/* Fourways International Trading - Main Script */

// Buy Now Ordering System - Define functions first
let currentOrder = null;

function startOrderProcess(productId) {
    console.log('startOrderProcess called with productId:', productId);
    
    // Ensure products are loaded
    if (!products || products.length === 0) {
        console.log('Products not loaded, refreshing...');
        refreshProducts();
    }
    
    // Convert productId to number for comparison
    const id = parseInt(productId);
    console.log('Converted ID:', id);
    console.log('Available products:', products);
    
    // Try to find product by both number and string ID
    let product = products.find(p => p.id === id || p.id === productId || p.id === String(productId));
    
    // If still not found, try refreshing products and searching again
    if (!product) {
        console.log('Product not found, refreshing products and trying again...');
        refreshProducts();
        product = products.find(p => p.id === id || p.id === productId || p.id === String(productId));
    }
    
    console.log('Found product:', product);
    
    if (!product) {
        console.error('Product not found after refresh:', productId);
        console.error('Available product IDs:', products.map(p => p.id));
        alert('Product not found. Please refresh the page and try again.');
        return;
    }
    
    // Store order data in sessionStorage for the order details page
    const orderData = {
        product: product,
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
    console.log('Order data stored:', orderData);
    
    // Redirect to order details page
    window.location.href = 'order-details.html?id=' + productId;
}

// Function to load order details on the order details page
function loadOrderDetailsPage() {
    console.log('Loading order details page...');
    
    // Get order data from sessionStorage
    const orderDataStr = sessionStorage.getItem('currentOrder');
    if (!orderDataStr) {
        console.error('No order data found');
        alert('No order data found. Redirecting to products page.');
        window.location.href = 'products.html';
        return;
    }
    
    const orderData = JSON.parse(orderDataStr);
    console.log('Loaded order data:', orderData);
    
    // Populate product information
    populateProductInfo(orderData.product);
    
    // Set up form handlers
    setupOrderForm(orderData);
}

function populateProductInfo(product) {
    console.log('Populating product info:', product);
    
    // Update product display
    document.getElementById('order-product-image').src = product.image;
    document.getElementById('order-product-image').alt = product.name;
    document.getElementById('order-product-name').textContent = product.name;
    document.getElementById('order-product-category').textContent = product.category;
    document.getElementById('order-product-description').textContent = product.description;
    
    const price = product.price || getProductPrice(product.id);
    document.getElementById('order-product-price').textContent = `₹${price.toLocaleString()}`;
    
    // Populate size options
    const sizeSelect = document.getElementById('product-size');
    sizeSelect.innerHTML = '';
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    // Update summary
    document.getElementById('summary-product-name').textContent = product.name;
    document.getElementById('summary-unit-price').textContent = `₹${price.toLocaleString()}`;
    updateOrderSummary();
}

function setupOrderForm(orderData) {
    const form = document.getElementById('order-form');
    const quantityInput = document.getElementById('order-quantity');
    
    // Add quantity change handler
    quantityInput.addEventListener('input', updateOrderSummary);
    
    // Add payment method change handlers
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
    
    // Add form submit handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleOrderFormSubmit(orderData);
    });
    
    console.log('Order form setup complete');
}

