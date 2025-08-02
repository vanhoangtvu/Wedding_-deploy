import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiEye, FiEdit3, FiFilter, FiDownload } from 'react-icons/fi';
import apiService from '../../services/apiService';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    
    const orderStatuses = [
        { value: 'PENDING', label: 'Chờ xử lý', color: 'warning' },
        { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'info' },
        { value: 'PRINTING', label: 'Đang in', color: 'primary' },
        { value: 'SHIPPING', label: 'Đang giao', color: 'secondary' },
        { value: 'COMPLETED', label: 'Hoàn thành', color: 'success' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'danger' }
    ];

    useEffect(() => {
        loadOrders();
    }, [filterStatus]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            let response;
            if (filterStatus) {
                response = await apiService.getOrdersByStatus(filterStatus);
            } else {
                response = await apiService.getAllOrders();
            }
            setOrders(response.data);
        } catch (error) {
            setError('Không thể tải dữ liệu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = async (orderId) => {
        try {
            const response = await apiService.getOrderById(orderId);
            setSelectedOrder(response.data);
            setShowModal(true);
        } catch (error) {
            setError('Không thể tải chi tiết đơn hàng: ' + error.message);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await apiService.updateOrderStatus(orderId, newStatus);
            setSuccess('Cập nhật trạng thái đơn hàng thành công!');
            await loadOrders();
            setShowModal(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Lỗi khi cập nhật: ' + error.message);
        }
    };

    const getStatusBadge = (status) => {
        const statusInfo = orderStatuses.find(s => s.value === status);
        return statusInfo ? (
            <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>
        ) : (
            <Badge bg="secondary">{status}</Badge>
        );
    };

    const exportOrders = () => {
        // Xuất CSV đơn giản
        const csvContent = [
            ['ID', 'Mã đơn hàng', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Ngày tạo'].join(','),
            ...orders.map(order => [
                order.id,
                order.orderCode,
                order.user?.fullName || 'N/A',
                order.totalAmount,
                order.status,
                new Date(order.createdAt).toLocaleDateString('vi-VN')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <Container className="py-4" style={{marginTop: '80px'}}>
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Button 
                                as={Link} 
                                to="/admin" 
                                variant="outline-secondary" 
                                size="sm" 
                                className="me-3"
                            >
                                <FiArrowLeft className="me-1" />
                                Quay lại
                            </Button>
                            <h2 className="mb-0">Quản lý đơn hàng</h2>
                        </div>
                        <div className="d-flex gap-2">
                            <Form.Select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{width: 'auto'}}
                            >
                                <option value="">Tất cả trạng thái</option>
                                {orderStatuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button variant="outline-success" onClick={exportOrders}>
                                <FiDownload className="me-1" />
                                Xuất Excel
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <strong className="text-primary">{order.orderCode}</strong>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{order.user?.fullName || 'N/A'}</strong>
                                            <div className="text-muted small">{order.user?.email || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td>{order.phone || 'N/A'}</td>
                                    <td>
                                        <strong className="text-success">
                                            {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ
                                        </strong>
                                    </td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="outline-info" 
                                                size="sm"
                                                onClick={() => handleViewOrder(order.id)}
                                            >
                                                <FiEye />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    {orders.length === 0 && (
                        <div className="text-center py-4">
                            <FiShoppingCart className="fs-1 text-muted mb-3" />
                            <h5>Chưa có đơn hàng nào</h5>
                            <p className="text-muted">
                                {filterStatus ? 
                                    `Không có đơn hàng nào với trạng thái "${orderStatuses.find(s => s.value === filterStatus)?.label}"` :
                                    'Chưa có đơn hàng nào trong hệ thống'
                                }
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Modal chi tiết đơn hàng */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.orderCode}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h6>Thông tin khách hàng</h6>
                                    <p><strong>Tên:</strong> {selectedOrder.user?.fullName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                    <p><strong>Điện thoại:</strong> {selectedOrder.phone || 'N/A'}</p>
                                    <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                                </Col>
                                <Col md={6}>
                                    <h6>Thông tin đơn hàng</h6>
                                    <p><strong>Mã đơn hàng:</strong> {selectedOrder.orderCode}</p>
                                    <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                                    <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                    <p><strong>Ghi chú:</strong> {selectedOrder.notes || 'Không có'}</p>
                                </Col>
                            </Row>

                            <h6>Chi tiết sản phẩm</h6>
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item.customInvitation ? 
                                                    `Thiệp tùy chỉnh - ${item.customInvitation.templateName}` :
                                                    item.customizedCard ? 
                                                    `Thiệp HTML - ${item.customizedCard.cardTemplateName}` :
                                                    'Sản phẩm không xác định'
                                                }
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>{new Intl.NumberFormat('vi-VN').format(item.unitPrice)}đ</td>
                                            <td>{new Intl.NumberFormat('vi-VN').format(item.subtotal)}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={3}>Tổng cộng:</th>
                                        <th className="text-success">
                                            {new Intl.NumberFormat('vi-VN').format(selectedOrder.totalAmount)}đ
                                        </th>
                                    </tr>
                                </tfoot>
                            </Table>

                            <div className="mt-4">
                                <h6>Cập nhật trạng thái</h6>
                                <div className="d-flex gap-2 flex-wrap">
                                    {orderStatuses.map(status => (
                                        <Button
                                            key={status.value}
                                            variant={selectedOrder.status === status.value ? status.color : `outline-${status.color}`}
                                            size="sm"
                                            onClick={() => handleUpdateStatus(selectedOrder.id, status.value)}
                                            disabled={selectedOrder.status === status.value}
                                        >
                                            {status.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminOrders;