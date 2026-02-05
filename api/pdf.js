export default async function handler(req, res) {
  const { blobUrl } = req.query;

  if (!blobUrl) {
    return res.status(400).json({ error: 'Blob URL required' });
  }

  try {
    // Fetch the PDF from blob URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF from blob');
    }

    const buffer = await response.arrayBuffer();

    // Set headers for inline display
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="pedido.pdf"');
    res.setHeader('Content-Length', buffer.byteLength);

    // Send the PDF
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
}
