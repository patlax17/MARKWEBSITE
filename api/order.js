import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';

// Predictable Cloudinary raw file public IDs
const CONFIG_PUBLIC_ID = (type) => `mark-portfolio/_config/${type}-order`;

// Folders that should never appear as work categories in a saved order
const CATEGORIES_BLACKLIST = new Set(['home', '_config']);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type } = req.query; // 'categories' or 'home'
  if (!type) return res.status(400).json({ error: 'Missing ?type= param' });

  // GET — return current order
  if (req.method === 'GET') {
    // Cache for 5 minutes; orders don't change often
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=30');
    try {
      // Use Admin API to get the versioned URL — avoids CDN cache serving stale data
      const resource = await cloudinary.api.resource(CONFIG_PUBLIC_ID(type), {
        resource_type: 'raw',
      });
      // secure_url from Admin API always contains the version number (cache buster)
      const r = await fetch(resource.secure_url);
      if (!r.ok) return res.status(200).json({ order: [] });
      const data = await r.json();

      // Sanitise: remove any blacklisted values that crept into categories order
      let order = data.order || [];
      if (type === 'categories') {
        order = order.filter(o => !CATEGORIES_BLACKLIST.has(o));
      }
      return res.status(200).json({ order });
    } catch {
      // File not yet saved — return empty order (not an error)
      return res.status(200).json({ order: [] });
    }
  }

  // POST — save new order
  if (req.method === 'POST') {
    const password = req.headers['x-admin-password'];
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

    let body = '';
    for await (const chunk of req) body += chunk;

    let parsed;
    try { parsed = JSON.parse(body); }
    catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

    let { order } = parsed;
    if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be array' });

    // Sanitise before saving
    if (type === 'categories') {
      order = order.filter(o => !CATEGORIES_BLACKLIST.has(o));
    }

    try {
      const json = JSON.stringify({ order });
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: CONFIG_PUBLIC_ID(type),
            resource_type: 'raw',
            overwrite: true,
            invalidate: true, // Purge CDN cache after overwrite
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
