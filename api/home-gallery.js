import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';

/**
 * Inject Cloudinary auto-format + auto-quality + width cap into any secure URL.
 * e.g. .../upload/v1/... → .../upload/f_auto,q_auto,w_1200/v1/...
 * This serves WebP/AVIF to browsers that support it and compresses smartly.
 */
function optimizeUrl(url) {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password, x-file-name');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — list all home images
  if (req.method === 'GET') {
    // Cache at CDN/browser for 5 minutes (stale-while-revalidate for 30s)
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=30');
    try {
      const result = await cloudinary.search
        .expression('public_id:mark-portfolio/home/* AND resource_type:image')
        .sort_by('public_id', 'asc')
        .max_results(500)
        .execute();

      const images = result.resources.map(r => ({
        url: optimizeUrl(r.secure_url),
        publicId: r.public_id,
        filename: r.public_id.split('/').pop(),
      }));

      return res.status(200).json({ images });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Require auth for write operations
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  // POST — upload a new home image
  if (req.method === 'POST') {
    const fileName = req.headers['x-file-name'];
    if (!fileName) return res.status(400).json({ error: 'Missing x-file-name' });

    try {
      const buffer = await streamToBuffer(req);
      const publicId = `mark-portfolio/home/${fileName.replace(/\.[^.]+$/, '')}`;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: publicId, overwrite: true, resource_type: 'image' },
          (err, result) => err ? reject(err) : resolve(result)
        );
        Readable.from(buffer).pipe(stream);
      });

      return res.status(200).json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — remove a home image
  if (req.method === 'DELETE') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { publicId } = JSON.parse(body);
    if (!publicId) return res.status(400).json({ error: 'Missing publicId' });

    try {
      await cloudinary.uploader.destroy(publicId);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', c => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
