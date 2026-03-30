import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';

// Seed list — always available even if Cloudinary search has no extras
const SEED_CATEGORIES = [
  "2025 Big East Men's Basketball Championship",
  "2025 CUNYAC Men's Championship",
  "Curtis High School Boys Basketball Media Day 2025",
  "High School Football",
  "Japan",
  "Liam Murphy x Chris Ledlum Basketball Camp",
  "Nike NYvsNY Focus 2025",
  "Staten Island Hoops",
];

async function getAllFolders() {
  try {
    // Search for all resources under mark-portfolio and extract unique subfolders
    const result = await cloudinary.search
      .expression('public_id:mark-portfolio/*')
      .sort_by('public_id', 'asc')
      .max_results(500)
      .execute();

    // Folders to never show as work categories
    const EXCLUDED = new Set(['home', '_config']);

    const folderSet = new Set(SEED_CATEGORIES);
    for (const r of result.resources) {
      const parts = r.public_id.split('/');
      // public_id = mark-portfolio/FolderName/filename → parts[1] is the folder
      if (parts.length >= 3 && parts[0] === 'mark-portfolio' && !EXCLUDED.has(parts[1])) {
        folderSet.add(parts[1]);
      }
    }
    return Array.from(folderSet).sort();
  } catch {
    // Fallback to seed list if search fails
    return [...SEED_CATEGORIES].sort();
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  // GET — list all folders
  if (req.method === 'GET') {
    const folders = await getAllFolders();
    return res.status(200).json({ folders });
  }

  // POST — create new category (uploads a placeholder to establish the folder)
  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { name } = JSON.parse(body);

    if (!name?.trim()) return res.status(400).json({ error: 'Category name required' });

    try {
      await cloudinary.uploader.upload(
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        {
          public_id: `mark-portfolio/${name.trim()}/_placeholder`,
          overwrite: false,
          resource_type: 'image',
        }
      );
    } catch (err) {
      // If placeholder already exists, that's fine
      if (!err.error?.message?.includes('already exists')) {
        return res.status(500).json({ error: err.message });
      }
    }
    return res.status(200).json({ success: true, name: name.trim() });
  }

  // DELETE — remove a category and all its photos
  if (req.method === 'DELETE') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { name } = JSON.parse(body);
    if (!name?.trim()) return res.status(400).json({ error: 'Category name required' });

    try {
      // 1. Find and delete all resources in the folder
      const search = await cloudinary.search
        .expression(`public_id:mark-portfolio/${name.trim()}/*`)
        .max_results(500)
        .execute();

      if (search.resources.length > 0) {
        const publicIds = search.resources.map(r => r.public_id);
        await cloudinary.api.delete_resources(publicIds);
      }

      // 2. Delete the folder itself
      try {
        await cloudinary.api.delete_folder(`mark-portfolio/${name.trim()}`);
      } catch {
        // Folder may already be gone — that's fine
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT — rename category
  if (req.method === 'PUT') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { oldName, newName } = JSON.parse(body);

    if (!oldName?.trim() || !newName?.trim()) return res.status(400).json({ error: 'Missing old or new name' });

    try {
      await cloudinary.api.rename_folder(`mark-portfolio/${oldName.trim()}`, `mark-portfolio/${newName.trim()}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      if (err.error?.message?.includes('Cannot rename folder to itself')) {
        return res.status(200).json({ success: true });
      }
      return res.status(500).json({ error: err.error?.message || err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
