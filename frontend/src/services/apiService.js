import axios from 'axios';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    this.removeAuthToken();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Token management
    setAuthToken(token) {
        this.token = token;
        if (token) {
            this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.api.defaults.headers.common['Authorization'];
        }
    }

    removeAuthToken() {
        this.token = null;
        delete this.api.defaults.headers.common['Authorization'];
    }

    getToken() {
        return this.token;
    }

    // Authentication APIs
    async login(credentials) {
        return this.api.post('/auth/dang_nhap', credentials);
    }

    async register(userData) {
        return this.api.post('/auth/dang_ky', userData);
    }

    async getCurrentUser() {
        return this.api.get('/auth/thong_tin_ca_nhan');
    }

    // Categories APIs
    async getCategories() {
        return this.api.get('/categories');
    }

    async getCategoryById(id) {
        return this.api.get(`/categories/${id}`);
    }

    async createCategory(data) {
        return this.api.post('/categories', data);
    }

    async updateCategory(id, data) {
        return this.api.put(`/categories/${id}`, data);
    }

    async deleteCategory(id) {
        return this.api.delete(`/categories/${id}`);
    }

    // Templates APIs
    async getTemplates() {
        return this.api.get('/templates');
    }

    async getTemplateById(id) {
        return this.api.get(`/templates/${id}`);
    }

    async getTemplatesByCategory(categoryId) {
        return this.api.get(`/templates/danh_muc/${categoryId}`);
    }

    async searchTemplates(keyword) {
        return this.api.get(`/templates/tim_kiem?keyword=${encodeURIComponent(keyword)}`);
    }

    async createTemplate(data) {
        return this.api.post('/templates', data);
    }

    async updateTemplate(id, data) {
        return this.api.put(`/templates/${id}`, data);
    }

    async deleteTemplate(id) {
        return this.api.delete(`/templates/${id}`);
    }

    // Custom Invitations APIs
    async createCustomInvitation(data) {
        return this.api.post('/custom-invitations', data);
    }

    async getUserInvitations() {
        return this.api.get('/custom-invitations');
    }

    async getUserSavedInvitations() {
        return this.api.get('/custom-invitations/da_luu');
    }

    async getCustomInvitationById(id) {
        return this.api.get(`/custom-invitations/${id}`);
    }

    async updateCustomInvitation(id, data) {
        return this.api.put(`/custom-invitations/${id}`, data);
    }

    async saveCustomInvitation(id) {
        return this.api.put(`/custom-invitations/${id}/luu`);
    }

    async deleteCustomInvitation(id) {
        return this.api.delete(`/custom-invitations/${id}`);
    }

    // Card Templates APIs (Admin)
    async getCardTemplates() {
        return this.api.get('/card-templates');
    }

    async getCardTemplatesByTemplateId(templateId) {
        return this.api.get(`/card-templates/template/${templateId}`);
    }

    async getCardTemplateById(id) {
        return this.api.get(`/card-templates/${id}`);
    }

    async createCardTemplate(data) {
        return this.api.post('/card-templates', data);
    }

    async updateCardTemplate(id, data) {
        return this.api.put(`/card-templates/${id}`, data);
    }

    async deleteCardTemplate(id) {
        return this.api.delete(`/card-templates/${id}`);
    }

    async getMyCardTemplates() {
        return this.api.get('/card-templates/my-templates');
    }

    // Customized Cards APIs (User)
    async renderTemplate(data) {
        return this.api.post('/customized-cards/render', data);
    }

    async getUserCustomizedCards() {
        return this.api.get('/customized-cards');
    }

    async getUserSavedCards() {
        return this.api.get('/customized-cards/saved');
    }

    async getCustomizedCardById(id) {
        return this.api.get(`/customized-cards/${id}`);
    }

    async saveCustomizedCard(id) {
        return this.api.put(`/customized-cards/${id}/save`);
    }

    async updateCustomizedCard(id, data) {
        return this.api.put(`/customized-cards/${id}`, data);
    }

    async deleteCustomizedCard(id) {
        return this.api.delete(`/customized-cards/${id}`);
    }

    // Orders APIs
    async createOrder(data) {
        return this.api.post('/orders', data);
    }

    async getUserOrders() {
        return this.api.get('/orders');
    }

    async getOrderById(id) {
        return this.api.get(`/orders/${id}`);
    }

    async getOrderByCode(orderCode) {
        return this.api.get(`/orders/ma_don_hang/${orderCode}`);
    }

    async updateOrderStatus(id, status) {
        return this.api.put(`/orders/${id}/trang_thai?status=${status}`);
    }

    async getOrdersByStatus(status) {
        return this.api.get(`/orders/theo_trang_thai?status=${status}`);
    }

    async getAllOrders() {
        return this.api.get('/orders/all');
    }

    // Statistics APIs for Dashboard
    async getDashboardStats() {
        try {
            const [users, orders, templates, categories] = await Promise.all([
                this.api.get('/users/count'),
                this.api.get('/orders/all'),
                this.api.get('/templates'),
                this.api.get('/categories')
            ]);
            
            // Calculate stats from API responses
            const totalOrders = orders.data.length;
            const totalRevenue = orders.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            
            return {
                data: {
                    totalUsers: users.data || 0,
                    totalOrders: totalOrders,
                    totalTemplates: templates.data.length,
                    totalCategories: categories.data.length,
                    totalRevenue: totalRevenue
                }
            };
        } catch (error) {
            // Fallback if some APIs are not available
            const [orders, templates, categories] = await Promise.all([
                this.api.get('/orders/all'),
                this.api.get('/templates'),
                this.api.get('/categories')
            ]);
            
            const totalOrders = orders.data.length;
            const totalRevenue = orders.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            
            return {
                data: {
                    totalUsers: 'N/A',
                    totalOrders: totalOrders,
                    totalTemplates: templates.data.length,
                    totalCategories: categories.data.length,
                    totalRevenue: totalRevenue
                }
            };
        }
    }

    // File upload (if needed)
    async uploadFile(file, type = 'image') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        return this.api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

const apiService = new ApiService();
export default apiService;