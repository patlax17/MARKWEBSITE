require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    const res = await cloudinary.api.root_folders();
    console.log("Root:", res.folders);
    
    // Check mark-portfolio subfolders
    const sub = await cloudinary.api.sub_folders('mark-portfolio');
    console.log("Sub:", sub.folders);
  } catch(e) { console.error(e) }
}
run();
