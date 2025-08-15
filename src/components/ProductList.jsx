import React from 'react'

const ProductList = ({ products, onDeleteProduct, onGenerateInvoice }) => {
  if (products.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Product List
        </h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">No products added yet</p>
          <p className="text-gray-500">Add your first product using the form on the left</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Product List ({products.length})
      </h2>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {product.image && (
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Category: {product.category}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Customer: {product.customerName}
                    </p>
                    <p className="text-lg font-bold text-primary-600">
                      ${product.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => onGenerateInvoice(product)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      📄 Generate Invoice
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
