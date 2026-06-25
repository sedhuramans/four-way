const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Connection URIs
const MONGODB_LOCAL_URI = 'mongodb://localhost:27017/nature_care_impex';
const MONGODB_ATLAS_URI = 'mongodb+srv://pavithra2282009_db_user:Pavi9876543210@cluster0.awahsjz.mongodb.net/nature_care_impex?retryWrites=true&w=majority&appName=Cluster0';

// Define Product Schema (matching the app's schema)
const ProductSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    image: { type: String, required: true },
    image2: { type: String },
    image3: { type: String },
    description: { type: String, required: true },
    sizes: { type: [String], default: ["Standard"] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

async function addProduct() {
    try {
        console.log('Connecting to MongoDB (Local)...');
        try {
            await mongoose.connect(MONGODB_LOCAL_URI, { serverSelectionTimeoutMS: 2000 });
            console.log('Connected to Local MongoDB successfully!');
        } catch (localErr) {
            console.log('⚠️ Local MongoDB failed, trying Atlas...');
            await mongoose.connect(MONGODB_ATLAS_URI);
            console.log('Connected to Atlas MongoDB successfully!');
        }

        // Image paths (using the ones provided in artifacts)
        const imgPath1 = 'C:\\Users\\sedhu\\.gemini\\antigravity\\brain\\d23cb460-de4e-4690-a3c7-18eb9c3f94fe\\media__1777651164587.png';
        const imgPath2 = 'C:\\Users\\sedhu\\.gemini\\antigravity\\brain\\d23cb460-de4e-4690-a3c7-18eb9c3f94fe\\media__1777651529480.png';

        const img1Base64 = `data:image/png;base64,${fs.readFileSync(imgPath1).toString('base64')}`;
        const img2Base64 = `data:image/png;base64,${fs.readFileSync(imgPath2).toString('base64')}`;

        // Get max ID to increment
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const nextId = (lastProduct && typeof lastProduct.id === 'number') ? lastProduct.id + 1 : 1;

        const newProduct = new Product({
            id: nextId,
            name: '5kg Cocopeat Block',
            category: 'cocopeat',
            price: 180,
            cost: 120,
            stock: 999,
            minStock: 0,
            image: img1Base64,
            image2: img2Base64,
            image3: img1Base64, // Reuse first image as third
            description: `High-compression cocopeat block made from premium coconut husk.\n\nSpecifications:\n\nWeight: 5kg\nExpansion: 70–75 liters\nLow EC & pH balanced\n\n👉 Bulk Orders: Price negotiable`,
            sizes: ["Standard"],
            isActive: true
        });

        await newProduct.save();
        console.log('✅ Product added successfully with ID:', nextId);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

addProduct();
