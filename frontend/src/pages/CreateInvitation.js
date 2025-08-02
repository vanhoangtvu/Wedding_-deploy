import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiImage, FiArrowRight, FiSearch, FiFilter } from 'react-icons/fi';
import apiService from '../services/apiService';
import { formatPrice } from '../utils/helpers';

const CreateInvitation = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [templatesRes, categoriesRes] = await Promise.all([
                apiService.getTemplates(),
                apiService.getCategories()
            ]);
            setTemplates(templatesRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             template.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || template.categoryId.toString() === selectedCategory;
        return matchesSearch && matchesCategory && template.isActive;
    });

    const handleTemplateSelect = (template) => {
        // Đi thẳng đến tùy chỉnh thiệp cơ bản
        navigate(`/custom-invitation/${template.id}`);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Không xác định';
    };

    if (loading) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải mẫu thiệp...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="text-center mb-4">
                        <h1 className="serif-font mb-3">Tạo thiệp cưới mới</h1>
                        <p className="text-muted">Chọn mẫu thiệp yêu thích để bắt đầu tùy chỉnh</p>
                    </div>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm mẫu thiệp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Button
                        variant="outline-primary"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                        }}
                    >
                        <FiFilter className="me-1" />
                        Xóa lọc
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
                <div className="text-center py-5">
                    <div className="fs-1 mb-3">😔</div>
                    <h4>Không tìm thấy mẫu thiệp nào</h4>
                    <p className="text-muted">Hãy thử thay đổi bộ lọc tìm kiếm</p>
                </div>
            ) : (
                <Row className="g-4">
                    {filteredTemplates.map((template) => (
                        <Col key={template.id} xs={12} sm={6} lg={4} xl={3}>
                            <Card className="h-100 border-0 shadow-sm template-card">
                                <div 
                                    className="bg-light d-flex align-items-center justify-content-center card-img-top"
                                    style={{ height: '200px' }}
                                >
                                    {template.imageUrl ? (
                                        <img 
                                            src={template.imageUrl} 
                                            alt={template.name}
                                            className="img-fluid rounded"
                                            style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'cover'}}
                                        />
                                    ) : (
                                        <FiImage size={48} className="text-muted" />
                                    )}
                                </div>
                                
                                <Card.Body className="d-flex flex-column">
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title mb-0">{template.name}</h6>
                                            <Badge bg="primary" className="ms-2">
                                                {getCategoryName(template.categoryId)}
                                            </Badge>
                                        </div>
                                        <p className="card-text text-muted small mb-3">
                                            {template.description || 'Mẫu thiệp đẹp cho ngày trọng đại'}
                                        </p>
                                    </div>
                                    
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="fw-bold text-primary">
                                            {formatPrice(template.price)}
                                        </span>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => handleTemplateSelect(template)}
                                        >
                                            Chọn mẫu
                                            <FiArrowRight className="ms-1" />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <style jsx>{`
                .template-card:hover {
                    transform: translateY(-5px);
                    transition: transform 0.3s ease;
                }
            `}</style>
        </Container>
    );
};

export default CreateInvitation;