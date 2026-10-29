const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Generates the PNG icons referenced by manifest.json and layout.tsx from icon.svg
// Run with: pnpm generate-icons

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const svg = fs.readFileSync(path.join(iconsDir, 'icon.svg'));

async function main() {
  for (const size of sizes) {
    const outFile = path.join(iconsDir, `icon-${size}x${size}.png`);
    // Render the SVG at 4x before downscaling so edges stay crisp
    await sharp(svg, { density: 72 * 4 })
      .resize(size, size)
      .png()
      .toFile(outFile);
    console.log(`Generated ${path.relative(process.cwd(), outFile)}`);
  }
}

main().catch((error) => {
  console.error('Icon generation failed:', error);
  process.exit(1);
});
