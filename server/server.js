const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const Product = require('./models/Product');

// Seed default products into MongoDB if the collection is empty
async function seedDefaultProducts() {
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) return;

        const count = await Product.countDocuments();
        if (count > 0) {
            console.log(`✅ Database already has ${count} products — skipping seed`);
            return;
        }

        const defaults = [
            {
                id: 1,
                name: "Cocopeat 5kg Block",
                category: "cocopeat",
                image: "https://res.cloudinary.com/dy5kyfcw4/image/upload/v1767190898/photo_2025-12-31_22-18-07_c2hs4m.jpg",
                description: "Premium washed cocopeat blocks ideal for potting mixes and hydroponics. High water retention and porosity.",
                sizes: ["S", "M", "L", "XL", "XXL"],
                price: 250, cost: 150, stock: 100, isActive: true
            },
            {
                id: 2,
                name: "Coco Grow Bags",
                category: "eco-care",
                image: "https://cdn.moglix.com/p/B5wXshH1wq7TS-xxlarge.jpg",
                description: "Ready-to-use grow bags for greenhouse cultivation. UV treated for durability and optimal root growth.",
                sizes: ["S", "M", "L", "XL", "XXL"],
                price: 90, cost: 60, stock: 200, isActive: true
            },
            {
                id: 3,
                name: "Coco Bricks (650g)",
                category: "cocopeat",
                image: "https://images.unsplash.com/photo-1591857177580-dc82b9e4e119?auto=format&fit=crop&w=800&q=80",
                description: "Compact 650g briquettes, perfect for home gardening and smaller applications. Expands to 9 liters.",
                sizes: ["S", "M", "L", "XL", "XXL"],
                price: 180, cost: 120, stock: 150, isActive: true
            },
            {
                id: 5,
                name: "Bamboo Period Pads",
                category: "bamboo",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbYHHF-lKgdGS9ftR4AwALD27xwGSO9hsldw&s",
                description: "Comfortable, absorbent, and eco-friendly bamboo period pads. Washable and reusable for a sustainable cycle.",
                sizes: ["S", "M", "L", "XL", "XXL"],
                price: 120, cost: 80, stock: 80, isActive: true
            },
            {
                id: 6,
                name: "12 Coco Bricks 400g",
                category: "cocopeat",
                image: "https://res.cloudinary.com/dy5kyfcw4/image/upload/v1767190712/photo_2025-12-31_22-14-34_zu8ayl.jpg",
                description: "High-quality 400g coco peat bricks, perfect for home gardening and seed starting. Compact and easy to use.",
                sizes: ["S", "M", "L", "XL", "XXL"],
                price: 200, cost: 140, stock: 120, isActive: true
            }
        ];

        await Product.insertMany(defaults);
        console.log(`🌱 Seeded ${defaults.length} default products into MongoDB`);
    } catch (err) {
        console.error('⚠️ Failed to seed default products:', err.message);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB().then(() => {
    // Auto-seed products if the DB is connected but empty
    seedDefaultProducts();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Private Network Access headers for development (Chrome security policy)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
        next();
    });
}

// Serve uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the parent directory (where HTML files are)
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Fourways International Trading API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'logo.jpg'));
});

// Robots.txt route
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, '..', 'robots.txt'));
});

// Apple app site association routes
app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.type('application/json');
    res.sendFile(path.join(__dirname, '..', '.well-known', 'apple-app-site-association'));
});

app.get('/apple-app-site-association', (req, res) => {
    res.type('application/json');
    res.sendFile(path.join(__dirname, '..', 'apple-app-site-association'));
});

// Sitemap route
app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

// Serve HTML files for specific routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'about.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'products.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'contact.html'));
});

app.get('/owner', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'owner.html'));
});



app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'payment.html'));
});

app.get('/order-details', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'order-details.html'));
});

// Catch all handler for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Fourways International Trading Server Started');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('📋 Available routes:');
    console.log('   • http://localhost:' + PORT + ' (Home)');
    console.log('   • http://localhost:' + PORT + '/about (About)');
    console.log('   • http://localhost:' + PORT + '/products (Products)');
    console.log('   • http://localhost:' + PORT + '/contact (Contact)');
    console.log('   • http://localhost:' + PORT + '/owner (Owner Portal)');

    console.log('   • http://localhost:' + PORT + '/api/health (API Health)');
    console.log('✨ Ready to serve requests!');
});

module.exports = app;