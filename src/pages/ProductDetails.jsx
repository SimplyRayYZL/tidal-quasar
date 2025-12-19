import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, WHATSAPP_NUMBER } from '../data/products';
import { supabase } from '../lib/supabase';
import { trackEvent, EVENTS } from '../lib/analytics';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        async function fetchProductData() {
            try {
                // Fetch product by ID
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (productError) throw productError;

                const formattedProduct = {
                    ...productData,
                    oldPrice: productData.old_price,
                    isNew: productData.is_new
                };
                setProduct(formattedProduct);

                // Track page view
                trackEvent(EVENTS.PAGE_VIEW, { page: 'product_details', product_id: id, product_name: formattedProduct.name });

                // Fetch related products
                const { data: relatedData, error: relatedError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', formattedProduct.category)
                    .neq('id', id)
                    .limit(4);

                if (!relatedError) {
                    const formattedRelated = relatedData.map(p => ({
                        ...p,
                        oldPrice: p.old_price,
                        isNew: p.is_new
                    }));
                    setRelatedProducts(formattedRelated);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            setLoading(true);
            fetchProductData();
        }
    }, [id]);

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    if (!product) {
        return (
            <div className="container">
                <div className="not-found">
                    <h2>المنتج غير موجود</h2>
                    <Link to="/products" className="btn btn-primary">العودة للمنتجات</Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (isAdding) return;

        setIsAdding(true);
        addToCart(product);

        // Track add to cart
        trackEvent(EVENTS.ADD_TO_CART, { product_id: product.id, product_name: product.name, price: product.price });

        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const handleWhatsAppOrder = () => {
        const message = `مرحباً، أريد الاستفسار عن:\n\n${product.name}\nالسعر: ${formatPrice(product.price)}\n\nشكراً`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="product-details-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb animate-fadeIn">
                    <Link to="/">الرئيسية</Link>
                    <span>/</span>
                    <Link to="/products">المنتجات</Link>
                    <span>/</span>
                    <Link to={`/products?category=${product.category}`}>
                        {product.category === 'AC' ? 'مشايات AC' : 'مشايات DC'}
                    </Link>
                    <span>/</span>
                    <span className="current">{product.name}</span>
                </nav>

                {/* Product Section */}
                <section className="product-section">
                    <div className="product-gallery animate-fadeInUp">
                        <div className="main-image">
                            <img src={product.image} alt={product.name} />
                            {product.isNew && <span className="badge-new animate-pulse">جديد</span>}
                        </div>
                    </div>

                    <div className="product-info animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <span className={`category-badge ${product.category.toLowerCase()}`}>
                            {product.category === 'AC' ? '⚡ موتور AC' : '🏠 موتور DC'}
                        </span>

                        <h1>{product.name}</h1>

                        <div className="price-section">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            {product.oldPrice && (
                                <span className="old-price">{formatPrice(product.oldPrice)}</span>
                            )}
                            {product.oldPrice && (
                                <span className="discount-badge animate-bounce">
                                    خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                                </span>
                            )}
                        </div>

                        <div className="stock-info">
                            <span className="in-stock">✓ متوفر في المخزون</span>
                        </div>

                        <div className="action-buttons">
                            <button
                                className={`btn btn-primary btn-large btn-glow ${isAdding ? 'btn-success-state' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {isAdding ? (
                                    <>
                                        <svg className="check-icon-anim" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        تمت الإضافة!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        أضف للسلة
                                    </>
                                )}
                            </button>
                            <button className="btn btn-whatsapp btn-large" onClick={handleWhatsAppOrder}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                اطلب عبر واتساب
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="guarantees">
                            <div className="guarantee-item">
                                <span className="icon">🚚</span>
                                <div>
                                    <strong>توصيل سريع</strong>
                                    <span>لجميع المحافظات</span>
                                </div>
                            </div>
                            <div className="guarantee-item">
                                <span className="icon">🛡️</span>
                                <div>
                                    <strong>ضمان سنتين</strong>
                                    <span>ضد عيوب الصناعة</span>
                                </div>
                            </div>
                            <div className="guarantee-item">
                                <span className="icon">🔧</span>
                                <div>
                                    <strong>صيانة منزلية</strong>
                                    <span>خدمة ما بعد البيع</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Description Section */}
                <section className="details-section animate-fadeInUp">
                    <div className="details-tabs">
                        <div className="tab active">الوصف والمميزات</div>
                    </div>
                    <div className="tab-content">
                        <div className="content-block">
                            <h3>وصف المنتج</h3>
                            <p className="description">{product.description}</p>
                        </div>

                        <div className="content-block">
                            <h3>المواصفات والمميزات</h3>
                            <div className="features-grid-list">
                                {product.features && product.features.map((feature, index) => (
                                    <div key={index} className="feature-item-inline">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-section">
                        <h2>منتجات مشابهة</h2>
                        <div className="products-grid">
                            {relatedProducts.map((product, index) => (
                                <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
