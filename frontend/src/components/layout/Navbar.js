import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiHeart, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { getTotalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setExpanded(false);
    };

    const handleNavClick = () => {
        setExpanded(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <BootstrapNavbar 
            bg="white" 
            expand="lg" 
            fixed="top" 
            className="shadow-sm"
            expanded={expanded}
            onToggle={setExpanded}
        >
            <Container>
                <BootstrapNavbar.Brand 
                    as={Link} 
                    to="/" 
                    className="serif-font fw-bold text-primary"
                    onClick={handleNavClick}
                >
                    💍 Wedinvite
                </BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav">
                    <FiMenu />
                </BootstrapNavbar.Toggle>

                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className={isActive('/') ? 'fw-bold text-primary' : ''}
                            onClick={handleNavClick}
                        >
                            Trang chủ
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/templates" 
                            className={isActive('/templates') ? 'fw-bold text-primary' : ''}
                            onClick={handleNavClick}
                        >
                            Mẫu thiệp
                        </Nav.Link>
                        {isAuthenticated() && (
                            <Nav.Link 
                                as={Link} 
                                to="/create-invitation" 
                                className={isActive('/create-invitation') ? 'fw-bold text-primary' : ''}
                                onClick={handleNavClick}
                            >
                                ✨ Tạo thiệp
                            </Nav.Link>
                        )}
                        {isAuthenticated() && (
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/my-invitations" 
                                    className={isActive('/my-invitations') ? 'fw-bold text-primary' : ''}
                                    onClick={handleNavClick}
                                >
                                    <FiHeart className="me-1" />
                                    Thiệp cơ bản
                                </Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/my-customized-cards" 
                                    className={isActive('/my-customized-cards') ? 'fw-bold text-primary' : ''}
                                    onClick={handleNavClick}
                                >
                                    💎 Thiệp HTML
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav className="align-items-center">
                        {isAuthenticated() ? (
                            <>
                                {/* Shopping Cart */}
                                <Nav.Link 
                                    as={Link} 
                                    to="/cart" 
                                    className="position-relative me-3"
                                    onClick={handleNavClick}
                                >
                                    <FiShoppingCart size={20} />
                                    {getTotalItems() > 0 && (
                                        <Badge 
                                            bg="primary" 
                                            pill 
                                            className="position-absolute top-0 start-100 translate-middle"
                                        >
                                            {getTotalItems()}
                                        </Badge>
                                    )}
                                </Nav.Link>

                                {/* User Dropdown */}
                                <NavDropdown
                                    title={
                                        <span>
                                            <FiUser className="me-1" />
                                            {user?.fullName || user?.username}
                                            {isAdmin() && (
                                                <Badge bg="warning" className="ms-1">Admin</Badge>
                                            )}
                                        </span>
                                    }
                                    id="user-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item 
                                        as={Link} 
                                        to="/profile"
                                        onClick={handleNavClick}
                                    >
                                        <FiUser className="me-2" />
                                        Thông tin cá nhân
                                    </NavDropdown.Item>
                                    
                                    <NavDropdown.Item 
                                        as={Link} 
                                        to="/orders"
                                        onClick={handleNavClick}
                                    >
                                        <FiShoppingCart className="me-2" />
                                        Đơn hàng của tôi
                                    </NavDropdown.Item>

                                    {isAdmin() && (
                                        <>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Header>Quản trị</NavDropdown.Header>
                                            <NavDropdown.Item 
                                                as={Link} 
                                                to="/admin"
                                                onClick={handleNavClick}
                                            >
                                                <FiSettings className="me-2" />
                                                Bảng điều khiển
                                            </NavDropdown.Item>
                                            <NavDropdown.Item 
                                                as={Link} 
                                                to="/admin/categories"
                                                onClick={handleNavClick}
                                            >
                                                Quản lý danh mục
                                            </NavDropdown.Item>
                                            <NavDropdown.Item 
                                                as={Link} 
                                                to="/admin/templates"
                                                onClick={handleNavClick}
                                            >
                                                Quản lý mẫu thiệp
                                            </NavDropdown.Item>
                                            <NavDropdown.Item 
                                                as={Link} 
                                                to="/admin/orders"
                                                onClick={handleNavClick}
                                            >
                                                Quản lý đơn hàng
                                            </NavDropdown.Item>
                                        </>
                                    )}

                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        <FiLogOut className="me-2" />
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/login"
                                    onClick={handleNavClick}
                                >
                                    Đăng nhập
                                </Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/register"
                                    onClick={handleNavClick}
                                >
                                    <button className="btn btn-primary btn-sm">
                                        Đăng ký
                                    </button>
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;