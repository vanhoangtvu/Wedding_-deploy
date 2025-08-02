import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiHeart, FiShare2, FiZoomIn } from 'react-icons/fi';
import apiService from '../services/apiService';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const TemplateDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [template, setTemplate] = useState(null);
    const [cardTemplates, setCardTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [relatedTemplates, setRelatedTemplates] = useState([]);

    useEffect(() => {
        fetchTemplateDetail();
    }, [id]);

    const fetchTemplateDetail = async () => {
        try {
            setLoading(true);
            setError('');
            
            const [templateResponse, cardTemplatesResponse] = await Promise.all([
                apiService.getTemplateById(id),
                apiService.getCardTemplatesByTemplateId(id)
            ]);
            
            const templateData = templateResponse.data;
            setTemplate(templateData);
            setCardTemplates(cardTemplatesResponse.data);
            
            // Fetch related templates from same category
            if (templateData.categoryId) {
                const relatedResponse = await apiService.getTemplatesByCategory(templateData.categoryId);
                const related = relatedResponse.data
                    .filter(t => t.id !== parseInt(id))
                    .slice(0, 4);
                setRelatedTemplates(related);
            }
        } catch (error) {
            setError('Không thể tải thông tin mẫu thiệp. Vui lòng thử lại.');
            console.error('Error fetching template detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomize = () => {
        if (!isAuthenticated()) {
            toast.info('Vui lòng đăng nhập để tùy chỉnh thiệp');
            navigate('/login');
            return;
        }
        navigate(`/custom-invitation/${id}`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: template.name,
                    text: `Xem mẫu thiệp cưới: ${template.name}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép link vào clipboard');
        }
    };

    if (loading) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải thông tin mẫu thiệp...</p>
                </div>
            </Container>
        );
    }

    if (error || !template) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <Alert variant="danger">
                    {error || 'Không tìm thấy mẫu thiệp này'}
                </Alert>
                <Button as={Link} to="/templates" variant="primary">
                    <FiArrowLeft className="me-2" />
                    Quay lại danh sách
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item as={Link} to="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item as={Link} to="/templates">Mẫu thiệp</Breadcrumb.Item>
                <Breadcrumb.Item active>{template.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="g-5">
                {/* Template Preview */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="p-0">
                            <div 
                                className="bg-light d-flex align-items-center justify-content-center position-relative"
                                style={{height: '500px'}}
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
                                        <div className="fs-1 mb-3">💌</div>
                                        <h4>Preview mẫu thiệp</h4>
                                        <p>{template.name}</p>
                                    </div>
                                )}
                                
                                {/* Overlay buttons */}
                                <div className="position-absolute top-0 end-0 p-3">
                                    <Button 
                                        variant="light" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={handleShare}
                                    >
                                        <FiShare2 />
                                    </Button>
                                    <Button variant="light" size="sm">
                                        <FiZoomIn />
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Template Description */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Mô tả chi tiết</h5>
                            <p className="text-muted mb-4">
                                {template.description || 'Mẫu thiệp cưới đẹp và độc đáo, phù hợp cho ngày trọng đại của bạn.'}
                            </p>
                            
                            <Row className="g-3">
                                <Col sm={6}>
                                    <strong>Danh mục:</strong>
                                    <br />
                                    <Badge bg="primary" className="mt-1">{template.categoryName}</Badge>
                                </Col>
                                <Col sm={6}>
                                    <strong>Giá:</strong>
                                    <br />
                                    <span className="text-primary fs-5 fw-bold">{formatPrice(template.price)}</span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Template Info & Actions */}
                <Col lg={4}>
                    <div className="sticky-top" style={{top: '100px'}}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <h3 className="serif-font mb-3">{template.name}</h3>
                                
                                <div className="d-flex align-items-center mb-4">
                                    <span className="text-primary fs-4 fw-bold me-3">
                                        {formatPrice(template.price)}
                                    </span>
                                    <Badge bg="success">Có sẵn</Badge>
                                </div>

                                <div className="d-grid gap-3">
                                    <Button 
                                        variant="primary" 
                                        size="lg"
                                        onClick={handleCustomize}
                                    >
                                        <FiEdit3 className="me-2" />
                                        Tùy chỉnh thiệp cơ bản
                                    </Button>
                                    
                                    {cardTemplates.length > 0 && (
                                        <Button 
                                            as={Link}
                                            to={`/custom-card-editor/${id}`}
                                            variant="success" 
                                            size="lg"
                                        >
                                            <FiEdit3 className="me-2" />
                                            Tùy chỉnh HTML ({cardTemplates.length} mẫu)
                                        </Button>
                                    )}
                                    
                                    <Button 
                                        variant="outline-primary"
                                        onClick={handleShare}
                                    >
                                        <FiShare2 className="me-2" />
                                        Chia sẻ
                                    </Button>
                                    
                                    <Button 
                                        as={Link} 
                                        to="/templates"
                                        variant="outline-secondary"
                                    >
                                        <FiArrowLeft className="me-2" />
                                        Quay lại danh sách
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Features */}
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <h6 className="mb-3">Đặc điểm nổi bật</h6>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Tùy chỉnh text dễ dàng
                                    </li>
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Chất lượng in cao cấp
                                    </li>
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Giao hàng toàn quốc
                                    </li>
                                    <li className="mb-2">
                                        <span className="text-success me-2">✓</span>
                                        Hỗ trợ 24/7
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Related Templates */}
            {relatedTemplates.length > 0 && (
                <Row className="mt-5">
                    <Col>
                        <h4 className="serif-font mb-4">Mẫu thiệp tương tự</h4>
                        <Row className="g-4">
                            {relatedTemplates.map((relatedTemplate) => (
                                <Col md={6} lg={3} key={relatedTemplate.id}>
                                    <Card className="h-100 border-0 shadow-sm">
                                        <div 
                                            className="card-img-top bg-light d-flex align-items-center justify-content-center"
                                            style={{height: '200px'}}
                                        >
                                            {relatedTemplate.imageUrl ? (
                                                <img 
                                                    src={relatedTemplate.imageUrl} 
                                                    alt={relatedTemplate.name}
                                                    className="img-fluid rounded"
                                                    style={{maxHeight: '100%', maxWidth: '100%'}}
                                                />
                                            ) : (
                                                <div className="text-center text-muted">
                                                    <div className="fs-2 mb-2">💌</div>
                                                    <small>Preview</small>
                                                </div>
                                            )}
                                        </div>
                                        <Card.Body>
                                            <h6 className="card-title mb-2">{relatedTemplate.name}</h6>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-primary">
                                                    {formatPrice(relatedTemplate.price)}
                                                </span>
                                                <Button 
                                                    as={Link}
                                                    to={`/templates/${relatedTemplate.id}`}
                                                    variant="outline-primary" 
                                                    size="sm"
                                                >
                                                    Xem
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default TemplateDetail;