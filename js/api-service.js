/* API Service for Fourways International Trading - MongoDB Integration */

// Helper: strip base64 image data before writing to localStorage to avoid quota errors
function _stripBase64ForStorage(val) {
    return (typeof val === 'string' && val.startsWith('data:')) ? '[uploaded-image]' : val;
}
function _safeSetProducts(products) {
    const safe = products.map(p => ({
        ...p,
        image:  _stripBase64ForStorage(p.image),
        image2: _stripBase64ForStorage(p.image2),
        image3: _stripBase64ForStorage(p.image3)
    }));
    try {
        localStorage.setItem('allProducts', JSON.stringify(safe));
    } catch (e) {
        console.warn('⚠️ localStorage quota exceeded, clearing product cache and retrying...');
        localStorage.removeItem('allProducts');
        localStorage.removeItem('adminProducts');
        localStorage.removeItem('productUpdateEvent');
        try { localStorage.setItem('allProducts', JSON.stringify(safe)); } catch (_) {}
    }
}

class APIService {
    constructor() {
        // Auto-detect environment and set appropriate server URL
        this.baseURL = this.getServerURL();
        this.fallbackToLocalStorage = false; // DISABLED - Force database storage
        this.serverConnected = false;
        this.databaseOnlyMode = true; // NEW - Force database-only operations
    }

    // Determine the correct server URL based on environment
    getServerURL() {
        const currentHost = window.location.hostname;
        const currentProtocol = window.location.protocol;
        
        // If running on localhost, use local server
        if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        
        // If running on production (Render), use production server
        if (currentHost.includes('onrender.com')) {
            return `${currentProtocol}//${currentHost}/api`;
        }
        
        // Default fallback to current domain
        return `${currentProtocol}//${currentHost}/api`;
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            
            if (!response.ok) {
                let errorMsg = data.message || 'API call failed';
                if (data.errors) errorMsg += `: ${data.errors.join(', ')}`;
                if (data.error) errorMsg += ` (${data.error})`;
                throw new Error(errorMsg);
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            
            // REMOVED: Automatic fallback to localStorage
            // In database-only mode, we throw the error instead of falling back
            if (this.databaseOnlyMode) {
                throw new Error(`Database operation failed: ${error.message}`);
            }
            
            // Only fallback if explicitly enabled (for backward compatibility)
            if (this.fallbackToLocalStorage) {
                console.log('Falling back to localStorage...');
                return this.handleFallback(endpoint, options);
            }
            
            throw error;
        }
    }

    // Fallback to localStorage when API is unavailable
    handleFallback(endpoint, options) {
        console.log('Using localStorage fallback for:', endpoint, options.method || 'GET');
        
        if (endpoint === '/products' && (!options.method || options.method === 'GET')) {
            return {
                success: true,
                data: JSON.parse(localStorage.getItem('allProducts') || '[]'),
                fallback: true,
                message: 'Loaded from localStorage (database unavailable)'
            };
        }
        
        if (endpoint === '/orders' && (!options.method || options.method === 'GET')) {
            return {
                success: true,
                data: JSON.parse(localStorage.getItem('customerOrders') || '[]'),
                fallback: true,
                message: 'Loaded from localStorage (database unavailable)'
            };
        }

        if (endpoint === '/products' && options.method === 'POST') {
            try {
                const productData = JSON.parse(options.body);
                const products = JSON.parse(localStorage.getItem('allProducts') || '[]');
                const newId = Math.max(...products.map(p => parseInt(p.id) || 0), 0) + 1;
                const newProduct = { ...productData, id: newId };
                products.push(newProduct);
                _safeSetProducts(products);
                
                return {
                    success: true,
                    data: newProduct,
                    fallback: true,
                    message: 'Product created locally (database unavailable)'
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Failed to create product locally: ' + error.message,
                    fallback: true
                };
            }
        }

        if (endpoint === '/orders' && options.method === 'POST') {
            try {
                const orderData = JSON.parse(options.body);
                const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
                orders.push(orderData);
                localStorage.setItem('customerOrders', JSON.stringify(orders));
                
                return {
                    success: true,
                    data: orderData,
                    fallback: true,
                    message: 'Order created locally (database unavailable)'
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Failed to create order locally: ' + error.message,
                    fallback: true
                };
            }
        }
        
        return {
            success: false,
            message: 'API unavailable and no fallback available for this operation',
            fallback: true
        };
    }

