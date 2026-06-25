# MongoDB Integration Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Initialize Database
Visit: http://localhost:3000/api/initialize

---

## 📊 MongoDB Integration Features

### ✅ What's Integrated
- **Products Management** - All products stored in MongoDB with fallback to localStorage
- **Order Management** - Complete order lifecycle with payment screenshots
- **Order Tracking** - Real-time order status updates
- **Screenshot Storage** - Payment screenshots stored as base64 in MongoDB
- **Statistics & Analytics** - Monthly sales, revenue, and order analytics
- **Automatic Fallback** - Works offline with localStorage when MongoDB is unavailable

### 🔧 Technical Implementation
- **Database**: MongoDB Atlas Cloud Database
- **Connection**: `mongodb+srv://bambooproducts295_db_user:ZNtZhF1kCc5d4gk0@cluster0.iahtqor.mongodb.net/`
- **Database Name**: `nature_care_impex`
- **Collections**: `products`, `orders`
- **API Endpoints**: RESTful API with full CRUD operations
- **Fallback System**: Automatic localStorage fallback for offline functionality

---

## 🗂️ Database Schema

### Products Collection
```javascript
{
  id: Number,           // Unique product ID
  name: String,         // Product name
  category: String,     // cocopeat, bamboo, eco-care
  description: String,  // Product description
  image: String,        // Product image URL
  sizes: [String],      // Available sizes/variants
  price: Number,        // Selling price
  cost: Number,         // Cost price
  stock: Number,        // Current stock
  minStock: Number,     // Minimum stock alert
  isActive: Boolean,    // Product status
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### Orders Collection
```javascript
{
  orderId: String,      // Unique order ID (ORD-timestamp)
  product: {            // Product details
    id: Number,
    name: String,
    category: String,
    image: String,
    description: String
  },
  customerDetails: {    // Customer information
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    deliveryAddress: String,
    quantity: Number,
    orderNotes: String
  },
  unitPrice: Number,    // Price per unit
  totalAmount: Number,  // Total order amount
  status: String,       // Order status
  productSize: String,  // Selected size/variant
  paymentScreenshot: {  // Payment proof
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    dataUrl: String,    // Base64 encoded image
    uploadedAt: Date
  },
  orderDate: String,    // Order date (YYYY-MM-DD)
  orderMonth: String,   // Order month (YYYY-MM)
  submittedAt: Date,    // Payment submission time
  createdAt: Date,      // Order creation time
  updatedAt: Date       // Last update time
}
```

---

## 🔌 API Endpoints

### Products API
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)
- `POST /api/products/initialize` - Initialize default products

### Orders API
- `GET /api/orders` - Get all orders (with filters)
- `GET /api/orders/:orderId` - Get single order
- `POST /api/orders` - Create new order
- `POST /api/orders/track` - Track order by ID and email
- `PUT /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/screenshot` - Upload payment screenshot

### Statistics API
- `GET /api/orders/stats/summary` - Get order statistics
- `GET /api/orders/stats/monthly` - Get monthly sales data

### System API
- `GET /api/health` - Server health check
- `GET /api/initialize` - Initialize database

---

## 🔄 Fallback System

The system automatically falls back to localStorage when MongoDB is unavailable:

### Online Mode (MongoDB Available)
- All data saved to MongoDB
- Real-time synchronization
- Advanced analytics
- Centralized data management

### Offline Mode (localStorage Fallback)
- Data stored locally in browser
- Basic functionality maintained
- Automatic sync when online
- No data loss

---

## 🚀 Deployment Instructions

### 1. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd fourways-international-trading

# Install dependencies
npm install

# Start server
npm start
```

### 2. MongoDB Connection
The MongoDB connection string is already configured:
```
mongodb+srv://bambooproducts295_db_user:ZNtZhF1kCc5d4gk0@cluster0.iahtqor.mongodb.net/nature_care_impex
```

### 3. Initialize Database
Visit: `http://localhost:3000/api/initialize`

This will:
- Create default products
- Set up database indexes
- Verify connection

### 4. Test the System
1. **Products**: Visit `/products.html` - should load from MongoDB
2. **Orders**: Place a test order - should save to MongoDB
3. **Owner Portal**: Login and view orders - should display MongoDB data
4. **Tracking**: Track an order - should query MongoDB

---

## 📱 Usage Examples

### Frontend Integration
```javascript
// Load products from MongoDB
const products = await window.apiService.getProducts();

// Create new order
const order = await window.apiService.createOrder(orderData);

// Track order
const result = await window.apiService.trackOrder(orderId, email);

// Upload screenshot
const upload = await window.apiService.uploadScreenshot(orderId, file);
```

### API Calls
```javascript
// Get products by category
fetch('/api/products?category=cocopeat')

// Create order
fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
})

// Update order status
fetch('/api/orders/ORD-123/status', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'shipped' })
})
```

---

## 🔧 Troubleshooting

### MongoDB Connection Issues
1. **Check Internet Connection**: MongoDB Atlas requires internet access
2. **Verify Credentials**: Ensure the connection string is correct
3. **Check IP Whitelist**: MongoDB Atlas may require IP whitelisting
4. **Fallback Mode**: System will automatically use localStorage if MongoDB fails

### Common Issues
- **CORS Errors**: Server includes CORS middleware
- **File Upload Limits**: Screenshots limited to 5MB
- **Connection Timeout**: 30-second timeout for MongoDB operations
- **Data Sync**: Manual sync available through API calls

### Debug Mode
Enable debug logging:
```javascript
window.apiService.fallbackToLocalStorage = false; // Disable fallback
console.log('API Service Debug Mode Enabled');
```

---

## 📊 Monitoring & Analytics

### Available Metrics
- Total orders and revenue
- Monthly sales trends
- Order status distribution
- Product performance
- Customer analytics

### Access Analytics
- **Owner Portal**: Built-in dashboard with charts
- **API Endpoints**: Raw data via `/api/orders/stats/*`
- **Database Queries**: Direct MongoDB aggregation

---

## 🔐 Security Features

### Data Protection
- Input validation and sanitization
- File type restrictions for uploads
- Size limits for file uploads
- SQL injection prevention (NoSQL)

### Access Control
- Owner portal authentication
- API endpoint protection
- Secure file handling
- Environment variable support

---

## ✅ System Status

### Current Implementation
- ✅ MongoDB connection established
- ✅ Products API fully functional
- ✅ Orders API with screenshot support
- ✅ Automatic fallback system
- ✅ Owner portal integration
- ✅ Order tracking system
- ✅ Statistics and analytics
- ✅ No breaking changes to existing code

### Ready for Production
The system is production-ready with:
- Robust error handling
- Automatic fallback mechanisms
- Comprehensive API coverage
- Full backward compatibility
- Complete documentation

---

**🎉 MongoDB Integration Complete!**

Your Fourways International Trading website now has full MongoDB integration while maintaining all existing functionality. The system automatically handles online/offline scenarios and provides a seamless user experience.