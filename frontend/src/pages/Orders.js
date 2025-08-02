import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPackage, FiSearch, FiEye, FiFilter, FiTruck, FiCheck } from 'react-icons/fi';
import apiService from '../services/apiService';
import { formatPrice, formatDateTime, getOrderStatusDisplay } from '../utils/helpers';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiService.getUserOrders();
            setOrders(response.data);
        } catch (error) {
            setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by search term (order code)
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Sort by created date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFilteredOrders(filtered);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <FiPackage className="me-1" />;
            case 'CONFIRMED':
                return <FiCheck className="me-1" />;
            case 'PRINTING':
                return <FiPackage className="me-1" />;
            case 'SHIPPING':
                return <FiTruck className="me-1" />;
            case 'COMPLETED':
                return <FiCheck className="me-1" />;
            case 'CANCELLED':
                return <span className="me-1">❌</span>;
            default:
                return <FiPackage className="me-1" />;
        }
    };

    if (loading) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải danh sách đơn hàng...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <h2 className="serif-font mb-2">
                        <FiPackage className="me-2" />
                        Đơn hàng của tôi
                    </h2>
                    <p className="text-muted">Theo dõi tình trạng các đơn hàng bạn đã đặt</p>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Label>Tìm kiếm theo mã đơn hàng</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiSearch />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập mã đơn hàng..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={4}>
                                    <Form.Label>Lọc theo trạng thái</Form.Label>
                                    <Form.Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="PENDING">Chờ xác nhận</option>
                                        <option value="CONFIRMED">Đã xác nhận</option>
                                        <option value="PRINTING">Đang in</option>
                                        <option value="SHIPPING">Đang giao</option>
                                        <option value="COMPLETED">Hoàn thành</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                    </Form.Select>
                                </Col>
                                <Col md={2} className="d-flex align-items-end">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('');
                                        }}
                                    >
                                        <FiFilter className="me-1" />
                                        Xóa bộ lọc
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="fs-1 mb-3">📦</div>
                    <h4>
                        {orders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng'}
                    </h4>
                    <p className="text-muted mb-4">
                        {orders.length === 0 
                            ? 'Bạn chưa đặt đơn hàng nào. Hãy khám phá các mẫu thiệp đẹp của chúng tôi!'
                            : 'Hãy thử thay đổi bộ lọc tìm kiếm'
                        }
                    </p>
                    {orders.length === 0 && (
                        <Button as={Link} to="/templates" variant="primary">
                            Khám phá mẫu thiệp
                        </Button>
                    )}
                </div>
            ) : (
                <Row className="g-4">
                    {filteredOrders.map((order) => {
                        const statusInfo = getOrderStatusDisplay(order.status);
                        return (
                            <Col key={order.id} xs={12}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                <div className="text-center">
                                                    <div className="fs-2 mb-2">📋</div>
                                                    <Badge 
                                                        bg={statusInfo.color} 
                                                        className="px-3 py-2"
                                                    >
                                                        {getStatusIcon(order.status)}
                                                        {statusInfo.text}
                                                    </Badge>
                                                </div>
                                            </Col>
                                            
                                            <Col md={6}>
                                                <h6 className="mb-2">
                                                    Đơn hàng #{order.orderCode}
                                                </h6>
                                                <div className="text-muted small mb-2">
                                                    <div className="mb-1">
                                                        <strong>Ngày đặt:</strong> {formatDateTime(order.createdAt)}
                                                    </div>
                                                    <div className="mb-1">
                                                        <strong>Số lượng sản phẩm:</strong> {order.orderItems?.length || 0}
                                                    </div>
                                                    {order.shippingAddress && (
                                                        <div className="mb-1">
                                                            <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                            
                                            <Col md={2} className="text-center">
                                                <div className="fs-5 fw-bold text-primary mb-2">
                                                    {formatPrice(order.totalAmount)}
                                                </div>
                                            </Col>
                                            
                                            <Col md={2} className="text-center">
                                                <Button
                                                    as={Link}
                                                    to={`/orders/${order.id}`}
                                                    variant="outline-primary"
                                                    size="sm"
                                                >
                                                    <FiEye className="me-1" />
                                                    Chi tiết
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Pagination could be added here if needed */}
        </Container>
    );
};

export default Orders;