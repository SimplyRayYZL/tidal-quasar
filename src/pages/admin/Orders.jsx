import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../data/products';
import './Orders.css';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('فشل تحديث الحالة');
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'قيد الانتظار';
            case 'confirmed': return 'تم التأكيد';
            case 'shipped': return 'تم الشحن';
            case 'delivered': return 'تم التوصيل';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'confirmed': return 'status-confirmed';
            case 'shipped': return 'status-shipped';
            case 'delivered': return 'status-delivered';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    return (
        <div className="orders-page animate-fadeIn">
            <div className="page-header">
                <h1>إدارة الطلبات</h1>
                <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">كل الطلبات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">تم التأكيد</option>
                        <option value="shipped">تم الشحن</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>رقم الهاتف</th>
                            <th>العنوان</th>
                            <th>المنتجات</th>
                            <th>الإجمالي</th>
                            <th>الحالة</th>
                            <th>التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id.slice(0, 8)}</td>
                                <td>{order.customer_name}</td>
                                <td>{order.customer_phone}</td>
                                <td className="address-cell" title={order.customer_address}>
                                    {order.customer_address.substring(0, 30)}...
                                </td>
                                <td>
                                    <div className="order-items-preview">
                                        {order.items.map((item, idx) => (
                                            <span key={idx} title={item.name}>
                                                {item.quantity}x {item.name.substring(0, 15)}...
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td>{formatPrice(order.total_amount)}</td>
                                <td>
                                    <select
                                        className={`status-select ${getStatusColor(order.status)}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="confirmed">تم التأكيد</option>
                                        <option value="shipped">تم الشحن</option>
                                        <option value="delivered">تم التوصيل</option>
                                        <option value="cancelled">ملغي</option>
                                    </select>
                                </td>
                                <td>{new Date(order.created_at).toLocaleDateString('ar-EG')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
