import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import InvoiceModal from './components/InvoiceModal'
import Header from './components/Header'

function App() {
  const [products, setProducts] = useState([])
  const [showInvoice, setShowInvoice] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState(null)

  // ========================================
  // DATABASE INTEGRATION POINT - START
  // ========================================
  
  // TODO: Replace localStorage with actual database calls
  // Current implementation uses localStorage for temporary storage
  // After deployment, replace these functions with:
  // - fetchProducts() - GET request to your API
  // - saveProduct() - POST request to your API  
  // - updateProduct() - PUT request to your API
  // - deleteProduct() - DELETE request to your API
  
  // Load products from localStorage on component mount
  // REPLACE WITH: Load products from database via API call
  useEffect(() => {
    const savedProducts = localStorage.getItem('zantech-products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    
    // FUTURE DATABASE IMPLEMENTATION:
    // const loadProducts = async () => {
    //   try {
    //     const response = await fetch('/api/products')
    //     const data = await response.json()
    //     setProducts(data)
    //   } catch (error) {
    //     console.error('Error loading products:', error)
    //     toast.error('Failed to load products')
    //   }
    // }
    // loadProducts()
  }, [])

  // Save products to localStorage whenever products change
  // REPLACE WITH: Save products to database via API call
  useEffect(() => {
    localStorage.setItem('zantech-products', JSON.stringify(products))
    
    // FUTURE DATABASE IMPLEMENTATION:
    // This useEffect should be removed and replaced with individual
    // API calls in addProduct, updateProduct, and deleteProduct functions
  }, [products])

  // ========================================
  // PRODUCT MANAGEMENT FUNCTIONS
  // ========================================
  
  const addProduct = async (newProduct) => {
    // TODO: DATABASE INTEGRATION - Replace with actual API calls
    // Current implementation uses in-memory state management
    
    const existingProduct = products.find(p => p.name.toLowerCase() === newProduct.name.toLowerCase())
    
    if (existingProduct) {
      // Auto-fill existing product data
      const updatedProduct = {
        ...newProduct,
        category: existingProduct.category,
        unitPrice: existingProduct.unitPrice,
        image: existingProduct.image
      }
      
      // FUTURE DATABASE IMPLEMENTATION:
      // const updateProductInDB = async () => {
      //   try {
      //     const response = await fetch(`/api/products/${existingProduct.id}`, {
      //       method: 'PUT',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(updatedProduct)
      //     })
      //     if (response.ok) {
      //       const updatedProductFromDB = await response.json()
      //       setProducts(prev => prev.map(p => 
      //         p.id === existingProduct.id ? updatedProductFromDB : p
      //       ))
      //       toast.success('Product updated successfully!')
      //     }
      //   } catch (error) {
      //     console.error('Error updating product:', error)
      //     toast.error('Failed to update product')
      //   }
      // }
      // await updateProductInDB()
      
      // Current implementation (temporary)
      setProducts(prev => prev.map(p => 
        p.name.toLowerCase() === newProduct.name.toLowerCase() ? updatedProduct : p
      ))
      toast.success('Product updated with existing data!')
    } else {
      // FUTURE DATABASE IMPLEMENTATION:
      // const saveProductToDB = async () => {
      //   try {
      //     const response = await fetch('/api/products', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(newProduct)
      //     })
      //     if (response.ok) {
      //       const savedProduct = await response.json()
      //       setProducts(prev => [...prev, savedProduct])
      //       toast.success('New product added successfully!')
      //     }
      //   } catch (error) {
      //     console.error('Error saving product:', error)
      //     toast.error('Failed to save product')
      //   }
      // }
      // await saveProductToDB()
      
      // Current implementation (temporary)
      setProducts(prev => [...prev, { ...newProduct, id: Date.now() }])
      toast.success('New product added successfully!')
    }
  }

  const deleteProduct = async (productId) => {
    // TODO: DATABASE INTEGRATION - Replace with actual API calls
    
    // FUTURE DATABASE IMPLEMENTATION:
    // try {
    //   const response = await fetch(`/api/products/${productId}`, {
    //     method: 'DELETE'
    //   })
    //   if (response.ok) {
    //     setProducts(prev => prev.filter(p => p.id !== productId))
    //     toast.success('Product deleted successfully!')
    //   }
    // } catch (error) {
    //   console.error('Error deleting product:', error)
    //   toast.error('Failed to delete product')
    // }
    
    // Current implementation (temporary)
    setProducts(prev => prev.filter(p => p.id !== productId))
    toast.success('Product deleted successfully!')
  }

  // ========================================
  // INVOICE GENERATION FUNCTION
  // ========================================
  
  const generateInvoice = (product) => {
    // TODO: DATABASE INTEGRATION - Consider saving invoices to database
    // Current implementation generates invoice in memory only
    
    const invoice = {
      id: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customerName: product.customerName,
      product: product,
      quantity: 1,
      total: product.unitPrice
    }
    
    // FUTURE DATABASE IMPLEMENTATION:
    // const saveInvoiceToDB = async () => {
    //   try {
    //     const response = await fetch('/api/invoices', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(invoice)
    //     })
    //     if (response.ok) {
    //       const savedInvoice = await response.json()
    //       setCurrentInvoice(savedInvoice)
    //       setShowInvoice(true)
    //     }
    //   } catch (error) {
    //     console.error('Error saving invoice:', error)
    //     toast.error('Failed to save invoice')
    //   }
    // }
    // saveInvoiceToDB()
    
    // Current implementation (temporary)
    setCurrentInvoice(invoice)
    setShowInvoice(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProductForm onAddProduct={addProduct} existingProducts={products} />
          </div>
          <div>
            <ProductList 
              products={products} 
              onDeleteProduct={deleteProduct}
              onGenerateInvoice={generateInvoice}
            />
          </div>
        </div>
      </main>

      {showInvoice && currentInvoice && (
        <InvoiceModal
          invoice={currentInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  )
}

export default App
