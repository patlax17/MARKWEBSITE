// Compresses all images in public/work_gallery to max 1200px wide, ~80% quality
// Saves originals are untouched. Output goes to public/work_gallery_compressed/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'public', 'work_gallery');
const OUTPUT = path.join(__dirname, 'public', 'work');

async function compressFolder(inputDir, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png|JPG|JPEG|PNG)$/i.test(f));

  for (const file of files) {
    const inPath = path.join(inputDir, file);
    const stat = fs.statSync(inPath);
    if (!stat.isFile()) continue;

    const outName = file.replace(/\.[^.]+$/, '.jpg');
    const outPath = path.join(outputDir, outName);

    if (fs.existsSync(outPath)) {
      process.stdout.write(`  — skip ${file}\n`);
      continue;
    }

    try {
      await sharp(inPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true })
        .toFile(outPath);
      const inMB = (stat.size / 1024 / 1024).toFixed(1);
      const outMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
      process.stdout.write(`  ✓ ${file} (${inMB}MB → ${outMB}MB)\n`);
    } catch (err) {
      process.stdout.write(`  ✗ ${file}: ${err.message}\n`);
    }
  }
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('ERROR: public/work_gallery not found. Make sure images are copied locally first.');
    process.exit(1);
  }

  const subFolders = fs.readdirSync(INPUT).filter(name => {
    return fs.statSync(path.join(INPUT, name)).isDirectory();
  });

  let totalIn = 0, totalOut = 0;

  for (const folder of subFolders) {
    console.log(`\nCompressing: ${folder}`);
    await compressFolder(path.join(INPUT, folder), path.join(OUTPUT, folder));
  }

  console.log('\n✅ Done! Compressed images saved to public/work/');

  // Calculate total size
  function dirSize(dir) {
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir, { recursive: true })
      .reduce((sum, f) => {
        const p = path.join(dir, f);
        return fs.existsSync(p) && fs.statSync(p).isFile() ? sum + fs.statSync(p).size : sum;
      }, 0);
  }

  const outMB = (dirSize(OUTPUT) / 1024 / 1024).toFixed(0);
  console.log(`Total size of compressed output: ~${outMB}MB`);
}

main();
