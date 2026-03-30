const fs = require('fs');
const path = require('path');

const publicWorkPath = path.join(__dirname, 'public', 'work_gallery');
const dataOutputPath = path.join(__dirname, 'src', 'data', 'work_gallery.json');

// Each entry: { id, title, folder }
// IDs must match exactly what Work.jsx links to via /work/:categoryId
const targetFolders = [
  {
    id: '2025-big-east-mens-basketball-championship',
    title: "2025 BIG EAST MEN'S BASKETBALL CHAMPIONSHIP",
    folder: "2025 Big East Men's Basketball Championship",
  },
  {
    id: '2025-cunyac-mens-basketball-championship',
    title: "2025 CUNYAC MEN'S BASKETBALL CHAMPIONSHIP",
    folder: "2025 CUNYAC Men's Championship",
  },
  {
    id: 'curtis-high-school-boys-basketball-media-day-2025',
    title: 'CURTIS HIGH SCHOOL BOYS BASKETBALL MEDIA DAY 2025',
    folder: 'Curtis High School Boys Basketball Media Day 2025',
  },
  {
    id: 'high-school-football',
    title: 'HIGH SCHOOL FOOTBALL',
    folder: 'High School Football',
  },
  {
    id: 'japan',
    title: 'JAPAN',
    folder: 'Japan',
  },
  {
    id: 'liam-murphy-x-chris-ledlum-basketball-camp',
    title: 'LIAM MURPHY X CHRIS LEDLUM BASKETBALL CAMP',
    folder: 'Liam Murphy x Chris Ledlum Basketball Camp',
  },
  {
    id: 'nike-nyvsny-focus-2025',
    title: 'NIKE NYVSNY FOCUS 2025',
    folder: 'Nike NYvsNY Focus 2025',
  },
  {
    id: 'staten-island-hoops',
    title: 'STATEN ISLAND HOOPS',
    folder: 'Staten Island Hoops',
  },
];

const categories = [];

targetFolders.forEach(({ id, title, folder }) => {
  const folderPath = path.join(publicWorkPath, folder);
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    console.warn(`WARNING: folder not found: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
    .sort();

  if (files.length === 0) {
    console.warn(`WARNING: no images in: ${folderPath}`);
    return;
  }

  // Build URL-safe paths — encode spaces as %20, preserve apostrophes as-is
  const urlFolder = folder.replace(/ /g, '%20');
  const toUrl = (file) => `/work_gallery/${urlFolder}/${file.replace(/ /g, '%20')}`;

  categories.push({
    id,
    title,
    folder,
    cover: toUrl(files[0]),
    images: files.map(toUrl),
  });
});

fs.writeFileSync(dataOutputPath, JSON.stringify(categories, null, 2), 'utf-8');
console.log(`Generated work_gallery.json with ${categories.length} categories.`);
categories.forEach(c => console.log(`  [${c.id}] → ${c.images.length} images`));
