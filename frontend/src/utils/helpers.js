import moment from 'moment';

// Format tiền tệ VND
export const formatPrice = (price) => {
    if (typeof price !== 'number') {
        return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

// Format ngày tháng
export const formatDate = (date, format = 'DD/MM/YYYY') => {
    if (!date) return '';
    return moment(date).format(format);
};

// Format ngày giờ
export const formatDateTime = (date, format = 'DD/MM/YYYY HH:mm') => {
    if (!date) return '';
    return moment(date).format(format);
};

// Format giờ
export const formatTime = (time, format = 'HH:mm') => {
    if (!time) return '';
    return moment(time, 'HH:mm:ss').format(format);
};

// Validate email
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (VN format)
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Validate password strength
export const validatePassword = (password) => {
    if (password.length < 6) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }
    return { valid: true, message: '' };
};

// Tạo slug từ string
export const createSlug = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[đĐ]/g, 'd') // Replace đ/Đ
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get file extension
export const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

// Validate image file
export const validateImageFile = (file) => {
    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
        return { valid: false, message: 'Vui lòng chọn file' };
    }

    const extension = getFileExtension(file.name);
    if (!allowedTypes.includes(extension)) {
        return { valid: false, message: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)' };
    }

    if (file.size > maxSize) {
        return { valid: false, message: 'File ảnh không được quá 5MB' };
    }

    return { valid: true, message: '' };
};

// Generate random ID
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Get order status display
export const getOrderStatusDisplay = (status) => {
    const statusMap = {
        'PENDING': { text: 'Chờ xác nhận', color: 'warning' },
        'CONFIRMED': { text: 'Đã xác nhận', color: 'info' },
        'PRINTING': { text: 'Đang in', color: 'primary' },
        'SHIPPING': { text: 'Đang giao', color: 'primary' },
        'COMPLETED': { text: 'Hoàn thành', color: 'success' },
        'CANCELLED': { text: 'Đã hủy', color: 'danger' }
    };
    
    return statusMap[status] || { text: status, color: 'secondary' };
};

// Get user role display
export const getUserRoleDisplay = (role) => {
    const roleMap = {
        'ADMIN': 'Quản trị viên',
        'USER': 'Người dùng'
    };
    
    return roleMap[role] || role;
};

// Format wedding names
export const formatWeddingNames = (groomName, brideName) => {
    if (!groomName && !brideName) return '';
    if (!groomName) return brideName;
    if (!brideName) return groomName;
    return `${groomName} & ${brideName}`;
};

// Check if date is in future
export const isFutureDate = (date) => {
    return moment(date).isAfter(moment(), 'day');
};

// Calculate days until wedding
export const daysUntilWedding = (weddingDate) => {
    const days = moment(weddingDate).diff(moment(), 'days');
    return days > 0 ? days : 0;
};

// Local storage helpers
export const setLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const getLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
};

export const removeLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};