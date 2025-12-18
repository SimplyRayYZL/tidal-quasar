import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState('default');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                console.error('Error fetching products:', error);
            } else {
                const formattedData = data.map(p => ({
                    ...p,
                    oldPrice: p.old_price,
                    isNew: p.is_new
                }));
                setAllProducts(formattedData);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        const category = searchParams.get('category') || 'all';
        setActiveCategory(category);
    }, [searchParams]);

    useEffect(() => {
        if (loading) return;

        let result = activeCategory === 'all'
            ? allProducts
            : allProducts.filter(p => p.category === activeCategory);

        // Sort products
        switch (sortBy) {
            case 'price-low':
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [activeCategory, sortBy, allProducts, loading]);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        if (categoryId === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', categoryId);
        }
        setSearchParams(searchParams);
    };

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    return (
        <div className="products-page">
            {/* Hero Banner */}
            <div className="page-header products-header">
                <img src="/products-banner.png" alt="المنتجات" className="page-header-bg" />
                <div className="page-header-overlay"></div>
                <div className="container">
                    <h1 className="animate-fadeInUp">المنتجات</h1>
                    <p className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>اكتشف مجموعتنا المتميزة من المشايات الكهربائية</p>
                </div>
            </div>

            <div className="container">
                <div className="products-layout">
                    {/* Sidebar */}
                    <aside className="products-sidebar animate-fadeInUp">
                        <div className="filter-section">
                            <h3>الفئات</h3>
                            <ul className="category-list">
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <button
                                            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                                            onClick={() => handleCategoryChange(category.id)}
                                        >
                                            <span className="category-icon">{category.icon}</span>
                                            <span className="category-name">{category.name}</span>
                                            <span className="category-count">
                                                {category.id === 'all'
                                                    ? allProducts.length
                                                    : allProducts.filter(p => p.category === category.id).length}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Info */}
                        <div className="sidebar-info">
                            <div className="info-card">
                                <h4>🚚 توصيل سريع</h4>
                                <p>لجميع المحافظات</p>
                            </div>
                            <div className="info-card">
                                <h4>💳 تقسيط</h4>
                                <p>حتى 12 شهر</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="products-main">
                        {/* Toolbar */}
                        <div className="products-toolbar animate-fadeIn">
                            <p className="results-count">
                                عرض <strong>{filteredProducts.length}</strong> منتج
                            </p>
                            <div className="sort-wrapper">
                                <label htmlFor="sort">ترتيب حسب:</label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="default">الترتيب الافتراضي</option>
                                    <option value="price-low">السعر: من الأقل للأعلى</option>
                                    <option value="price-high">السعر: من الأعلى للأقل</option>
                                    <option value="name">الاسم</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="products-grid">
                            {filteredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="no-products">
                                <p>لا توجد منتجات في هذه الفئة</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
