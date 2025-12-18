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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch orders stats
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*');

                if (ordersError) throw ordersError;

                const totalOrders = orders.length;
                const pendingOrders = orders.filter(o => o.status === 'pending').length;
                const totalSales = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

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

            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    return (
        <div className="dashboard-page animate-fadeIn">
            <h1 className="page-title">نظرة عامة</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>إجمالي المبيعات</h3>
                        <div className="stat-value">{formatPrice(stats.totalSales)}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>إجمالي الطلبات</h3>
                        <div className="stat-value">{stats.totalOrders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>طلبات قيد الانتظار</h3>
                        <div className="stat-value">{stats.pendingOrders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏃</div>
                    <div className="stat-info">
                        <h3>عدد المنتجات</h3>
                        <div className="stat-value">{stats.totalProducts}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
