const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PLACEHOLDER_VALUES = [
    'your-api-key',
    'your-cloudinary-api-key',
    'your-cloud-name',
    'your-api-secret',
    'PASTE_YOUR_API_KEY_HERE',
    'PASTE_YOUR_API_SECRET_HERE'
];

function isCloudinaryConfigured() {
    const key = (process.env.CLOUDINARY_API_KEY || '').trim();
    const secret = (process.env.CLOUDINARY_API_SECRET || '').trim();
    const name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    if (!key || !secret || !name) return false;
    return !PLACEHOLDER_VALUES.some(p => key.includes(p) || secret.includes(p) || name.includes(p));
}

function guessExtension(mimetype, originalname) {
    const fromName = path.extname(originalname || '').toLowerCase();
    if (fromName) return fromName;

    const map = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/bmp': '.bmp',
        'image/tiff': '.tiff',
        'image/heic': '.heic',
        'image/heif': '.heif',
        'image/avif': '.avif',
        'image/svg+xml': '.svg'
    };
    return map[mimetype] || '.jpg';
}

function saveLocally(file) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = guessExtension(file.mimetype, file.originalname);
    const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);

    return `/uploads/${filename}`;
}

async function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'fourways-products',
                resource_type: 'auto',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'heic', 'heif', 'avif', 'svg'],
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(file.buffer);
    });
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        const allowed = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'image/webp', 'image/bmp', 'image/tiff', 'image/tif',
            'image/heic', 'image/heif', 'image/avif', 'image/svg+xml',
            'image/x-icon', 'image/vnd.microsoft.icon'
        ];
        if (file.mimetype.startsWith('image/') || allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File must be an image (jpg, png, gif, webp, heic, bmp, tiff, etc.)'));
        }
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        console.log(`📤 Uploading image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB, ${req.file.mimetype})`);

        if (isCloudinaryConfigured()) {
            try {
                const result = await uploadToCloudinary(req.file);
                console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
                return res.json({
                    success: true,
                    url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    storage: 'cloudinary',
                    message: 'Image uploaded successfully'
                });
            } catch (cloudErr) {
                console.warn('⚠️ Cloudinary upload failed, using local storage:', cloudErr.message);
            }
        } else {
            console.log('ℹ️ Cloudinary not configured — saving image locally');
        }

        const localUrl = saveLocally(req.file);
        console.log(`✅ Saved locally: ${localUrl}`);

        res.json({
            success: true,
            url: localUrl,
            storage: 'local',
            message: 'Image uploaded successfully'
        });

    } catch (error) {
        console.error('❌ Upload error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Image upload failed: ' + error.message
        });
    }
});

module.exports = router;
