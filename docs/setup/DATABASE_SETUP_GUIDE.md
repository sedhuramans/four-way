# 🚀 Database Setup & Troubleshooting Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
Or double-click `start-server.bat` on Windows.

### 3. Test the Connection
Open `test-database-connection.html` in your browser to verify everything is working.

## 🔧 Troubleshooting

### Problem: "Cannot add products to database"

**Solution Steps:**

1. **Check if server is running:**
   - Open terminal/command prompt
   - Navigate to your project folder
   - Run: `npm start`
   - You should see: "🚀 Fourways International Trading server running at: http://localhost:3000"

2. **Test database connection:**
   - Open `test-database-connection.html` in your browser
   - Click "Check Server Status" - should show ✅ green
   - Click "Test Database" - should show ✅ green

3. **If server won't start:**
   ```bash
   # Install dependencies
   npm install
   
   # Try starting again
   npm start
   ```

4. **If database connection fails:**
   - Check your internet connection (MongoDB is cloud-hosted)
   - The app will automatically use localStorage as backup

### Problem: "Orders not storing in database"

**Solution:**

1. **Verify server is running** (see above)

2. **Test order creation:**
   - Open `test-database-connection.html`
   - Click "Create Test Order"
   - Should show ✅ success message

3. **Check owner portal:**
   - Go to `owner.html`
   - Login (username: `admin`, password: `2025`)
   - Click "Order Management" - you should see all orders

## 📊 Database Information

- **Type:** MongoDB Atlas (Cloud)
- **Connection:** Automatic (no setup needed)
- **Backup:** localStorage (works offline)
- **URL:** `mongodb+srv://bambooproducts295_db_user:***@cluster0.iahtqor.mongodb.net/nature_care_impex`

## 🔍 Testing Your Setup

### Test Files Available:
1. `test-database-connection.html` - Complete database testing
2. `test-owner-product-management.html` - Product management testing
3. `test-api-direct.html` - Direct API testing

### Manual Testing Steps:

1. **Test Product Creation:**
   - Go to owner portal → Product Management
   - Click "Add New Product"
   - Fill form and submit
   - Should see success message and product appears in list

2. **Test Order Creation:**
   - Go to main site → Products
   - Click "Buy Now" on any product
   - Complete the order process
   - Check owner portal → Order Management

3. **Test Edit/Delete:**
   - In owner portal → Product Management
   - Click "Edit" on any product → modify and save
   - Click "Delete" on any product → confirm deletion

## 🚨 Common Issues & Fixes

### Issue: "API Service not found"
**Fix:** Make sure `api-service.js` is loaded before other scripts in your HTML.

### Issue: "CORS Error"
**Fix:** Server includes CORS middleware. If still getting errors, try:
```javascript
// In api-service.js, change baseURL to:
this.baseURL = 'http://localhost:3000/api';
```

### Issue: "Products not syncing between owner portal and main site"
**Fix:** The system automatically syncs via localStorage. If not working:
1. Clear browser cache
2. Restart server
3. Refresh both pages

### Issue: "MongoDB connection timeout"
**Fix:** 
- Check internet connection
- System automatically falls back to localStorage
- All functionality works offline

## 📱 URLs for Testing

- **Main Website:** http://localhost:3000
- **Owner Portal:** http://localhost:3000/owner.html
- **Products Page:** http://localhost:3000/products.html
- **Database Test:** http://localhost:3000/test-database-connection.html
- **API Health:** http://localhost:3000/api/health

## 🔄 How the System Works

1. **Primary:** Tries to save to MongoDB database
2. **Fallback:** If database unavailable, saves to localStorage
3. **Sync:** Both systems stay in sync automatically
4. **Offline:** Full functionality works without internet

## 💡 Pro Tips

1. **Always start the server first** before testing
2. **Use the test files** to verify functionality
3. **Check browser console** for detailed error messages
4. **localStorage backup** means you never lose data
5. **Server restart** fixes most connection issues

## 🆘 Still Having Issues?

1. Open browser Developer Tools (F12)
2. Check Console tab for error messages
3. Run the test files and note any red error messages
4. Restart the server: `Ctrl+C` then `npm start`
5. Clear browser cache and try again

The system is designed to work reliably with automatic fallbacks, so your data is always safe!