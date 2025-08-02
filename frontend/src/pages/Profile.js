import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { validateEmail } from '../utils/helpers';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || ''
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        
        try {
            // Simulate API call to update user profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update user context
            updateUser({ ...user, ...data });
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4" style={{marginTop: '80px'}}>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                    <FiUser size={30} className="text-primary" />
                                </div>
                                <h3 className="serif-font mb-2">Thông tin cá nhân</h3>
                                <p className="text-muted">Cập nhật thông tin tài khoản của bạn</p>
                            </div>

                            {error && (
                                <Alert variant="danger" className="mb-4">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <FiUser className="me-2" />
                                                Tên đăng nhập
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user?.username || ''}
                                                disabled
                                                className="bg-light"
                                            />
                                            <Form.Text className="text-muted">
                                                Tên đăng nhập không thể thay đổi
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <FiMail className="me-2" />
                                                Email *
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email"
                                                {...register('email', {
                                                    required: 'Email không được để trống',
                                                    validate: value => validateEmail(value) || 'Email không hợp lệ'
                                                })}
                                                isInvalid={!!errors.email}
                                            />
                                            {errors.email && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Họ và tên *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        {...register('fullName', {
                                            required: 'Họ và tên không được để trống'
                                        })}
                                        isInvalid={!!errors.fullName}
                                    />
                                    {errors.fullName && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.fullName.message}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <FiPhone className="me-2" />
                                                Số điện thoại
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="Nhập số điện thoại"
                                                {...register('phone')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Vai trò</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                                                disabled
                                                className="bg-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        <FiMapPin className="me-2" />
                                        Địa chỉ
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Nhập địa chỉ"
                                        {...register('address')}
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            'Đang cập nhật...'
                                        ) : (
                                            <>
                                                <FiSave className="me-2" />
                                                Cập nhật thông tin
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;