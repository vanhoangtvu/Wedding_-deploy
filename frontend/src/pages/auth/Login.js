import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // Redirect nếu đã đăng nhập
    React.useEffect(() => {
        if (isAuthenticated()) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await login(data);
            if (result.success) {
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-light-primary min-vh-100 d-flex align-items-center" style={{paddingTop: '80px'}}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="border-0 shadow-lg">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="serif-font text-primary mb-2">Đăng nhập</h2>
                                    <p className="text-muted">Chào mừng bạn trở lại!</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên đăng nhập</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên đăng nhập"
                                            {...register('username', {
                                                required: 'Tên đăng nhập không được để trống'
                                            })}
                                            isInvalid={!!errors.username}
                                        />
                                        {errors.username && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.username.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Mật khẩu</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Nhập mật khẩu"
                                                {...register('password', {
                                                    required: 'Mật khẩu không được để trống'
                                                })}
                                                isInvalid={!!errors.password}
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute top-50 end-0 translate-middle-y border-0 text-muted"
                                                onClick={() => setShowPassword(!showPassword)}
                                                type="button"
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </Button>
                                        </div>
                                        {errors.password && (
                                            <Form.Control.Feedback type="invalid" className="d-block">
                                                {errors.password.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>

                                    <div className="d-grid mb-3">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Đang đăng nhập...
                                                </>
                                            ) : (
                                                <>
                                                    <FiLogIn className="me-2" />
                                                    Đăng nhập
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center">
                                    <p className="mb-0">
                                        Chưa có tài khoản?{' '}
                                        <Link to="/register" className="text-primary text-decoration-none">
                                            Đăng ký ngay
                                        </Link>
                                    </p>
                                </div>

                                {/* Demo accounts info */}
                                <div className="mt-4 p-3 bg-light rounded">
                                    <small className="text-muted">
                                        <strong>Tài khoản demo:</strong><br/>
                                        Admin: admin / admin123<br/>
                                        User: user1 / user123
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;