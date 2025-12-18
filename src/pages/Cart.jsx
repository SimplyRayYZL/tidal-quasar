import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, WHATSAPP_NUMBER } from '../data/products';
import { supabase } from '../lib/supabase';
import { trackEvent, EVENTS } from '../lib/analytics';
import './Cart.css';

export default function Cart() {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getWhatsAppMessage
    } = useCart();

    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track cart view on mount
    useEffect(() => {
        if (cartItems.length > 0) {
            trackEvent(EVENTS.VIEW_CART, { items_count: cartItems.length, total: getCartTotal() });
        }
    }, []);

    // Handle starting checkout
    const handleStartCheckout = () => {
        setShowCheckout(true);
        trackEvent(EVENTS.CHECKOUT_START, { items_count: cartItems.length, total: getCartTotal() });
    };

    if (orderSuccess) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="success-order animate-fadeInUp">
                        <div className="success-icon">✅</div>
                        <h2>تم استلام طلبك بنجاح!</h2>
                        <p>رقم الطلب: #{Math.floor(Math.random() * 10000)}</p>
                        <p>سنتواصل معك في أقرب وقت لتأكيد التفاصيل وميعاد التوصيل.</p>
                        <Link to="/" className="btn btn-primary btn-glow">
                            العودة للرئيسية
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart animate-fadeInUp">
                        <div className="empty-icon">🛒</div>
                        <h2>السلة فارغة</h2>
                        <p>لم تضف أي منتجات للسلة بعد</p>
                        <Link to="/products" className="btn btn-primary btn-glow">
                            تصفح المنتجات
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_address: formData.address,
                total_amount: getCartTotal(),
                items: cartItems,
                status: 'pending'
            };

            const { error } = await supabase
                .from('orders')
                .insert([orderData]);

            if (error) throw error;

            // Track purchase
            trackEvent(EVENTS.PURCHASE, {
                items_count: cartItems.length,
                total: getCartTotal(),
                items: cartItems.map(i => ({ id: i.id, name: i.name, qty: i.quantity }))
            });

            // Success
            clearCart();
            setOrderSuccess(true);
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="cart-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="animate-fadeInUp">سلة التسوق</h1>
                    <p className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>مراجعة طلبك قبل الشراء</p>
                </div>
            </div>

            <div className="container">
                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items animate-fadeInUp">
                        <div className="cart-header">
                            <span>المنتج</span>
                            <span>الكمية</span>
                            <span>السعر</span>
                            <span>الإجمالي</span>
                            <span></span>
                        </div>

                        {cartItems.map((item, index) => (
                            <div key={item.id} className="cart-item animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="item-product">
                                    <Link to={`/product/${item.id}`} className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </Link>
                                    <div className="item-info">
                                        <Link to={`/product/${item.id}`} className="item-name">
                                            {item.name}
                                        </Link>
                                        <span className="item-category">
                                            {item.category === 'AC' ? 'موتور AC' : 'موتور DC'}
                                        </span>
                                    </div>
                                </div>

                                <div className="item-quantity">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-price">
                                    {formatPrice(item.price)}
                                </div>

                                <div className="item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </div>

                                <button
                                    className="item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="حذف"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}

                        <div className="cart-actions">
                            <button className="btn btn-outline" onClick={clearCart}>
                                تفريغ السلة
                            </button>
                            <Link to="/products" className="btn btn-outline">
                                متابعة التسوق
                            </Link>
                        </div>
                    </div>

                    {/* Cart Summary & Checkout */}
                    <div className="cart-summary animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <h3>ملخص الطلب</h3>

                        <div className="summary-row">
                            <span>عدد المنتجات</span>
                            <span>{cartItems.length}</span>
                        </div>

                        <div className="summary-row">
                            <span>المجموع الفرعي</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>

                        <div className="summary-row">
                            <span>التوصيل</span>
                            <span className="free-shipping">مجاني</span>
                        </div>

                        <div className="summary-total">
                            <span>الإجمالي</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>

                        {!showCheckout ? (
                            <>
                                <button
                                    className="btn btn-primary btn-checkout"
                                    onClick={handleStartCheckout}
                                >
                                    متابعة الشراء
                                </button>
                                <p className="checkout-note">
                                    سيتم إرسال الطلب وحفظه لدينا للتواصل معك
                                </p>
                            </>
                        ) : (
                            <form onSubmit={handleCheckoutSubmit} className="checkout-form animate-fadeIn">
                                <h4>بيانات الشحن</h4>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="الاسم بالكامل"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="رقم الهاتف"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="address"
                                        placeholder="العنوان بالتفصيل"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="checkout-actions">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setShowCheckout(false)}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Trust badges */}
                        <div className="trust-badges">
                            <div className="trust-item">
                                <span>🚚</span>
                                <span>توصيل مجاني</span>
                            </div>
                            <div className="trust-item">
                                <span>🛡️</span>
                                <span>ضمان سنتين</span>
                            </div>
                            <div className="trust-item">
                                <span>💳</span>
                                <span>دفع عند الاستلام</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
