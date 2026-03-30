import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';

// Predictable Cloudinary raw file URLs
const CONFIG_PUBLIC_ID = (type) => `mark-portfolio/_config/${type}-order`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type } = req.query; // 'categories' or 'home'
  if (!type) return res.status(400).json({ error: 'Missing ?type= param' });

  // GET — return current order
  if (req.method === 'GET') {
    try {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${CONFIG_PUBLIC_ID(type)}`;
      const r = await fetch(url);
      if (!r.ok) return res.status(200).json({ order: [] }); // Not yet saved
      const data = await r.json();
      return res.status(200).json(data);
    } catch {
      return res.status(200).json({ order: [] });
    }
  }

  // POST — save new order
  if (req.method === 'POST') {
    const password = req.headers['x-admin-password'];
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

    let body = '';
    for await (const chunk of req) body += chunk;
    const { order } = JSON.parse(body);
    if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be array' });

    try {
      const json = JSON.stringify({ order });
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: CONFIG_PUBLIC_ID(type),
            resource_type: 'raw',
            overwrite: true,
          },
          (err, result) => err ? reject(err) : resolve(result)
        );
        Readable.from(Buffer.from(json)).pipe(stream);
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
