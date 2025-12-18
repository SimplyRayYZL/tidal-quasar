import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './ProductForm.css';

export default function ProductForm({ product, onClose, onSave }) {
    const isEdit = !!product;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        old_price: '',
        category: 'AC',
        image: '',
        description: '',
        features: '',
        is_new: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                old_price: product.old_price || '',
                category: product.category || 'AC',
                image: product.image || '',
                description: product.description || '',
                features: Array.isArray(product.features) ? product.features.join('\n') : '',
                is_new: product.is_new || false
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSave = {
                name: formData.name,
                price: parseFloat(formData.price),
                old_price: formData.old_price ? parseFloat(formData.old_price) : null,
                category: formData.category,
                image: formData.image,
                description: formData.description,
                features: formData.features.split('\n').filter(f => f.trim()),
                is_new: formData.is_new
            };

            if (isEdit) {
                const { error } = await supabase
                    .from('products')
                    .update(dataToSave)
                    .eq('id', product.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([dataToSave]);
                if (error) throw error;
            }

            onSave();
            onClose();
        } catch (err) {
            console.error('Error saving product:', err);
            setError('حدث خطأ أثناء حفظ المنتج');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>اسم المنتج *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>القسم *</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="AC">موتور AC</option>
                                <option value="DC">موتور DC</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>السعر الحالي *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>السعر القديم (اختياري)</label>
                            <input
                                type="number"
                                name="old_price"
                                value={formData.old_price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>رابط الصورة *</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="/products/example.png أو https://..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>المميزات (كل ميزة في سطر)</label>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            rows="4"
                            placeholder="موتور AC قوي&#10;وزن 180 كيلو&#10;ضمان سنتين"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_new"
                                checked={formData.is_new}
                                onChange={handleChange}
                            />
                            <span>منتج جديد (يظهر عليه بادج "جديد")</span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'جاري الحفظ...' : (isEdit ? 'حفظ التعديلات' : 'إضافة المنتج')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
