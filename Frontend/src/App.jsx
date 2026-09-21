import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import AnimatedToast from './components/AnimatedToast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
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
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageTransition><Home /></PageTransition>} />
        <Route path='/login' element={<PageTransition><Login /></PageTransition>} />
        <Route path='/reset-password' element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path='/register' element={<PageTransition><Register /></PageTransition>} />
        <Route path='/categories' element={<PageTransition><Categories /></PageTransition>} />
        <Route path='/categories/:id' element={<PageTransition><CategoryProducts /></PageTransition>} />
        <Route path='/traders' element={<PageTransition><Traders /></PageTransition>} />
        <Route path='/traders/:id/products' element={<PageTransition><TraderProducts /></PageTransition>} />
        <Route path='/products/:id' element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path='/profile' element={<PageTransition><ProtectedRoute><Profile /></ProtectedRoute></PageTransition>} />
        <Route path='/checkout' element={<PageTransition><ProtectedRoute role='CUSTOMER'><Checkout /></ProtectedRoute></PageTransition>} />
        <Route path='/orders' element={<PageTransition><ProtectedRoute role='CUSTOMER'><Orders /></ProtectedRoute></PageTransition>} />
        <Route path='/trader/dashboard' element={<PageTransition><ProtectedRoute role='TRADER'><TraderDashboard /></ProtectedRoute></PageTransition>} />
        <Route path='/trader/orders' element={<PageTransition><ProtectedRoute role='TRADER'><TraderOrders /></ProtectedRoute></PageTransition>} />
        <Route path='/trader/products/new' element={<PageTransition><ProtectedRoute role='TRADER'><AddProduct /></ProtectedRoute></PageTransition>} />
        <Route path='/trader/products/:id/edit' element={<PageTransition><ProtectedRoute role='TRADER'><EditProduct /></ProtectedRoute></PageTransition>} />

        <Route path='/admin' element={<Navigate to='/admin/dashboard' replace />} />
        <Route path='/admin/dashboard' element={<PageTransition><ProtectedRoute role='ADMIN'><AdminDashboard /></ProtectedRoute></PageTransition>} />
        <Route path='/admin/users' element={<PageTransition><ProtectedRoute role='ADMIN'><AdminUsers /></ProtectedRoute></PageTransition>} />
        <Route path='/admin/products' element={<PageTransition><ProtectedRoute role='ADMIN'><AdminProducts /></ProtectedRoute></PageTransition>} />
        <Route path='/admin/orders' element={<PageTransition><ProtectedRoute role='ADMIN'><AdminOrders /></ProtectedRoute></PageTransition>} />

        <Route path='*' element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <AnimatedToast />
              <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors'>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <CartDrawer />
                <main className='flex-1'>
                  <AnimatedRoutes />
                </main>
                <Footer />
              </div>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}