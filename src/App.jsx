import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Contact from './pages/Contact';

// Admin Imports
import Login from './pages/admin/Login';
import AdminSetup from './pages/admin/Setup';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                        <>
                            <Header />
                            <main>
                                <Home />
                            </main>
                            <Footer />
                            <WhatsAppButton />
                        </>
                    } />
                    <Route path="/products" element={
                        <>
                            <Header />
                            <main>
                                <Products />
                            </main>
                            <Footer />
                            <WhatsAppButton />
                        </>
                    } />
                    <Route path="/product/:id" element={
                        <>
                            <Header />
                            <main>
                                <ProductDetails />
                            </main>
                            <Footer />
                            <WhatsAppButton />
                        </>
                    } />
                    <Route path="/cart" element={
                        <>
                            <Header />
                            <main>
                                <Cart />
                            </main>
                            <Footer />
                            <WhatsAppButton />
                        </>
                    } />
                    <Route path="/contact" element={
                        <>
                            <Header />
                            <main>
                                <Contact />
                            </main>
                            <Footer />
                            <WhatsAppButton />
                        </>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/setup" element={<AdminSetup />} />
                    <Route path="/admin/login" element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="products" element={<AdminProducts />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
