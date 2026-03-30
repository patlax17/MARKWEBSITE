import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'DELETE') {
    const password = req.headers['x-admin-password'];
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

    let body = '';
    for await (const chunk of req) body += chunk;
    const { url } = JSON.parse(body);

    if (!url) return res.status(400).json({ error: 'Missing image url' });

    try {
      // Reconstruct public_id directly from the secure_url
      // Example url: https://res.cloudinary.com/cloudName/image/upload/v1234/mark-portfolio/FolderName/filename.jpg
      const splitIdx = url.indexOf('mark-portfolio/');
      if (splitIdx === -1) return res.status(400).json({ error: 'URL is not from mark-portfolio directory' });
      
      const pathWithExt = url.substring(splitIdx);
      const publicId = pathWithExt.replace(/\.[^/.]+$/, ""); // Strip file extension

      await cloudinary.uploader.destroy(publicId);

      return res.status(200).json({ success: true, publicId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
