import { useState, useMemo, useEffect } from 'react'
import SHA256 from 'crypto-js/sha256'
import { client } from './lib/sanity'
import Header from './components/Header'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import AdminPanel from './components/AdminPanel'
import LoginModal from './components/LoginModal'
import CartSidebar from './components/CartSidebar'
import Toast from './components/Toast'
import ConfirmModal from './components/ConfirmModal'
import WhatsAppButton from './components/WhatsAppButton'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [view, setView] = useState('home') // 'home', 'product', 'admin'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirmData, setConfirmData] = useState(null)

  // Fetch from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Query fetching all fields. Order by createdAt to see newest first.
        const query = `*[_type == "product"] | order(_createdAt desc)`
        const result = await client.fetch(query)
        setProducts(result)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setView('product')
  }

  const handleBackToHome = () => {
    setSelectedProduct(null)
    setView('home')
  }

  const handleToggleAdmin = () => {
    if (view === 'admin') {
      setView('home')
      setIsAdmin(false)
    } else {
      // Show login modal instead of confirm alert
      setShowLogin(true)
    }
  }

  const handleLogin = (password) => {
    const correctPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD;
    const inputHash = SHA256(password).toString();
    if (inputHash === correctPasswordHash) {
      setIsAdmin(true)
      setView('admin')
      setShowLogin(false)
      return true;
    }
    return false;
  }

  // Cart Operations
  const addToCart = (product, color, size) => {
    setCart([...cart, { product, color, size }])
    setIsCartOpen(true)
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  // Toast & Modal Utils
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  }

  const handleConfirm = (data) => {
    setConfirmData(data);
  }

  // CRUD Operations - Helper to update local state after Sanity operations
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev])
  }

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p))
  }

  const handleDeleteProduct = async (id) => {
    // Optimistic delete
    setProducts(prev => prev.filter(p => p._id !== id))
    try {
      await client.delete(id)
    } catch (err) {
      console.error("Failed to delete", err)
      showToast("Erro ao deletar produto no sistema.", "error")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Carregando estoque...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white">
      <Header
        onSearch={setSearchTerm}
        onToggleAdmin={handleToggleAdmin}
        isAdmin={view === 'admin'}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto max-w-5xl">
        {view === 'home' && (
          <ProductList
            products={filteredProducts}
            onProductClick={handleProductClick}
          />
        )}

        {view === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToHome}
            onAddToCart={addToCart}
            cartCount={cart.length}
            onOpenCart={() => setIsCartOpen(true)}
            showToast={showToast}
          />
        )}

        {view === 'admin' && (
          <AdminPanel
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            showToast={showToast}
            onConfirm={handleConfirm}
            onExit={() => {
              setView('home')
              setIsAdmin(false)
            }}
          />
        )}

        {showLogin && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setShowLogin(false)}
          />
        )}

      </main>

      <CartSidebar
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={removeFromCart}
        showToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmData && (
        <ConfirmModal
          {...confirmData}
          onCancel={() => setConfirmData(null)}
          onConfirm={() => {
            confirmData.onConfirm();
            setConfirmData(null);
          }}
        />
      )}

      {view !== 'admin' && <WhatsAppButton />}
    </div>
  )
}

export default App
