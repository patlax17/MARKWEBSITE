import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Maps Cloudinary folder names → site metadata
const FOLDER_META = {
  "2025-big-east-mens-basketball-championship": {
    title: "2025 BIG EAST MEN'S BASKETBALL CHAMPIONSHIP",
    folder: "mark-portfolio/2025 Big East Men's Basketball Championship",
  },
  "2025-cunyac-mens-basketball-championship": {
    title: "2025 CUNYAC MEN'S BASKETBALL CHAMPIONSHIP",
    folder: "mark-portfolio/2025 CUNYAC Men's Championship",
  },
  "curtis-high-school-boys-basketball-media-day-2025": {
    title: "CURTIS HIGH SCHOOL BOYS BASKETBALL MEDIA DAY 2025",
    folder: "mark-portfolio/Curtis High School Boys Basketball Media Day 2025",
  },
  "high-school-football": {
    title: "HIGH SCHOOL FOOTBALL",
    folder: "mark-portfolio/High School Football",
  },
  "japan": {
    title: "JAPAN",
    folder: "mark-portfolio/Japan",
  },
  "liam-murphy-x-chris-ledlum-basketball-camp": {
    title: "LIAM MURPHY X CHRIS LEDLUM BASKETBALL CAMP",
    folder: "mark-portfolio/Liam Murphy x Chris Ledlum Basketball Camp",
  },
  "nike-nyvsny-focus-2025": {
    title: "NIKE NYVSNY FOCUS 2025",
    folder: "mark-portfolio/Nike NYvsNY Focus 2025",
  },
  "staten-island-hoops": {
    title: "STATEN ISLAND HOOPS",
    folder: "mark-portfolio/Staten Island Hoops",
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const categories = await Promise.all(
      Object.entries(FOLDER_META).map(async ([id, meta]) => {
        const result = await cloudinary.search
          .expression(`folder:"${meta.folder}"`)
          .sort_by('public_id', 'asc')
          .max_results(500)
          .execute();

        const images = result.resources.map(r => r.secure_url);

        return {
          id,
          title: meta.title,
          folder: meta.folder,
          cover: images[0] || null,
          images,
        };
      })
    );

    // Only return categories that actually have images
    const filled = categories.filter(c => c.images.length > 0);
    return res.status(200).json(filled);
  } catch (err) {
    console.error('Cloudinary gallery error:', err);
    return res.status(500).json({ error: err.message });
  }
}
