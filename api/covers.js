import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';
const CONFIG_PUBLIC_ID = 'mark-portfolio/_config/covers';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — return current covers
  if (req.method === 'GET') {
    try {
      // Use Admin API to get versioned URL to bypass CDN cache
      const resource = await cloudinary.api.resource(CONFIG_PUBLIC_ID, { resource_type: 'raw' });
      const r = await fetch(resource.secure_url);
      if (!r.ok) return res.status(200).json({ covers: {} });
      const data = await r.json();
      return res.status(200).json({ covers: data.covers || {} });
    } catch {
      return res.status(200).json({ covers: {} }); // Return empty if not created yet
    }
  }

  // POST — save new covers
  if (req.method === 'POST') {
    const password = req.headers['x-admin-password'];
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

    let body = '';
    for await (const chunk of req) body += chunk;

    let parsed;
    try { parsed = JSON.parse(body); }
    catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

    const { folder, url } = parsed;
    if (!folder || !url) return res.status(400).json({ error: 'Missing folder or url' });

    try {
      // 1. Fetch current covers to merge
      let targetCovers = {};
      try {
        const resource = await cloudinary.api.resource(CONFIG_PUBLIC_ID, { resource_type: 'raw' });
        const r = await fetch(resource.secure_url);
        if (r.ok) {
          const data = await r.json();
          if (data.covers) targetCovers = data.covers;
        }
      } catch { /* None yet, keep empty */ }

      // 2. Merge newly selected cover
      targetCovers[folder] = url;

      // 3. Save it back
      const json = JSON.stringify({ covers: targetCovers });
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: CONFIG_PUBLIC_ID,
            resource_type: 'raw',
            overwrite: true,
            invalidate: true,
          },
          (err, result) => err ? reject(err) : resolve(result)
        );
        Readable.from(Buffer.from(json)).pipe(stream);
      });

      return res.status(200).json({ success: true, covers: targetCovers });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
