import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating icons...');
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
    
  // Maskable icon with 15% padding
  await sharp(svgBuffer)
    .resize(400, 400) // smaller to give padding
    .extend({
      top: 56,
      bottom: 56,
      left: 56,
      right: 56,
      background: { r: 236, g: 72, b: 153, alpha: 1 } // #ec4899 background
    })
    .png()
    .toFile('public/pwa-maskable-512x512.png');

  await sharp(svgBuffer)
    .resize(180, 180) // Standard Apple touch icon
    .png()
    .toFile('public/apple-touch-icon.png');
    
  console.log('Done!');
}

generateIcons().catch(console.error);
