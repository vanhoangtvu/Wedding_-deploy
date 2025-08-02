import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFolder, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import apiService from '../../services/apiService';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await apiService.getCategories();
            setCategories(response.data);
        } catch (error) {
            setError('Không thể tải dữ liệu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: ''
            });
        }
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await apiService.updateCategory(editingCategory.id, formData);
                setSuccess('Cập nhật danh mục thành công!');
            } else {
                await apiService.createCategory(formData);
                setSuccess('Tạo danh mục thành công!');
            }
            await loadCategories();
            setTimeout(() => {
                handleCloseModal();
            }, 1500);
        } catch (error) {
            setError('Lỗi: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await apiService.deleteCategory(id);
                setSuccess('Xóa danh mục thành công!');
                await loadCategories();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Lỗi khi xóa: ' + error.message);
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    if (loading) {
        return (
            <Container className="py-4" style={{marginTop: '80px'}}>
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Button 
                                as={Link} 
                                to="/admin" 
                                variant="outline-secondary" 
                                size="sm" 
                                className="me-3"
                            >
                                <FiArrowLeft className="me-1" />
                                Quay lại
                            </Button>
                            <h2 className="mb-0">Quản lý danh mục</h2>
                        </div>
                        <Button variant="primary" onClick={() => handleShowModal()}>
                            <FiPlus className="me-1" />
                            Thêm danh mục
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <FiFolder className="me-2 text-primary" />
                                            <strong>{category.name}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        {category.description && (
                                            <span className="text-muted">
                                                {category.description.length > 100 ? 
                                                    `${category.description.substring(0, 100)}...` : 
                                                    category.description
                                                }
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {category.createdAt ? 
                                            new Date(category.createdAt).toLocaleDateString('vi-VN') : 
                                            'N/A'
                                        }
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="outline-warning" 
                                                size="sm"
                                                onClick={() => handleShowModal(category)}
                                            >
                                                <FiEdit3 />
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <FiTrash2 />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    {categories.length === 0 && (
                        <div className="text-center py-4">
                            <FiFolder className="fs-1 text-muted mb-3" />
                            <h5>Chưa có danh mục nào</h5>
                            <p className="text-muted">Nhấn "Thêm danh mục" để tạo danh mục đầu tiên</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Modal thêm/sửa danh mục */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Tên danh mục *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Cổ điển, Hiện đại, Vintage..."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Mô tả chi tiết về danh mục này..."
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminCategories;