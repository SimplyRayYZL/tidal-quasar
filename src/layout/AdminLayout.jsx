import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
    const { signOut } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>لوحة التحكم</h2>
                    <p>اللياقة للأجهزة الرياضية</p>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <span>📊</span>
                        <span>الرئيسية</span>
                    </Link>
                    <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
                        <span>📦</span>
                        <span>الطلبات</span>
                    </Link>
                    <Link to="/admin/products" className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
                        <span>🏃</span>
                        <span>المنتجات</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={signOut} className="btn-logout">
                        <span>🚪</span>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
