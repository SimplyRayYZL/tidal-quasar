import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { WHATSAPP_NUMBER } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                console.error('Error fetching products:', error);
            } else {
                // Normalize data to match existing component expectation
                const formattedData = data.map(p => ({
                    ...p,
                    oldPrice: p.old_price,
                    isNew: p.is_new
                }));
                setProducts(formattedData);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    const featuredProducts = products.filter(p => p.isNew).slice(0, 4);
    const acProducts = products.filter(p => p.category === 'AC').slice(0, 4);
    const dcProducts = products.filter(p => p.category === 'DC').slice(0, 4);

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    return (
        <div className="home">
            {/* Hero Section with Banner Image */}
            <section className="hero">
                <div className="hero-bg">
                    <img src="/hero-banner.png" alt="مشايات كهربائية" className="hero-bg-image" />
                    <div className="hero-overlay"></div>
                </div>
                <div className="container">
                    <div className="hero-content animate-fadeInUp">
                        <span className="hero-badge animate-pulse">🏃 أفضل المشايات الكهربائية في مصر</span>
                        <h1 className="animate-slideInRight">اللياقة للأجهزة الرياضية</h1>
                        <p className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                            اكتشف مجموعتنا المتميزة من المشايات الكهربائية بموتور AC و DC
                            <br />
                            مع ضمان شامل وخدمة ما بعد البيع
                        </p>
                        <div className="hero-buttons animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                            <Link to="/products" className="btn btn-secondary btn-glow">
                                تصفح المنتجات
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn btn-whatsapp-hero" target="_blank" rel="noopener noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                تواصل واتساب
                            </a>
                        </div>
                    </div>

                    <div className="hero-stats animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                        <div className="stat animate-float">
                            <span className="stat-number">19+</span>
                            <span className="stat-label">مشاية كهربائية</span>
                        </div>
                        <div className="stat animate-float" style={{ animationDelay: '0.2s' }}>
                            <span className="stat-number">2</span>
                            <span className="stat-label">سنوات ضمان</span>
                        </div>
                        <div className="stat animate-float" style={{ animationDelay: '0.4s' }}>
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">دعم العملاء</span>
                        </div>
                    </div>
                </div>

                {/* Animated shapes */}
                <div className="hero-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-title">
                        <h2 className="animate-fadeInUp">اختر نوع المشاية المناسب لك</h2>
                        <p className="animate-fadeIn">نوفر لك مشايات بموتور AC للجيمات و DC للمنزل</p>
                    </div>

                    <div className="categories-grid">
                        <Link to="/products?category=AC" className="category-card ac animate-slideInRight">
                            <div className="category-icon animate-bounce">⚡</div>
                            <div className="category-content">
                                <h3>مشايات موتور AC</h3>
                                <p>للاستخدام التجاري والجيمات - تعمل لفترات طويلة تصل إلى 24 ساعة متواصلة</p>
                                <span className="category-count">14 منتج</span>
                            </div>
                            <div className="category-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </Link>

                        <Link to="/products?category=DC" className="category-card dc animate-slideInLeft">
                            <div className="category-icon animate-bounce" style={{ animationDelay: '0.2s' }}>🏠</div>
                            <div className="category-content">
                                <h3>مشايات موتور DC</h3>
                                <p>للاستخدام المنزلي - اقتصادية في الكهرباء ومثالية للعائلات</p>
                                <span className="category-count">5 منتجات</span>
                            </div>
                            <div className="category-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-title">
                        <h2>المنتجات الجديدة</h2>
                        <p>أحدث المشايات الكهربائية في متجرنا</p>
                    </div>

                    <div className="products-grid">
                        {featuredProducts.map((product, index) => (
                            <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.15}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <div className="section-cta">
                        <Link to="/products" className="btn btn-primary btn-glow">
                            عرض جميع المنتجات
                        </Link>
                    </div>
                </div>
            </section>

            {/* AC Promo Banner */}
            <section className="promo-banner promo-ac">
                <img src="/promo-banner.png" alt="مشايات AC" className="promo-bg-image" />
                <div className="promo-overlay"></div>
                <div className="container">
                    <div className="promo-content animate-fadeIn">
                        <span className="promo-badge animate-pulse">⚡ موتور AC</span>
                        <h2 className="animate-slideInRight">مشايات احترافية للجيمات</h2>
                        <p className="animate-fadeInUp">موتور AC يعمل لفترات طويلة من 5 إلى 24 ساعة متواصلة</p>
                        <Link to="/products?category=AC" className="btn btn-secondary btn-glow">
                            اكتشف مشايات AC
                        </Link>
                    </div>
                </div>
            </section>

            {/* AC Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>مشايات موتور AC</h2>
                        <Link to="/products?category=AC" className="view-all">
                            عرض الكل
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="products-grid">
                        {acProducts.map((product, index) => (
                            <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DC Promo Banner */}
            <section className="promo-banner promo-dc">
                <img src="/dc-banner.png" alt="مشايات DC" className="promo-bg-image" />
                <div className="promo-overlay"></div>
                <div className="container">
                    <div className="promo-content animate-fadeIn">
                        <span className="promo-badge animate-pulse">🏠 موتور DC</span>
                        <h2 className="animate-slideInLeft">مشايات منزلية اقتصادية</h2>
                        <p className="animate-fadeInUp">توفير في استهلاك الكهرباء مع أداء ممتاز للاستخدام المنزلي</p>
                        <Link to="/products?category=DC" className="btn btn-secondary btn-glow">
                            اكتشف مشايات DC
                        </Link>
                    </div>
                </div>
            </section>

            {/* DC Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>مشايات موتور DC</h2>
                        <Link to="/products?category=DC" className="view-all">
                            عرض الكل
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="products-grid">
                        {dcProducts.map((product, index) => (
                            <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-title">
                        <h2>لماذا تختار اللياقة؟</h2>
                        <p>نقدم لك أفضل الخدمات والمنتجات</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card animate-fadeInUp">
                            <div className="feature-icon animate-bounce">🚚</div>
                            <h3>توصيل سريع</h3>
                            <p>توصيل لجميع محافظات مصر</p>
                        </div>
                        <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon animate-bounce" style={{ animationDelay: '0.1s' }}>🛡️</div>
                            <h3>ضمان شامل</h3>
                            <p>ضمان سنتين على جميع المنتجات</p>
                        </div>
                        <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon animate-bounce" style={{ animationDelay: '0.2s' }}>📞</div>
                            <h3>دعم فني متواصل</h3>
                            <p>دعم فني 7 أيام في الأسبوع</p>
                        </div>
                        <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon animate-bounce" style={{ animationDelay: '0.3s' }}>🔧</div>
                            <h3>صيانة منزلية</h3>
                            <p>خدمة صيانة في بيتك</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
