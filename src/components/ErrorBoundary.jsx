import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
                    <h1>عذراً، حدث خطأ ما</h1>
                    <p>{this.state.error?.toString()}</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('alliyaqa-cart');
                            window.location.reload();
                        }}
                        style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}
                    >
                        حاول مرة أخرى (تفريغ السلة)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
