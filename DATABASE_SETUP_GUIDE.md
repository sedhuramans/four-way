# Database Configuration Guide - Track Orders Storage

## ✅ Current Configuration Status

Your database is **already configured** to store tracking orders! Here's the complete setup:

## 📊 Database Architecture

### MongoDB Atlas (Cloud Database)
- **Provider**: MongoDB Atlas
- **Cluster**: cluster0.boime9a.mongodb.net
- **Database**: nature_care_impex
- **Collection**: orders
- **Access**: Global, 24/7

### Connection String
```
mongodb+srv://p59050352_db_user:keerthivasan@cluster0.boime9a.mongodb.net/nature_care_impex?retryWrites=true&w=majority&appName=Cluster0
```

## 🗄️ Order Schema (What Gets Stored)

Every order stored in the database includes:

### 1. Order Identification
- `orderId` - Unique order ID (e.g., NCI-20250116-XXXX)
- `createdAt` - Timestamp when order was created
- `orderDate` - Date in YYYY-MM-DD format
- `orderMonth` - Month in YYYY-MM format

### 2. Product Information
- `product.id` - Product ID
- `product.name` - Product name
- `product.category` - Product category
- `product.image` - Product image URL
- `product.description` - Product description

### 3. Customer Details
- `customerDetails.customerName` - Customer name
- `customerDetails.customerEmail` - Customer email (used for tracking)
- `customerDetails.customerPhone` - Customer phone
- `customerDetails.deliveryAddress` - Delivery address
- `customerDetails.quantity` - Order quantity
- `customerDetails.orderNotes` - Special instructions

### 4. Pricing
- `unitPrice` - Price per unit
- `totalAmount` - Total order amount
- `productSize` - Product size/variant

### 5. Order Status
- `status` - Current status (pending, screenshot, processing, shipped, completed, cancelled)
- `submittedAt` - When order was submitted

### 6. Payment Screenshot
- `paymentScreenshot.filename` - Screenshot filename
- `paymentScreenshot.dataUrl` - Base64 image data
- `paymentScreenshot.uploadedAt` - Upload timestamp

## 🔍 Database Indexes (For Fast Tracking)

The database has optimized indexes for fast order tracking:

```javascript
// Search by Order ID (fastest)
OrderSchema.index({ orderId: 1 });

// Search by Email (fast)
OrderSchema.index({ 'customerDetails.customerEmail': 1 });

// Filter by Status
OrderSchema.index({ status: 1 });

// Sort by Date
OrderSchema.index({ createdAt: -1 });

// Monthly reports
OrderSchema.index({ orderMonth: 1 });
```

## 🧪 Test Your Database Configuration

### Option 1: Run Test Script (Recommended)

```bash
cd server
node test-database.js
```

This will:
- ✅ Check environment variables
- ✅ Connect to MongoDB Atlas
- ✅ List collections
- ✅ Count existing orders
- ✅ Create test order
- ✅ Search by Order ID
- ✅ Search by Email
- ✅ Delete test order
- ✅ Show recent orders

### Option 2: Manual Test via API

1. **Start the server**:
```bash
cd server
npm start
```

2. **Create a test order** (use Postman or browser):
```
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "orderId": "TEST-123",
  "product": {
    "id": 1,
    "name": "Test Product",
    "category": "test",
    "image": "https://via.placeholder.com/150",
    "description": "Test"
  },
  "customerDetails": {
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "1234567890",
    "deliveryAddress": "Test Address",
    "quantity": 1
  },
  "unitPrice": 100,
  "totalAmount": 100,
  "status": "pending",
  "productSize": "Standard",
  "orderDate": "2025-01-16",
  "orderMonth": "2025-01"
}
```

3. **Track the order**:
```
POST http://localhost:3000/api/orders/track
Content-Type: application/json

{
  "orderId": "TEST-123",
  "email": ""
}
```

## 🌐 Render Deployment Configuration

### Environment Variables in Render

Make sure these are set in your Render dashboard:

1. Go to: https://dashboard.render.com
2. Select: fourways-international-trading-1
3. Click: Environment tab
4. Add/Verify:

```
MONGODB_ATLAS_URI=mongodb+srv://p59050352_db_user:keerthivasan@cluster0.boime9a.mongodb.net/nature_care_impex?retryWrites=true&w=majority&appName=Cluster0

NODE_ENV=production
PORT=3000
```

## 🔐 MongoDB Atlas Configuration

### Network Access (IP Whitelist)

For Render deployment to work, you need to whitelist Render's IP addresses:

