import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/helpers';

const Register = () => {
    const { register: registerUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    // Redirect nếu đã đăng nhập
    React.useEffect(() => {
        if (isAuthenticated()) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await registerUser(data);
            if (result.success) {
                setSuccess('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
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
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-lg">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="serif-font text-primary mb-2">Đăng ký tài khoản</h2>
                                    <p className="text-muted">Tạo tài khoản để bắt đầu thiết kế thiệp cưới</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert variant="success" className="mb-4">
                                        {success}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên đăng nhập *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên đăng nhập"
                                                    {...register('username', {
                                                        required: 'Tên đăng nhập không được để trống',
                                                        minLength: {
                                                            value: 3,
                                                            message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                                                        },
                                                        maxLength: {
                                                            value: 50,
                                                            message: 'Tên đăng nhập không được quá 50 ký tự'
                                                        }
                                                    })}
                                                    isInvalid={!!errors.username}
                                                />
                                                {errors.username && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.username.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email *</Form.Label>
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
                                            placeholder="Nhập họ và tên đầy đủ"
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
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    placeholder="Nhập số điện thoại"
                                                    {...register('phone')}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Địa chỉ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập địa chỉ"
                                                    {...register('address')}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mật khẩu *</Form.Label>
                                                <div className="position-relative">
                                                    <Form.Control
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Nhập mật khẩu"
                                                        {...register('password', {
                                                            required: 'Mật khẩu không được để trống',
                                                            validate: value => {
                                                                const result = validatePassword(value);
                                                                return result.valid || result.message;
                                                            }
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
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Xác nhận mật khẩu *</Form.Label>
                                                <div className="position-relative">
                                                    <Form.Control
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        placeholder="Nhập lại mật khẩu"
                                                        {...register('confirmPassword', {
                                                            required: 'Vui lòng xác nhận mật khẩu',
                                                            validate: value => value === password || 'Mật khẩu xác nhận không khớp'
                                                        })}
                                                        isInvalid={!!errors.confirmPassword}
                                                    />
                                                    <Button
                                                        variant="link"
                                                        className="position-absolute top-50 end-0 translate-middle-y border-0 text-muted"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        type="button"
                                                    >
                                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                                    </Button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <Form.Control.Feedback type="invalid" className="d-block">
                                                        {errors.confirmPassword.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

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
                                                    Đang tạo tài khoản...
                                                </>
                                            ) : (
                                                <>
                                                    <FiUserPlus className="me-2" />
                                                    Đăng ký
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center">
                                    <p className="mb-0">
                                        Đã có tài khoản?{' '}
                                        <Link to="/login" className="text-primary text-decoration-none">
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;