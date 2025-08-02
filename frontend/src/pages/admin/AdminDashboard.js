import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiImage, FiTrendingUp, FiShoppingCart, FiSettings, FiFolder } from 'react-icons/fi';
import apiService from '../../services/apiService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalTemplates: 0,
        totalCategories: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await apiService.getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
            setError('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, title, value, color, link }) => (
        <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
                <div className={`text-${color} fs-1 mb-3`}>
                    {icon}
                </div>
                <h3 className="serif-font mb-2">{value}</h3>
                <p className="text-muted mb-3">{title}</p>
                {link && (
                    <Button as={Link} to={link} variant={`outline-${color}`} size="sm">
                        Xem chi tiết
                    </Button>
                )}
            </Card.Body>
        </Card>
    );

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <h2 className="serif-font mb-2">
                        <FiSettings className="me-2" />
                        Bảng điều khiển Admin
                    </h2>
                    <p className="text-muted">Tổng quan hệ thống Wedinvite</p>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
            <Row className="g-4 mb-5">
                <Col md={6} xl={3}>
                    <StatCard
                        icon={<FiUsers />}
                        title="Người dùng"
                        value={stats.totalUsers}
                        color="primary"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        icon={<FiShoppingCart />}
                        title="Đơn hàng"
                        value={stats.totalOrders}
                        color="success"
                        link="/admin/orders"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        icon={<FiImage />}
                        title="Mẫu thiệp"
                        value={stats.totalTemplates}
                        color="info"
                        link="/admin/templates"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        icon={<FiFolder />}
                        title="Danh mục"
                        value={stats.totalCategories}
                        color="secondary"
                        link="/admin/categories"
                    />
                </Col>
            </Row>

            {/* Revenue Card */}
            <Row className="mb-5">
                <Col md={6}>
                    <StatCard
                        icon={<FiTrendingUp />}
                        title="Tổng doanh thu"
                        value={new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(stats.totalRevenue)}
                        color="warning"
                    />
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <div className="text-center">
                                <div className="text-primary fs-1 mb-3">
                                    💍
                                </div>
                                <h5>Wedinvite Dashboard</h5>
                                <p className="text-muted">Quản lý thiệp cưới online</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Management Links */}
            <Row className="g-4">
                <Col md={6} lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center p-4">
                            <div className="text-primary fs-1 mb-3">
                                <FiPackage />
                            </div>
                            <h5 className="mb-3">Quản lý danh mục</h5>
                            <p className="text-muted mb-4">
                                Thêm, sửa, xóa các danh mục thiệp cưới
                            </p>
                            <Button as={Link} to="/admin/categories" variant="primary" className="w-100">
                                Quản lý danh mục
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center p-4">
                            <div className="text-info fs-1 mb-3">
                                <FiImage />
                            </div>
                            <h5 className="mb-3">Quản lý mẫu thiệp</h5>
                            <p className="text-muted mb-4">
                                Thêm, sửa, xóa các mẫu thiệp cưới
                            </p>
                            <div className="d-grid gap-2">
                                <Button as={Link} to="/admin/templates" variant="info">
                                    Mẫu thiệp cơ bản
                                </Button>
                                <Button as={Link} to="/admin/card-templates" variant="outline-info">
                                    Mẫu HTML Templates
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center p-4">
                            <div className="text-success fs-1 mb-3">
                                <FiShoppingCart />
                            </div>
                            <h5 className="mb-3">Quản lý đơn hàng</h5>
                            <p className="text-muted mb-4">
                                Xem và cập nhật trạng thái đơn hàng
                            </p>
                            <Button as={Link} to="/admin/orders" variant="success" className="w-100">
                                Quản lý đơn hàng
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity */}
            <Row className="mt-5">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header>
                            <h5 className="mb-0">Hoạt động gần đây</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center py-4 text-muted">
                                <FiTrendingUp size={48} className="mb-3" />
                                <p>Tính năng theo dõi hoạt động sẽ được cập nhật sớm</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;