function updateOrderSummary() {
    const quantity = parseInt(document.getElementById('order-quantity').value) || 1;
    const orderData = JSON.parse(sessionStorage.getItem('currentOrder'));
    const price = orderData.product.price || getProductPrice(orderData.product.id);
    const subtotal = quantity * price;
    const charges = 20; // ₹20 for both shipping and COD
    const total = subtotal + charges;
    
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'online';
    
    // Update labels based on payment method
    const chargesLabel = document.getElementById('charges-label');
    if (paymentMethod === 'cod') {
        chargesLabel.textContent = 'COD Charges:';
    } else {
        chargesLabel.textContent = 'Shipping:';
    }
    
    document.getElementById('summary-quantity').textContent = quantity;
    document.getElementById('summary-subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('summary-total').textContent = `₹${total.toLocaleString()}`;
}

function handleOrderFormSubmit(orderData) {
    console.log('Handling order form submit...');
    
    // Collect form data
    const formData = {
        customerName: document.getElementById('customer-name').value,
        customerPhone: document.getElementById('customer-phone').value,
        customerEmail: document.getElementById('customer-email').value,
        deliveryAddress: document.getElementById('delivery-address').value,
        productSize: document.getElementById('product-size').value,
        quantity: parseInt(document.getElementById('order-quantity').value),
        orderNotes: document.getElementById('order-notes').value
    };
    
    // Calculate total (Subtotal + Delivery Charge)
    const price = getProductPrice(orderData.product.id);
    const subtotal = formData.quantity * price;
    const deliveryCharge = 20;
    const total = subtotal + deliveryCharge;
    
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'online';
    
    // Create final order
    const finalOrder = {
        ...orderData,
        customerDetails: formData,
        unitPrice: price,
        totalAmount: total,
        status: paymentMethod === 'cod' ? 'cod' : 'pending',
        paymentMethod: paymentMethod,
        productSize: formData.productSize, // Add size/variant to main order object
        orderDate: new Date().toISOString().split('T')[0], // Add order date for monthly calculations
        orderMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format for monthly grouping
    };
    
    console.log('Final order:', finalOrder);
    
    // Store order for payment page
    sessionStorage.setItem('orderForPayment', JSON.stringify(finalOrder));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Payment page functions
function loadPaymentPage() {
    console.log('Loading payment page...');
    
    // Get order data from sessionStorage
    const orderDataStr = sessionStorage.getItem('orderForPayment');
    if (!orderDataStr) {
        console.error('No order data found for payment');
        
        // Create demo order data for testing
        const demoOrder = {
            orderId: 'ORD-DEMO-' + Date.now(),
            product: {
                id: 1,
                name: 'Cocopeat 5kg Block',
                category: 'Cocopeat',
                image: 'assets/products/cocopeat-block.jpg',
                description: 'Premium quality cocopeat block for gardening.'
            },
            customerDetails: {
                customerName: 'Demo Customer',
                customerPhone: '9876543210',
                customerEmail: 'demo@example.com',
                deliveryAddress: 'Demo Address',
                quantity: 1
            },
            unitPrice: 250,
            totalAmount: 250,
            productSize: '5kg',
            status: 'pending'
        };
        
        console.log('Using demo order data:', demoOrder);
        sessionStorage.setItem('orderForPayment', JSON.stringify(demoOrder));
        
        // Use demo data
        populatePaymentInfo(demoOrder);
        generatePaymentQR(demoOrder);
        return;
    }
    
    const orderData = JSON.parse(orderDataStr);
    console.log('Loaded payment order data:', orderData);
    
    // Populate payment page
    populatePaymentInfo(orderData);
    
    // Generate QR code
    generatePaymentQR(orderData);
}

function populatePaymentInfo(orderData) {
    console.log('Populating payment info...');
    
    // Order summary
    document.getElementById('payment-order-id').textContent = orderData.orderId;
    document.getElementById('payment-product-name').textContent = orderData.product.name;
    document.getElementById('payment-quantity').textContent = orderData.customerDetails.quantity;
    document.getElementById('payment-unit-price').textContent = `₹${orderData.unitPrice.toLocaleString()}`;
    
    // Total amount already includes delivery charge from submission
    const finalAmount = orderData.totalAmount;
    const amount = orderData.totalAmount;
    const upiId = 'naveethulhussain700-4@okaxis';
    const deliveryChargesRow = document.getElementById('cod-charges-row');
    const deliveryChargesElement = document.getElementById('payment-cod-charges');
    const totalAmountElement = document.getElementById('payment-total-amount');
    
    if (deliveryChargesRow && deliveryChargesElement) {
        deliveryChargesRow.style.display = 'flex';
        deliveryChargesElement.textContent = `₹20`;
        
        // Update the label to show "Delivery Charges" instead of "COD Charges"
        const deliveryLabel = deliveryChargesRow.querySelector('span:first-child');
        if (deliveryLabel) {
            deliveryLabel.textContent = orderData.paymentMethod === 'cod' ? 'COD Charges:' : 'Delivery Charges:';
        }
    }
    
    // Always update total amount if the element exists
    if (totalAmountElement) {
        totalAmountElement.textContent = `₹${finalAmount.toLocaleString()}`;
    }
    
    // Customer details
    document.getElementById('customer-name-display').textContent = orderData.customerDetails.customerName;
    document.getElementById('customer-phone-display').textContent = orderData.customerDetails.customerPhone;
    document.getElementById('customer-email-display').textContent = orderData.customerDetails.customerEmail;
    document.getElementById('customer-address-display').textContent = orderData.customerDetails.deliveryAddress;

    // Handle COD specific UI changes
    const isCOD = orderData.paymentMethod === 'cod' || orderData.status === 'cod';
    if (isCOD) {
        console.log('📦 COD detected - Hiding UPI and Screenshot sections');
        const upiSection = document.querySelector('.payment-methods-section');
        const screenshotSection = document.getElementById('screenshot-section');
        
        if (upiSection) {
            const h3 = upiSection.querySelector('h3');
            if (h3) h3.textContent = 'Payment Method: Cash on Delivery';
        }

        // KEEP UPI specific parts visible (as per user request)
        const qrContainer = document.querySelector('.qr-payment-section');
        if (qrContainer) qrContainer.style.display = 'block';
        
        // ONLY Hide the screenshot section
        if (screenshotSection) {
            screenshotSection.style.display = 'none';
            screenshotSection.setAttribute('hidden', 'true');
        }
        
        // KEEP UPI ID section visible
        const upiIdSection = document.querySelector('.upi-id-section');
        if (upiIdSection) upiIdSection.style.display = 'block';
        
        // Update confirmation text to mention optional online payment
        const confirmBtn = document.getElementById('confirm-payment-btn');
        if (confirmBtn) {
            confirmBtn.textContent = '✅ Confirm COD Order';
            confirmBtn.style.background = 'linear-gradient(135deg, #0A2A6B 0%, #2e7d32 100%)';
        }
        
        const confirmInstruction = document.querySelector('.confirmation-instruction');
        if (confirmInstruction) {
            confirmInstruction.textContent = 'You can pay via UPI now or pay cash on delivery. No payment screenshot is required for COD.';
        }
    } else {
        console.log('💳 Online Payment detected');
    }
}

// Function to update total with COD charges
function updateTotalWithCOD() {
    const orderData = JSON.parse(sessionStorage.getItem('orderForPayment'));
    if (!orderData) return;
    
    const baseAmount = orderData.totalAmount;
    const codCharges = 20; // Fixed COD charge of ₹20 for all orders
    const finalAmount = baseAmount + codCharges;
    
    // Show COD charges row
    const codChargesRow = document.getElementById('cod-charges-row');
    const codChargesElement = document.getElementById('payment-cod-charges');
    const totalAmountElement = document.getElementById('payment-total-amount');
    
    if (codChargesRow && codChargesElement && totalAmountElement) {
        codChargesRow.style.display = 'flex';
        codChargesElement.textContent = `₹${codCharges}`;
        totalAmountElement.textContent = `₹${finalAmount.toLocaleString()}`;
    }
}

// Function to update total without COD charges
function updateTotalWithoutCOD() {
    const orderData = JSON.parse(sessionStorage.getItem('orderForPayment'));
    if (!orderData) return;
    
    const baseAmount = orderData.totalAmount;
    
    // Hide COD charges row
    const codChargesRow = document.getElementById('cod-charges-row');
    const totalAmountElement = document.getElementById('payment-total-amount');
    
    if (codChargesRow && totalAmountElement) {
        codChargesRow.style.display = 'none';
        totalAmountElement.textContent = `₹${baseAmount.toLocaleString()}`;
    }
}

function generatePaymentQR(orderData) {
    console.log('🔄 Generating UPI QR code for amount:', orderData.totalAmount);
    
    const primaryUpiId  = 'naveethulhussain700-4@okaxis';
    const merchantName  = 'Fourways International Trading';
    const amount        = orderData.totalAmount;
    const transactionNote = `Order-${orderData.orderId}`; // ← was broken before (appended on wrong line)

    // Standard UPI deep-link string
    const upiData = `upi://pay?pa=${primaryUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    console.log('📱 UPI Data:', upiData);
    console.log('💰 Total Amount:', amount);
    console.log('🆔 UPI ID:', primaryUpiId);

    const qrCodeElement = document.getElementById('payment-qr-code');
    if (!qrCodeElement) {
        console.error('❌ QR code element not found');
        return;
    }

    // Primary: api.qrserver.com  (reliable, no CORS issues)
    const primaryQrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiData)}&format=png&margin=10`;
    // Backup: Google Charts
    const backupQrUrl   = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiData)}&choe=UTF-8`;

    console.log('🔗 Primary QR URL:', primaryQrUrl);

    qrCodeElement.onload = function() {
        console.log('✅ UPI QR code loaded successfully');
        this.style.border  = '3px solid #28a745';
        this.style.display = 'block';

        const container = this.parentElement;
        let validationMsg = container.querySelector('.qr-validation');
        if (!validationMsg) {
            validationMsg = document.createElement('p');
            validationMsg.className = 'qr-validation';
            validationMsg.style.cssText = 'color:#28a745;font-weight:600;margin-top:10px;font-size:14px;';
            container.appendChild(validationMsg);
        }
        validationMsg.innerHTML = `✅ QR Code Ready — Amount: ₹${amount}`;
    };

    qrCodeElement.onerror = function() {
        console.error('❌ Primary QR service failed, trying backup...');
        this.onerror = function() {
            console.error('❌ Both QR services failed');
            this.style.display = 'none';
            const container = this.parentElement;
            container.innerHTML += `<div style="padding:20px;text-align:center;color:#dc3545;border:2px dashed #dc3545;border-radius:8px;margin-top:10px;">
                <p>⚠️ QR code could not load.</p>
                <p>Please use the <strong>UPI ID</strong> below to pay manually.</p>
            </div>`;
        };
        this.src = backupQrUrl;
    };

    qrCodeElement.src = primaryQrUrl;
    qrCodeElement.style.maxWidth = '250px';
    qrCodeElement.style.height  = 'auto';
}

// SIMPLE AND DIRECT PAYMENT APP OPENER - NO POPUPS
window.openPaymentAppDirect = function(appName) {
    console.log('🚀 Direct app opening:', appName);
    
    const orderData = JSON.parse(sessionStorage.getItem('orderForPayment'));
    if (!orderData) {
        console.error('❌ No order data found');
        return;
    }
    
    const upiId = 'naveethulhussain700-4@okaxis';
    const amount = orderData.totalAmount;
    const orderId = orderData.orderId;
    const note = `Order-${orderId}`;
    
    // SIMPLE URL CONSTRUCTION
    let url = '';
    let appDisplayName = '';
    
    if (appName === 'paytm') {
        // Try multiple Paytm URL schemes for better compatibility
        url = `paytmmp://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
        appDisplayName = 'Paytm';
        
        // Try primary Paytm URL
        try {
            window.location.href = url;
            console.log(`✅ ${appDisplayName} opening attempted with paytmmp://`);
        } catch (error) {
            // Fallback to alternative Paytm URL
            const altUrl = `paytm://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
            try {
                window.location.href = altUrl;
                console.log(`✅ ${appDisplayName} opening attempted with paytm://`);
            } catch (error2) {
                // Final fallback to generic UPI
                const genericUrl = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
                window.location.href = genericUrl;
                console.log(`✅ ${appDisplayName} opening attempted with generic UPI`);
            }
        }
        return; // Exit early for Paytm
    } else if (appName === 'gpay') {
        url = `tez://upi/pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
        appDisplayName = 'Google Pay';
    } else if (appName === 'phonepe') {
        url = `phonepe://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
        appDisplayName = 'PhonePe';
    } else {
        console.error('❌ Invalid app name');
        return;
    }
    
    console.log(`🔗 ${appDisplayName} URL:`, url);
    console.log(`💰 Amount: ₹${amount}`);
    
    // DIRECT OPENING - NO POPUPS
    try {
        window.location.href = url;
        console.log(`✅ ${appDisplayName} opening attempted`);
    } catch (error) {
        console.error(`❌ Error opening ${appDisplayName}:`, error);
        // Fallback - try generic UPI
        const genericUrl = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
        window.location.href = genericUrl;
    }
};

