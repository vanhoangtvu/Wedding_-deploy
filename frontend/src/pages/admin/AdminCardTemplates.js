import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit3, FiTrash2, FiArrowLeft, FiCode, FiEye, FiImage } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import apiService from '../../services/apiService';
import { formatDateTime } from '../../utils/helpers';
import { toast } from 'react-toastify';

const AdminCardTemplates = () => {
    const [cardTemplates, setCardTemplates] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, template: null });
    const [previewModal, setPreviewModal] = useState({ show: false, template: null });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const [cardTemplatesResponse, templatesResponse] = await Promise.all([
                apiService.getMyCardTemplates(),
                apiService.getTemplates()
            ]);
            setCardTemplates(cardTemplatesResponse.data);
            setTemplates(templatesResponse.data);
        } catch (error) {
            setError('Không thể tải danh sách mẫu thiệp HTML. Vui lòng thử lại.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (template = null) => {
        setEditingTemplate(template);
        if (template) {
            reset({
                templateId: template.templateId,
                cardTemplateName: template.cardTemplateName,
                htmlContent: template.htmlContent,
                cssContent: template.cssContent,
                templateVariables: template.templateVariables,
                previewImageUrl: template.previewImageUrl,
                version: template.version
            });
        } else {
            reset({
                templateId: '',
                cardTemplateName: '',
                htmlContent: '',
                cssContent: '',
                templateVariables: '{"groom_name": "Tên chú rể", "bride_name": "Tên cô dâu", "wedding_date": "Ngày cưới", "wedding_time": "Giờ cưới", "wedding_venue": "Địa điểm", "custom_message": "Lời nhắn"}',
                previewImageUrl: '',
                version: '1.0'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTemplate(null);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (editingTemplate) {
                await apiService.updateCardTemplate(editingTemplate.id, data);
                toast.success('Cập nhật mẫu thiệp HTML thành công!');
            } else {
                await apiService.createCardTemplate(data);
                toast.success('Tạo mẫu thiệp HTML mới thành công!');
            }
            
            handleCloseModal();
            fetchData();
        } catch (error) {
            const message = error.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.';
            toast.error(message);
            console.error('Error saving card template:', error);
        }
    };

    const handleDeleteTemplate = async () => {
        if (!deleteModal.template) return;
        
        try {
            await apiService.deleteCardTemplate(deleteModal.template.id);
            toast.success('Xóa mẫu thiệp HTML thành công!');
            setDeleteModal({ show: false, template: null });
            fetchData();
        } catch (error) {
            const message = error.response?.data?.error || 'Không thể xóa mẫu thiệp HTML. Vui lòng thử lại.';
            toast.error(message);
            console.error('Error deleting card template:', error);
        }
    };

    const handlePreview = (template) => {
        setPreviewModal({ show: true, template });
    };

    const PreviewComponent = ({ template }) => {
        if (!template) return null;

        return (
            <div>
                <style dangerouslySetInnerHTML={{ __html: template.cssContent }} />
                <div 
                    dangerouslySetInnerHTML={{ 
                        __html: template.htmlContent 
                    }} 
                />
            </div>
        );
    };

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="serif-font mb-2">
                                <FiCode className="me-2" />
                                Quản lý mẫu thiệp HTML
                            </h2>
                            <p className="text-muted">Tạo và quản lý mẫu thiệp HTML với CSS</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="success"
                                onClick={() => handleShowModal()}
                            >
                                <FiPlus className="me-2" />
                                Thêm mẫu HTML
                            </Button>
                            <Button
                                as={Link}
                                to="/admin"
                                variant="outline-secondary"
                            >
                                <FiArrowLeft className="me-2" />
                                Quay lại
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Đang tải danh sách mẫu thiệp HTML...</p>
                        </div>
                    ) : cardTemplates.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="fs-1 mb-3">📄</div>
                            <h4>Chưa có mẫu thiệp HTML nào</h4>
                            <p className="text-muted mb-4">Hãy thêm mẫu thiệp HTML đầu tiên</p>
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <FiPlus className="me-2" />
                                Thêm mẫu HTML đầu tiên
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 p-3">ID</th>
                                        <th className="border-0 p-3">Tên mẫu HTML</th>
                                        <th className="border-0 p-3">Template gốc</th>
                                        <th className="border-0 p-3">Version</th>
                                        <th className="border-0 p-3">Ngày tạo</th>
                                        <th className="border-0 p-3 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cardTemplates.map((template) => (
                                        <tr key={template.id}>
                                            <td className="p-3">
                                                <Badge bg="secondary">#{template.id}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <strong>{template.cardTemplateName}</strong>
                                                {template.previewImageUrl && (
                                                    <div className="mt-1">
                                                        <Badge bg="info" className="small">
                                                            <FiImage className="me-1" />
                                                            Có ảnh preview
                                                        </Badge>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <span className="text-muted">{template.templateName}</span>
                                            </td>
                                            <td className="p-3">
                                                <Badge bg="primary">{template.version}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <small className="text-muted">
                                                    {formatDateTime(template.createdAt)}
                                                </small>
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => handlePreview(template)}
                                                    >
                                                        <FiEye />
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleShowModal(template)}
                                                    >
                                                        <FiEdit3 />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => setDeleteModal({ show: true, template })}
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Card Template Form Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingTemplate ? 'Sửa mẫu thiệp HTML' : 'Thêm mẫu thiệp HTML mới'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Tabs defaultActiveKey="basic" className="mb-3">
                            <Tab eventKey="basic" title="Thông tin cơ bản">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Template gốc *</Form.Label>
                                            <Form.Select
                                                {...register('templateId', {
                                                    required: 'Template gốc không được để trống'
                                                })}
                                                isInvalid={!!errors.templateId}
                                            >
                                                <option value="">Chọn template gốc</option>
                                                {templates.map(template => (
                                                    <option key={template.id} value={template.id}>
                                                        {template.name} - {template.categoryName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.templateId && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.templateId.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tên mẫu HTML *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tên mẫu HTML"
                                                {...register('cardTemplateName', {
                                                    required: 'Tên mẫu HTML không được để trống'
                                                })}
                                                isInvalid={!!errors.cardTemplateName}
                                            />
                                            {errors.cardTemplateName && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.cardTemplateName.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>URL ảnh preview</Form.Label>
                                            <Form.Control
                                                type="url"
                                                placeholder="https://example.com/preview.jpg"
                                                {...register('previewImageUrl')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Version</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="1.0"
                                                {...register('version')}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="template" title="Template Variables">
                                <Form.Group className="mb-3">
                                    <Form.Label>Template Variables (JSON) *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={8}
                                        placeholder='{"groom_name": "Tên chú rể", "bride_name": "Tên cô dâu"}'
                                        {...register('templateVariables', {
                                            required: 'Template variables không được để trống'
                                        })}
                                        isInvalid={!!errors.templateVariables}
                                    />
                                    {errors.templateVariables && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.templateVariables.message}
                                        </Form.Control.Feedback>
                                    )}
                                    <Form.Text className="text-muted">
                                        JSON định nghĩa các biến có thể thay thế trong HTML template
                                    </Form.Text>
                                </Form.Group>
                            </Tab>

                            <Tab eventKey="html" title="HTML Content">
                                <Form.Group className="mb-3">
                                    <Form.Label>HTML Content *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={15}
                                        placeholder="<div class='wedding-card'>{{groom_name}} & {{bride_name}}</div>"
                                        {...register('htmlContent', {
                                            required: 'HTML content không được để trống'
                                        })}
                                        isInvalid={!!errors.htmlContent}
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                    {errors.htmlContent && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.htmlContent.message}
                                        </Form.Control.Feedback>
                                    )}
                                    <Form.Text className="text-muted">
                                        Sử dụng {'{{'} và {'}'} để tạo placeholders như {'{'}{'{'} groom_name {'}'}{'}'}, {'{'}{'{'} bride_name {'}'}{'}'}
                                    </Form.Text>
                                </Form.Group>
                            </Tab>

                            <Tab eventKey="css" title="CSS Styling">
                                <Form.Group className="mb-3">
                                    <Form.Label>CSS Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={15}
                                        placeholder=".wedding-card { background: #ffd700; padding: 20px; }"
                                        {...register('cssContent')}
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                    <Form.Text className="text-muted">
                                        CSS styling cho HTML template
                                    </Form.Text>
                                </Form.Group>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingTemplate ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Preview Modal */}
            <Modal 
                show={previewModal.show} 
                onHide={() => setPreviewModal({ show: false, template: null })}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Preview - {previewModal.template?.cardTemplateName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="border rounded p-3 bg-light">
                        <PreviewComponent template={previewModal.template} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setPreviewModal({ show: false, template: null })}
                    >
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal 
                show={deleteModal.show} 
                onHide={() => setDeleteModal({ show: false, template: null })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa mẫu thiệp HTML</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa mẫu thiệp HTML này không?</p>
                    {deleteModal.template && (
                        <div className="bg-light p-3 rounded">
                            <strong>{deleteModal.template.cardTemplateName}</strong>
                            <br />
                            <small className="text-muted">
                                Template: {deleteModal.template.templateName}
                            </small>
                        </div>
                    )}
                    <p className="text-danger small mt-2 mb-0">
                        ⚠️ Hành động này không thể hoàn tác
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setDeleteModal({ show: false, template: null })}
                    >
                        Hủy
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteTemplate}
                    >
                        Xóa mẫu HTML
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminCardTemplates;