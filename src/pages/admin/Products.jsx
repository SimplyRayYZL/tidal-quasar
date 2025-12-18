import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../data/products';
import './Orders.css'; // Reusing table styles

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('حدث خطأ أثناء الحذف');
        }
    };

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    return (
        <div className="products-page animate-fadeIn">
            <div className="page-header">
                <h1>إدارة المنتجات</h1>
                <button className="btn btn-primary" onClick={() => alert('قريباً: إضافة منتج جديد')}>
                    + إضافة منتج
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>الصورة</th>
                            <th>الاسم</th>
                            <th>السعر</th>
                            <th>القسم</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>
                                    <span className={`badge-category-sm ${product.category?.toLowerCase()}`}>
                                        {product.category}
                                    </span>
                                </td>
                                <td>
                                    {product.is_new ? <span className="badge-new-sm">جديد</span> : '-'}
                                </td>
                                <td>
                                    <button
                                        className="btn-icon delete"
                                        onClick={() => handleDelete(product.id)}
                                        title="حذف"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
