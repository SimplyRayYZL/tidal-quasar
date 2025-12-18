import { supabase } from './supabase';

// Generate or get session ID
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

// Track an analytics event
export const trackEvent = async (eventType, eventData = {}) => {
    try {
        await supabase.from('analytics').insert([{
            event_type: eventType,
            event_data: eventData,
            session_id: getSessionId()
        }]);
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
};

// Event types
export const EVENTS = {
    PAGE_VIEW: 'page_view',
    ADD_TO_CART: 'add_to_cart',
    VIEW_CART: 'view_cart',
    CHECKOUT_START: 'checkout_start',
    PURCHASE: 'purchase'
};
