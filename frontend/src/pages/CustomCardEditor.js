import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Breadcrumb, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { FiSave, FiShoppingCart, FiArrowLeft, FiEye, FiCode } from 'react-icons/fi';
import apiService from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDate, formatTime } from '../utils/helpers';
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";

const CustomCardEditor = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [template, setTemplate] = useState(null);
    const [cardTemplates, setCardTemplates] = useState([]);
    const [selectedCardTemplate, setSelectedCardTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [weddingDate, setWeddingDate] = useState(null);
    const [weddingTime, setWeddingTime] = useState(new Date());
    const [renderedCard, setRenderedCard] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const watchedFields = watch();

    useEffect(() => {
        fetchTemplateData();
    }, [templateId]);

    useEffect(() => {
        if (selectedCardTemplate && watchedFields.groomName && watchedFields.brideName) {
            previewCard();
        }
    }, [selectedCardTemplate, watchedFields, weddingDate, weddingTime]);

    const fetchTemplateData = async () => {
        try {
            setLoading(true);
            setError('');
            
            const [templateResponse, cardTemplatesResponse] = await Promise.all([
                apiService.getTemplateById(templateId),
                apiService.getCardTemplatesByTemplateId(templateId)
            ]);
            
            setTemplate(templateResponse.data);
            setCardTemplates(cardTemplatesResponse.data);
            
            // Auto select first card template if available
            if (cardTemplatesResponse.data.length > 0) {
                setSelectedCardTemplate(cardTemplatesResponse.data[0]);
            }
        } catch (error) {
            setError('Không thể tải thông tin mẫu thiệp. Vui lòng thử lại.');
            console.error('Error fetching template data:', error);
        } finally {
            setLoading(false);
        }
    };

    const previewCard = async () => {
        if (!selectedCardTemplate || !watchedFields.groomName || !watchedFields.brideName) {
            return;
        }

        try {
            const customData = {
                groom_name: watchedFields.groomName || '',
                bride_name: watchedFields.brideName || '',
                wedding_date: weddingDate ? formatDate(weddingDate) : '',
                wedding_time: weddingTime ? formatTime(weddingTime) : '',
                wedding_venue: watchedFields.weddingVenue || '',
                custom_message: watchedFields.customMessage || ''
            };

            const response = await apiService.renderTemplate({
                cardTemplateId: selectedCardTemplate.id,
                customData: customData,
                saveCard: false // Just preview, don't save
            });

            setRenderedCard(response.data);
        } catch (error) {
            console.error('Error previewing card:', error);
        }
    };

    const onSubmit = async (data) => {
        if (!selectedCardTemplate) {
            toast.error('Vui lòng chọn mẫu thiệp HTML');
            return;
        }

        if (!weddingDate) {
            toast.error('Vui lòng chọn ngày cưới');
            return;
        }

        setSaving(true);
        try {
            const customData = {
                groom_name: data.groomName,
                bride_name: data.brideName,
                wedding_date: formatDate(weddingDate),
                wedding_time: formatTime(weddingTime),
                wedding_venue: data.weddingVenue || '',
                custom_message: data.customMessage || ''
            };

            const response = await apiService.renderTemplate({
                cardTemplateId: selectedCardTemplate.id,
                customData: customData,
                saveCard: true // Save the card
            });

            const savedCard = response.data;
            toast.success('Đã tạo thiệp tùy chỉnh thành công!');
            
            // Navigate to customized cards list
            navigate('/my-customized-cards', { 
                state: { 
                    newCard: savedCard,
                    showAddToCart: true 
                } 
            });
        } catch (error) {
            const message = error.response?.data?.error || 'Không thể tạo thiệp tùy chỉnh. Vui lòng thử lại.';
            toast.error(message);
            console.error('Error creating customized card:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddToCart = async (data) => {
        if (!selectedCardTemplate) {
            toast.error('Vui lòng chọn mẫu thiệp HTML');
            return;
        }

        if (!weddingDate) {
            toast.error('Vui lòng chọn ngày cưới');
            return;
        }

        setSaving(true);
        try {
            const customData = {
                groom_name: data.groomName,
                bride_name: data.brideName,
                wedding_date: formatDate(weddingDate),
                wedding_time: formatTime(weddingTime),
                wedding_venue: data.weddingVenue || '',
                custom_message: data.customMessage || ''
            };

            const response = await apiService.renderTemplate({
                cardTemplateId: selectedCardTemplate.id,
                customData: customData,
                saveCard: true
            });

            const savedCard = response.data;
            
            // Add to cart
            const cartItem = {
                id: savedCard.id,
                templateId: savedCard.templateId,
                templateName: savedCard.templateName,
                cardTemplateName: savedCard.cardTemplateName,
                groomName: savedCard.groomName,
                brideName: savedCard.brideName,
                weddingDate: savedCard.weddingDate,
                weddingTime: savedCard.weddingTime,
                weddingVenue: savedCard.weddingVenue,
                customMessage: savedCard.customMessage,
                renderedHtml: savedCard.renderedHtml,
                unitPrice: template.price
            };
            
            addToCart(cartItem, 1);
            navigate('/cart');
        } catch (error) {
            const message = error.response?.data?.error || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
            toast.error(message);
            console.error('Error adding to cart:', error);
        } finally {
            setSaving(false);
        }
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

    if (cardTemplates.length === 0) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <Alert variant="warning">
                    <h5>Chưa có mẫu HTML nào</h5>
                    <p>Mẫu thiệp này chưa có mẫu HTML. Vui lòng quay lại sau hoặc chọn mẫu khác.</p>
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
                <Breadcrumb.Item as={Link} to={`/templates/${templateId}`}>{template.name}</Breadcrumb.Item>
                <Breadcrumb.Item active>Tùy chỉnh HTML</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="g-5">
                {/* Form */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <h3 className="serif-font mb-4">
                                <FiCode className="me-2" />
                                Tùy chỉnh thiệp HTML
                            </h3>
                            
                            {/* Card Template Selection */}
                            <div className="form-section mb-4">
                                <h5 className="text-primary mb-3">🎨 Chọn mẫu HTML</h5>
                                <Row className="g-3">
                                    {cardTemplates.map((cardTemplate) => (
                                        <Col md={6} key={cardTemplate.id}>
                                            <Card 
                                                className={`border-2 cursor-pointer ${
                                                    selectedCardTemplate?.id === cardTemplate.id 
                                                        ? 'border-primary' 
                                                        : 'border-light'
                                                }`}
                                                onClick={() => setSelectedCardTemplate(cardTemplate)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Card.Body className="p-3">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 className="mb-1">{cardTemplate.cardTemplateName}</h6>
                                                            <Badge bg="info" className="small">
                                                                Version {cardTemplate.version}
                                                            </Badge>
                                                        </div>
                                                        {selectedCardTemplate?.id === cardTemplate.id && (
                                                            <Badge bg="primary">✓ Đã chọn</Badge>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                {/* Couple Names */}
                                <div className="form-section">
                                    <h5 className="text-primary mb-3">👰🤵 Thông tin cặp đôi</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên chú rể *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên chú rể"
                                                    {...register('groomName', {
                                                        required: 'Tên chú rể không được để trống'
                                                    })}
                                                    isInvalid={!!errors.groomName}
                                                />
                                                {errors.groomName && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.groomName.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên cô dâu *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên cô dâu"
                                                    {...register('brideName', {
                                                        required: 'Tên cô dâu không được để trống'
                                                    })}
                                                    isInvalid={!!errors.brideName}
                                                />
                                                {errors.brideName && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.brideName.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Wedding Details */}
                                <div className="form-section">
                                    <h5 className="text-primary mb-3">💒 Thông tin đám cưới</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ngày cưới *</Form.Label>
                                                <DatePicker
                                                    selected={weddingDate}
                                                    onChange={setWeddingDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                    placeholderText="Chọn ngày cưới"
                                                    className="form-control"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Giờ cưới</Form.Label>
                                                <DatePicker
                                                    selected={weddingTime}
                                                    onChange={setWeddingTime}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="HH:mm"
                                                    placeholderText="Chọn giờ cưới"
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>Địa điểm tổ chức</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            placeholder="Nhập địa điểm tổ chức đám cưới"
                                            {...register('weddingVenue')}
                                        />
                                    </Form.Group>
                                </div>

                                {/* Custom Message */}
                                <div className="form-section">
                                    <h5 className="text-primary mb-3">💌 Lời nhắn tùy chỉnh</h5>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Lời mời đặc biệt</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Thêm lời mời hoặc thông điệp đặc biệt cho thiệp cưới của bạn..."
                                            {...register('customMessage')}
                                        />
                                    </Form.Group>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex flex-wrap gap-3">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={saving || !selectedCardTemplate}
                                        className="px-4"
                                    >
                                        {saving ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="me-2" />
                                                Lưu thiệp
                                            </>
                                        )}
                                    </Button>
                                    
                                    <Button 
                                        variant="success" 
                                        disabled={saving || !selectedCardTemplate}
                                        onClick={handleSubmit(handleAddToCart)}
                                        className="px-4"
                                    >
                                        <FiShoppingCart className="me-2" />
                                        Thêm vào giỏ hàng
                                    </Button>
                                    
                                    <Button 
                                        as={Link}
                                        to={`/templates/${templateId}`} 
                                        variant="outline-secondary"
                                    >
                                        <FiArrowLeft className="me-2" />
                                        Quay lại
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Preview */}
                <Col lg={4}>
                    <div className="sticky-top" style={{top: '100px'}}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h6 className="mb-0">
                                    <FiEye className="me-2" />
                                    Preview thiệp HTML
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                {renderedCard ? (
                                    <div className="preview-container border rounded p-3 bg-light">
                                        {/* Render CSS */}
                                        {renderedCard.renderedCss && (
                                            <style dangerouslySetInnerHTML={{ __html: renderedCard.renderedCss }} />
                                        )}
                                        
                                        {/* Render HTML */}
                                        <div 
                                            dangerouslySetInnerHTML={{ 
                                                __html: renderedCard.renderedHtml 
                                            }} 
                                        />
                                    </div>
                                ) : selectedCardTemplate ? (
                                    <div className="text-center text-muted p-4">
                                        <div className="fs-3 mb-2">📄</div>
                                        <p>Nhập thông tin cặp đôi để xem preview</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted p-4">
                                        <div className="fs-3 mb-2">🎨</div>
                                        <p>Chọn mẫu HTML để bắt đầu</p>
                                    </div>
                                )}
                                
                                <div className="text-center mt-3">
                                    <h6 className="serif-font mb-2">{template.name}</h6>
                                    <p className="text-muted small mb-3">{template.categoryName}</p>
                                    <div className="fs-5 fw-bold text-primary">
                                        {formatPrice(template.price)}
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

export default CustomCardEditor;