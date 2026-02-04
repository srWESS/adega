# TODO: Implementar Geração de PDF Serverless com Link Temporário

## 1. Configurar Projeto para Vercel
- [x] Criar package.json com dependências necessárias
- [x] Criar diretório api/

## 2. Criar API para Geração de PDF
- [x] Criar api/generate-pdf.js: Receber dados do formulário, gerar PDF com pdfkit, fazer upload para Vercel Blob, armazenar metadados no KV com token e expiração (24h), retornar link para /api/pdf?token=xyz

## 3. Criar API para Servir PDF Temporário
- [x] Criar api/pdf.js: Receber token, verificar no KV se válido e não expirado, se sim, redirecionar para URL blob ou servir PDF

## 4. Modificar Front-end
- [x] Modificar checkout.js: Remover geração de PDF no cliente, enviar POST para /api/generate-pdf com dados do formulário, obter link, incluir na mensagem do WhatsApp em vez de URL blob
- [x] Remover jsPDF de checkout.html se não usado mais

## 5. Testes e Deploy
- [ ] Testar geração de PDF e link temporário
- [ ] Explicar deploy no Vercel
- [ ] Nota: Para envio automático via WhatsApp, integrar Twilio posteriormente