function payWithApp(appName) {
    console.log('🚀 Opening payment app:', appName);
    
    const orderData = JSON.parse(sessionStorage.getItem('orderForPayment'));
    if (!orderData) {
        console.error('❌ Order data not found. Please try again.');
        return;
    }
    
    const upiId = 'naveethulhussain700-4@okaxis';
    const amount = orderData.totalAmount;
    const orderId = orderData.orderId;
    const transactionNote = `Order-${orderId}`;
    
    // SIMPLE AND DIRECT APPROACH - NO POPUPS
    let appUrl = '';
    let appName_display = '';
    
    switch(appName) {
        case 'paytm':
            // Use multiple Paytm URL schemes for better compatibility
            appUrl = `paytmmp://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
            appName_display = 'Paytm';
            
            // Try Paytm with multiple fallbacks
            try {
                window.location.href = appUrl;
                console.log(`✅ ${appName_display} opening attempted with paytmmp://`);
            } catch (error) {
                // Try alternative Paytm URL
                const altUrl = `paytm://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
                try {
                    window.location.href = altUrl;
                    console.log(`✅ ${appName_display} opening attempted with paytm://`);
                } catch (error2) {
                    // Final fallback to generic UPI
                    const genericUrl = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
                    window.location.href = genericUrl;
                    console.log(`✅ ${appName_display} opening attempted with generic UPI`);
                }
            }
            return; // Exit early for Paytm
        case 'gpay':
            appUrl = `tez://upi/pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
            appName_display = 'Google Pay';
            break;
        case 'phonepe':
            appUrl = `phonepe://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
            appName_display = 'PhonePe';
            break;
        default:
            console.error('❌ Invalid payment app');
            return;
    }
    
    console.log(`🔗 ${appName_display} URL:`, appUrl);
    console.log(`💰 Amount: ₹${amount}`);
    console.log(`🆔 UPI ID: ${upiId}`);
    
    // DIRECT METHOD - NO POPUPS
    try {
        window.location.href = appUrl;
        console.log(`✅ ${appName_display} opening attempted`);
    } catch (error) {
        console.error(`❌ Error opening ${appName_display}:`, error);
        // Fallback - try generic UPI
        const genericUrl = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
        window.location.href = genericUrl;
    }
}

function copyUpiId() {
    const upiId = 'naveethulhussain700-4@okaxis'; // Updated to the working UPI ID
    
    // Try to copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(upiId).then(() => {
            console.log('✅ UPI ID copied to clipboard:', upiId);
            // Show visual feedback instead of popup
            const copyBtn = document.querySelector('.copy-upi-btn');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                copyBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
                }, 2000);
            }
        }).catch(() => {
            // Fallback for older browsers
            fallbackCopyUpiId(upiId);
        });
    } else {
        fallbackCopyUpiId(upiId);
    }
}

function fallbackCopyUpiId(upiId) {
    // Create temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = upiId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    console.log('✅ UPI ID copied to clipboard (fallback method):', upiId);
    
    // Show visual feedback instead of popup
    const copyBtn = document.querySelector('.copy-upi-btn');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
        }, 2000);
    }
}

function handleScreenshotUpload(event) {
    // Screenshot upload is no longer required
    alert('Screenshot upload is no longer required! Simply complete your UPI payment and click confirm order.');
    return;
}

function removeScreenshot() {
    // Screenshot upload is no longer required
    alert('Screenshot upload is no longer required! Simply complete your UPI payment and click confirm order.');
    return;
}

// Enhanced confirmPayment function with MongoDB integration
async function confirmPayment() {
    console.log('Confirming payment...');

    const orderData = JSON.parse(sessionStorage.getItem('orderForPayment'));
    if (!orderData) {
        alert('Order data not found. Please restart the order process.');
        window.location.href = 'products.html';
        return;
    }

    // ── Confirmation dialog ──────────────────────────────────────────────────
    const qty    = orderData.customerDetails?.quantity || 1;
    const name   = orderData.customerDetails?.customerName || 'Customer';
    const phone  = orderData.customerDetails?.customerPhone || '';
    const confirmMessage =
        `Confirm your order:\n\n` +
        `Order ID : ${orderData.orderId}\n` +
        `Product  : ${orderData.product?.name}\n` +
        `Quantity : ${qty}\n` +
        `Total    : ₹${(orderData.totalAmount || 0).toLocaleString()}\n\n` +
        `Customer : ${name}\n` +
        `Phone    : ${phone}\n\n` +
        `Click OK to confirm.`;

    if (!confirm(confirmMessage)) return;

    // Disable button to prevent double submit
    const btn = document.getElementById('confirm-payment-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Processing...'; }

    // ── Build final order object ─────────────────────────────────────────────
    const finalOrder = {
        ...orderData,
        status: orderData.paymentMethod === 'cod' ? 'cod' : 'pending',
        submittedAt: new Date().toISOString(),
        createdAt: orderData.timestamp || new Date().toISOString(),
        orderDate:  orderData.orderDate  || new Date().toISOString().split('T')[0],
        orderMonth: orderData.orderMonth || new Date().toISOString().slice(0, 7),
        customerDetails: {
            ...orderData.customerDetails,
            name:    orderData.customerDetails?.customerName    || '',
            email:   orderData.customerDetails?.customerEmail   || '',
            phone:   orderData.customerDetails?.customerPhone   || '',
            address: orderData.customerDetails?.deliveryAddress || '',
            quantity: qty,
            notes:   orderData.customerDetails?.orderNotes || '',
            total:   orderData.totalAmount
        }
    };

    // ── Step 1: Save to localStorage FIRST (guaranteed) ──────────────────────
    try {
        let customerOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        // Avoid duplicates
        if (!customerOrders.find(o => o.orderId === finalOrder.orderId)) {
            customerOrders.push(finalOrder);
            localStorage.setItem('customerOrders', JSON.stringify(customerOrders));
        }
        console.log('✅ Order saved to localStorage:', finalOrder.orderId);
    } catch (lsErr) {
        console.warn('⚠️ localStorage save failed:', lsErr);
    }

    // ── Step 2: Clear session storage ───────────────────────────────────────
    sessionStorage.removeItem('orderForPayment');
    sessionStorage.removeItem('currentOrder');

    // ── Step 3: Try MongoDB (non-blocking — don't wait for redirect) ─────────
    let savedToDb = false;
    try {
        if (window.apiService) {
            const result = await window.apiService.createOrder(finalOrder);
            savedToDb = !!(result && result.success);
            console.log(savedToDb ? '✅ Order saved to MongoDB' : '⚠️ MongoDB save returned failure');
        }
    } catch (dbErr) {
        console.warn('⚠️ MongoDB save failed (order already in localStorage):', dbErr.message);
    }

    // ── Step 4: Show success and redirect ───────────────────────────────────
    showOrderSuccessMessage(finalOrder, savedToDb ? 'database' : 'localStorage');
}

