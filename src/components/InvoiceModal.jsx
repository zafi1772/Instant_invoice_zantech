import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const InvoiceModal = ({ invoice, onClose }) => {
  // ========================================
  // INVOICE MODAL COMPONENT
  // ========================================
  // TODO: DATABASE INTEGRATION - Consider implementing:
  // - Invoice history and management
  // - Customer database integration
  // - Payment tracking and status updates
  // - Invoice numbering system with database sequence
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [quantity, setQuantity] = useState(invoice.quantity)

  const total = quantity * invoice.product.unitPrice

  // ========================================
  // PDF GENERATION FUNCTION
  // ========================================
  // TODO: DATABASE INTEGRATION - Enhance PDF generation:
  // - Store generated PDFs in database or cloud storage
  // - Add invoice templates and customization options
  // - Implement email functionality for invoice delivery
  // - Add digital signature capabilities
  
  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const element = document.getElementById('invoice-content')
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // FUTURE DATABASE IMPLEMENTATION:
      // Save generated PDF to database or cloud storage
      // const savePDFToStorage = async (pdfBlob, invoiceId) => {
      //   try {
      //     const formData = new FormData()
      //     formData.append('pdf', pdfBlob, `invoice-${invoiceId}.pdf`)
      //     formData.append('invoiceId', invoiceId)
      //     
      //     const response = await fetch('/api/invoices/save-pdf', {
      //       method: 'POST',
      //       body: formData
      //     })
      //     
      //     if (response.ok) {
      //       const { pdfUrl } = await response.json()
      //       // Update invoice record with PDF URL
      //       await fetch(`/api/invoices/${invoiceId}`, {
      //         method: 'PATCH',
      //         headers: { 'Content-Type': 'application/json' },
      //         body: JSON.stringify({ pdfUrl })
      //       })
      //     }
      //   } catch (error) {
      //     console.error('Error saving PDF:', error)
      //   }
      // }
      
      // Convert PDF to blob for storage
      const pdfBlob = pdf.output('blob')
      // await savePDFToStorage(pdfBlob, invoice.id)
      
      pdf.save(`invoice-${invoice.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Invoice #{invoice.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div id="invoice-content" className="bg-white p-8 border-2 border-gray-200 rounded-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary-600 mb-2">
                Zantech Instant Order
              </h1>
              <p className="text-gray-600">Professional Product Solutions</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Invoice Details</h3>
                <p className="text-gray-600">Invoice #: {invoice.id}</p>
                <p className="text-gray-600">Date: {invoice.date}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
                <p className="text-gray-600">Name: {invoice.customerName}</p>
              </div>
            </div>

            {/* Product Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center space-x-3">
                        {invoice.product.image && (
                          <img
                            src={invoice.product.image}
                            alt={invoice.product.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        )}
                        <span className="font-medium">{invoice.product.name}</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{invoice.product.category}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${invoice.product.unitPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="text-right">
              <div className="inline-block border-t-2 border-gray-300 pt-4">
                <p className="text-xl font-bold text-gray-800">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500 text-sm">
              <p>Thank you for your business!</p>
              <p>Zantech Instant Order - Quality Products, Instant Service</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? 'Generating PDF...' : '📄 Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal
