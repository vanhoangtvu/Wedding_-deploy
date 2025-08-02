import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import CreateInvitation from './pages/CreateInvitation';
import CustomInvitation from './pages/CustomInvitation';
import CustomCardEditor from './pages/CustomCardEditor';
import MyInvitations from './pages/MyInvitations';
import MyCustomizedCards from './pages/MyCustomizedCards';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminCardTemplates from './pages/admin/AdminCardTemplates';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="App">
                        <Navbar />
                        <main style={{ minHeight: '80vh' }}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/templates" element={<Templates />} />
                                <Route path="/templates/:id" element={<TemplateDetail />} />
                                
                                {/* Protected User Routes */}
                                <Route path="/create-invitation" element={
                                    <ProtectedRoute>
                                        <CreateInvitation />
                                    </ProtectedRoute>
                                } />
                                <Route path="/custom-invitation/:templateId" element={
                                    <ProtectedRoute>
                                        <CustomInvitation />
                                    </ProtectedRoute>
                                } />
                                <Route path="/custom-card-editor/:templateId" element={
                                    <ProtectedRoute>
                                        <CustomCardEditor />
                                    </ProtectedRoute>
                                } />
                                <Route path="/my-invitations" element={
                                    <ProtectedRoute>
                                        <MyInvitations />
                                    </ProtectedRoute>
                                } />
                                <Route path="/my-customized-cards" element={
                                    <ProtectedRoute>
                                        <MyCustomizedCards />
                                    </ProtectedRoute>
                                } />
                                <Route path="/cart" element={
                                    <ProtectedRoute>
                                        <Cart />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders" element={
                                    <ProtectedRoute>
                                        <Orders />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders/:id" element={
                                    <ProtectedRoute>
                                        <OrderDetail />
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Admin Routes */}
                                <Route path="/admin" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/categories" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminCategories />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/templates" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminTemplates />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/card-templates" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminCardTemplates />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/orders" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminOrders />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;