function showOrderSuccessMessage(order, saveLocation) {
    let locationMessage = '';
    if (saveLocation === 'database') {
        locationMessage = '✅ Your order has been saved to our database and will be processed immediately.';
    } else {
        locationMessage = '📱 Your order has been saved locally and will be synced to our database when available.';
    }
    
    alert(`Order confirmed successfully!

Order ID: ${order.orderId}
Product: ${order.product.name}
Total: ₹${order.totalAmount.toLocaleString()}

${locationMessage}

Thank you for your order! We will contact you shortly to confirm delivery details.

Payment Instructions:
• Please complete payment using the UPI QR code or UPI ID provided
• Keep your payment reference for tracking
• We will verify payment and process your order

Your order is now in our system and will be processed once payment is received.`);
    
    // Redirect to products page
    window.location.href = 'products.html';
}

// Make payment functions globally available
window.loadPaymentPage = loadPaymentPage;
window.populatePaymentInfo = populatePaymentInfo;
window.generatePaymentQR = generatePaymentQR;
window.payWithApp = payWithApp;
window.copyUpiId = copyUpiId;
window.handleScreenshotUpload = handleScreenshotUpload;
window.removeScreenshot = removeScreenshot;
window.confirmPayment = confirmPayment;

// Make functions globally available
window.loadOrderDetailsPage = loadOrderDetailsPage;
window.populateProductInfo = populateProductInfo;
window.setupOrderForm = setupOrderForm;
window.updateOrderSummary = updateOrderSummary;
window.handleOrderFormSubmit = handleOrderFormSubmit;

// Make functions globally available immediately
window.startOrderProcess = startOrderProcess;

// Add a simple test function
window.testBuyNow = function() {
    alert('Buy Now button clicked! Function is working.');
    console.log('Test function called');
    if (typeof products !== 'undefined' && products.length > 0) {
        console.log('Products available:', products.length);
        startOrderProcess('1');
    } else {
        alert('Products not loaded yet. Please refresh the page.');
    }
};

// Define modal functions
function closeOrderModal() {
    const modal = document.getElementById('order-details-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('order-success-modal');
    if (modal) modal.remove();
}

// Make modal functions globally available
window.closeOrderModal = closeOrderModal;
window.closePaymentModal = closePaymentModal;
window.closeSuccessModal = closeSuccessModal;

// Product Data - Load from localStorage or use defaults
// Enhanced product loading with MongoDB integration
async function loadProductsData() {
    try {
        console.log('🔄 Loading products from database...');
        
        // Try to load from MongoDB API first
        if (window.apiService) {
            const result = await window.apiService.getProducts();
            if (result.success && result.data) {
                console.log('✅ Products loaded from MongoDB:', result.data.length);
                
                // Convert database products to website format
                const websiteProducts = result.data.map(product => ({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    image: product.image,
                    image2: product.image2,
                    image3: product.image3,
                    description: product.description,
                    sizes: product.sizes || ["Standard"],
                    price: product.price,
                    cost: product.cost,
                    stock: product.stock
                }));
                
                // Save to localStorage for website use
                // Strip base64 image data to avoid exceeding localStorage quota (~5MB)
                function stripBase64(val) {
                    return (typeof val === 'string' && val.startsWith('data:')) ? '[uploaded-image]' : val;
                }
                const productsForStorage = websiteProducts.map(p => ({
                    ...p,
                    image: stripBase64(p.image),
                    image2: stripBase64(p.image2),
                    image3: stripBase64(p.image3)
                }));
                try {
                    localStorage.setItem('allProducts', JSON.stringify(productsForStorage));
                } catch (storageError) {
                    console.warn('⚠️ localStorage quota exceeded, clearing cache and retrying...');
                    localStorage.removeItem('allProducts');
                    localStorage.removeItem('adminProducts');
                    localStorage.removeItem('productUpdateEvent');
                    try {
                        localStorage.setItem('allProducts', JSON.stringify(productsForStorage));
                    } catch (e) {
                        console.warn('⚠️ Cannot write to localStorage even after clearing, continuing without cache');
                    }
                }
                console.log('✅ Products synced to localStorage for website:', websiteProducts.length);
                return websiteProducts;
            } else {
                console.log('⚠️ Failed to load from database, using fallback');
            }
        } else {
            console.log('⚠️ API Service not available');
        }
    } catch (error) {
        console.log('⚠️ MongoDB unavailable, using localStorage fallback:', error.message);
    }

    // Fallback to localStorage
    const savedProducts = localStorage.getItem('allProducts');
    if (savedProducts) {
        try {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                console.log('📱 Using products from localStorage:', parsed.length);
                return parsed;
            }
        } catch (e) {
            console.error('Error parsing saved products:', e);
        }
    }
    
    console.log('⚠️ No products found, returning empty array');
    return [];
}

// Initialize products variable
let products = [];

// Enhanced initialization with async product loading
async function initializeProducts() {
    try {
        console.log('🔄 Initializing products...');
        products = await loadProductsData();
        console.log('✅ Products initialized:', products.length);
        return products;
    } catch (error) {
        console.error('❌ Error initializing products:', error);
        // Fallback to empty array
        products = [];
        return products;
    }
}

// Track current filter state
let currentFilterCategory = 'all';

// Enhanced refreshProducts function with async support
async function refreshProducts() {
    try {
        console.log('🔄 Refreshing products...');
        const updatedProducts = await loadProductsData();
        
        // Update the global products array
        products.length = 0;
        products.push(...updatedProducts);
        
        console.log('✅ Products refreshed:', products.length);
        
        // Re-render products with current filter state
        if (document.getElementById('products-grid')) {
            console.log('Refreshing products with current filter:', currentFilterCategory);
            await renderAllProducts(currentFilterCategory);
        }
        if (document.getElementById('featured-grid')) {
            await renderFeaturedProducts();
        }
    } catch (error) {
        console.error('❌ Error refreshing products:', error);
    }
}

