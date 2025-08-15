import React, { useState, useRef, useEffect } from 'react'
import CameraCapture from './CameraCapture'

const ProductForm = ({ onAddProduct, existingProducts }) => {
  // ========================================
  // FORM STATE MANAGEMENT
  // ========================================
  // TODO: DATABASE INTEGRATION - Consider adding form validation
  // and error handling for database operations
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unitPrice: '',
    customerName: '',
    image: null
  })
  
  const [showCamera, setShowCamera] = useState(false)
  const [duplicateProduct, setDuplicateProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ========================================
  // INPUT CHANGE HANDLER WITH DUPLICATE CHECKING
  // ========================================
  // TODO: DATABASE INTEGRATION - Consider implementing server-side
  // duplicate checking for better performance with large datasets
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Check for duplicate product when name changes
    // FUTURE DATABASE IMPLEMENTATION:
    // This could be replaced with a debounced API call to check for duplicates
    // const checkDuplicateProduct = async (productName) => {
    //   try {
    //     const response = await fetch(`/api/products/check-duplicate?name=${encodeURIComponent(productName)}`)
    //     const { exists, product } = await response.json()
    //     if (exists) {
    //       setDuplicateProduct(product)
    //       // Auto-fill form with existing product data
    //       setFormData(prev => ({
    //         ...prev,
    //         category: product.category,
    //         unitPrice: product.unitPrice,
    //         image: product.image
    //       }))
    //     } else {
    //       setDuplicateProduct(null)
    //     }
    //   } catch (error) {
    //     console.error('Error checking for duplicates:', error)
    //   }
    // }
    
    if (name === 'name' && value.trim()) {
      const existing = existingProducts.find(p => 
        p.name.toLowerCase() === value.toLowerCase()
      )
      setDuplicateProduct(existing)
      
      // Auto-fill if duplicate found
      if (existing) {
        setFormData(prev => ({
          ...prev,
          category: existing.category,
          unitPrice: existing.unitPrice,
          image: existing.image
        }))
      }
    }
  }

  const handleImageCapture = (imageData) => {
    setFormData(prev => ({ ...prev, image: imageData }))
    setShowCamera(false)
  }

  // ========================================
  // FORM SUBMISSION HANDLER
  // ========================================
  // TODO: DATABASE INTEGRATION - Add proper error handling
  // and validation for database operations
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic form validation
    if (!formData.name.trim() || !formData.category.trim() || 
        !formData.unitPrice || !formData.customerName.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // FUTURE DATABASE IMPLEMENTATION:
    // Add server-side validation here
    // const validateProductData = async (data) => {
    //   try {
    //     const response = await fetch('/api/products/validate', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(data)
    //     })
    //     const { isValid, errors } = await response.json()
    //     if (!isValid) {
    //       // Display validation errors
    //       errors.forEach(error => toast.error(error.message))
    //       return false
    //     }
    //     return true
    //   } catch (error) {
    //     console.error('Validation error:', error)
    //     return false
    //   }
    // }
    
    setIsSubmitting(true)
    
    try {
      await onAddProduct({
        ...formData,
        unitPrice: parseFloat(formData.unitPrice)
      })
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        unitPrice: '',
        customerName: '',
        image: null
      })
      setDuplicateProduct(null)
    } catch (error) {
      console.error('Error adding product:', error)
      // FUTURE DATABASE IMPLEMENTATION:
      // Add proper error handling for database operations
      // toast.error('Failed to add product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Automotive',
    'Health & Beauty',
    'Toys & Games',
    'Other'
  ]

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Product Entry Form
      </h2>
      
      {duplicateProduct && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">
            ⚠️ Product "{duplicateProduct.name}" already exists!
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Category: {duplicateProduct.category} | 
            Price: ${duplicateProduct.unitPrice}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Unit Price ($) *
          </label>
          <input
            type="number"
            id="unitPrice"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleInputChange}
            className="input-field"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Photo
          </label>
          <div className="space-y-3">
            {formData.image && (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="w-full btn-secondary"
            >
              {formData.image ? 'Retake Photo' : 'Capture Photo'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>

      {showCamera && (
        <CameraCapture
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}

export default ProductForm
