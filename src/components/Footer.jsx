import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '../data/products';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Company Info */}
                    <div className="footer-section company-info">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.png" alt="اللياقة" />
                        </Link>
                        <p>
                            اللياقة للأجهزة الرياضية - نوفر لك أفضل المشايات الكهربائية
                            بموتور AC و DC مع ضمان شامل وخدمة ما بعد البيع.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>روابط سريعة</h4>
                        <ul className="footer-links">
                            <li><Link to="/">الرئيسية</Link></li>
                            <li><Link to="/products">المنتجات</Link></li>
                            <li><Link to="/products?category=AC">مشايات AC</Link></li>
                            <li><Link to="/products?category=DC">مشايات DC</Link></li>
                            <li><Link to="/contact">تواصل معنا</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4>تواصل معنا</h4>
                        <ul className="footer-contact">
                            <li>
                                <span className="icon">📞</span>
                                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`} dir="ltr">{PHONE_NUMBER}</a>
                            </li>
                            <li>
                                <span className="icon">💬</span>
                                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                                    واتساب
                                </a>
                            </li>
                            <li>
                                <span className="icon">📍</span>
                                <span>القاهرة، مصر</span>
                            </li>
                        </ul>
                    </div>

                    {/* Working Hours */}
                    <div className="footer-section">
                        <h4>ساعات العمل</h4>
                        <ul className="footer-hours">
                            <li>
                                <span>السبت - الخميس</span>
                                <span>10:00 ص - 10:00 م</span>
                            </li>
                            <li>
                                <span>الجمعة</span>
                                <span>2:00 م - 10:00 م</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} اللياقة للأجهزة الرياضية. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