// Enhanced DOMContentLoaded Event with async product loading
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    
    // Clear product cache to ensure fresh data with correct sizes
    clearProductCache();
    
    // Initialize products first
    await initializeProducts();
    
    // Set up real-time product update listener
    window.addEventListener('productUpdated', async (event) => {
        console.log('🔄 Product update detected:', event.detail);
        await refreshProducts();
        showNotification('Products updated! New items are now available.', 'success');
    });
    
    // Listen for localStorage changes (cross-tab communication)
    window.addEventListener('storage', async (event) => {
        if (event.key === 'productUpdateEvent') {
            console.log('🔄 Product update from owner portal detected');
            await refreshProducts();
            showNotification('Products updated from owner portal!', 'success');
        }
    });
    
    initMobileMenu();

    // Check page context and render products
    if (document.getElementById('featured-grid')) {
        console.log('Featured grid found, rendering featured products');
        await renderFeaturedProducts();
    }

    if (document.querySelector('.hero-carousel')) {
        console.log('Hero carousel found, initializing');
        initCarousel();
    }

    if (document.getElementById('products-grid')) {
        console.log('Products grid found, rendering all products');
        await renderAllProducts('all');
        initFilters();
        
        // Set up periodic refresh for products (every 30 seconds)
        setInterval(async () => {
            await refreshProducts();
        }, 30000);
    }

    if (document.getElementById('product-detail-container')) {
        console.log('Product detail container found, loading details');
        await loadProductDetails();
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Scroll Animations
    initScrollAnimations();
});

// Make functions globally available
window.refreshProducts = refreshProducts;
window.loadProductsData = loadProductsData;
window.renderAllProducts = renderAllProducts;
window.initializeProducts = initializeProducts;
window.getCurrentFilter = () => currentFilterCategory;

// Simple notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.backgroundColor = '#007bff';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Make updateOrderTotal globally available
window.updateOrderTotal = updateOrderTotal;

// Scroll Reveal Logic
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach(el => observer.observe(el));
}

// Mobile Menu Toggle — handled by inline toggleNav() on each page
function initMobileMenu() {
    // Navigation is handled by toggleNav() / closeNav() inline functions
    // No conflicting listener needed here
}

// Carousel Logic
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!slides.length) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    let slideTimer;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Wrap around logic
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Auto Play
    function startTimer() {
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    function resetTimer() {
        clearInterval(slideTimer);
        startTimer();
    }

    // Start
    startTimer();
}

// Enhanced renderFeaturedProducts with async support
async function renderFeaturedProducts() {
    console.log('renderFeaturedProducts called');
    const grid = document.getElementById('featured-grid');
    if (!grid) {
        console.error('Featured grid not found');
        return;
    }

    // Ensure products are loaded
    if (!products || products.length === 0) {
        console.log('Products not loaded, initializing...');
        await initializeProducts();
    }

    const featured = products.slice(0, 3);
    console.log('Rendering featured products:', featured);
    grid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Enhanced renderAllProducts with async support
async function renderAllProducts(filterCategory) {
    console.log('renderAllProducts called with filter:', filterCategory);
    console.log('Products array:', products);
    
    // Update current filter state
    currentFilterCategory = filterCategory;
    
    const grid = document.getElementById('products-grid');
    if (!grid) {
        console.error('Products grid element not found!');
        return;
    }
    
    console.log('Products grid element found:', grid);

    // Ensure products are loaded
    if (!products || products.length === 0) {
        console.log('Products not loaded, initializing...');
        await initializeProducts();
    }

    let filtered = products;
    if (filterCategory !== 'all') {
        filtered = products.filter(p => {
            console.log(`Checking product: ${p.name}, category: ${p.category}, matches ${filterCategory}:`, p.category === filterCategory);
            return p.category === filterCategory;
        });
    }
    
    console.log('Filtered products for category', filterCategory, ':', filtered);
    console.log('Number of filtered products:', filtered.length);

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; padding: 40px;">No products found for category "${filterCategory}".</p>`;
        return;
    }

    grid.innerHTML = filtered.map(product => createProductCard(product)).join('');
    console.log('Products rendered successfully for category:', filterCategory);
}

// Init Filter Buttons
// Enhanced initFilters function with async support
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    console.log('Initializing filter buttons:', buttons.length);
    
    buttons.forEach(btn => {
        const category = btn.getAttribute('data-filter');
        console.log('Filter button found:', category);
        
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Filter button clicked:', category);
            
            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update current filter state and render products
            currentFilterCategory = category;
            await renderAllProducts(category);
        });
    });
    
    // Ensure "All" is selected by default
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton && !document.querySelector('.filter-btn.active')) {
        allButton.classList.add('active');
        currentFilterCategory = 'all';
    }
}

