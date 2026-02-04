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

    // Fetch the PDF from blob URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF from blob');
    }

    const buffer = await response.arrayBuffer();

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="pedido.pdf"');
    res.setHeader('Content-Length', buffer.byteLength);

    // Send the PDF
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
}