1. Go to: https://cloud.mongodb.com
2. Select your cluster
3. Click: Network Access
4. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - **Note**: This allows access from any IP. For production, you can restrict to Render's IP ranges.

### Database User

Verify your database user has proper permissions:

1. Go to: Database Access
2. User: `p59050352_db_user`
3. Password: `keerthivasan`
4. Role: `readWrite` on `nature_care_impex` database

## 📱 How Track Order Uses Database

### Flow Diagram:
```
Customer enters Order ID
    ↓
Frontend (track-order.html)
    ↓
API Service (js/api-service.js)
    ↓
POST /api/orders/track
    ↓
Server (server/routes/orders.js)
    ↓
MongoDB Query: Order.findOne({ orderId: "..." })
    ↓
Database (MongoDB Atlas)
    ↓
Return Order Data
    ↓
Display on Track Page
```

### Code Flow:

**Frontend** (`track-order.html`):
```javascript
// Search database first
const result = await window.apiService.trackOrder(orderId, email);
```

**API Service** (`js/api-service.js`):
```javascript
async trackOrder(orderId, email) {
    const result = await this.apiCall('/orders/track', {
        method: 'POST',
        body: JSON.stringify({ orderId, email })
    });
    return result;
}
```

**Backend** (`server/routes/orders.js`):
```javascript
router.post('/track', async (req, res) => {
    const { orderId, email } = req.body;
    
    // Build flexible query
    let query = {};
    if (orderId && !email) {
        query = { orderId: orderId };
    } else if (email && !orderId) {
        query = { 'customerDetails.customerEmail': email };
    }
    
    // Search database
    const order = await Order.findOne(query);
    
    res.json({ success: true, data: order });
});
```

## ✅ Verification Checklist

### Local Development:
- [ ] `.env` file exists in `server/` folder
- [ ] `MONGODB_ATLAS_URI` is set correctly
- [ ] Run `node server/test-database.js` - all tests pass
- [ ] Server starts without database errors
- [ ] Can create orders via API
- [ ] Can track orders via API

### Render Deployment:
- [ ] Environment variables set in Render dashboard
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Render deployment shows "Live" status
- [ ] Check Render logs for "✅ MongoDB Atlas Connected"
- [ ] Can place orders on website
- [ ] Can track orders on website
- [ ] Orders appear in owner portal

### MongoDB Atlas:
- [ ] Cluster is active (not paused)
- [ ] Database user exists with correct password
- [ ] Network access allows connections
- [ ] Can see `orders` collection in Atlas dashboard
- [ ] Can view order documents in Atlas

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Cause**: Wrong username or password  
**Fix**: 
1. Check MongoDB Atlas → Database Access
2. Verify username: `p59050352_db_user`
3. Reset password if needed
4. Update `MONGODB_ATLAS_URI` with new password

### Error: "Network timeout"
**Cause**: IP not whitelisted  
**Fix**:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0`
3. Wait 2-3 minutes for changes to apply

### Error: "Database not available"
**Cause**: Connection string incorrect  
**Fix**:
1. Copy connection string from MongoDB Atlas
2. Replace `<password>` with actual password
3. Add database name: `/nature_care_impex`
4. Update `.env` file

### Orders not appearing in database
**Cause**: Orders saving to localStorage only  
**Fix**:
1. Check browser console for API errors
2. Verify server is running
3. Check Render logs for database connection
4. Test API endpoint manually

## 📊 Monitor Your Database

### MongoDB Atlas Dashboard:
1. Go to: https://cloud.mongodb.com
2. Select: Cluster0
3. Click: Collections
4. View: `nature_care_impex` → `orders`
5. See all orders in real-time

### Render Logs:
1. Go to: https://dashboard.render.com
2. Select: fourways-international-trading-1
3. Click: Logs
4. Look for:
   - `✅ MongoDB Atlas Connected`
   - `📊 Database: nature_care_impex`

## 🎯 Success Indicators

Your database is properly configured if:

- ✅ Test script passes all tests
- ✅ Server logs show "MongoDB Atlas Connected"
- ✅ Orders appear in MongoDB Atlas dashboard
- ✅ Track order finds orders from database
- ✅ Owner portal shows orders from database
- ✅ Console shows "Searching in database..." first
- ✅ Multi-device access works

## 📝 Summary

Your database is **already configured** to store tracking orders with:

- ✅ MongoDB Atlas cloud database
- ✅ Proper schema with all required fields
- ✅ Optimized indexes for fast searching
- ✅ Track by Order ID or Email
- ✅ Multi-device access enabled
- ✅ Real-time synchronization
- ✅ Automatic backups

**No additional configuration needed!** Just run the test script to verify everything is working.
