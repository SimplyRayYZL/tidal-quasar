import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="اللياقة للأجهزة الرياضية" />
                        <div className="logo-text">
                            <span className="logo-title">اللياقة</span>
                            <span className="logo-subtitle">للأجهزة الرياضية</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            الرئيسية
                        </NavLink>
                        <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            المنتجات
                        </NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            تواصل معنا
                        </NavLink>
                    </nav>

                    {/* Cart & Mobile Menu */}
                    <div className="header-actions">
                        <Link to="/cart" className="cart-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        </Link>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        الرئيسية
                    </NavLink>
                    <NavLink
                        to="/products"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        المنتجات
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        تواصل معنا
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
