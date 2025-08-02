import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiPlus, FiEdit3, FiTrash2, FiEye, FiSave, FiX } from 'react-icons/fi';
import apiService from '../../services/apiService';

const AdminTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingName, setEditingName] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        price: '',
        imageUrl: '',
        htmlContent: ''
    });

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
            setError('Không thể tải dữ liệu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            categoryId: '',
            price: '',
            imageUrl: '',
            htmlContent: ''
        });
        setEditingTemplate(null);
    };

    const handleShowModal = (template = null) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({
                name: template.name,
                categoryId: template.categoryId?.toString() || '',
                price: template.price?.toString() || '',
                imageUrl: template.imageUrl || '',
                htmlContent: template.htmlContent || ''
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const templateData = {
                ...formData,
                price: parseFloat(formData.price),
                categoryId: parseInt(formData.categoryId),
                description: `Mẫu thiệp ${formData.name}`,
                isActive: true
            };

            if (editingTemplate) {
                await apiService.updateTemplate(editingTemplate.id, templateData);
                setSuccess('Cập nhật mẫu thiệp thành công!');
            } else {
                await apiService.createTemplate(templateData);
                setSuccess('Thêm mẫu thiệp thành công!');
            }
            
            handleCloseModal();
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Lỗi: ' + error.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa mẫu thiệp này?')) {
            try {
                await apiService.deleteTemplate(id);
                setSuccess('Xóa mẫu thiệp thành công!');
                loadData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Lỗi khi xóa: ' + error.message);
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleInlineEdit = async (templateId, newName) => {
        try {
            const template = templates.find(t => t.id === templateId);
            await apiService.updateTemplate(templateId, { ...template, name: newName });
            setSuccess('Cập nhật tên thành công!');
            loadData();
            setEditingName(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Lỗi cập nhật tên: ' + error.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Không xác định';
    };

    if (loading) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải dữ liệu...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <Button as={Link} to="/admin/dashboard" variant="outline-secondary" className="me-3">
                                <FiArrowLeft className="me-2" />
                                Quay lại
                            </Button>
                            <div>
                                <h2 className="serif-font mb-1">Quản lý mẫu thiệp</h2>
                                <p className="text-muted mb-0">Thêm và quản lý mẫu thiệp trưng bày</p>
                            </div>
                        </div>
                        <Button variant="primary" onClick={() => handleShowModal()}>
                            <FiPlus className="me-2" />
                            Thêm mẫu thiệp
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Alerts */}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Templates Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên mẫu</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {templates.map((template) => (
                                <tr key={template.id}>
                                    <td>
                                        <div style={{width: '60px', height: '40px'}} className="bg-light rounded d-flex align-items-center justify-content-center">
                                            {template.imageUrl ? (
                                                <img 
                                                    src={template.imageUrl} 
                                                    alt={template.name}
                                                    className="img-fluid rounded"
                                                    style={{maxWidth: '100%', maxHeight: '100%'}}
                                                />
                                            ) : (
                                                <FiImage className="text-muted" />
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {editingName === template.id ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={template.name}
                                                    size="sm"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleInlineEdit(template.id, e.target.value);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={(e) => {
                                                        const input = e.target.closest('div').querySelector('input');
                                                        handleInlineEdit(template.id, input.value);
                                                    }}
                                                >
                                                    <FiSave />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setEditingName(null)}
                                                >
                                                    <FiX />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center gap-2">
                                                <span>{template.name}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => setEditingName(template.id)}
                                                >
                                                    <FiEdit3 size={12} />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <Badge bg="primary">{getCategoryName(template.categoryId)}</Badge>
                                    </td>
                                    <td className="fw-bold text-primary">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(template.price)}
                                    </td>
                                    <td>
                                        <Badge bg={template.isActive ? 'success' : 'secondary'}>
                                            {template.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline-info"
                                                onClick={() => handleShowModal(template)}
                                            >
                                                <FiEdit3 />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleDelete(template.id)}
                                            >
                                                <FiTrash2 />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {templates.length === 0 && (
                        <div className="text-center py-4">
                            <FiImage size={48} className="text-muted mb-3" />
                            <h5>Chưa có mẫu thiệp nào</h5>
                            <p className="text-muted">Nhấn "Thêm mẫu thiệp" để bắt đầu</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingTemplate ? 'Sửa mẫu thiệp' : 'Thêm mẫu thiệp mới'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên mẫu thiệp *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="VD: Thiệp cưới hoa hồng"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Danh mục *</Form.Label>
                                    <Form.Select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá (VND) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        placeholder="50000"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>URL ảnh</Form.Label>
                                    <Form.Control
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung HTML mẫu</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                value={formData.htmlContent}
                                onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
                                placeholder="<div>HTML content cho mẫu thiệp...</div>"
                            />
                            <Form.Text className="text-muted">
                                Nhập mã HTML cho mẫu thiệp (tùy chọn)
                            </Form.Text>
                        </Form.Group>

                        {/* Preview */}
                        {formData.imageUrl && (
                            <div className="mb-3">
                                <Form.Label>Xem trước ảnh:</Form.Label>
                                <div className="border rounded p-3 text-center">
                                    <img 
                                        src={formData.imageUrl} 
                                        alt="Preview"
                                        style={{maxWidth: '200px', maxHeight: '150px'}}
                                        className="img-fluid rounded"
                                    />
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingTemplate ? 'Cập nhật' : 'Thêm mẫu'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminTemplates;