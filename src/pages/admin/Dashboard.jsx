import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../data/products';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalSales: 0,
        totalProducts: 0
    });
    const [analytics, setAnalytics] = useState({
        pageViews: 0,
        cartAdds: 0,
        checkoutViews: 0,
        purchases: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch orders stats
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*');

                if (ordersError) throw ordersError;

                const totalOrders = orders?.length || 0;
                const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
                const totalSales = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

                // Fetch products stats
                const { count: productsCount, error: productsError } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                if (productsError) throw productsError;

                setStats({
                    totalOrders,
                    pendingOrders,
                    totalSales,
                    totalProducts: productsCount || 0
                });

                // Fetch analytics (last 30 days)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const { data: analyticsData, error: analyticsError } = await supabase
                    .from('analytics')
                    .select('event_type')
                    .gte('created_at', thirtyDaysAgo.toISOString());

                if (!analyticsError && analyticsData) {
                    const pageViews = analyticsData.filter(a => a.event_type === 'page_view').length;
                    const cartAdds = analyticsData.filter(a => a.event_type === 'add_to_cart').length;
                    const checkoutViews = analyticsData.filter(a => a.event_type === 'checkout_start').length;
                    const purchases = analyticsData.filter(a => a.event_type === 'purchase').length;

                    setAnalytics({ pageViews, cartAdds, checkoutViews, purchases });
                }

            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    // Calculate conversion rates
    const cartRate = analytics.pageViews > 0 ? ((analytics.cartAdds / analytics.pageViews) * 100).toFixed(1) : 0;
    const checkoutRate = analytics.cartAdds > 0 ? ((analytics.checkoutViews / analytics.cartAdds) * 100).toFixed(1) : 0;
    const purchaseRate = analytics.checkoutViews > 0 ? ((analytics.purchases / analytics.checkoutViews) * 100).toFixed(1) : 0;

    return (
        <div className="dashboard-page animate-fadeIn">
            <h1>لوحة التحكم</h1>

            {/* Main Stats */}
            <div className="stats-grid">
                <div className="stat-card sales">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <span className="stat-label">إجمالي المبيعات</span>
                        <span className="stat-value">{formatPrice(stats.totalSales)}</span>
                    </div>
                </div>
                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <span className="stat-label">إجمالي الطلبات</span>
                        <span className="stat-value">{stats.totalOrders}</span>
                    </div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <span className="stat-label">طلبات معلقة</span>
                        <span className="stat-value">{stats.pendingOrders}</span>
                    </div>
                </div>
                <div className="stat-card products">
                    <div className="stat-icon">🏃</div>
                    <div className="stat-content">
                        <span className="stat-label">المنتجات</span>
                        <span className="stat-value">{stats.totalProducts}</span>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>📊 تحليلات آخر 30 يوم</h2>

            <div className="stats-grid">
                <div className="stat-card analytics-card">
                    <div className="stat-icon">👁️</div>
                    <div className="stat-content">
                        <span className="stat-label">زيارات الصفحات</span>
                        <span className="stat-value">{analytics.pageViews}</span>
                    </div>
                </div>
                <div className="stat-card analytics-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                        <span className="stat-label">إضافة للسلة</span>
                        <span className="stat-value">{analytics.cartAdds}</span>
                        <span className="stat-rate">{cartRate}% من الزيارات</span>
                    </div>
                </div>
                <div className="stat-card analytics-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <span className="stat-label">بدء الدفع</span>
                        <span className="stat-value">{analytics.checkoutViews}</span>
                        <span className="stat-rate">{checkoutRate}% من السلة</span>
                    </div>
                </div>
                <div className="stat-card analytics-card success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <span className="stat-label">عمليات شراء</span>
                        <span className="stat-value">{analytics.purchases}</span>
                        <span className="stat-rate">{purchaseRate}% من الدفع</span>
                    </div>
                </div>
            </div>

            {/* Conversion Funnel */}
            <div className="funnel-section" style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>📈 قمع التحويل</h3>
                <div className="funnel-chart">
                    <div className="funnel-step" style={{ width: '100%' }}>
                        <div className="funnel-bar" style={{ background: 'linear-gradient(90deg, #3498db, #2980b9)' }}>
                            <span>زيارات: {analytics.pageViews}</span>
                        </div>
                    </div>
                    <div className="funnel-step" style={{ width: analytics.pageViews > 0 ? `${(analytics.cartAdds / analytics.pageViews) * 100}%` : '0%', minWidth: '20%' }}>
                        <div className="funnel-bar" style={{ background: 'linear-gradient(90deg, #f39c12, #e67e22)' }}>
                            <span>سلة: {analytics.cartAdds}</span>
                        </div>
                    </div>
                    <div className="funnel-step" style={{ width: analytics.pageViews > 0 ? `${(analytics.checkoutViews / analytics.pageViews) * 100}%` : '0%', minWidth: '15%' }}>
                        <div className="funnel-bar" style={{ background: 'linear-gradient(90deg, #9b59b6, #8e44ad)' }}>
                            <span>دفع: {analytics.checkoutViews}</span>
                        </div>
                    </div>
                    <div className="funnel-step" style={{ width: analytics.pageViews > 0 ? `${(analytics.purchases / analytics.pageViews) * 100}%` : '0%', minWidth: '10%' }}>
                        <div className="funnel-bar" style={{ background: 'linear-gradient(90deg, #2ecc71, #27ae60)' }}>
                            <span>شراء: {analytics.purchases}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
