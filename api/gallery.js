import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Get all subfolders under mark-portfolio dynamically
    const { folders } = await cloudinary.api.sub_folders('mark-portfolio');

    // 2. For each folder, get images sorted by filename
    const categories = await Promise.all(
      folders.map(async ({ name, path }) => {
        const result = await cloudinary.search
          .expression(`folder:"${path}" AND resource_type:image AND NOT public_id:*/_placeholder`)
          .sort_by('public_id', 'asc')
          .max_results(500)
          .execute();

        const images = result.resources.map(r => r.secure_url);

        return {
          id: slugify(name),
          title: name.toUpperCase(),
          folder: name,
          cover: images[0] || null,
          images,
        };
      })
    );

    // 3. Filter out empty categories (ones with no real images yet)
    const filled = categories.filter(c => c.images.length > 0);

    return res.status(200).json(filled);
  } catch (err) {
    console.error('Gallery API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
