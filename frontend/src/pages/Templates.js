import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Badge, Alert, Modal } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiFilter, FiLock } from 'react-icons/fi';
import apiService from '../services/apiService';
import { formatPrice, debounce } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const Templates = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [searchParams, setSearchParams] = useSearchParams();
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || '');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, [selectedCategory, priceRange]);

    // Debounced search
    useEffect(() => {
        const debouncedSearch = debounce(() => {
            if (searchTerm) {
                searchTemplates();
            } else {
                fetchTemplates();
            }
        }, 500);

        debouncedSearch();
    }, [searchTerm]);

    const fetchCategories = async () => {
        try {
            const response = await apiService.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError('');
            
            let response;
            if (selectedCategory) {
                response = await apiService.getTemplatesByCategory(selectedCategory);
            } else {
                response = await apiService.getTemplates();
            }
            
            let filteredTemplates = response.data;
            
            // Apply price filter
            if (priceRange) {
                filteredTemplates = applyPriceFilter(filteredTemplates, priceRange);
            }
            
            setTemplates(filteredTemplates);
        } catch (error) {
            setError('Không thể tải danh sách mẫu thiệp. Vui lòng thử lại.');
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchTemplates = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await apiService.searchTemplates(searchTerm);
            let filteredTemplates = response.data;
            
            // Apply filters
            if (selectedCategory) {
                filteredTemplates = filteredTemplates.filter(t => t.categoryId.toString() === selectedCategory);
            }
            
            if (priceRange) {
                filteredTemplates = applyPriceFilter(filteredTemplates, priceRange);
            }
            
            setTemplates(filteredTemplates);
        } catch (error) {
            setError('Không thể tìm kiếm mẫu thiệp. Vui lòng thử lại.');
            console.error('Error searching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyPriceFilter = (templates, range) => {
        switch (range) {
            case 'under-50k':
                return templates.filter(t => t.price < 50000);
            case '50k-100k':
                return templates.filter(t => t.price >= 50000 && t.price <= 100000);
            case 'over-100k':
                return templates.filter(t => t.price > 100000);
            default:
                return templates;
        }
    };

    const handleFilterChange = (filterType, value) => {
        const newParams = new URLSearchParams(searchParams);
        
        if (value) {
            newParams.set(filterType, value);
        } else {
            newParams.delete(filterType);
        }
        
        setSearchParams(newParams);
        
        switch (filterType) {
            case 'search':
                setSearchTerm(value);
                break;
            case 'category':
                setSelectedCategory(value);
                break;
            case 'priceRange':
                setPriceRange(value);
                break;
            default:
                break;
        }
    };

    const clearFilters = () => {
        setSearchParams({});
        setSearchTerm('');
        setSelectedCategory('');
        setPriceRange('');
    };

    const handleCustomizeClick = (templateId) => {
        if (isAuthenticated()) {
            navigate(`/custom-invitation/${templateId}`);
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <Container className="py-5" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <h1 className="serif-font mb-2">Mẫu thiệp cưới</h1>
                    <p className="text-muted">Khám phá bộ sưu tập thiệp cưới đa dạng và độc đáo</p>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <Row className="g-3 align-items-end">
                                <Col md={4}>
                                    <Form.Label>Tìm kiếm</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiSearch />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm kiếm mẫu thiệp..."
                                            value={searchTerm}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                
                                <Col md={3}>
                                    <Form.Label>Danh mục</Form.Label>
                                    <Form.Select
                                        value={selectedCategory}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                
                                <Col md={3}>
                                    <Form.Label>Khoảng giá</Form.Label>
                                    <Form.Select
                                        value={priceRange}
                                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                    >
                                        <option value="">Tất cả giá</option>
                                        <option value="under-50k">Dưới 50.000₫</option>
                                        <option value="50k-100k">50.000₫ - 100.000₫</option>
                                        <option value="over-100k">Trên 100.000₫</option>
                                    </Form.Select>
                                </Col>
                                
                                <Col md={2}>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={clearFilters}
                                        >
                                            <FiFilter className="me-1" />
                                            Xóa bộ lọc
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* View Mode & Results */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="text-muted mb-0">
                            Tìm thấy <strong>{templates.length}</strong> mẫu thiệp
                        </p>
                        <div className="d-flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <FiGrid />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <FiList />
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Content */}
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải mẫu thiệp...</p>
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center py-5">
                    <div className="fs-1 mb-3">😔</div>
                    <h4>Không tìm thấy mẫu thiệp nào</h4>
                    <p className="text-muted">Hãy thử thay đổi bộ lọc tìm kiếm</p>
                    <Button variant="primary" onClick={clearFilters}>
                        Xóa bộ lọc
                    </Button>
                </div>
            ) : (
                <Row className={viewMode === 'grid' ? 'g-4' : 'g-3'}>
                    {templates.map((template) => (
                        <Col 
                            key={template.id} 
                            xs={12} 
                            sm={viewMode === 'grid' ? 6 : 12} 
                            lg={viewMode === 'grid' ? 4 : 12}
                        >
                            <Card className={`h-100 border-0 shadow-sm ${viewMode === 'list' ? 'flex-row' : ''}`}>
                                <div 
                                    className={`bg-light d-flex align-items-center justify-content-center ${
                                        viewMode === 'list' ? 'flex-shrink-0' : 'card-img-top'
                                    }`}
                                    style={{
                                        height: viewMode === 'list' ? '150px' : '250px',
                                        width: viewMode === 'list' ? '200px' : 'auto'
                                    }}
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
                                
                                <Card.Body className={viewMode === 'list' ? 'd-flex flex-column justify-content-between' : ''}>
                                    <div>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title mb-0">{template.name}</h6>
                                            <Badge bg="primary">{template.categoryName}</Badge>
                                        </div>
                                        <p className="card-text text-muted small mb-3">
                                            {template.description}
                                        </p>
                                    </div>
                                    
                                    <div className={`d-flex align-items-center ${
                                        viewMode === 'list' ? 'justify-content-between' : 'justify-content-between'
                                    }`}>
                                        <span className="fw-bold text-primary fs-5">
                                            {formatPrice(template.price)}
                                        </span>
                                        <div className="d-flex gap-2">
                                            <Button 
                                                as={Link}
                                                to={`/templates/${template.id}`}
                                                variant="outline-primary" 
                                                size="sm"
                                            >
                                                Chi tiết
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => handleCustomizeClick(template.id)}
                                            >
                                                {isAuthenticated() ? 'Tùy chỉnh' : (
                                                    <>
                                                        <FiLock className="me-1" />
                                                        Đăng nhập để thử
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Đăng nhập để thử mẫu thiệp</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-3">
                        <FiLock size={48} className="text-primary" />
                    </div>
                    <h5>Bạn cần đăng nhập</h5>
                    <p className="text-muted">
                        Đăng nhập để tùy chỉnh và tạo thiệp cưới theo ý muốn của bạn
                    </p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button 
                        as={Link} 
                        to="/login" 
                        variant="primary"
                        onClick={() => setShowLoginModal(false)}
                    >
                        Đăng nhập ngay
                    </Button>
                    <Button 
                        as={Link} 
                        to="/register" 
                        variant="outline-primary"
                        onClick={() => setShowLoginModal(false)}
                    >
                        Đăng ký mới
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Templates;