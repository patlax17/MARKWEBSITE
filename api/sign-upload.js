import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mark2025';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  let body = '';
  for await (const chunk of req) body += chunk;
  const { folder, filename } = JSON.parse(body);
  if (!folder || !filename) return res.status(400).json({ error: 'Missing folder or filename' });

  // Build the public_id (strip file extension)
  const baseName = filename.replace(/\.[^.]+$/, '');
  const publicId  = `${folder}/${baseName}`;
  const timestamp = Math.round(Date.now() / 1000);

  // Sign exactly the params we'll send to Cloudinary
  const paramsToSign = { overwrite: 'true', public_id: publicId, timestamp };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return res.status(200).json({
    signature,
    timestamp,
    publicId,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey:    process.env.CLOUDINARY_API_KEY,
  });
}
