import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { blobs } = await list({ prefix: 'gallery/' });

    // Group blobs by category folder
    const categories = {};
    for (const blob of blobs) {
      // blob.pathname looks like: gallery/Japan/japan-1-5.jpg
      const parts = blob.pathname.replace('gallery/', '').split('/');
      if (parts.length < 2) continue;
      const folder = parts[0];
      if (!categories[folder]) categories[folder] = [];
      categories[folder].push(blob.url);
    }

    // Map into the same shape as work_gallery.json
    const FOLDER_META = {
      "2025 Big East Men's Basketball Championship": { id: '2025-big-east-mens-basketball-championship', title: "2025 BIG EAST MEN'S BASKETBALL CHAMPIONSHIP" },
      "2025 CUNYAC Men's Championship":             { id: '2025-cunyac-mens-basketball-championship',   title: "2025 CUNYAC MEN'S BASKETBALL CHAMPIONSHIP" },
      "Curtis High School Boys Basketball Media Day 2025": { id: 'curtis-high-school-boys-basketball-media-day-2025', title: 'CURTIS HIGH SCHOOL BOYS BASKETBALL MEDIA DAY 2025' },
      "High School Football":                       { id: 'high-school-football',                       title: 'HIGH SCHOOL FOOTBALL' },
      "Japan":                                      { id: 'japan',                                      title: 'JAPAN' },
      "Liam Murphy x Chris Ledlum Basketball Camp": { id: 'liam-murphy-x-chris-ledlum-basketball-camp', title: 'LIAM MURPHY X CHRIS LEDLUM BASKETBALL CAMP' },
      "Nike NYvsNY Focus 2025":                     { id: 'nike-nyvsny-focus-2025',                     title: 'NIKE NYVSNY FOCUS 2025' },
      "Staten Island Hoops":                        { id: 'staten-island-hoops',                        title: 'STATEN ISLAND HOOPS' },
    };

    const result = Object.entries(categories)
      .filter(([folder]) => FOLDER_META[folder])
      .map(([folder, images]) => ({
        id: FOLDER_META[folder].id,
        title: FOLDER_META[folder].title,
        folder,
        cover: images[0],
        images,
      }));

    return res.status(200).json(result);
  } catch (err) {
    console.error('List error:', err);
    return res.status(500).json({ error: err.message });
  }
}
