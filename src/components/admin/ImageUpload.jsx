import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import './ImageUpload.css';

export default function ImageUpload({ value, onChange, label = 'صورة المنتج' }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(value || '');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('نوع الملف غير مدعوم. يرجى اختيار صورة (JPEG, PNG, WebP, GIF)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
            return;
        }

        setError('');
        setUploading(true);

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `images/${fileName}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onChange(publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError('حدث خطأ أثناء رفع الصورة');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setPreview(url);
        onChange(url);
    };

    return (
        <div className="image-upload">
            <label className="upload-label">{label} *</label>

            <div className="upload-container">
                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="image-preview" />
                        <button type="button" className="remove-btn" onClick={handleRemove}>
                            ✕
                        </button>
                    </div>
                ) : (
                    <div
                        className="upload-area"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="upload-icon">📷</div>
                        <div className="upload-text">
                            {uploading ? 'جاري الرفع...' : 'اضغط لاختيار صورة'}
                        </div>
                        <div className="upload-hint">JPEG, PNG, WebP - حد أقصى 5MB</div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="file-input"
                />
            </div>

            <div className="url-fallback">
                <span className="or-divider">أو أدخل رابط الصورة</span>
                <input
                    type="text"
                    value={preview}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.png"
                    className="url-input"
                />
            </div>

            {error && <div className="upload-error">{error}</div>}
        </div>
    );
}
