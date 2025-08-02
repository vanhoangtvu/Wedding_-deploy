import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiStar, FiTrendingUp } from 'react-icons/fi';
import apiService from '../services/apiService';
import { formatPrice } from '../utils/helpers';

const Home = () => {
    const [featuredTemplates, setFeaturedTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [templatesResponse, categoriesResponse] = await Promise.all([
                    apiService.getTemplates(),
                    apiService.getCategories()
                ]);
                
                // Lấy 6 templates đầu tiên làm featured
                setFeaturedTemplates(templatesResponse.data.slice(0, 6));
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <Container>
                    <Row className="align-items-center min-vh-75">
                        <Col lg={6}>
                            <div className="fade-in-up">
                                <h1 className="hero-title">
                                    <span className="text-primary">Wedinvite</span> - Thiệp cưới 
                                    <br />cho ngày trọng đại
                                </h1>
                                <p className="hero-subtitle mb-4">
                                    Nền tảng tạo thiệp cưới online hiện đại với hàng trăm mẫu đẹp, 
                                    công cụ tùy chỉnh HTML và hệ thống đặt hàng tiện lợi.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Button 
                                        as={Link} 
                                        to="/create-invitation" 
                                        variant="primary" 
                                        size="lg"
                                        className="px-4"
                                    >
                                        ✨ Tạo thiệp ngay
                                        <FiArrowRight className="ms-2" />
                                    </Button>
                                    <Button 
                                        as={Link} 
                                        to="/templates" 
                                        variant="outline-primary" 
                                        size="lg"
                                        className="px-4"
                                    >
                                        Khám phá mẫu thiệp
                                    </Button>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="text-center">
                                <div className="position-relative">
                                    <img 
                                        src="/api/placeholder/500/400" 
                                        alt="Wedding invitation preview" 
                                        className="img-fluid rounded-4 shadow-lg"
                                        style={{maxWidth: '100%', height: 'auto'}}
                                    />
                                    <div className="position-absolute top-0 start-0 translate-middle">
                                        <Badge bg="primary" className="p-2 rounded-circle">
                                            <FiHeart size={20} />
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-white">
                <Container>
                    <Row className="text-center mb-5">
                        <Col>
                            <h2 className="serif-font mb-3">Tại sao chọn chúng tôi?</h2>
                            <p className="text-muted">Những lý do khiến hàng nghìn cặp đôi tin tưởng</p>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {[
                            {
                                icon: '🎨',
                                title: 'Thiết kế đa dạng',
                                description: 'Hàng trăm mẫu thiệp từ cổ điển đến hiện đại, phù hợp mọi phong cách'
                            },
                            {
                                icon: '✏️',
                                title: 'Tùy chỉnh linh hoạt',
                                description: 'Thay đổi text, màu sắc, hình ảnh dễ dàng với giao diện thân thiện'
                            },
                            {
                                icon: '💎',
                                title: 'Chất lượng cao cấp',
                                description: 'In trên giấy cao cấp với công nghệ in hiện đại, màu sắc sống động'
                            },
                            {
                                icon: '🚚',
                                title: 'Giao hàng nhanh',
                                description: 'Giao hàng toàn quốc trong 2-3 ngày, đóng gói cẩn thận'
                            }
                        ].map((feature, index) => (
                            <Col md={6} lg={3} key={index}>
                                <Card className="h-100 border-0 text-center p-3">
                                    <Card.Body>
                                        <div className="fs-1 mb-3">{feature.icon}</div>
                                        <h5>{feature.title}</h5>
                                        <p className="text-muted small">{feature.description}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="py-5 bg-light-primary">
                <Container>
                    <Row className="text-center mb-5">
                        <Col>
                            <h2 className="serif-font mb-3">Danh mục thiệp cưới</h2>
                            <p className="text-muted">Chọn phong cách phù hợp với đám cưới của bạn</p>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {categories.map((category) => (
                            <Col md={6} lg={3} key={category.id}>
                                <Card 
                                    as={Link} 
                                    to={`/templates?category=${category.id}`}
                                    className="h-100 border-0 text-decoration-none text-dark"
                                >
                                    <div 
                                        className="card-img-top bg-gradient d-flex align-items-center justify-content-center"
                                        style={{
                                            height: '150px',
                                            background: `linear-gradient(135deg, var(--primary-color), var(--accent-color))`
                                        }}
                                    >
                                        <h3 className="text-white serif-font">{category.name}</h3>
                                    </div>
                                    <Card.Body className="text-center">
                                        <h5 className="card-title">{category.name}</h5>
                                        <p className="card-text text-muted small">{category.description}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Featured Templates Section */}
            <section className="py-5 bg-white">
                <Container>
                    <Row className="align-items-center mb-5">
                        <Col>
                            <h2 className="serif-font mb-3">
                                <FiTrendingUp className="me-2 text-primary" />
                                Mẫu thiệp nổi bật
                            </h2>
                            <p className="text-muted">Những mẫu thiệp được yêu thích nhất</p>
                        </Col>
                        <Col xs="auto">
                            <Button as={Link} to="/templates" variant="outline-primary">
                                Xem tất cả
                                <FiArrowRight className="ms-2" />
                            </Button>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Đang tải mẫu thiệp...</p>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {featuredTemplates.map((template) => (
                                <Col md={6} lg={4} key={template.id}>
                                    <Card className="h-100 border-0 shadow-sm">
                                        <div 
                                            className="card-img-top bg-light d-flex align-items-center justify-content-center"
                                            style={{height: '250px'}}
                                        >
                                            {template.imageUrl ? (
                                                <img 
                                                    src={template.imageUrl} 
                                                    alt={template.name}
                                                    className="img-fluid rounded"
                                                    style={{maxHeight: '100%', maxWidth: '100%'}}
                                                />
                                            ) : (
                                                <div className="text-center text-muted">
                                                    <div className="fs-1 mb-2">💌</div>
                                                    <small>Preview thiệp</small>
                                                </div>
                                            )}
                                        </div>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="card-title mb-0">{template.name}</h6>
                                                <Badge bg="primary">{template.categoryName}</Badge>
                                            </div>
                                            <p className="card-text text-muted small mb-3">
                                                {template.description}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-primary">
                                                    {formatPrice(template.price)}
                                                </span>
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        as={Link}
                                                        to={`/templates/${template.id}`}
                                                        variant="outline-primary" 
                                                        size="sm"
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                    <Button 
                                                        as={Link}
                                                        to={`/custom-invitation/${template.id}`}
                                                        variant="primary" 
                                                        size="sm"
                                                    >
                                                        Tùy chỉnh
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-primary text-white">
                <Container>
                    <Row className="text-center">
                        <Col lg={8} className="mx-auto">
                            <h2 className="serif-font mb-3">Sẵn sàng tạo thiệp cưới của bạn?</h2>
                            <p className="mb-4">
                                Bắt đầu ngay hôm nay và tạo ra những tấm thiệp cưới độc đáo, 
                                ý nghĩa cho ngày trọng đại của bạn.
                            </p>
                            <Button 
                                as={Link} 
                                to="/templates" 
                                variant="light" 
                                size="lg"
                                className="px-5"
                            >
                                <FiStar className="me-2" />
                                Bắt đầu thiết kế
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Home;