// Load Product Details
// Enhanced loadProductDetails function with async support
async function loadProductDetails() {
    const container = document.getElementById('product-detail-container');
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')); // ID is number in our data

    // Ensure products are loaded
    if (!products || products.length === 0) {
        console.log('Products not loaded, initializing...');
        await initializeProducts();
    }

    const product = products.find(p => p.id === id);

    if (!product) {
        container.innerHTML = '<div class="text-center"><h2>Product Not Found</h2><a href="products.html" class="btn btn-primary">Back to Products</a></div>';
        return;
    }

    // Generate Size Options — always just "Standard"
    const sizeOptions = '<option value="Standard">Standard</option>';

    const detailImages = [product.image, product.image2, product.image3].filter(img => {
        if (!img || typeof img !== 'string' || img.length < 4) return false;
        if (img === '[uploaded-image]') return false;
        if (img.startsWith('data:')) return false;
        return true;
    });
    const imagesHtml = detailImages.map(img => `<img src="${img}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`).join('');

    const productPrice = product.price || 0;

    const html = `
        <div class="detail-wrapper">
            <div class="detail-image">
                ${imagesHtml}
            </div>
            <div class="detail-content">
                <span class="product-category">${product.category}</span>
                <h1>${product.name}</h1>
                <p class="description">${product.description}</p>

                <div class="spec-group">
                    <label for="size-select">Select Variant:</label>
                    <select id="size-select" class="size-select">
                        ${sizeOptions}
                    </select>
                </div>

                <!-- ★ QUANTITY SELECTOR ★ -->
                <div class="quantity-section" style="
                    background: linear-gradient(135deg, #f0f4fc 0%, #e8f5ec 100%);
                    border: 2px solid #0A2A6B;
                    border-radius: 14px;
                    padding: 20px 22px;
                    margin: 22px 0;
                    box-shadow: 0 4px 16px rgba(10, 42, 107,0.10);
                ">
                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;">
                        <div>
                            <div style="font-size:0.78rem; font-weight:700; color:#5FA8FF; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:4px;">
                                ★ Required
                            </div>
                            <label for="detail-quantity" style="font-size:1.15rem; font-weight:800; color:#0A2A6B; display:block; margin-bottom:0;">
                                Quantity *
                            </label>
                        </div>
                        <div style="display:flex; align-items:center; gap:0; border:2px solid #0A2A6B; border-radius:10px; overflow:hidden; background:#fff;">
                            <button type="button" onclick="changeDetailQty(-1, 0)" style="
                                width:44px; height:44px; background:#0A2A6B; color:#fff;
                                border:none; font-size:1.4rem; cursor:pointer;
                                display:flex; align-items:center; justify-content:center;
                                transition:background 0.2s; font-weight:700;
                            " onmouseover="this.style.background='#5FA8FF'" onmouseout="this.style.background='#0A2A6B'">−</button>
                            <input type="number" id="detail-quantity" value="1" min="1" max="9999"
                                style="
                                    width:70px; height:44px; text-align:center;
                                    border:none; outline:none; font-size:1.2rem;
                                    font-weight:800; color:#0A2A6B;
                                "
                                oninput="updateDetailTotal(0)"
                                onchange="updateDetailTotal(0)"
                            >
                            <button type="button" onclick="changeDetailQty(1, 0)" style="
                                width:44px; height:44px; background:#0A2A6B; color:#fff;
                                border:none; font-size:1.4rem; cursor:pointer;
                                display:flex; align-items:center; justify-content:center;
                                transition:background 0.2s; font-weight:700;
                            " onmouseover="this.style.background='#5FA8FF'" onmouseout="this.style.background='#0A2A6B'">+</button>
                        </div>
                    </div>
                </div>
                <!-- ★ END QUANTITY SELECTOR ★ -->

                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="sendWhatsAppEnquiry('${product.name}', '${product.id}')">Enquiry Now</button>
                    <a href="contact.html?subject=${encodeURIComponent(product.name)}" class="btn btn-secondary">Contact Sales</a>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Handle Contact Form
function handleContactForm(e) {
    e.preventDefault();
    // Simulate submission
    alert('Thank you! Your message has been sent successfully. We will contact you shortly.');
    e.target.reset();
}

// Quantity stepper helpers for product detail page
function changeDetailQty(delta, unitPrice) {
    const input = document.getElementById('detail-quantity');
    if (!input) return;
    const newVal = Math.max(1, (parseInt(input.value) || 1) + delta);
    input.value = newVal;
    updateDetailTotal(unitPrice);
}

function updateDetailTotal(unitPrice) {
    const input = document.getElementById('detail-quantity');
    if (!input) return;
    const qty = parseInt(input.value) || 1;
    const total = qty * unitPrice;
    const amountEl = document.getElementById('detail-total-amount');
    if (amountEl) amountEl.textContent = total.toLocaleString();
    const display = document.getElementById('detail-total-display');
    if (display) {
        const hint = display.querySelector('span:last-child');
        if (hint) hint.textContent = `(${qty} × ₹${unitPrice.toLocaleString()})`;
    }
}

// WhatsApp Enquiry Function
function sendWhatsAppEnquiry(productName, productId) {
    const phoneNumber = "33605705699";
    const qtyInput = document.getElementById('detail-quantity');
    const quantity = qtyInput ? qtyInput.value : 1;
    
    const message = `Hello Fourways International Trading, I'm interested in the product: ${productName} (ID: ${productId}). 
Quantity: ${quantity}
Could you please provide more details?`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

window.changeDetailQty = changeDetailQty;
window.updateDetailTotal = updateDetailTotal;
window.sendWhatsAppEnquiry = sendWhatsAppEnquiry;

// Buy Now Ordering System Functions

function showOrderDetailsModal() {
    console.log('showOrderDetailsModal called');
    console.log('currentOrder:', currentOrder);
    
    if (!currentOrder) {
        console.error('No current order found');
        alert('Error: No order data found. Please try again.');
        return;
    }
    
    const modal = document.getElementById('order-details-modal');
    if (!modal) {
        console.log('Modal not found, creating new modal');
        createOrderDetailsModal();
        return;
    }
    
    console.log('Modal found, populating data');
    try {
        // Populate product info
        document.getElementById('order-product-name').textContent = currentOrder.product.name;
        document.getElementById('order-product-image').src = currentOrder.product.image;
        document.getElementById('order-product-price').textContent = `₹${getProductPrice(currentOrder.product.id)}`;
        
        // Update total
        updateOrderTotal();
        
        console.log('Showing modal');
        modal.style.display = 'block';
        modal.classList.add('show');
        
        // Add success feedback
        console.log('Modal should now be visible');
        
    } catch (error) {
        console.error('Error populating modal:', error);
        alert('Error displaying order form. Please try again.');
    }
}

function createOrderDetailsModal() {
    console.log('createOrderDetailsModal called');
    
    const modalHTML = `
        <div id="order-details-modal" class="modal">
            <div class="modal-content order-modal">
                <div class="modal-header">
                    <h3>Order Details</h3>
                    <span class="close" onclick="closeOrderModal()">&times;</span>
                </div>
                <div class="order-modal-body">
                    <div class="product-summary">
                        <img id="order-product-image" src="" alt="Product" class="order-product-img">
                        <div class="product-info">
                            <h4 id="order-product-name"></h4>
                            <div class="price" id="order-product-price"></div>
                        </div>
                    </div>
                    
                    <form id="order-details-form" class="order-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customer-name">Full Name *</label>
                                <input type="text" id="customer-name" required>
                            </div>
                            <div class="form-group">
                                <label for="customer-phone">Phone Number *</label>
                                <input type="tel" id="customer-phone" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-email">Email Address *</label>
                            <input type="email" id="customer-email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="delivery-address">Delivery Address *</label>
                            <textarea id="delivery-address" rows="3" required placeholder="Enter complete delivery address"></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="order-quantity">Quantity *</label>
                                <input type="number" id="order-quantity" min="1" value="1" required onchange="updateOrderTotal()">
                            </div>
                            <div class="form-group">
                                <label for="order-total">Total Amount</label>
                                <input type="text" id="order-total" readonly>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="order-notes">Special Instructions (Optional)</label>
                            <textarea id="order-notes" rows="2" placeholder="Any special delivery instructions..."></textarea>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="closeOrderModal()">Cancel</button>
                            <button type="submit" class="btn-primary">Proceed to Payment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    console.log('Adding modal HTML to body');
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submit handler
    console.log('Adding form submit handler');
    const form = document.getElementById('order-details-form');
    if (form) {
        form.addEventListener('submit', handleOrderDetails);
    }
    
    // Populate product info and show modal
    console.log('Populating product info and showing modal');
    setTimeout(() => {
        // Populate product info
        const productName = document.getElementById('order-product-name');
        const productImage = document.getElementById('order-product-image');
        const productPrice = document.getElementById('order-product-price');
        
        if (productName && productImage && productPrice && currentOrder) {
            productName.textContent = currentOrder.product.name;
            productImage.src = currentOrder.product.image;
            productPrice.textContent = `₹${getProductPrice(currentOrder.product.id)}`;
            
            // Update total
            updateOrderTotal();
            
            // Show modal
            const modal = document.getElementById('order-details-modal');
            if (modal) {
                modal.style.display = 'block';
                modal.classList.add('show');
                console.log('Modal displayed successfully');
            }
        }
    }, 100);
}

function updateOrderTotal() {
    const quantity = parseInt(document.getElementById('order-quantity').value) || 1;
    const price = getProductPrice(currentOrder.product.id);
    const total = quantity * price;
    document.getElementById('order-total').value = `₹${total.toLocaleString()}`;
}

function getProductPrice(productId) {
    // First try to get price from loaded products array
    if (products && products.length > 0) {
        const product = products.find(p => p.id == productId || p.id === String(productId));
        if (product && product.price) {
            console.log(`Found price for product ${productId}: ₹${product.price}`);
            return product.price;
        }
    }
    
    // Fallback to localStorage products
    try {
        const storedProducts = JSON.parse(localStorage.getItem('allProducts') || '[]');
        const product = storedProducts.find(p => p.id == productId || p.id === String(productId));
        if (product && product.price) {
            console.log(`Found price in localStorage for product ${productId}: ₹${product.price}`);
            return product.price;
        }
    } catch (error) {
        console.error('Error reading products from localStorage:', error);
    }
    
    // Final fallback if no price is found anywhere
    const fallbackPrice = 0;
    console.warn(`⚠️ No price found for product ${productId}, using fallback: ₹${fallbackPrice}`);
    return fallbackPrice;
}

