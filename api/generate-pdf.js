const PDFDocument = require('pdfkit');
const { put } = require('@vercel/blob');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      phone,
      deliveryMethod,
      cep,
      address,
      number,
      payment,
      notes,
      cart,
      total,
      shippingCost
    } = req.body;

    // Gerar PDF
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20);
    doc.fillColor('#0066CC').font('Helvetica-Bold');
    doc.text('SUA ADEGA', 0, 20, { align: 'center' });
    doc.fontSize(14);
    doc.fillColor('black').font('Helvetica');
    doc.text('Pedido de Compra', 0, 30, { align: 'center' });
    doc.moveTo(20, 35).lineTo(580, 35).stroke();

    // Date
    doc.fontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);

    // Customer Info
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Dados do Cliente', 20, 60);
    doc.font('Helvetica');
    doc.text(`Nome: ${name}`, 20, 75);
    doc.text(`Telefone: ${phone}`, 20, 90);
    doc.text(`Método de Entrega: ${deliveryMethod === 'entrega' ? 'Entrega' : 'Retirar na Loja'}`, 20, 105);

    let y = 120;
    if (deliveryMethod === 'entrega') {
      doc.text(`CEP: ${cep}`, 20, y);
      y += 15;
      doc.text(`Endereço: ${address}, ${number}`, 20, y);
      y += 15;
      doc.text(`Frete: R$ ${shippingCost.toFixed(2).replace('.', ',')}`, 20, y);
      y += 15;
    }
    doc.text(`Forma de Pagamento: ${payment}`, 20, y);
    y += 15;
    if (notes) {
      doc.text(`Observações: ${notes}`, 20, y);
      y += 15;
    }

    // Items Header
    y += 15;
    doc.font('Helvetica-Bold');
    doc.text('Itens do Pedido', 20, y);
    doc.moveTo(20, y + 2).lineTo(580, y + 2).stroke();
    y += 15;

    // Items
    doc.font('Helvetica');
    cart.forEach(item => {
      doc.text(`${item.quantity}x ${item.name}`, 20, y);
      doc.text(`R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`, 0, y, { align: 'right' });
      y += 15;
    });

    // Total
    y += 15;
    doc.moveTo(20, y).lineTo(580, y).stroke();
    y += 15;
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text(`Total: R$ ${total.toFixed(2).replace('.', ',')}`, 0, y, { align: 'right' });

    // Footer
    y += 25;
    doc.fontSize(10).font('Helvetica-Oblique').fillColor('gray');
    doc.text('Obrigado pela sua compra! Sua Adega', 0, y, { align: 'center' });
    doc.text('Contato: (11) 9199-1854-713', 0, y + 15, { align: 'center' });

    doc.end();

    // Wait for PDF to finish
    await new Promise((resolve) => doc.on('end', resolve));

    const pdfBuffer = Buffer.concat(buffers);

    // Upload to Vercel Blob
    const blob = await put(`pedido-${Date.now()}.pdf`, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf'
    });

    // Return the public link directly (permanent link due to free tier limitations)
    res.status(200).json({ link: blob.url });

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
