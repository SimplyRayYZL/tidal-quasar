import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './Settings.css';

export default function AdminSettings() {
    const [gtmId, setGtmId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('setting_key', 'gtm_id')
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setGtmId(data.setting_value || '');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    setting_key: 'gtm_id',
                    setting_value: gtmId,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'setting_key' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

    return (
        <div className="settings-page animate-fadeIn">
            <h1>⚙️ الإعدادات</h1>

            <div className="settings-card">
                <h2>🔗 Google Tag Manager</h2>
                <p className="settings-desc">
                    أضف معرف Google Tag Manager لتتبُّع زيارات موقعك والتحليلات.
                </p>

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label htmlFor="gtm_id">GTM Container ID</label>
                        <input
                            type="text"
                            id="gtm_id"
                            value={gtmId}
                            onChange={(e) => setGtmId(e.target.value)}
                            placeholder="GTM-XXXXXXX"
                            className="form-input"
                            dir="ltr"
                        />
                        <small className="form-hint">
                            مثال: GTM-XXXXXXX أو G-XXXXXXXXXX
                        </small>
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-save"
                        disabled={saving}
                    >
                        {saving ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
                    </button>
                </form>
            </div>

            <div className="settings-card">
                <h2>📊 كود التتبع</h2>
                <p className="settings-desc">
                    بعد حفظ الـ GTM ID، هيتم إضافة كود التتبع تلقائياً للموقع.
                </p>

                {gtmId && (
                    <div className="code-preview">
                        <code>
                            {`<!-- Google Tag Manager -->`}<br />
                            {`<script async src="https://www.googletagmanager.com/gtag/js?id=${gtmId}"></script>`}
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
}
