import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { trackEvent, EVENTS } from '../lib/analytics';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding) return;

        setIsAdding(true);
        addToCart(product);

        // Track add to cart
        trackEvent(EVENTS.ADD_TO_CART, { product_id: product.id, product_name: product.name, price: product.price });

        // Reset after animation
        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.isNew && <span className="badge-new">جديد</span>}
                <span className={`badge-category ${product.category.toLowerCase()}`}>
                    {product.category === 'AC' ? 'موتور AC' : 'موتور DC'}
                </span>
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                <div className="product-price">
                    <span className="price-current">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                        <span className="price-old">{formatPrice(product.oldPrice)}</span>
                    )}
                </div>

                <div className="product-features">
                    {product.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                    ))}
                </div>

                <button
                    className={`btn-add-cart ${isAdding ? 'adding' : ''}`}
                    onClick={handleAddToCart}
                >
                    {isAdding ? (
                        <>
                            <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            تمت الإضافة!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            أضف للسلة
                        </>
                    )}
                </button>
            </div>
        </Link>
    );
}