function handleOrderDetails(e) {
    e.preventDefault();
    
    // Collect order details
    currentOrder.customerDetails = {
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('delivery-address').value,
        quantity: parseInt(document.getElementById('order-quantity').value),
        total: getProductPrice(currentOrder.product.id) * parseInt(document.getElementById('order-quantity').value),
        notes: document.getElementById('order-notes').value
    };
    
    closeOrderModal();
    showPaymentModal();
}

function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (!modal) {
        createPaymentModal();
        return;
    }
    
    // Update payment details
    document.getElementById('payment-order-id').textContent = currentOrder.orderId;
    document.getElementById('payment-amount').textContent = `₹${currentOrder.customerDetails.total.toLocaleString()}`;
    document.getElementById('payment-product').textContent = currentOrder.product.name;
    
    // Generate QR code (using a QR code service)
    const qrData = `upi://pay?pa=fourwaysinternational@paytm&pn=Fourways International Trading&am=${currentOrder.customerDetails.total}&cu=INR&tn=Order ${currentOrder.orderId}`;
    document.getElementById('payment-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    
    modal.style.display = 'block';
}

function createPaymentModal() {
    const modalHTML = `
        <div id="payment-modal" class="modal">
            <div class="modal-content payment-modal">
                <div class="modal-header">
                    <h3>Payment</h3>
                    <span class="close" onclick="closePaymentModal()">&times;</span>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-summary">
                        <h4>Order Summary</h4>
                        <div class="summary-row">
                            <span>Order ID:</span>
                            <span id="payment-order-id"></span>
                        </div>
                        <div class="summary-row">
                            <span>Product:</span>
                            <span id="payment-product"></span>
                        </div>
                        <div class="summary-row total">
                            <span>Total Amount:</span>
                            <span id="payment-amount"></span>
                        </div>
                    </div>
                    
                    <div class="payment-methods">
                        <h4>Payment Options</h4>
                        
                        <div class="payment-option active" onclick="selectPaymentMethod('upi')">
                            <div class="payment-header">
                                <input type="radio" name="payment" value="upi" checked>
                                <label>UPI Payment</label>
                            </div>
                            <div class="upi-details">
                                <div class="qr-section">
                                    <img id="payment-qr" src="" alt="QR Code" class="payment-qr">
                                    <p>Scan QR code with any UPI app</p>
                                </div>
                                <div class="upi-apps">
                                    <p>Or pay directly using:</p>
                                    <div class="app-buttons">
                                        <button class="upi-app paytm" onclick="payWithApp('paytm')">
                                            <div class="app-icon">
                                                <img src="https://logoeps.com/wp-content/uploads/2013/03/paytm-vector-logo.png" alt="Paytm" class="app-logo">
                                            </div>
                                            <span>Paytm</span>
                                        </button>
                                        <button class="upi-app gpay" onclick="payWithApp('gpay')">
                                            <div class="app-icon">
                                                <img src="https://developers.google.com/pay/api/images/brand-guidelines/google-pay-mark.png" alt="Google Pay" class="app-logo">
                                            </div>
                                            <span>Google Pay</span>
                                        </button>
                                        <button class="upi-app phonepe" onclick="payWithApp('phonepe')">
                                            <div class="app-icon">
                                                <img src="https://www.phonepe.com/webstatic/6.8.0/images/phonepe-logo-big.svg" alt="PhonePe" class="app-logo">
                                            </div>
                                            <span>PhonePe</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="upi-id">
                                    <p><strong>UPI ID:</strong> fourwaysinternational@paytm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="screenshot-upload">
                        <h4>Upload Payment Screenshot</h4>
                        <div class="upload-area" onclick="document.getElementById('screenshot-input').click()">
                            <div class="upload-content">
                                <div class="upload-icon">📷</div>
                                <p>Click to upload payment screenshot</p>
                                <small>Supported: JPG, PNG (Max 5MB)</small>
                            </div>
                            <input type="file" id="screenshot-input" accept="image/*" style="display: none;" onchange="handleScreenshotUpload(event)">
                        </div>
                        <div id="screenshot-preview" class="screenshot-preview" style="display: none;">
                            <img id="preview-image" src="" alt="Screenshot">
                            <button class="remove-screenshot" onclick="removeScreenshot()">&times;</button>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="closePaymentModal()">Cancel</button>
                        <button type="button" class="btn-primary" id="confirm-order-btn" onclick="confirmOrder()" disabled>Confirm Order</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    setTimeout(() => showPaymentModal(), 100);
}

function selectPaymentMethod(method) {
    // For now, only UPI is implemented
    console.log('Selected payment method:', method);
}

function payWithApp(app) {
    const amount = currentOrder.customerDetails.total;
    const orderId = currentOrder.orderId;
    
    let url = '';
    switch(app) {
        case 'paytm':
            url = `paytmmp://pay?pa=fourwaysinternational@paytm&pn=Fourways International Trading&am=${amount}&cu=INR&tn=Order ${orderId}`;
            break;
        case 'gpay':
            url = `tez://upi/pay?pa=fourwaysinternational@paytm&pn=Fourways International Trading&am=${amount}&cu=INR&tn=Order ${orderId}`;
            break;
        case 'phonepe':
            url = `phonepe://pay?pa=fourwaysinternational@paytm&pn=Fourways International Trading&am=${amount}&cu=INR&tn=Order ${orderId}`;
            break;
    }
    
    // Try to open the app
    window.location.href = url;
    
    // Fallback message
    setTimeout(() => {
        alert(`If ${app} didn't open automatically, please use the QR code or UPI ID to make payment.`);
    }, 2000);
}

async function confirmOrder() {
    let finalOrder;
    
    try {
        // Create final order object
        finalOrder = {
            ...currentOrder,
            status: 'screenshot', // Valid status from enum
            createdAt: new Date().toISOString(),
            paymentScreenshot: currentOrder.screenshot
        };
        
        console.log('📤 Confirming order:', finalOrder);
        
        // Check if API service is available
        if (!window.apiService) {
            throw new Error('API Service not available');
        }
        
        // Send order to server/database via API service
        console.log('🔄 Calling apiService.createOrder...');
        const result = await window.apiService.createOrder(finalOrder);
        console.log('📡 API Response:', result);
        
        if (result.success) {
            console.log('✅ Order successfully saved to database');
            
            // Close modal and show success
            closePaymentModal();
            showOrderSuccess();
            
            // Reset current order
            currentOrder = null;
            
            // Show success message with database confirmation
            setTimeout(() => {
                alert('✅ Order saved to database successfully!\n\nOrder ID: ' + finalOrder.orderId + '\n\nYou can now check the Owner Portal to see your order.');
            }, 1000);
            
        } else {
            console.error('❌ Failed to save order:', result.message);
            throw new Error('Database save failed: ' + result.message);
        }
        
    } catch (error) {
        console.error('❌ Order confirmation error:', error);
        
        // Fallback: Store order in localStorage only
        console.log('⚠️ Falling back to localStorage storage');
        let orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        orders.push(finalOrder);
        localStorage.setItem('customerOrders', JSON.stringify(orders));
        
        // Close modal and show success
        closePaymentModal();
        showOrderSuccess();
        
        // Reset current order
        currentOrder = null;
        
        // Show warning about offline mode
        setTimeout(() => {
            alert('⚠️ Order saved locally only!\n\nDatabase Error: ' + error.message + '\n\nOrder ID: ' + (finalOrder ? finalOrder.orderId : 'N/A') + '\n\nPlease contact support or try again later.');
        }, 1000);
    }
}

