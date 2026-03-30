// One-time script: uploads all local work_gallery images to Cloudinary
// Run: node upload-to-cloudinary.cjs
// Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local

require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const LOCAL_GALLERY = path.join(__dirname, 'public', 'work_gallery');

const FOLDER_MAP = {
  "2025 Big East Men's Basketball Championship": "mark-portfolio/2025 Big East Men's Basketball Championship",
  "2025 CUNYAC Men's Championship":             "mark-portfolio/2025 CUNYAC Men's Championship",
  "Curtis High School Boys Basketball Media Day 2025": "mark-portfolio/Curtis High School Boys Basketball Media Day 2025",
  "High School Football":                       "mark-portfolio/High School Football",
  "Japan":                                      "mark-portfolio/Japan",
  "Liam Murphy x Chris Ledlum Basketball Camp": "mark-portfolio/Liam Murphy x Chris Ledlum Basketball Camp",
  "Nike NYvsNY Focus 2025":                     "mark-portfolio/Nike NYvsNY Focus 2025",
  "Staten Island Hoops":                        "mark-portfolio/Staten Island Hoops",
};

async function uploadFolder(localFolder, cloudFolder) {
  const files = fs.readdirSync(localFolder)
    .filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));

  console.log(`\nUploading ${files.length} images from "${path.basename(localFolder)}"...`);

  for (const file of files) {
    const filePath = path.join(localFolder, file);
    const publicId = `${cloudFolder}/${path.parse(file).name}`;

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
      });
      console.log(`  ✓ ${file}`);
    } catch (err) {
      if (err.error?.message?.includes('already exists')) {
        console.log(`  — ${file} (already uploaded, skipped)`);
      } else {
        console.error(`  ✗ ${file}: ${err.message}`);
      }
    }
  }
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('ERROR: Missing CLOUDINARY_CLOUD_NAME in .env.local');
    process.exit(1);
  }

  for (const [localName, cloudFolder] of Object.entries(FOLDER_MAP)) {
    const localPath = path.join(LOCAL_GALLERY, localName);
    if (fs.existsSync(localPath)) {
      await uploadFolder(localPath, cloudFolder);
    } else {
      console.warn(`WARNING: local folder not found: ${localPath}`);
    }
  }

  console.log('\n✅ Upload complete! All images are now on Cloudinary.');
}

main();
