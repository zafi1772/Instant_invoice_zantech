# Zantech Instant Order - Product Management System

A React web application for managing sold product information with invoice generation capabilities. Built with modern web technologies and designed for easy database integration after deployment.

## 🚀 Features

- **Product Entry Form** with all required fields
- **Live Camera Capture** integration for product photos
- **Duplicate Product Detection** with auto-fill functionality
- **Invoice Generation** with PDF download capability
- **Responsive Design** using Tailwind CSS
- **Toast Notifications** for user feedback
- **Local Storage** for temporary data persistence

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Camera**: Browser MediaDevices API
- **PDF Generation**: jsPDF + html2canvas
- **Notifications**: react-hot-toast
- **Build Tool**: Vite

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zantech-instant-order
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

### Build for Production
```bash
npm run build
npm run preview
```

## 🗄️ Database Integration Guide

This application is designed to be easily integrated with a real database after deployment. The current implementation uses localStorage for temporary data storage.

### 🔄 What to Replace

#### 1. **Product Management Functions** (`src/App.jsx`)
- **Current**: In-memory state management with localStorage
- **Replace with**: API calls to your backend

```javascript
// CURRENT IMPLEMENTATION (Temporary)
const addProduct = async (newProduct) => {
  setProducts(prev => [...prev, { ...newProduct, id: Date.now() }])
}

// FUTURE DATABASE IMPLEMENTATION
const addProduct = async (newProduct) => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    if (response.ok) {
      const savedProduct = await response.json()
      setProducts(prev => [...prev, savedProduct])
    }
  } catch (error) {
    console.error('Error saving product:', error)
  }
}
```

#### 2. **Data Loading** (`src/App.jsx`)
- **Current**: `localStorage.getItem('zantech-products')`
- **Replace with**: API call to fetch products

```javascript
// CURRENT IMPLEMENTATION (Temporary)
useEffect(() => {
  const savedProducts = localStorage.getItem('zantech-products')
  if (savedProducts) {
    setProducts(JSON.parse(savedProducts))
  }
}, [])

// FUTURE DATABASE IMPLEMENTATION
useEffect(() => {
  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }
  loadProducts()
}, [])
```

#### 3. **Image Storage** (`src/components/CameraCapture.jsx`)
- **Current**: Base64 data URLs stored in memory
- **Replace with**: Cloud storage (AWS S3, Cloudinary, etc.)

```javascript
// FUTURE DATABASE IMPLEMENTATION
const uploadImageToCloud = async (imageData) => {
  try {
    const formData = new FormData()
    formData.append('image', imageData)
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })
    const { imageUrl } = await response.json()
    return imageUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return imageData // Fallback to base64
  }
}
```

#### 4. **Invoice Storage** (`src/components/InvoiceModal.jsx`)
- **Current**: Generated PDFs downloaded locally only
- **Replace with**: Store PDFs in database/cloud storage

```javascript
// FUTURE DATABASE IMPLEMENTATION
const savePDFToStorage = async (pdfBlob, invoiceId) => {
  try {
    const formData = new FormData()
    formData.append('pdf', pdfBlob, `invoice-${invoiceId}.pdf`)
    formData.append('invoiceId', invoiceId)
    
    const response = await fetch('/api/invoices/save-pdf', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const { pdfUrl } = await response.json()
      // Update invoice record with PDF URL
      await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl })
      })
    }
  } catch (error) {
    console.error('Error saving PDF:', error)
  }
}
```

### 🏗️ Recommended Database Schema

#### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Invoices Table
```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Customers Table (Optional Enhancement)
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🔌 API Endpoints to Implement

#### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/check-duplicate?name=:name` - Check for duplicate names

#### Invoices
- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Fetch specific invoice
- `PATCH /api/invoices/:id` - Update invoice (e.g., add PDF URL)

#### File Upload
- `POST /api/upload-image` - Upload product images
- `POST /api/invoices/save-pdf` - Save generated PDFs

### 🚀 Deployment Considerations

#### 1. **Environment Variables**
```bash
# Database
DATABASE_URL=your_database_connection_string
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=zantech_orders
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# File Storage
CLOUD_STORAGE_BUCKET=your_bucket_name
CLOUD_STORAGE_REGION=your_region
CLOUD_STORAGE_ACCESS_KEY=your_access_key
CLOUD_STORAGE_SECRET_KEY=your_secret_key

# API Configuration
API_BASE_URL=https://your-api-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
```

#### 2. **Security Measures**
- Implement authentication and authorization
- Add input validation and sanitization
- Use HTTPS in production
- Implement rate limiting
- Add CSRF protection

#### 3. **Performance Optimizations**
- Implement database indexing
- Add caching layers (Redis)
- Optimize image compression
- Use CDN for static assets

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Camera API**: Requires HTTPS in production

## 🔧 Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure HTTPS is enabled (required for camera access)
   - Check browser permissions for camera access
   - Try refreshing the page

2. **PDF generation fails**
   - Check browser console for errors
   - Ensure all images are loaded before generating PDF
   - Try with smaller images

3. **Local storage issues**
   - Clear browser cache and localStorage
   - Check if private/incognito mode is enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add comprehensive comments for database integration
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions about database integration:
- Create an issue in the repository
- Check the code comments for implementation details
- Review the database integration guide above

---

**Note**: This application is designed as a proof-of-concept with temporary storage. For production use, implement proper database integration following the guidelines above.
#   I n s t a n t _ i n v o i c e _ z a n t e c h  
 