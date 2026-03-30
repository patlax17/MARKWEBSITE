import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Cloudinary free plan doesn't support sub_folders() — we use the Search API instead
// These folders live under mark-portfolio/ but are NOT work categories
const EXCLUDED_FOLDERS = new Set(['home', '_config']);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Search ALL resources under mark-portfolio/ (free-plan-safe)
    const result = await cloudinary.search
      .expression('public_id:mark-portfolio/*')
      .sort_by('public_id', 'asc')
      .max_results(500)
      .execute();

    // Group images by subfolder, skipping excluded folders and placeholder assets
    const folderMap = {};
    for (const r of result.resources) {
      const parts = r.public_id.split('/');
      // Expected shape: mark-portfolio / FolderName / filename
      if (parts.length < 3 || parts[0] !== 'mark-portfolio') continue;
      const folder = parts[1];
      if (EXCLUDED_FOLDERS.has(folder)) continue;
      if (parts[2] === '_placeholder') continue;
      if (!folderMap[folder]) folderMap[folder] = [];
      folderMap[folder].push(r.secure_url);
    }

    // Try to fetch custom covers config
    let coversConfig = {};
    let workOrderConfig = {};
    try {
      const [coversRes, orderRes] = await Promise.all([
        fetch('https://res.cloudinary.com/' + process.env.CLOUDINARY_CLOUD_NAME + '/raw/upload/mark-portfolio/_config/covers'),
        fetch('https://res.cloudinary.com/' + process.env.CLOUDINARY_CLOUD_NAME + '/raw/upload/mark-portfolio/_config/work-order')
      ]);
      
      if (coversRes.ok) {
        const coverData = await coversRes.json();
        coversConfig = coverData.covers || {};
      }
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        workOrderConfig = orderData.order || {};
      }
    } catch {
      // Configuration fetch failed, keep fallbacks
    }

    const applyOrder = (items, order) => {
      if (!order || order.length === 0) return items;
      // Filter the items using the exact match for ordered URLs
      const ordered = order.filter(url => items.includes(url));
      const rest = items.filter(url => !order.includes(url));
      return [...ordered, ...rest];
    };

    // Build the categories array
    const categories = Object.entries(folderMap)
      .filter(([, images]) => images.length > 0)
      .map(([name, images]) => ({
        id: slugify(name),
        title: name.toUpperCase(),
        folder: name,
        cover: coversConfig[name] || images[0],
        images: applyOrder(images, workOrderConfig[name] || []),
      }))
      .sort((a, b) => a.folder.localeCompare(b.folder));

    return res.status(200).json(categories);
  } catch (err) {
    console.error('Gallery API error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
