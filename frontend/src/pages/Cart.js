import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, formatDate, formatTime, formatWeddingNames } from '../utils/helpers';
import { toast } from 'react-toastify';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleUpdateQuantity = (invitationId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(invitationId);
            return;
        }
        updateQuantity(invitationId, newQuantity);
    };

    const handleRemoveItem = (invitationId) => {
        removeFromCart(invitationId);
    };

    const handleClearCart = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            clearCart();
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated()) {
            toast.info('Vui lòng đăng nhập để đặt hàng');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống');
            return;
        }

        // Navigate to checkout with cart data
        navigate('/checkout', { state: { cartItems, totalPrice: getTotalPrice() } });
    };

    const QuantityControl = ({ item }) => (
        <div className="d-flex align-items-center">
            <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
            >
                <FiMinus />
            </Button>
            <Form.Control
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="mx-2 text-center"
                style={{ width: '70px' }}
            />
            <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            >
                <FiPlus />
            </Button>
        </div>
    );

    if (cartItems.length === 0) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <Card className="border-0 shadow-sm p-5">
                            <div className="fs-1 mb-3">🛒</div>
                            <h3 className="serif-font mb-3">Giỏ hàng trống</h3>
                            <p className="text-muted mb-4">
                                Bạn chưa có sản phẩm nào trong giỏ hàng. 
                                Hãy khám phá các mẫu thiệp cưới đẹp của chúng tôi!
                            </p>
                            <div className="d-flex gap-3 justify-content-center">
                                <Button as={Link} to="/templates" variant="primary">
                                    Khám phá mẫu thiệp
                                </Button>
                                <Button as={Link} to="/my-invitations" variant="outline-primary">
                                    Thiệp của tôi
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="serif-font mb-2">
                                <FiShoppingCart className="me-2" />
                                Giỏ hàng của bạn
                            </h2>
                            <p className="text-muted">
                                Bạn có {getTotalItems()} sản phẩm trong giỏ hàng
                            </p>
                        </div>
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={handleClearCart}
                        >
                            <FiTrash2 className="me-2" />
                            Xóa tất cả
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Cart Items */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 p-3">Sản phẩm</th>
                                            <th className="border-0 p-3 text-center">Số lượng</th>
                                            <th className="border-0 p-3 text-end">Đơn giá</th>
                                            <th className="border-0 p-3 text-end">Thành tiền</th>
                                            <th className="border-0 p-3 text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="p-3">
                                                    <div className="d-flex align-items-start">
                                                        <div 
                                                            className="bg-light rounded me-3 flex-shrink-0 d-flex align-items-center justify-content-center"
                                                            style={{width: '80px', height: '80px'}}
                                                        >
                                                            {item.generatedImageUrl ? (
                                                                <img 
                                                                    src={item.generatedImageUrl} 
                                                                    alt="Invitation preview"
                                                                    className="img-fluid rounded"
                                                                    style={{maxHeight: '100%', maxWidth: '100%'}}
                                                                />
                                                            ) : (
                                                                <div className="text-center text-muted">
                                                                    <div className="fs-4">💌</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                                                                <div>
                                            <h6 className="mb-1">{item.templateName}</h6>
                                            {item.cardTemplateName && (
                                                <div className="mb-1">
                                                    <Badge bg="info" className="small">
                                                        HTML: {item.cardTemplateName}
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="text-muted small mb-1">
                                                <strong>
                                                    {formatWeddingNames(item.groomName, item.brideName)}
                                                </strong>
                                            </div>
                                            <div className="text-muted small">
                                                {formatDate(item.weddingDate)}
                                                {item.weddingTime && (
                                                    <> • {formatTime(item.weddingTime)}</>
                                                )}
                                            </div>
                                            {item.weddingVenue && (
                                                <div className="text-muted small">
                                                    📍 {item.weddingVenue}
                                                </div>
                                            )}
                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center align-middle">
                                                    <QuantityControl item={item} />
                                                </td>
                                                <td className="p-3 text-end align-middle">
                                                    <span className="fw-bold">
                                                        {formatPrice(item.unitPrice)}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-end align-middle">
                                                    <span className="fw-bold text-primary">
                                                        {formatPrice(item.unitPrice * item.quantity)}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center align-middle">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Summary */}
                <Col lg={4}>
                    <div className="sticky-top" style={{top: '100px'}}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h6 className="mb-0">Tóm tắt đơn hàng</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-success">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Tổng cộng:</strong>
                                    <strong className="text-primary fs-5">
                                        {formatPrice(getTotalPrice())}
                                    </strong>
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="primary" 
                                        size="lg"
                                        onClick={handleCheckout}
                                        disabled={loading}
                                    >
                                        Đặt hàng ngay
                                        <FiArrowRight className="ms-2" />
                                    </Button>
                                    
                                    <Button 
                                        as={Link}
                                        to="/templates" 
                                        variant="outline-primary"
                                    >
                                        <FiArrowLeft className="me-2" />
                                        Tiếp tục mua sắm
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Shipping Info */}
                        <Card className="border-0 shadow-sm mt-3">
                            <Card.Body>
                                <h6 className="mb-3">🚚 Thông tin giao hàng</h6>
                                <ul className="list-unstyled mb-0 small">
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Miễn phí giao hàng toàn quốc
                                    </li>
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Giao hàng trong 2-3 ngày làm việc
                                    </li>
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Đóng gói cẩn thận, chống ẩm
                                    </li>
                                    <li className="mb-0">
                                        <span className="text-success me-2">✓</span>
                                        Hỗ trợ đổi trả trong 7 ngày
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;