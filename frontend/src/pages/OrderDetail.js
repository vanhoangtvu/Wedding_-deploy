import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Breadcrumb, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiPhone, FiCalendar } from 'react-icons/fi';
import apiService from '../services/apiService';
import { formatPrice, formatDateTime, formatWeddingNames, getOrderStatusDisplay } from '../utils/helpers';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiService.getOrderById(id);
            setOrder(response.data);
        } catch (error) {
            setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
            console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOrderProgress = (status) => {
        const steps = [
            { key: 'PENDING', label: 'Chờ xác nhận', icon: '⏳' },
            { key: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅' },
            { key: 'PRINTING', label: 'Đang in', icon: '🖨️' },
            { key: 'SHIPPING', label: 'Đang giao hàng', icon: '🚚' },
            { key: 'COMPLETED', label: 'Hoàn thành', icon: '🎉' }
        ];

        const currentStepIndex = steps.findIndex(step => step.key === status);
        const isCancelled = status === 'CANCELLED';

        return (
            <div className="order-progress">
                {steps.map((step, index) => {
                    let stepClass = 'text-muted';
                    if (isCancelled) {
                        stepClass = 'text-muted';
                    } else if (index <= currentStepIndex) {
                        stepClass = index === currentStepIndex ? 'text-primary fw-bold' : 'text-success';
                    }

                    return (
                        <div key={step.key} className={`d-flex align-items-center mb-2 ${stepClass}`}>
                            <span className="me-2 fs-5">{step.icon}</span>
                            <span>{step.label}</span>
                            {index === currentStepIndex && !isCancelled && (
                                <Badge bg="primary" className="ms-2">Hiện tại</Badge>
                            )}
                        </div>
                    );
                })}
                {isCancelled && (
                    <div className="d-flex align-items-center mb-2 text-danger fw-bold">
                        <span className="me-2 fs-5">❌</span>
                        <span>Đơn hàng đã bị hủy</span>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải thông tin đơn hàng...</p>
                </div>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <Alert variant="danger">
                    {error || 'Không tìm thấy đơn hàng này'}
                </Alert>
                <Button as={Link} to="/orders" variant="primary">
                    <FiArrowLeft className="me-2" />
                    Quay lại danh sách
                </Button>
            </Container>
        );
    }

    const statusInfo = getOrderStatusDisplay(order.status);

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item as={Link} to="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item as={Link} to="/orders">Đơn hàng</Breadcrumb.Item>
                <Breadcrumb.Item active>#{order.orderCode}</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="g-4">
                {/* Order Info */}
                <Col lg={8}>
                    {/* Order Header */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h3 className="serif-font mb-2">Đơn hàng #{order.orderCode}</h3>
                                    <p className="text-muted mb-0">
                                        Đặt hàng vào {formatDateTime(order.createdAt)}
                                    </p>
                                </div>
                                <Badge 
                                    bg={statusInfo.color} 
                                    className="px-3 py-2 fs-6"
                                >
                                    {statusInfo.text}
                                </Badge>
                            </div>
                            
                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="d-flex align-items-center text-muted">
                                        <FiMapPin className="me-2" />
                                        <div>
                                            <strong>Địa chỉ giao hàng:</strong>
                                            <br />
                                            {order.shippingAddress || 'Chưa cung cấp'}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center text-muted">
                                        <FiPhone className="me-2" />
                                        <div>
                                            <strong>Số điện thoại:</strong>
                                            <br />
                                            {order.phone || 'Chưa cung cấp'}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            
                            {order.notes && (
                                <div className="mt-3 p-3 bg-light rounded">
                                    <strong>Ghi chú:</strong>
                                    <p className="mb-0 mt-1">{order.notes}</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Order Items */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header>
                            <h5 className="mb-0">Chi tiết sản phẩm</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 p-3">Sản phẩm</th>
                                            <th className="border-0 p-3 text-center">Số lượng</th>
                                            <th className="border-0 p-3 text-end">Đơn giá</th>
                                            <th className="border-0 p-3 text-end">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-3">
                                                    <div className="d-flex align-items-start">
                                                        <div 
                                                            className="bg-light rounded me-3 flex-shrink-0 d-flex align-items-center justify-content-center"
                                                            style={{width: '60px', height: '60px'}}
                                                        >
                                                            <div className="text-center text-muted">
                                                                <div className="fs-5">💌</div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1">{item.templateName}</h6>
                                                            <div className="text-muted small">
                                                                <strong>
                                                                    {formatWeddingNames(item.groomName, item.brideName)}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center align-middle">
                                                    <Badge bg="secondary">{item.quantity}</Badge>
                                                </td>
                                                <td className="p-3 text-end align-middle">
                                                    {formatPrice(item.unitPrice)}
                                                </td>
                                                <td className="p-3 text-end align-middle">
                                                    <strong>{formatPrice(item.subtotal)}</strong>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-light">
                                        <tr>
                                            <td colSpan="3" className="p-3 text-end">
                                                <strong>Tổng cộng:</strong>
                                            </td>
                                            <td className="p-3 text-end">
                                                <strong className="text-primary fs-5">
                                                    {formatPrice(order.totalAmount)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Status & Actions */}
                <Col lg={4}>
                    <div className="sticky-top" style={{top: '100px'}}>
                        {/* Order Progress */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header>
                                <h6 className="mb-0">
                                    <FiPackage className="me-2" />
                                    Tình trạng đơn hàng
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                {getOrderProgress(order.status)}
                            </Card.Body>
                        </Card>

                        {/* Actions */}
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-grid gap-2">
                                    <Button 
                                        as={Link}
                                        to="/orders" 
                                        variant="outline-primary"
                                    >
                                        <FiArrowLeft className="me-2" />
                                        Quay lại danh sách
                                    </Button>
                                    
                                    {order.status === 'PENDING' && (
                                        <Button variant="outline-danger" size="sm">
                                            Hủy đơn hàng
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Support Info */}
                        <Card className="border-0 shadow-sm mt-3">
                            <Card.Body>
                                <h6 className="mb-3">💬 Cần hỗ trợ?</h6>
                                <p className="small text-muted mb-3">
                                    Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng
                                </p>
                                <div className="small">
                                    <div className="mb-2">
                                        <FiPhone className="me-2" />
                                        Hotline: 0123 456 789
                                    </div>
                                    <div>
                                        📧 Email: support@thiepCuoi.com
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderDetail;