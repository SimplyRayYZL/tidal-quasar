import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function GoogleTagManager() {
    const [gtmId, setGtmId] = useState('');

    useEffect(() => {
        async function fetchGtmId() {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('setting_value')
                    .eq('setting_key', 'gtm_id')
                    .single();

                if (!error && data && data.setting_value) {
                    setGtmId(data.setting_value);
                }
            } catch (err) {
                console.error('Error fetching GTM ID:', err);
            }
        }

        fetchGtmId();
    }, []);

    useEffect(() => {
        if (!gtmId) return;

        // Check if script already exists
        if (document.getElementById('gtm-script')) return;

        // Add GTM/GA4 script
        const script = document.createElement('script');
        script.id = 'gtm-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
        document.head.appendChild(script);

        // Add gtag config
        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtmId}');
        `;
        document.head.appendChild(inlineScript);

        return () => {
            // Cleanup if needed
            const existingScript = document.getElementById('gtm-script');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [gtmId]);

    return null; // This component doesn't render anything
}
