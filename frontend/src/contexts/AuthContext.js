import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(Cookies.get('token'));

    // Kiểm tra token khi component mount
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = Cookies.get('token');
            if (savedToken) {
                try {
                    apiService.setAuthToken(savedToken);
                    const response = await apiService.getCurrentUser();
                    setUser(response.data);
                    setToken(savedToken);
                } catch (error) {
                    console.error('Token không hợp lệ:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Đăng nhập
    const login = async (credentials) => {
        try {
            const response = await apiService.login(credentials);
            const { token: newToken, user: userData } = response.data;
            
            // Lưu token vào cookie (expires in 7 days)
            Cookies.set('token', newToken, { expires: 7 });
            
            // Set token cho api service
            apiService.setAuthToken(newToken);
            
            setToken(newToken);
            setUser(userData);
            
            toast.success('Đăng nhập thành công!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Đăng nhập thất bại';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Đăng ký
    const register = async (userData) => {
        try {
            const response = await apiService.register(userData);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            return { success: true, data: response.data };
        } catch (error) {
            const message = error.response?.data?.error || 'Đăng ký thất bại';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Đăng xuất
    const logout = () => {
        Cookies.remove('token');
        apiService.removeAuthToken();
        setToken(null);
        setUser(null);
        toast.info('Đã đăng xuất');
    };

    // Cập nhật thông tin người dùng
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    // Kiểm tra quyền admin
    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    // Kiểm tra đã đăng nhập
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};