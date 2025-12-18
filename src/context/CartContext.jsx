import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('alliyaqa-cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('alliyaqa-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getWhatsAppMessage = () => {
        if (cartItems.length === 0) return '';

        let message = '🛒 *طلب جديد من موقع اللياقة*\n\n';
        message += '*المنتجات:*\n';

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   الكمية: ${item.quantity}\n`;
            message += `   السعر: ${item.price.toLocaleString('ar-EG')} ج.م\n\n`;
        });

        message += `━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*الإجمالي: ${getCartTotal().toLocaleString('ar-EG')} ج.م*\n\n`;
        message += `أرجو التواصل لإتمام الطلب 🙏`;

        return encodeURIComponent(message);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            getWhatsAppMessage
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
