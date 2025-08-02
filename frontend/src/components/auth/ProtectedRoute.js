import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    // Hiển thị loading khi đang kiểm tra auth
    if (loading) {
        return (
            <Container className="mt-5 pt-5">
                <Row className="justify-content-center">
                    <Col xs={12} className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Đang kiểm tra quyền truy cập...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    // Chưa đăng nhập -> redirect về login
    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Cần quyền admin nhưng không phải admin
    if (adminOnly && !isAdmin()) {
        return (
            <Container className="mt-5 pt-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="danger" className="text-center">
                            <Alert.Heading>🚫 Không có quyền truy cập</Alert.Heading>
                            <p>
                                Bạn không có quyền truy cập vào trang này. 
                                Chỉ quản trị viên mới có thể truy cập.
                            </p>
                            <hr />
                            <p className="mb-0">
                                Nếu bạn là quản trị viên, vui lòng liên hệ với nhà phát triển để được hỗ trợ.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    // Có quyền truy cập -> render children
    return children;
};

export default ProtectedRoute;