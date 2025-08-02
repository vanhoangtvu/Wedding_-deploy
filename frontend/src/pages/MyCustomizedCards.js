import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Tab, Tabs } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiShoppingCart, FiHeart, FiEye, FiPlus, FiCode } from 'react-icons/fi';
import apiService from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDate, formatTime, formatWeddingNames } from '../utils/helpers';
import { toast } from 'react-toastify';

const MyCustomizedCards = () => {
    const location = useLocation();
    const { addToCart } = useCart();
    const [allCards, setAllCards] = useState([]);
    const [savedCards, setSavedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, card: null });
    const [previewModal, setPreviewModal] = useState({ show: false, card: null });
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchCustomizedCards();
        
        // Handle redirect from card editor
        if (location.state?.newCard) {
            toast.success('Thiệp HTML đã được tạo thành công!');
            if (location.state.showAddToCart) {
                const newCard = location.state.newCard;
                // Auto-add to cart if requested
                // addToCart(newCard, 1);
            }
        }
    }, [location.state]);

    const fetchCustomizedCards = async () => {
        try {
            setLoading(true);
            setError('');
            
            const [allResponse, savedResponse] = await Promise.all([
                apiService.getUserCustomizedCards(),
                apiService.getUserSavedCards()
            ]);
            
            setAllCards(allResponse.data);
            setSavedCards(savedResponse.data);
        } catch (error) {
            setError('Không thể tải danh sách thiệp. Vui lòng thử lại.');
            console.error('Error fetching customized cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCard = async (card) => {
        try {
            await apiService.saveCustomizedCard(card.id);
            toast.success('Đã lưu thiệp vào yêu thích');
            fetchCustomizedCards(); // Refresh data
        } catch (error) {
            toast.error('Không thể lưu thiệp. Vui lòng thử lại.');
            console.error('Error saving card:', error);
        }
    };

    const handleDeleteCard = async () => {
        if (!deleteModal.card) return;
        
        try {
            await apiService.deleteCustomizedCard(deleteModal.card.id);
            toast.success('Đã xóa thiệp thành công');
            setDeleteModal({ show: false, card: null });
            fetchCustomizedCards(); // Refresh data
        } catch (error) {
            toast.error('Không thể xóa thiệp. Vui lòng thử lại.');
            console.error('Error deleting card:', error);
        }
    };

    const handleAddToCart = (card) => {
        const cartItem = {
            id: card.id,
            templateId: card.templateId,
            templateName: card.templateName,
            cardTemplateName: card.cardTemplateName,
            groomName: card.groomName,
            brideName: card.brideName,
            weddingDate: card.weddingDate,
            weddingTime: card.weddingTime,
            weddingVenue: card.weddingVenue,
            customMessage: card.customMessage,
            renderedHtml: card.renderedHtml,
            unitPrice: card.templatePrice || 50000 // Default price if not available
        };
        addToCart(cartItem, 1);
    };

    const handlePreview = (card) => {
        setPreviewModal({ show: true, card });
    };

    const CustomizedCardComponent = ({ card, showSaveButton = false }) => (
        <Card className="h-100 border-0 shadow-sm">
            <div 
                className="card-img-top bg-light d-flex align-items-center justify-content-center position-relative"
                style={{height: '200px', overflow: 'hidden'}}
            >
                {card.renderedHtml ? (
                    <div className="w-100 h-100" style={{transform: 'scale(0.6)', pointerEvents: 'none'}}>
                        {card.renderedCss && (
                            <style dangerouslySetInnerHTML={{ __html: card.renderedCss }} />
                        )}
                        <div 
                            dangerouslySetInnerHTML={{ 
                                __html: card.renderedHtml 
                            }} 
                        />
                    </div>
                ) : (
                    <div className="text-center text-muted p-3">
                        <div className="fs-1 mb-2">📄</div>
                        <div className="preview-names serif-font">
                            {formatWeddingNames(card.groomName, card.brideName)}
                        </div>
                        <div className="small">
                            {formatDate(card.weddingDate)}
                        </div>
                    </div>
                )}
                
                {/* Status badge */}
                <div className="position-absolute top-0 end-0 p-2">
                    {card.isSaved ? (
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
                    <h6 className="card-title mb-1">{card.templateName}</h6>
                    <div className="d-flex gap-1 mb-2">
                        <Badge bg="primary" className="small">{card.templateName}</Badge>
                        <Badge bg="info" className="small">
                            <FiCode className="me-1" />
                            {card.cardTemplateName}
                        </Badge>
                    </div>
                </div>
                
                <div className="mb-3">
                    <div className="d-flex justify-content-between text-sm text-muted mb-1">
                        <span>Cặp đôi:</span>
                        <strong>{formatWeddingNames(card.groomName, card.brideName)}</strong>
                    </div>
                    <div className="d-flex justify-content-between text-sm text-muted mb-1">
                        <span>Ngày cưới:</span>
                        <strong>
                            {formatDate(card.weddingDate)}
                            {card.weddingTime && (
                                <> • {formatTime(card.weddingTime)}</>
                            )}
                        </strong>
                    </div>
                    {card.weddingVenue && (
                        <div className="text-sm text-muted">
                            <span>Địa điểm: </span>
                            <span className="fw-medium">{card.weddingVenue}</span>
                        </div>
                    )}
                </div>
                
                <div className="d-flex gap-2 flex-wrap">
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handlePreview(card)}
                    >
                        <FiEye className="me-1" />
                        Xem
                    </Button>
                    
                    <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleAddToCart(card)}
                    >
                        <FiShoppingCart className="me-1" />
                        Thêm vào giỏ
                    </Button>
                    
                    {showSaveButton && !card.isSaved && (
                        <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => handleSaveCard(card)}
                        >
                            <FiHeart className="me-1" />
                            Lưu
                        </Button>
                    )}
                    
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => setDeleteModal({ show: true, card })}
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
                            <h2 className="serif-font mb-2">
                                <FiCode className="me-2" />
                                Thiệp HTML của tôi
                            </h2>
                            <p className="text-muted">Quản lý các thiệp HTML đã tạo</p>
                        </div>
                        <Button as={Link} to="/templates" variant="primary">
                            <FiPlus className="me-2" />
                            Tạo thiệp HTML mới
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
                <Tab eventKey="all" title={`Tất cả (${allCards.length})`}>
                    {allCards.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="fs-1 mb-3">📄</div>
                            <h4>Chưa có thiệp HTML nào</h4>
                            <p className="text-muted mb-4">
                                Bạn chưa tạo thiệp HTML nào. Hãy bắt đầu tạo thiệp đầu tiên!
                            </p>
                            <Button as={Link} to="/templates" variant="primary">
                                <FiPlus className="me-2" />
                                Tạo thiệp HTML đầu tiên
                            </Button>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {allCards.map((card) => (
                                <Col md={6} lg={4} key={card.id}>
                                    <CustomizedCardComponent card={card} showSaveButton />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
                
                <Tab eventKey="saved" title={`Đã lưu (${savedCards.length})`}>
                    {savedCards.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="fs-1 mb-3">❤️</div>
                            <h4>Chưa có thiệp yêu thích</h4>
                            <p className="text-muted mb-4">
                                Bạn chưa lưu thiệp HTML nào vào danh sách yêu thích
                            </p>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {savedCards.map((card) => (
                                <Col md={6} lg={4} key={card.id}>
                                    <CustomizedCardComponent card={card} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
            </Tabs>

            {/* Preview Modal */}
            <Modal 
                show={previewModal.show} 
                onHide={() => setPreviewModal({ show: false, card: null })}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Preview - {formatWeddingNames(
                            previewModal.card?.groomName, 
                            previewModal.card?.brideName
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {previewModal.card && (
                        <div className="border rounded p-3 bg-light">
                            {previewModal.card.renderedCss && (
                                <style dangerouslySetInnerHTML={{ __html: previewModal.card.renderedCss }} />
                            )}
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: previewModal.card.renderedHtml 
                                }} 
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setPreviewModal({ show: false, card: null })}
                    >
                        Đóng
                    </Button>
                    {previewModal.card && (
                        <Button 
                            variant="primary"
                            onClick={() => {
                                handleAddToCart(previewModal.card);
                                setPreviewModal({ show: false, card: null });
                            }}
                        >
                            <FiShoppingCart className="me-2" />
                            Thêm vào giỏ hàng
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal 
                show={deleteModal.show} 
                onHide={() => setDeleteModal({ show: false, card: null })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa thiệp HTML</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa thiệp HTML này không?</p>
                    {deleteModal.card && (
                        <div className="bg-light p-3 rounded">
                            <strong>{deleteModal.card.templateName}</strong>
                            <br />
                            <small className="text-muted">
                                {formatWeddingNames(
                                    deleteModal.card.groomName, 
                                    deleteModal.card.brideName
                                )}
                                {' • '}
                                {formatDate(deleteModal.card.weddingDate)}
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
                        onClick={() => setDeleteModal({ show: false, card: null })}
                    >
                        Hủy
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteCard}
                    >
                        Xóa thiệp
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyCustomizedCards;