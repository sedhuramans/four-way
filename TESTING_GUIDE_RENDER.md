# Testing Guide for Render Deployment

## ✅ Changes Pushed to GitHub

All fixes have been committed and pushed to GitHub. Render should automatically redeploy within 2-3 minutes.

## 🔍 What Was Fixed

### 1. Track Order Functionality
- ✅ Now searches real orders from localStorage and database
- ✅ Search by Order ID or Email
- ✅ Displays complete order details with timeline
- ✅ Shows "Order Not Found" with helpful tips

### 2. Owner Portal Integration
- ✅ Server routes fixed to serve correct owner.html from root
- ✅ API routes moved before static file serving (critical fix)
- ✅ Owner portal accessible at: `https://fourways-international-trading-1.onrender.com/owner.html`

### 3. Add New Product Form
- ✅ Fixed form field mismatch (product-image-url and product-image-file)
- ✅ Added two image upload options (URL or File upload)
- ✅ Image preview functionality
- ✅ Category-based default images

### 4. Delete Order Functionality
- ✅ Delete button in order management
- ✅ Confirmation dialog before deletion
- ✅ Removes from all storage locations

## 🧪 Testing Steps on Render

### Wait for Deployment
1. Go to your Render dashboard: https://dashboard.render.com
2. Find "fourways-international-trading-1" service
3. Wait for "Deploy" status to show "Live" (2-3 minutes)
4. Check the logs for any errors

### Test 1: Place a New Order
1. Visit: https://fourways-international-trading-1.onrender.com
2. Click "Products" in navigation
3. Click "Buy Now" on any product
4. Fill in order details:
   - Name: Test Customer
   - Email: test@example.com
   - Phone: 9876543210
   - Address: Test Address
   - Quantity: 2
5. Click "Proceed to Payment"
6. Upload a screenshot (any image)
7. Click "Confirm Order"
8. Note the Order ID (e.g., NCI-20250116-XXXX)

### Test 2: Check Owner Portal
1. Visit: https://fourways-international-trading-1.onrender.com/owner.html
2. Login with:
   - Username: admin
   - Password: 2025
3. Check Dashboard:
   - Should show updated statistics
   - Recent activity should show your test order
4. Click "Order Management":
   - Your test order should appear in the list
   - Should show "📷 screenshot" status
   - Should have "🗑️ Delete" button

### Test 3: Track Order
1. Visit: https://fourways-international-trading-1.onrender.com/track-order.html
2. Enter your Order ID from Test 1
3. Click "Track Order"
4. Should display:
   - Order details
   - Customer information
   - Product details
   - Order timeline with status

### Test 4: Add New Product (Owner Portal)
1. In owner portal, click "Product Management"
2. Click "Add New Product" button
3. Fill in product details:
   - Name: Test Product
   - Category: cocopeat
   - Description: Test description
   - Price: 500
   - Cost: 300
   - Stock: 100
   - Min Stock: 20
   - Image: Either paste URL or upload file
4. Click "Add Product"
5. Product should appear in the products list
6. Go to main website products page - new product should be visible

### Test 5: Delete Order
1. In owner portal, go to "Order Management"
2. Find your test order
3. Click "🗑️ Delete" button
4. Confirm deletion
5. Order should disappear from the list

## 🔧 Environment Variables Check

Make sure these are set in Render dashboard:

1. Go to: https://dashboard.render.com
2. Select your service "fourways-international-trading-1"
3. Click "Environment" tab
4. Verify these variables exist:

```
MONGODB_ATLAS_URI=mongodb+srv://p59050352_db_user:keerthivasan@cluster0.boime9a.mongodb.net/nature_care_impex?retryWrites=true&w=majority&appName=Cluster0

NODE_ENV=production
PORT=3000
```

## 🐛 Troubleshooting

### If Owner Portal Shows Old Version:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try incognito/private window
4. Check Render logs for errors

### If Orders Don't Appear:
1. Open browser console (F12)
2. Look for error messages
3. Check if localStorage has orders: `localStorage.getItem('customerOrders')`
4. Verify MongoDB connection in Render logs

### If Track Order Doesn't Work:
1. Make sure you're using the correct Order ID format (NCI-YYYYMMDD-XXXX)
2. Check browser console for errors
3. Verify order exists in localStorage or database

### If Add Product Fails:
1. Check browser console for errors
2. Verify all required fields are filled
3. Check image file size (max 5MB)
4. Try using image URL instead of file upload

## 📊 Expected Console Output

### On Main Website:
```
📡 API Service loaded successfully
🔌 API Service initialized
✅ Server connected successfully
🔗 Server URL: https://fourways-international-trading-1.onrender.com/api
```

### On Owner Portal:
```
🔄 Loading dashboard data...
✅ Products loaded from MongoDB for dashboard: X
📊 Parsed customer orders: X
✅ Loaded X orders from localStorage
✅ Orders loaded from MongoDB: X
✅ Merged orders - DB: X Local only: X Total: X
```

### On Track Order:
```
🔍 Searching for order: NCI-XXXXXXXX-XXXX
📱 Searching in localStorage...
✅ Order found in localStorage
```

## 🎯 Success Criteria

All tests pass if:
- ✅ New orders save and appear in owner portal immediately
- ✅ Track order finds and displays order details
- ✅ Owner portal loads correct version (not default)
- ✅ Add new product works with both URL and file upload
- ✅ Delete order removes order from list
- ✅ No console errors
- ✅ MongoDB connection successful (check Render logs)

## 📝 Next Steps After Testing

If all tests pass:
1. ✅ System is fully functional
2. ✅ Ready for production use
3. ✅ Can start taking real orders

If any test fails:
1. Note which test failed
2. Check browser console for errors
3. Check Render logs for server errors
4. Share error messages for debugging

## 🔗 Important URLs

- **Main Website**: https://fourways-international-trading-1.onrender.com
- **Owner Portal**: https://fourways-international-trading-1.onrender.com/owner.html
- **Track Order**: https://fourways-international-trading-1.onrender.com/track-order.html
- **GitHub Repo**: https://github.com/keerthivasan98406-blip/nature_care_impex
- **Render Dashboard**: https://dashboard.render.com

## ⏱️ Deployment Timeline

- **Commit Time**: Just now
- **Push Time**: Just now
- **Expected Deploy Time**: 2-3 minutes from now
- **Test Start Time**: After deploy shows "Live" status

---

**Note**: Wait for Render to finish deploying before testing. You can monitor the deployment in your Render dashboard.
