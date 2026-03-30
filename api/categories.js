import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST: create a new category folder
  if (req.method === 'POST') {
    const password = req.headers['x-admin-password'];
    if (password !== (process.env.ADMIN_PASSWORD || 'mark2025')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let body = '';
    for await (const chunk of req) body += chunk;
    const { name } = JSON.parse(body);

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name required' });
    }

    try {
      // Create a placeholder image in the folder to establish it in Cloudinary
      await cloudinary.uploader.upload(
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        {
          public_id: `mark-portfolio/${name.trim()}/_placeholder`,
          overwrite: false,
          resource_type: 'image',
        }
      );
      return res.status(200).json({ success: true, name: name.trim() });
    } catch (err) {
      // If placeholder already exists, folder already exists — that's fine
      if (err.error?.message?.includes('already exists')) {
        return res.status(200).json({ success: true, name: name.trim() });
      }
      return res.status(500).json({ error: err.message });
    }
  }

  // GET: list all category folders
  if (req.method === 'GET') {
    try {
      const result = await cloudinary.api.sub_folders('mark-portfolio');
      const folders = result.folders.map(f => f.name);
      return res.status(200).json({ folders });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
