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

        // Detect if it's GTM (GTM-XXXXXX) or GA4 (G-XXXXXXXX)
        const isGTM = gtmId.startsWith('GTM-');
        const isGA4 = gtmId.startsWith('G-');

        if (isGTM) {
            // Google Tag Manager script
            const script = document.createElement('script');
            script.id = 'gtm-script';
            script.innerHTML = `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
            `;
            document.head.insertBefore(script, document.head.firstChild);

            // Add noscript fallback to body
            const noscript = document.createElement('noscript');
            noscript.id = 'gtm-noscript';
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
            iframe.height = '0';
            iframe.width = '0';
            iframe.style.display = 'none';
            iframe.style.visibility = 'hidden';
            noscript.appendChild(iframe);
            document.body.insertBefore(noscript, document.body.firstChild);
        } else if (isGA4) {
            // Google Analytics 4 (gtag.js) script
            const script = document.createElement('script');
            script.id = 'gtm-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
            document.head.appendChild(script);

            // Add gtag config
            const inlineScript = document.createElement('script');
            inlineScript.id = 'gtag-config';
            inlineScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtmId}');
            `;
            document.head.appendChild(inlineScript);
        }

        return () => {
            // Cleanup
            ['gtm-script', 'gtm-noscript', 'gtag-config'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        };
    }, [gtmId]);

    return null;
}
