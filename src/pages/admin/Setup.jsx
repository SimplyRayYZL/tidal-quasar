import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminSetup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setMsg('جاري التطبيق...');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            setMsg('✅ تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
            setTimeout(() => navigate('/admin/login'), 2000);

        } catch (error) {
            setMsg('❌ حدث خطأ: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', color: 'white' }}>
            <h1>إنشاء حساب أدمن جديد</h1>
            <p>استخدم هذه الصفحة لإنشاء حسابك الأول للدخول للوحة التحكم.</p>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ padding: '10px' }}
                    required
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ padding: '10px' }}
                    required
                />
                <button type="submit" style={{ padding: '10px', background: '#e6b31e', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    إنشاء الحساب
                </button>
            </form>

            <p style={{ marginTop: '1rem' }}>{msg}</p>
        </div>
    );
}
