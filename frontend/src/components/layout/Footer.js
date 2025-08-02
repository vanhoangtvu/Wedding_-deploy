import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white">
            <Container>
                <Row className="py-5">
                    <Col lg={4} md={6} className="mb-4">
                        <h5 className="serif-font mb-3">💍 Wedinvite</h5>
                        <p className="text-light mb-3">
                            Nền tảng tạo thiệp cưới online hiện đại với mẫu HTML cao cấp, 
                            tính năng tùy chỉnh linh hoạt và hệ thống đặt hàng tiện lợi.
                        </p>
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center">
                                <FiMail className="me-2" />
                                <span>contact@wedinvite.com</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <FiPhone className="me-2" />
                                <span>1900 6969</span>
                            </div>
                        </div>
                    </Col>

                    <Col lg={2} md={6} className="mb-4">
                        <h6 className="mb-3">Dịch vụ</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/templates" className="text-light text-decoration-none">
                                    Mẫu thiệp cưới
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/create-invitation" className="text-light text-decoration-none">
                                    Tạo thiệp mới
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/my-customized-cards" className="text-light text-decoration-none">
                                    Thiệp HTML cao cấp
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/cart" className="text-light text-decoration-none">
                                    Đặt hàng online
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={2} md={6} className="mb-4">
                        <h6 className="mb-3">Hỗ trợ</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-light text-decoration-none">
                                    Hướng dẫn đặt hàng
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/" className="text-light text-decoration-none">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/" className="text-light text-decoration-none">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/" className="text-light text-decoration-none">
                                    Bảo mật thông tin
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                        <h6 className="mb-3">Liên hệ</h6>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <FiPhone className="me-2" />
                                <span>0123 456 789</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FiMail className="me-2" />
                                <span>hotro@thiepCuoi.com</span>
                            </div>
                            <div className="d-flex align-items-start mb-2">
                                <FiMapPin className="me-2 mt-1" />
                                <span>123 Đường ABC, Quận 1, TP.HCM</span>
                            </div>
                        </div>
                        
                        <div className="bg-primary bg-opacity-10 p-3 rounded">
                            <h6 className="mb-2">💌 Nhận ưu đãi mới nhất</h6>
                            <p className="small mb-2">Đăng ký để nhận thông tin về các mẫu thiệp mới và khuyến mãi</p>
                            <div className="d-flex">
                                <input 
                                    type="email" 
                                    className="form-control form-control-sm me-2" 
                                    placeholder="Email của bạn" 
                                />
                                <button className="btn btn-primary btn-sm">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4" />

                <Row className="align-items-center">
                    <Col md={6}>
                        <p className="mb-0">
                            © 2024 Thiệp Cưới Online. All rights reserved.
                        </p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p className="mb-0">
                            Made with <FiHeart className="text-danger mx-1" /> by Development Team
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;