function showOrderSuccess() {
    const successHTML = `
        <div id="order-success-modal" class="modal">
            <div class="modal-content success-modal">
                <div class="success-content">
                    <div class="success-icon">✅</div>
                    <h3>Order Confirmed!</h3>
                    <p>Your order has been successfully placed.</p>
                    <p>Order ID: <strong>${currentOrder ? currentOrder.orderId : 'N/A'}</strong></p>
                    <p>We will contact you shortly to confirm delivery details.</p>
                    <button class="btn-primary" onclick="closeSuccessModal()">Continue Shopping</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    document.getElementById('order-success-modal').style.display = 'block';
}

// Make all modal functions globally available
window.selectPaymentMethod = selectPaymentMethod;
window.payWithApp = payWithApp;
window.handleScreenshotUpload = handleScreenshotUpload;
window.removeScreenshot = removeScreenshot;
window.confirmOrder = confirmOrder;

// Additional modal functions defined above

// Helper: Create HTML for a Product Card
function createProductCard(product) {
    console.log('Creating product card for:', product.name, 'ID:', product.id);
    const productPrice = product.price || getProductPrice(product.id);
    
    // Collect valid images — accept http URLs and local /uploads/ paths
    const images = [product.image, product.image2, product.image3].filter(img => {
        if (!img || typeof img !== 'string' || img.length < 4) return false;
        if (img === '[uploaded-image]') return false;
        if (img.startsWith('data:')) return false;
        return true; // accepts http:// and /uploads/
    });
    const pid = product.id;

    let imageContent;
    if (images.length > 1) {
        const slides = images.map((img, i) => `
            <div class="pc-slide" data-index="${i}" style="
                flex: 0 0 100%; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center; overflow: hidden;
            ">
                <img src="${img}" alt="${product.name} image ${i + 1}" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
        `).join('');

        const dots = images.map((_, i) => `
            <span class="pc-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" onclick="event.stopPropagation();pcGoTo('${pid}',${i})" style="
                display:inline-block;width:8px;height:8px;border-radius:50%;
                background:${i === 0 ? '#fff' : 'rgba(255,255,255,0.45)'};
                margin:0 3px;cursor:pointer;transition:background .2s;
            "></span>
        `).join('');

        imageContent = `
            <div class="pc-carousel" id="pc-${pid}" data-current="0" style="position:relative;width:100%;height:100%;overflow:hidden;">
                <div class="pc-track" id="pc-track-${pid}" style="
                    display:flex;height:100%;
                    transition:transform .35s ease;
                    will-change:transform;
                ">
                    ${slides}
                </div>

                <!-- Prev button -->
                <button onclick="event.preventDefault();event.stopPropagation();pcPrev('${pid}')" style="
                    position:absolute;left:0;top:0;bottom:0;width:36px;
                    background:rgba(0,0,0,0.25);border:none;cursor:pointer;
                    color:#fff;font-size:18px;display:flex;align-items:center;
                    justify-content:center;opacity:0;transition:opacity .2s;z-index:2;
                " class="pc-btn pc-btn-prev" aria-label="Previous image">&#8249;</button>

                <!-- Next button -->
                <button onclick="event.preventDefault();event.stopPropagation();pcNext('${pid}')" style="
                    position:absolute;right:0;top:0;bottom:0;width:36px;
                    background:rgba(0,0,0,0.25);border:none;cursor:pointer;
                    color:#fff;font-size:18px;display:flex;align-items:center;
                    justify-content:center;opacity:0;transition:opacity .2s;z-index:2;
                " class="pc-btn pc-btn-next" aria-label="Next image">&#8250;</button>

                <!-- Dots -->
                <div style="
                    position:absolute;bottom:8px;left:0;right:0;
                    display:flex;justify-content:center;align-items:center;z-index:2;
                " id="pc-dots-${pid}">
                    ${dots}
                </div>
            </div>`;
    } else {
        imageContent = `<img src="${images[0] || ''}" alt="${product.name}" class="product-image" style="display:block;width:100%;height:100%;object-fit:cover;">`;
    }

    return `
        <div class="product-card"
             onmouseenter="pcShowBtns('${pid}')"
             onmouseleave="pcHideBtns('${pid}')">
            <div class="card-image-wrapper" style="cursor:pointer;padding:0;overflow:hidden;">
                ${imageContent}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-actions">
                    <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                    <button class="btn btn-primary" onclick="sendWhatsAppEnquiry('${product.name}', '${product.id}')">Enquiry Now</button>
                </div>
            </div>
        </div>
    `;
}

/* ── Product Card Carousel helpers (global) ── */
function pcGoTo(pid, index) {
    const carousel = document.getElementById('pc-' + pid);
    const track    = document.getElementById('pc-track-' + pid);
    const dotsEl   = document.getElementById('pc-dots-' + pid);
    if (!carousel || !track) return;

    const total = track.children.length;
    index = ((index % total) + total) % total;   // wrap around
    carousel.dataset.current = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    if (dotsEl) {
        [...dotsEl.querySelectorAll('.pc-dot')].forEach((d, i) => {
            d.style.background = i === index ? '#fff' : 'rgba(255,255,255,0.45)';
            d.classList.toggle('active', i === index);
        });
    }
}
function pcNext(pid) {
    const carousel = document.getElementById('pc-' + pid);
    if (!carousel) return;
    pcGoTo(pid, parseInt(carousel.dataset.current || 0) + 1);
}
function pcPrev(pid) {
    const carousel = document.getElementById('pc-' + pid);
    if (!carousel) return;
    pcGoTo(pid, parseInt(carousel.dataset.current || 0) - 1);
}
function pcShowBtns(pid) {
    const el = document.getElementById('pc-' + pid);
    if (!el) return;
    el.querySelectorAll('.pc-btn').forEach(b => b.style.opacity = '1');
}
function pcHideBtns(pid) {
    const el = document.getElementById('pc-' + pid);
    if (!el) return;
    el.querySelectorAll('.pc-btn').forEach(b => b.style.opacity = '0');
}

// Expose carousel helpers globally
window.pcGoTo = pcGoTo;
window.pcNext = pcNext;
window.pcPrev = pcPrev;
window.pcShowBtns = pcShowBtns;
window.pcHideBtns = pcHideBtns;

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Security measures
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        console.log('Developer tools disabled for security.');
    }
});

console.log('Fourways International Trading script loaded successfully!');
// Function to clear cached product data and reload fresh
function clearProductCache() {
    localStorage.removeItem('allProducts');
    localStorage.removeItem('productsLastUpdated');
    console.log('🧹 Product cache cleared');
}

// Function to force refresh products from server
async function forceRefreshProducts() {
    clearProductCache();
    products = await loadProductsData();
    console.log('🔄 Products force refreshed:', products.length);
    return products;
}

// Make functions available globally
window.clearProductCache = clearProductCache;
window.forceRefreshProducts = forceRefreshProducts;