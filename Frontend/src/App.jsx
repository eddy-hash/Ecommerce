import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Categories from './pages/Categories'
import CategoryProducts from './pages/CategoryProducts'
import Traders from './pages/Traders'
import TraderProducts from './pages/TraderProducts'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import TraderDashboard from './pages/TraderDashboard'
import TraderOrders from './pages/TraderOrders'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--toast-bg, #fff)", color: "var(--toast-color, #111)" }, className: "dark:!bg-gray-800 dark:!text-white" }} />
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
              <Navbar onMenuClick={() => setSidebarOpen(true)} />
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <CartDrawer />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:id" element={<CategoryProducts />} />
                  <Route path="/traders" element={<Traders />} />
                  <Route path="/traders/:id/products" element={<TraderProducts />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute role="CUSTOMER"><Checkout /></ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute role="CUSTOMER"><Orders /></ProtectedRoute>
                  } />
                  <Route path="/trader/dashboard" element={
                    <ProtectedRoute role="TRADER"><TraderDashboard /></ProtectedRoute>
                  } />
                  <Route path="/trader/orders" element={
                    <ProtectedRoute role="TRADER"><TraderOrders /></ProtectedRoute>
                  } />
                  <Route path="/trader/products/new" element={
                    <ProtectedRoute role="TRADER"><AddProduct /></ProtectedRoute>
                  } />
                  <Route path="/trader/products/:id/edit" element={
                    <ProtectedRoute role="TRADER"><EditProduct /></ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}