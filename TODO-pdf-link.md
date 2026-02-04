# TODO: Implementar Link do PDF na Mensagem do WhatsApp

## 1. Modificar Geração do PDF em checkout.js
- [x] Alterar handleCheckout para criar blob URL do PDF em vez de apenas salvar
- [x] Incluir o link do blob URL na mensagem do WhatsApp
- [x] Manter o salvamento automático do PDF para o usuário

## 2. Testes
- [x] Alterado para usar blob URL com atraso de 60 segundos no redirecionamento para manter o link válido
- [ ] Testar se o PDF pode ser baixado via link no WhatsApp (enviar mensagem rapidamente)
- [ ] Confirmar que a mensagem do WhatsApp inclui o link
