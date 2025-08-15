import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

const InvoiceForm = ({ products, onGenerateInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    selectedProducts: [],
    notes: ''
  })

  const [selectedProduct, setSelectedProduct] = useState({
    productId: '',
    quantity: 1
  })

  const handleInputChange = (e) => {p0
    const { name, value } = e.target
    setInvoiceData(prev => ({ ...prev, [name]: value }))
  }

  const handleProductSelect = (e) => {
    const productId = e.target.value
    const product = products.find(p => p.id === parseInt(productId))
    
    if (product) {
      setSelectedProduct({
        productId: parseInt(productId),
        quantity: 1,
        product: product
      })
    }
  }

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value)
    setSelectedProduct(prev => ({ ...prev, quantity: quantity > 0 ? quantity : 1 }))
  }

  const addProductToInvoice = () => {
    if (!selectedProduct.productId || selectedProduct.quantity < 1) {
      toast.error('Please select a product and valid quantity')
      return
    }

    const product = products.find(p => p.id === selectedProduct.productId)
    if (!product) {
      toast.error('Product not found')
      return
    }

    // Check if product already exists in invoice
    const existingIndex = invoiceData.selectedProducts.findIndex(
      item => item.productId === selectedProduct.productId
    )

    if (existingIndex >= 0) {
      // Update existing product quantity
      const updatedProducts = [...invoiceData.selectedProducts]
      updatedProducts[existingIndex].quantity += selectedProduct.quantity
      setInvoiceData(prev => ({ ...prev, selectedProducts: updatedProducts }))
      toast.success(`Updated quantity for ${product.name}`)
    } else {
      // Add new product to invoice
      const newProductItem = {
        ...selectedProduct,
        product: product,
        unitPrice: product.unitPrice,
        total: product.unitPrice * selectedProduct.quantity
      }
      
      setInvoiceData(prev => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, newProductItem]
      }))
      toast.success(`Added ${product.name} to invoice`)
    }

    // Reset selection
    setSelectedProduct({
      productId: '',
      quantity: 1
    })
  }

  const removeProductFromInvoice = (productId) => {
    setInvoiceData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(item => item.productId !== productId)
    }))
    toast.success('Product removed from invoice')
  }

  const updateProductQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    setInvoiceData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity, total: item.unitPrice * newQuantity }
          : item
      )
    }))
  }

  const calculateTotal = () => {
    return invoiceData.selectedProducts.reduce((total, item) => total + item.total, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!invoiceData.customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }

    if (invoiceData.selectedProducts.length === 0) {
      toast.error('Please add at least one product to the invoice')
      return
    }

    const invoice = {
      id: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customer: {
        name: invoiceData.customerName,
        email: invoiceData.customerEmail,
        phone: invoiceData.customerPhone,
        address: invoiceData.customerAddress
      },
      products: invoiceData.selectedProducts,
      subtotal: calculateTotal(),
      tax: calculateTotal() * 0.1, // 10% tax
      total: calculateTotal() * 1.1,
      notes: invoiceData.notes
    }

    onGenerateInvoice(invoice)
    
    // Reset form
    setInvoiceData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      selectedProducts: [],
      notes: ''
    })
    
    toast.success('Invoice generated successfully!')
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create Invoice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Customer Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={invoiceData.customerName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={invoiceData.customerEmail}
                onChange={handleInputChange}
                className="input-field"
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={invoiceData.customerPhone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="customerAddress"
                name="customerAddress"
                value={invoiceData.customerAddress}
                onChange={handleInputChange}
                className="input-field"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Add Products
          </h3>
          
          <div className="flex space-x-2">
            <select
              value={selectedProduct.productId}
              onChange={handleProductSelect}
              className="input-field flex-1"
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.unitPrice} ({product.category})
                </option>
              ))}
            </select>
            
            <input
              type="number"
              value={selectedProduct.quantity}
              onChange={handleQuantityChange}
              className="input-field w-20"
              min="1"
              placeholder="Qty"
            />
            
            <button
              type="button"
              onClick={addProductToInvoice}
              disabled={!selectedProduct.productId}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {/* Selected Products */}
        {invoiceData.selectedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Invoice Items
            </h3>
            
            <div className="space-y-3">
              {invoiceData.selectedProducts.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.product.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.product.category} - ${item.unitPrice} each
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateProductQuantity(item.productId, parseInt(e.target.value))}
                      className="input-field w-16 text-center"
                      min="1"
                    />
                    
                    <div className="text-right min-w-[80px]">
                      <div className="font-medium">${item.total.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeProductFromInvoice(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Invoice Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax (10%):</span>
                <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={invoiceData.notes}
            onChange={handleInputChange}
            className="input-field"
            rows="3"
            placeholder="Additional notes for the invoice..."
          />
        </div>

        <button
          type="submit"
          disabled={invoiceData.selectedProducts.length === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Invoice
        </button>
      </form>
    </div>
  )
}

export default InvoiceForm
