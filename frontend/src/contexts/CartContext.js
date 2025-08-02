import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage khi component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Thêm item vào giỏ hàng
    const addToCart = (item, quantity = 1) => {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            // Nếu đã có trong giỏ, cập nhật số lượng
            setCartItems(cartItems.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            ));
            toast.success('Đã cập nhật số lượng trong giỏ hàng');
        } else {
            // Thêm item mới vào giỏ (hỗ trợ cả custom invitations và customized cards)
            const newItem = {
                id: item.id,
                templateId: item.templateId,
                templateName: item.templateName,
                cardTemplateName: item.cardTemplateName, // For customized cards
                groomName: item.groomName,
                brideName: item.brideName,
                weddingDate: item.weddingDate,
                weddingTime: item.weddingTime,
                weddingVenue: item.weddingVenue,
                customMessage: item.customMessage,
                generatedImageUrl: item.generatedImageUrl,
                renderedHtml: item.renderedHtml, // For customized cards
                unitPrice: item.unitPrice || 0,
                quantity: quantity,
                type: item.renderedHtml ? 'customized_card' : 'custom_invitation' // Distinguish types
            };
            
            setCartItems([...cartItems, newItem]);
            toast.success('Đã thêm vào giỏ hàng');
        }
    };

    // Xóa item khỏi giỏ hàng
    const removeFromCart = (invitationId) => {
        setCartItems(cartItems.filter(item => item.id !== invitationId));
        toast.info('Đã xóa khỏi giỏ hàng');
    };

    // Cập nhật số lượng item
    const updateQuantity = (invitationId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(invitationId);
            return;
        }

        setCartItems(cartItems.map(item =>
            item.id === invitationId
                ? { ...item, quantity: quantity }
                : item
        ));
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
        toast.info('Đã xóa toàn bộ giỏ hàng');
    };

    // Tính tổng số lượng items
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng tiền
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    };

    // Kiểm tra item có trong giỏ không
    const isInCart = (invitationId) => {
        return cartItems.some(item => item.id === invitationId);
    };

    // Lấy thông tin item trong giỏ
    const getCartItem = (invitationId) => {
        return cartItems.find(item => item.id === invitationId);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getCartItem
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};