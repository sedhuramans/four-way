const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Helper to copy file
function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${src} to ${dest}`);
    } catch (err) {
        console.error(`Error copying ${src} to ${dest}:`, err);
    }
}

// 1. Copy logo image
const logoSource = path.join(rootDir, 'image.png');
if (fs.existsSync(logoSource)) {
    copyFile(logoSource, path.join(rootDir, 'assets', 'logo.jpg'));
    copyFile(logoSource, path.join(rootDir, 'assets', 'images', 'logo.jpg'));
} else {
    console.error('image.png not found at root directory!');
}

// 2. Replacements configuration (case-insensitive)
const searchTerms = [
    { regex: /nature\s+care\s+impex/gi, replacement: 'Fourways International Trading' },
    { regex: /nature-care-impex/gi, replacement: 'fourways-international-trading' },
    { regex: /nature--care-impex/gi, replacement: 'fourways-international-trading' },
    { regex: /naturecareimpex/gi, replacement: 'fourwaysinternational' },
    { regex: /nature\s+care/gi, replacement: 'Fourways International' },
    { regex: /naturecare/gi, replacement: 'FourwaysInternational' },
    // Also handle email
    { regex: /sales@naturecareimpex\.com/gi, replacement: 'sales@fourwaysint.com' },
    // Handle URL
    { regex: /sales\.naturecareimpex\.com/gi, replacement: 'sales.fourwaysinternational.com' },
    // Handle Order ID Prefix
    { regex: /ORDER_ID_PREFIX=NCI/gi, replacement: 'ORDER_ID_PREFIX=FIT' }
];

// Helper to walk directory and process files
function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Exclude node_modules, .git, and scratch directories
            if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
                walkDir(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            const name = path.basename(file).toLowerCase();
            if (['.html', '.js', '.json', '.css', '.xml', '.txt', '.md', '.bat', '.env'].includes(ext) || name === '.env' || name === '.env.example') {
                processFile(fullPath);
            }
        }
    }
}

function processFile(filePath) {
    // Read file
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Apply brand name replacements
    for (const term of searchTerms) {
        content = content.replace(term.regex, term.replacement);
    }
    
    // Replace old green/gold colors with new corporate blue theme
    // Replace Primary Green (#1A4A30) with Navy Blue (#0A2A6B)
    content = content.replace(/#1A4A30/gi, '#0A2A6B');
    // Replace Secondary Green (#2E6B47) with Royal Blue (#1E5BFF)
    content = content.replace(/#2E6B47/gi, '#1E5BFF');
    // Replace Accent Gold (#C9A84C or #C8A96E) with Sky Blue (#5FA8FF) or Royal Blue (#1E5BFF)
    content = content.replace(/#C9A84C/gi, '#5FA8FF');
    content = content.replace(/#C8A96E/gi, '#1E5BFF');
    content = content.replace(/#D4AF37/gi, '#1E5BFF');
    content = content.replace(/#FFD700/gi, '#1E5BFF');
    
    // Replace light green background highlights with light blue
    content = content.replace(/#f0f7f2/gi, '#f0f4fc');
    content = content.replace(/#f0f7f3/gi, '#f0f4fc');
    content = content.replace(/#e6f4eb/gi, '#e0eaff');
    
    // Replace RGBA color arrays
    content = content.replace(/rgba\(26,\s*74,\s*48,/gi, 'rgba(10, 42, 107,');
    content = content.replace(/rgba\(13,\s*43,\s*31,/gi, 'rgba(5, 21, 53,');

    // Custom replacements for owner-portal.css
    if (filePath.endsWith('owner-portal.css')) {
        content = content.replace(/#1a1a1a/g, '#0A2A6B'); // Dark backgrounds to navy
        content = content.replace(/#2c2c2c/g, '#030C22'); // Dark gray to deep navy
    }

    // Save if changed
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

console.log('Starting brand translation...');
walkDir(rootDir);
console.log('Brand translation finished!');
