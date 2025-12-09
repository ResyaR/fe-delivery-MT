// Script to generate PWA icons from logo.png
// This script requires sharp package: npm install sharp --save-dev

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 256, 384, 512];
const inputLogo = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    // Check if logo.png exists
    if (!fs.existsSync(inputLogo)) {
      console.error('Error: logo.png not found in public folder');
      process.exit(1);
    }

    console.log('Generating PWA icons...');

    // Generate icons for each size
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    // Generate apple-touch-icon (180x180)
    const appleIconPath = path.join(outputDir, 'apple-touch-icon.png');
    await sharp(inputLogo)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(appleIconPath);
    
    console.log('✓ Generated apple-touch-icon.png');
    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

