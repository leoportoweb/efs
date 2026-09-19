const { writeFileSync } = require('fs');
const { join } = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple SVG icon (soccer ball + checkmark)
const svgTemplate = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a5c2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3d1e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <!-- Soccer ball -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="white" stroke-width="12" opacity="0.9"/>
  <ellipse cx="256" cy="256" rx="160" ry="60" fill="none" stroke="white" stroke-width="8" opacity="0.7"/>
  <ellipse cx="256" cy="256" rx="60" ry="160" fill="none" stroke="white" stroke-width="8" opacity="0.7"/>
  <!-- Pentagons pattern -->
  <g fill="white" opacity="0.85">
    <polygon points="256,100 290,140 256,180 222,140"/>
    <polygon points="256,332 290,372 256,412 222,372"/>
    <polygon points="140,256 100,290 60,256 100,222"/>
    <polygon points="412,256 372,290 332,256 372,222"/>
  </g>
  <!-- Checkmark -->
  <path d="M180 256 L240 316 L340 180" fill="none" stroke="#f59e0b" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

async function generateIcons() {
  const sharp = await import('sharp').then(m => m.default).catch(() => null);

  if (!sharp) {
    console.log('Sharp not available, creating placeholder SVG icons...');
    for (const size of sizes) {
      const svg = svgTemplate(size);
      writeFileSync(join('public', 'icons', `icon-${size}.svg`), svg);
    }
    console.log('Created SVG icons (install sharp for PNG generation)');
    return;
  }

  for (const size of sizes) {
    const svg = svgTemplate(size);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(join('public', 'icons', `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Also create maskable icon (512x512 with safe zone)
  const maskableSvg = svgTemplate(512).replace('rx="96"', 'rx="96"').replace('viewBox="0 0 512 512"', 'viewBox="0 0 512 512"');
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(join('public', 'icons', 'icon-512-maskable.png'));
  console.log('Generated maskable icon');
}

generateIcons().catch(console.error);