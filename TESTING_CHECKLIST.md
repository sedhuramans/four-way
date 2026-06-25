# Testing Checklist for E-Commerce Order Flow

## Before Testing
1. ✅ Push all changes to GitHub using `push-updates.bat`
2. ✅ Wait 1-2 minutes for GitHub Pages to rebuild
3. ✅ Clear browser cache (Ctrl+Shift+Delete)

## Test URL
https://keerthivasan98406-blip.github.io/nature_care_impex

---

## Test 1: Products Page
**URL**: `/products.html`

### Expected Behavior:
- [ ] Page loads without errors
- [ ] Products display with images
- [ ] Each product shows:
  - [ ] Product name
  - [ ] Category
  - [ ] Description
  - [ ] Price (₹)
  - [ ] "View Details" button
  - [ ] "Buy Now" button (NOT "Contact Us")

### Filter Testing:
- [ ] Click "All" - Shows all products
- [ ] Click "Cocopeat" - Shows only cocopeat products
- [ ] Click "Bamboo" - Shows only bamboo products
- [ ] Click "Eco-Care" - Shows only eco-care products

---

## Test 2: Buy Now Flow
**Start**: Click "Buy Now" on any product

### Step 1: Order Details Page
**URL**: `/order-details.html?id=X`

- [ ] Product image displays correctly
- [ ] Product name, category, description show
- [ ] Price displays correctly
- [ ] Form fields present:
  - [ ] Full Name
  - [ ] Phone Number
  - [ ] Email Address
  - [ ] Delivery Address
  - [ ] Size/Variant dropdown
  - [ ] Quantity input
  - [ ] Special Instructions (optional)
- [ ] Order Summary shows:
  - [ ] Product name
  - [ ] Unit price
  - [ ] Quantity
  - [ ] Total amount
- [ ] "Continue Shopping" button works
- [ ] "Proceed to Payment" button enabled

### Step 2: Fill Order Form
- [ ] Enter customer name
- [ ] Enter phone number
- [ ] Enter email
- [ ] Enter delivery address
- [ ] Select size/variant
- [ ] Change quantity (verify total updates)
- [ ] Click "Proceed to Payment"

### Step 3: Payment Page
**URL**: `/payment.html`

- [ ] Order ID displays
- [ ] Product name shows
- [ ] Quantity correct
- [ ] Unit price correct
- [ ] Total amount correct
- [ ] Customer details display:
  - [ ] Name
  - [ ] Phone
  - [ ] Email
  - [ ] Address
- [ ] QR code displays
- [ ] UPI ID shows: fourwaysinternational@paytm
- [ ] "Copy UPI ID" button works
- [ ] Screenshot upload area visible

### Step 4: Upload Screenshot
- [ ] Click upload area
- [ ] Select an image file
- [ ] Preview displays
- [ ] "Confirm Order" button appears/enables
- [ ] Remove screenshot button works

### Step 5: Confirm Order
- [ ] Click "Confirm Order"
- [ ] Success message displays with:
  - [ ] Order ID
  - [ ] Product name
  - [ ] Total amount
  - [ ] Confirmation message
- [ ] Redirects to products page

---

## Test 3: Product Details Page
**URL**: `/product-detail.html?id=X`

- [ ] Product image displays
- [ ] Product name shows
- [ ] Category displays
- [ ] Description shows
- [ ] Size/variant dropdown works
- [ ] "Buy Now" button present
- [ ] Clicking "Buy Now" goes to order details

---

## Test 4: Track Order
**URL**: `/track-order.html`

- [ ] Page loads
- [ ] Order ID input field present
- [ ] "Track Order" button works
- [ ] Can find previously placed orders

---

## Test 5: Navigation
- [ ] Logo links to home page
- [ ] "Home" link works
- [ ] "Products" link works
- [ ] "About Us" link works
- [ ] "Contact" link works
- [ ] "Track Order" button in header works
- [ ] Back button works on all pages
- [ ] Footer links work

---

## Test 6: Mobile Responsiveness
Test on mobile device or browser dev tools (F12 → Toggle device toolbar)

- [ ] Products page displays correctly
- [ ] Order details form is usable
- [ ] Payment page is readable
- [ ] Buttons are clickable
- [ ] Images scale properly
- [ ] Navigation menu works (hamburger)

---

## Test 7: Browser Console
Press F12 → Console tab

### Check for Errors:
- [ ] No 404 errors for CSS files
- [ ] No 404 errors for JS files
- [ ] No 404 errors for images
- [ ] No JavaScript errors
- [ ] Products load successfully (check console logs)

### Expected Console Messages:
```
DOM loaded, initializing...
Products initialized: 5
Products grid element found
Products rendered successfully
```

---

## Common Issues & Solutions

### Issue: "Contact Us" buttons still showing
**Solution**: Clear browser cache completely and refresh

### Issue: Buy Now button doesn't work
**Solution**: 
1. Check browser console for errors
2. Verify `js/main.js` and `js/api-service.js` loaded
3. Clear cache and try again

### Issue: Products not loading
**Solution**:
1. Check console for errors
2. Verify products array initialized
3. Check if `products-grid` element exists

### Issue: Order details page blank
**Solution**:
1. Verify product ID in URL
2. Check sessionStorage has order data
3. Verify JavaScript files loaded

### Issue: Payment page not showing order
**Solution**:
1. Check sessionStorage for `orderForPayment`
2. Verify you came from order details page
3. Try the flow again from products page

---

## Success Criteria
✅ All products display with Buy Now buttons
✅ Complete order flow works from start to finish
✅ No console errors
✅ All pages load correctly
✅ Navigation works throughout
✅ Mobile responsive
✅ Order confirmation received

---

## Report Issues
If any test fails, note:
1. Which test failed
2. What you expected
3. What actually happened
4. Browser console errors (if any)
5. Screenshots (if helpful)
