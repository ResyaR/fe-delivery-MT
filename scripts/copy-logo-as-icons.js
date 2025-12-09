// Simple script to copy logo.png as PWA icons
// This is a temporary solution until proper icons are generated

const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('Error: logo.png not found');
  process.exit(1);
}

// Copy logo as different icon sizes
const iconSizes = [
  { name: 'icon-192x192.png', size: '192x192' },
  { name: 'icon-256x256.png', size: '256x256' },
  { name: 'icon-384x384.png', size: '384x384' },
  { name: 'icon-512x512.png', size: '512x512' },
  { name: 'apple-touch-icon.png', size: '180x180' }
];

console.log('Copying logo.png as PWA icons...');
console.log('Note: These are temporary icons. For production, generate proper sized icons.');

iconSizes.forEach(icon => {
  const outputPath = path.join(outputDir, icon.name);
  fs.copyFileSync(logoPath, outputPath);
  console.log(`✓ Created ${icon.name}`);
});

console.log('\n✅ Icons created!');
console.log('⚠️  Note: These icons use the same logo.png file.');
console.log('   For best results, generate properly sized icons using an image editor or online tool.');