    // Products API
    async getProducts(category = null) {
        const endpoint = category ? `/products?category=${category}` : '/products';
        const result = await this.apiCall(endpoint);
        
        // DON'T automatically update localStorage here
        // Let the calling code decide when to sync to localStorage
        // This prevents unwanted overwrites and duplicates
        
        return result;
    }

    async getProduct(id) {
        const result = await this.apiCall(`/products/${id}`);
        return result;
    }

    async createProduct(productData) {
        try {
            console.log('📤 Creating product in database:', productData);
            
            const result = await this.apiCall('/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            
            if (result.success) {
                console.log('✅ Product successfully saved to MongoDB database');
                // Update localStorage cache ONLY after successful database save
                const products = JSON.parse(localStorage.getItem('allProducts') || '[]');
                products.push(result.data);
                _safeSetProducts(products);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Database product creation failed:', error);
            throw new Error(`Failed to save product to database: ${error.message}`);
        }
    }

    async updateProduct(id, productData) {
        try {
            const result = await this.apiCall(`/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            
            // DON'T update localStorage here - let the owner portal handle syncing
            // This prevents duplicates and ensures consistency
            
            return result;
        } catch (error) {
            console.error('Update product error:', error);
            
            // Fallback: update in localStorage only
            if (this.fallbackToLocalStorage) {
                const products = JSON.parse(localStorage.getItem('allProducts') || '[]');
                const index = products.findIndex(p => p.id == id);
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                    _safeSetProducts(products);
                    
                    return {
                        success: true,
                        data: products[index],
                        fallback: true,
                        message: 'Product updated locally (database unavailable)'
                    };
                } else {
                    return {
                        success: false,
                        message: 'Product not found',
                        fallback: true
                    };
                }
            }
            
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await this.apiCall(`/products/${id}`, {
                method: 'DELETE'
            });
            
            // DON'T update localStorage here - let the owner portal handle syncing
            // This prevents inconsistencies and ensures proper data flow
            
            return result;
        } catch (error) {
            console.error('Delete product error:', error);
            
            // Fallback: delete from localStorage only
            if (this.fallbackToLocalStorage) {
                const products = JSON.parse(localStorage.getItem('allProducts') || '[]');
                const index = products.findIndex(p => p.id == id);
                if (index !== -1) {
                    const deletedProduct = products.splice(index, 1)[0];
                    _safeSetProducts(products);
                    
                    return {
                        success: true,
                        data: deletedProduct,
                        fallback: true,
                        message: 'Product deleted locally (database unavailable)'
                    };
                } else {
                    return {
                        success: false,
                        message: 'Product not found',
                        fallback: true
                    };
                }
            }
            
            throw error;
        }
    }

    async deleteOrder(orderId) {
        try {
            console.log(`🗑️ API Request: Deleting order ${orderId}`);
            const result = await this.apiCall(`/orders/${orderId}`, {
                method: 'DELETE'
            });
            return result;
        } catch (error) {
            console.error('Delete order error:', error);
            throw error;
        }
    }

    // Orders API
    async getOrders(filters = {}) {
        let endpoint = '/orders';
        const params = new URLSearchParams();
        
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        if (params.toString()) {
            endpoint += '?' + params.toString();
        }
        
        const result = await this.apiCall(endpoint);
        
        // Update localStorage cache
        if (result.success && result.data) {
            localStorage.setItem('customerOrders', JSON.stringify(result.data));
        }
        
        return result;
    }

    async getOrder(orderId) {
        const result = await this.apiCall(`/orders/${orderId}`);
        return result;
    }

    async createOrder(orderData) {
        try {
            // Ensure the order data matches the expected schema
            const formattedOrderData = {
                orderId: orderData.orderId,
                product: {
                    id: orderData.product.id,
                    name: orderData.product.name,
                    category: orderData.product.category,
                    image: orderData.product.image,
                    description: orderData.product.description
                },
                customerDetails: {
                    customerName: orderData.customerDetails.customerName || orderData.customerDetails.name,
                    customerEmail: orderData.customerDetails.customerEmail || orderData.customerDetails.email,
                    customerPhone: orderData.customerDetails.customerPhone || orderData.customerDetails.phone,
                    deliveryAddress: orderData.customerDetails.deliveryAddress || orderData.customerDetails.address,
                    quantity: orderData.customerDetails.quantity,
                    orderNotes: orderData.customerDetails.orderNotes || orderData.customerDetails.notes || ''
                },
                unitPrice: orderData.unitPrice,
                totalAmount: orderData.totalAmount,
                status: orderData.status || 'pending',
                productSize: orderData.productSize || 'Standard',
                paymentScreenshot: orderData.paymentScreenshot || null,
                orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
                orderMonth: orderData.orderMonth || new Date().toISOString().slice(0, 7),
                submittedAt: orderData.submittedAt || new Date(),
                createdAt: orderData.createdAt || new Date().toISOString()
            };

            console.log('📤 Sending order to MongoDB database:', formattedOrderData);

            const result = await this.apiCall('/orders', {
                method: 'POST',
                body: JSON.stringify(formattedOrderData)
            });
            
            if (result.success) {
                console.log('✅ Order successfully saved to MongoDB database');
                // Update localStorage cache ONLY after successful database save
                const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
                orders.push(result.data);
                localStorage.setItem('customerOrders', JSON.stringify(orders));
            }
            
            return result;
        } catch (error) {
            console.error('❌ Database order creation failed:', error);
            throw new Error(`Failed to save order to database: ${error.message}`);
        }
    }

    async trackOrder(orderId, email) {
        const result = await this.apiCall('/orders/track', {
            method: 'POST',
            body: JSON.stringify({ orderId, email })
        });
        return result;
    }

    async updateOrderStatus(orderId, status) {
        const result = await this.apiCall(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        // Update localStorage cache
        if (result.success) {
            const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
            const index = orders.findIndex(o => o.orderId === orderId);
            if (index !== -1) {
                orders[index].status = status;
                localStorage.setItem('customerOrders', JSON.stringify(orders));
            }
        }
        
        return result;
    }

    async uploadScreenshot(orderId, file) {
        try {
            const formData = new FormData();
            formData.append('screenshot', file);

            const response = await fetch(`${this.baseURL}/orders/${orderId}/screenshot`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Screenshot upload failed');
            }

            return result;
        } catch (error) {
            console.error('Screenshot upload error:', error);
            
            // Fallback: store as base64 in localStorage
            if (this.fallbackToLocalStorage) {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
                        const orderIndex = orders.findIndex(o => o.orderId === orderId);
                        
                        if (orderIndex !== -1) {
                            orders[orderIndex].paymentScreenshot = {
                                dataUrl: e.target.result,
                                filename: file.name,
                                uploadedAt: new Date().toISOString()
                            };
                            orders[orderIndex].status = 'screenshot';
                            localStorage.setItem('customerOrders', JSON.stringify(orders));
                            
                            resolve({
                                success: true,
                                message: 'Screenshot saved locally',
                                fallback: true
                            });
                        } else {
                            resolve({
                                success: false,
                                message: 'Order not found',
                                fallback: true
                            });
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }
            
            throw error;
        }
    }

    // Statistics API
    async getOrderStats(month = null) {
        const endpoint = month ? `/orders/stats/summary?month=${month}` : '/orders/stats/summary';
        const result = await this.apiCall(endpoint);
        return result;
    }

    async getMonthlyStats(year = null) {
        const endpoint = year ? `/orders/stats/monthly?year=${year}` : '/orders/stats/monthly';
        const result = await this.apiCall(endpoint);
        return result;
    }

    // Initialize database
    async initializeDatabase() {
        try {
            const result = await this.apiCall('/products/initialize', {
                method: 'POST'
            });
            return result;
        } catch (error) {
            console.error('Database initialization error:', error);
            return { success: false, message: error.message };
        }
    }

    // Health check
    async healthCheck() {
        try {
            const result = await fetch(`${this.baseURL}/health`);
            const data = await result.json();
            this.serverConnected = data.success;
            return data;
        } catch (error) {
            this.serverConnected = false;
            return { success: false, message: 'Server unavailable' };
        }
    }
}

// Create global instance
window.apiService = new APIService();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔌 API Service initialized');
    console.log('🌐 Environment detected:', window.location.hostname);
    console.log('🔗 Using server URL:', window.apiService.baseURL);
    
    // Check server health
    const health = await window.apiService.healthCheck();
    if (health.success) {
        console.log('✅ Server is online - MongoDB integration active');
        console.log('🔗 Server URL confirmed:', window.apiService.baseURL);
        
        // Initialization removed to prevent default products from reappearing

    } else {
        console.log('⚠️ Server offline - Using localStorage fallback');
        console.log('🔗 Attempted server URL:', window.apiService.baseURL);
    }
});

console.log('📡 API Service loaded successfully');