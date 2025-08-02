import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Breadcrumb } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { FiSave, FiShoppingCart, FiArrowLeft, FiEye } from 'react-icons/fi';
import apiService from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDate, formatTime } from '../utils/helpers';
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";

const CustomInvitation = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [weddingDate, setWeddingDate] = useState(null);
    const [weddingTime, setWeddingTime] = useState(new Date());

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const watchedFields = watch();

    useEffect(() => {
        fetchTemplate();
    }, [templateId]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiService.getTemplateById(templateId);
            setTemplate(response.data);
        } catch (error) {
            setError('Không thể tải thông tin mẫu thiệp. Vui lòng thử lại.');
            console.error('Error fetching template:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!weddingDate) {
            toast.error('Vui lòng chọn ngày cưới');
            return;
        }

        setSaving(true);
        try {
            const invitationData = {
                templateId: parseInt(templateId),
                groomName: data.groomName,
                brideName: data.brideName,
                weddingDate: weddingDate.toISOString().split('T')[0],
                weddingTime: weddingTime.toTimeString().split(' ')[0],
                weddingVenue: data.weddingVenue,
                customMessage: data.customMessage
            };

            const response = await apiService.createCustomInvitation(invitationData);
            const savedInvitation = response.data;
            
            toast.success('Đã tạo thiệp tùy chỉnh thành công!');
            
            // Redirect to my invitations with success message
            navigate('/my-invitations', { 
                state: { 
                    newInvitation: savedInvitation,
                    showAddToCart: true 
                } 
            });
        } catch (error) {
            const message = error.response?.data?.error || 'Không thể tạo thiệp tùy chỉnh. Vui lòng thử lại.';
            toast.error(message);
            console.error('Error creating custom invitation:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddToCart = async (data) => {
        if (!weddingDate) {
            toast.error('Vui lòng chọn ngày cưới');
            return;
        }

        setSaving(true);
        try {
            // First create the custom invitation
            const invitationData = {
                templateId: parseInt(templateId),
                groomName: data.groomName,
                brideName: data.brideName,
                weddingDate: weddingDate.toISOString().split('T')[0],
                weddingTime: weddingTime.toTimeString().split(' ')[0],
                weddingVenue: data.weddingVenue,
                customMessage: data.customMessage
            };

            const response = await apiService.createCustomInvitation(invitationData);
            const savedInvitation = response.data;
            
            // Add to cart
            const cartItem = {
                ...savedInvitation,
                unitPrice: template.price
            };
            
            addToCart(cartItem, 1);
            
            // Navigate to cart
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

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item as={Link} to="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item as={Link} to="/templates">Mẫu thiệp</Breadcrumb.Item>
                <Breadcrumb.Item as={Link} to={`/templates/${templateId}`}>{template.name}</Breadcrumb.Item>
                <Breadcrumb.Item active>Tùy chỉnh</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="g-5">
                {/* Form */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <h3 className="serif-font mb-4">Tùy chỉnh thiệp cưới</h3>
                            
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
                                        <Form.Text className="text-muted">
                                            Lời nhắn sẽ được hiển thị trên thiệp cưới của bạn
                                        </Form.Text>
                                    </Form.Group>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex flex-wrap gap-3">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={saving}
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
                                        disabled={saving}
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
                                    Xem trước thiệp
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <div className="preview-template mb-4">
                                    <div className="text-center">
                                        {template.imageUrl && (
                                            <img 
                                                src={template.imageUrl} 
                                                alt={template.name}
                                                className="img-fluid mb-3 rounded"
                                                style={{maxHeight: '150px'}}
                                            />
                                        )}
                                        
                                        <div className="preview-names">
                                            {watchedFields.groomName || 'Chú rể'} & {watchedFields.brideName || 'Cô dâu'}
                                        </div>
                                        
                                        <div className="preview-date">
                                            {weddingDate ? formatDate(weddingDate) : 'Ngày cưới'}
                                            {weddingTime && (
                                                <> • {formatTime(weddingTime)}</>
                                            )}
                                        </div>
                                        
                                        {watchedFields.weddingVenue && (
                                            <div className="preview-venue">
                                                {watchedFields.weddingVenue}
                                            </div>
                                        )}
                                        
                                        {watchedFields.customMessage && (
                                            <div className="preview-message mt-3 p-2 bg-light rounded">
                                                <small className="fst-italic">"{watchedFields.customMessage}"</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-center">
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

export default CustomInvitation;