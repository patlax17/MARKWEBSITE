import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';
const CONFIG_PUBLIC_ID = 'mark-portfolio/_config/work-order';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const resource = await cloudinary.api.resource(CONFIG_PUBLIC_ID, { resource_type: 'raw' });
      const r = await fetch(resource.secure_url);
      if (!r.ok) return res.status(200).json({ order: {} });
      const data = await r.json();
      return res.status(200).json({ order: data.order || {} });
    } catch {
      return res.status(200).json({ order: {} });
    }
  }

  if (req.method === 'POST') {
    const password = req.headers['x-admin-password'];
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

    let body = '';
    for await (const chunk of req) body += chunk;
    const { folder, order } = JSON.parse(body);

    if (!folder || !Array.isArray(order)) return res.status(400).json({ error: 'Missing folder or order mapping' });

    try {
      // 1. Fetch current orders config perfectly so we don't drop other folders
      let targetOrder = {};
      try {
        const resource = await cloudinary.api.resource(CONFIG_PUBLIC_ID, { resource_type: 'raw' });
        const r = await fetch(resource.secure_url);
        if (r.ok) {
          const data = await r.json();
          if (data.order) targetOrder = data.order;
        }
      } catch { /* None yet */ }

      // 2. Overwrite the specific folder's order array
      targetOrder[folder] = order;

      // 3. Save back to Cloudinary
      const json = JSON.stringify({ order: targetOrder });
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: CONFIG_PUBLIC_ID, resource_type: 'raw', overwrite: true, invalidate: true },
          (err, result) => err ? reject(err) : resolve(result)
        );
        Readable.from(Buffer.from(json)).pipe(stream);
      });

      return res.status(200).json({ success: true, order: targetOrder });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
