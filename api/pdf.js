const { kv } = require('@vercel/kv');

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    const data = await kv.get(`pdf:${token}`);

    if (!data) {
      return res.status(404).json({ error: 'Link expired or invalid' });
    }

    const { blobUrl, expiresAt } = JSON.parse(data);

    if (Date.now() > expiresAt) {
      // Delete expired entry
      await kv.del(`pdf:${token}`);
      return res.status(410).json({ error: 'Link expired' });
    }

    // Redirect to blob URL
    res.redirect(blobUrl);

  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
}
