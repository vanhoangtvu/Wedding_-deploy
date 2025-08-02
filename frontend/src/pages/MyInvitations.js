import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Tab, Tabs } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiShoppingCart, FiHeart, FiEye, FiPlus } from 'react-icons/fi';
import apiService from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDate, formatTime, formatWeddingNames } from '../utils/helpers';
import { toast } from 'react-toastify';

const MyInvitations = () => {
    const location = useLocation();
    const { addToCart } = useCart();
    const [allInvitations, setAllInvitations] = useState([]);
    const [savedInvitations, setSavedInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, invitation: null });
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchInvitations();
        
        // Handle redirect from custom invitation creation
        if (location.state?.newInvitation) {
            toast.success('Thiệp đã được tạo thành công!');
            if (location.state.showAddToCart) {
                const newInvitation = location.state.newInvitation;
                // Auto-add to cart if requested
                // addToCart(newInvitation, 1);
            }
        }
    }, [location.state]);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            setError('');
            
            const [allResponse, savedResponse] = await Promise.all([
                apiService.getUserInvitations(),
                apiService.getUserSavedInvitations()
            ]);
            
            setAllInvitations(allResponse.data);
            setSavedInvitations(savedResponse.data);
        } catch (error) {
            setError('Không thể tải danh sách thiệp. Vui lòng thử lại.');
            console.error('Error fetching invitations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveInvitation = async (invitation) => {
        try {
            await apiService.saveCustomInvitation(invitation.id);
            toast.success('Đã lưu thiệp vào yêu thích');
            fetchInvitations(); // Refresh data
        } catch (error) {
            toast.error('Không thể lưu thiệp. Vui lòng thử lại.');
            console.error('Error saving invitation:', error);
        }
    };

    const handleDeleteInvitation = async () => {
        if (!deleteModal.invitation) return;
        
        try {
            await apiService.deleteCustomInvitation(deleteModal.invitation.id);
            toast.success('Đã xóa thiệp thành công');
            setDeleteModal({ show: false, invitation: null });
            fetchInvitations(); // Refresh data
        } catch (error) {
            toast.error('Không thể xóa thiệp. Vui lòng thử lại.');
            console.error('Error deleting invitation:', error);
        }
    };

    const handleAddToCart = (invitation) => {
        const cartItem = {
            ...invitation,
            unitPrice: invitation.templatePrice || 50000 // Default price if not available
        };
        addToCart(cartItem, 1);
    };

    const InvitationCard = ({ invitation, showSaveButton = false }) => (
        <Card className="h-100 border-0 shadow-sm">
            <div 
                className="card-img-top bg-light d-flex align-items-center justify-content-center position-relative"
                style={{height: '200px'}}
            >
                {invitation.generatedImageUrl ? (
                    <img 
                        src={invitation.generatedImageUrl} 
                        alt="Custom invitation"
                        className="img-fluid rounded"
                        style={{maxHeight: '100%', maxWidth: '100%'}}
                    />
                ) : (
                    <div className="text-center text-muted p-3">
                        <div className="fs-1 mb-2">💌</div>
                        <div className="preview-names serif-font">
                            {formatWeddingNames(invitation.groomName, invitation.brideName)}
                        </div>
                        <div className="small">
                            {formatDate(invitation.weddingDate)}
                        </div>
                    </div>
                )}
                
                {/* Status badge */}
                <div className="position-absolute top-0 end-0 p-2">
                    {invitation.isSaved ? (
                        <Badge bg="success">
                            <FiHeart className="me-1" />
                            Đã lưu
                        </Badge>
                    ) : (
                        <Badge bg="secondary">Bản nháp</Badge>
                    )}
                </div>
            </div>
            
            <Card.Body>
                <div className="mb-2">
                    <h6 className="card-title mb-1">{invitation.templateName}</h6>
                    <Badge bg="primary" className="small">{invitation.categoryName}</Badge>
                </div>
                
                <div className="mb-3">
                    <div className="d-flex justify-content-between text-sm text-muted mb-1">
                        <span>Cặp đôi:</span>
                        <strong>{formatWeddingNames(invitation.groomName, invitation.brideName)}</strong>
                    </div>
                    <div className="d-flex justify-content-between text-sm text-muted mb-1">
                        <span>Ngày cưới:</span>
                        <strong>
                            {formatDate(invitation.weddingDate)}
                            {invitation.weddingTime && (
                                <> • {formatTime(invitation.weddingTime)}</>
                            )}
                        </strong>
                    </div>
                    {invitation.weddingVenue && (
                        <div className="text-sm text-muted">
                            <span>Địa điểm: </span>
                            <span className="fw-medium">{invitation.weddingVenue}</span>
                        </div>
                    )}
                </div>
                
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleAddToCart(invitation)}
                    >
                        <FiShoppingCart className="me-1" />
                        Thêm vào giỏ
                    </Button>
                    
                    <Button 
                        as={Link}
                        to={`/custom-invitation/${invitation.templateId}`}
                        variant="outline-secondary" 
                        size="sm"
                    >
                        <FiEdit3 className="me-1" />
                        Sửa
                    </Button>
                    
                    {showSaveButton && !invitation.isSaved && (
                        <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleSaveInvitation(invitation)}
                        >
                            <FiHeart className="me-1" />
                            Lưu
                        </Button>
                    )}
                    
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => setDeleteModal({ show: true, invitation })}
                    >
                        <FiTrash2 />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );

    if (loading) {
        return (
            <Container className="py-5" style={{marginTop: '80px'}}>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải danh sách thiệp...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="serif-font mb-2">Thiệp của tôi</h2>
                            <p className="text-muted">Quản lý các thiệp cưới bạn đã tạo</p>
                        </div>
                        <Button as={Link} to="/templates" variant="primary">
                            <FiPlus className="me-2" />
                            Tạo thiệp mới
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="mb-4"
            >
                <Tab eventKey="all" title={`Tất cả (${allInvitations.length})`}>
                    {allInvitations.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="fs-1 mb-3">💌</div>
                            <h4>Chưa có thiệp nào</h4>
                            <p className="text-muted mb-4">
                                Bạn chưa tạo thiệp cưới nào. Hãy bắt đầu tạo thiệp đầu tiên của bạn!
                            </p>
                            <Button as={Link} to="/templates" variant="primary">
                                <FiPlus className="me-2" />
                                Tạo thiệp đầu tiên
                            </Button>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {allInvitations.map((invitation) => (
                                <Col md={6} lg={4} key={invitation.id}>
                                    <InvitationCard invitation={invitation} showSaveButton />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
                
                <Tab eventKey="saved" title={`Đã lưu (${savedInvitations.length})`}>
                    {savedInvitations.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="fs-1 mb-3">❤️</div>
                            <h4>Chưa có thiệp yêu thích</h4>
                            <p className="text-muted mb-4">
                                Bạn chưa lưu thiệp nào vào danh sách yêu thích
                            </p>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {savedInvitations.map((invitation) => (
                                <Col md={6} lg={4} key={invitation.id}>
                                    <InvitationCard invitation={invitation} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
            </Tabs>

            {/* Delete Confirmation Modal */}
            <Modal 
                show={deleteModal.show} 
                onHide={() => setDeleteModal({ show: false, invitation: null })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa thiệp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa thiệp này không?</p>
                    {deleteModal.invitation && (
                        <div className="bg-light p-3 rounded">
                            <strong>{deleteModal.invitation.templateName}</strong>
                            <br />
                            <small className="text-muted">
                                {formatWeddingNames(
                                    deleteModal.invitation.groomName, 
                                    deleteModal.invitation.brideName
                                )}
                                {' • '}
                                {formatDate(deleteModal.invitation.weddingDate)}
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
                        onClick={() => setDeleteModal({ show: false, invitation: null })}
                    >
                        Hủy
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteInvitation}
                    >
                        Xóa thiệp
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyInvitations;