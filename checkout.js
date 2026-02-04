let cart = [];
const RESTAURANT_ADDRESS = "Avenida Atlântica, Jardim Revista, Suzano - SP, 519";
let currentShippingCost = 0;

// Coordenadas da loja (aproximadas para Suzano - SP)
const RESTAURANT_LAT = -23.535;
const RESTAURANT_LNG = -46.31;

// Função para calcular distância usando fórmula de Haversine
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Função para geocodificar endereço usando Nominatim (OpenStreetMap)
async function geocodeAddress(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await response.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        throw new Error('Endereço não encontrado');
    } catch (error) {
        throw new Error('Erro ao geocodificar endereço: ' + error.message);
    }
}

// Função para estimar distância baseada na cidade do endereço
function estimateDistanceByCity(address) {
    const lowerAddress = address.toLowerCase();
    if (lowerAddress.includes('suzano')) {
        return 5; // km
    } else if (lowerAddress.includes('são paulo') || lowerAddress.includes('sao paulo')) {
        return 30; // km
    } else if (lowerAddress.includes('mogi das cruzes') || lowerAddress.includes('poá') || lowerAddress.includes('ferraz de vasconcelos')) {
        return 20; // km
    } else {
        return 50; // km para outras cidades
    }
}

// Função para calcular o frete
async function calculateShippingCost(destination) {
    // Estimar distância baseada na cidade
    const distanceKm = estimateDistanceByCity(destination);

    // Verificar se atende a região
    if (distanceKm > 30) {
        return { cost: null, distance: distanceKm };
    }

    // Cálculo do frete: R$ 7,00 para até 5 km, + R$ 1,00 por km adicional
    let shippingCost = 7.00; // mínimo
    if (distanceKm > 5) {
        shippingCost += (distanceKm - 5) * 1.00; // R$ 1 por km adicional
    }

    return { cost: shippingCost, distance: distanceKm };
}

// Traduções para checkout
const checkoutTranslations = {
    pt: {
        back: '← Voltar',
        title: 'Detalhes da Compra',
        subtitle: 'Preencha suas informações para finalizar o pedido',
        orderSummary: 'Resumo do Pedido',
        customerData: 'Dados do Cliente',
        fullName: 'Nome Completo *',
        phone: 'Telefone *',
        deliveryMethod: 'Método de Entrega *',
        select: 'Selecione...',
        delivery: 'Entrega',
        pickup: 'Retirar na Loja',
        cep: 'CEP *',
        cepLink: 'Não sei meu CEP',
        address: 'Endereço *',
        addressPlaceholder: 'Rua, bairro',
        number: 'Número *',
        numberPlaceholder: 'Número da residência',
        paymentMethod: 'Forma de Pagamento *',
        cash: 'Dinheiro',
        pix: 'PIX',
        card: 'Cartão de Crédito/Débito',
        notes: 'Observações',
        notesPlaceholder: 'Instruções especiais para entrega...',
        finalizeOrder: 'Finalizar Pedido no WhatsApp',
        total: 'Total:',
        emptyCart: 'Carrinho vazio',
        quantity: 'Quantidade:',
        cepNotFound: 'CEP não encontrado!',
        cepError: 'Erro ao buscar endereço. Tente novamente.',
        fillFields: 'Por favor, preencha todos os campos obrigatórios.',
        confirmDelivery: '_Por favor, confirme a entrega!_',
        confirmPickup: '_Por favor, avise quando estiver pronto para retirada!_',
        newOrder: '*NOVO PEDIDO - SUA ADEGA*',
        client: '*Cliente:*',
        deliveryMethodLabel: '*Método de Entrega:*',
        cepLabel: '*CEP:*',
        addressLabel: '*Endereço:*',
        paymentLabel: '*Pagamento:*',
        notesLabel: '*Observações:*',
        orderLabel: '*PEDIDO:*'
    },
    en: {
        back: '← Back',
        title: 'Purchase Details',
        subtitle: 'Fill in your information to complete the order',
        orderSummary: 'Order Summary',
        customerData: 'Customer Data',
        fullName: 'Full Name *',
        phone: 'Phone *',
        deliveryMethod: 'Delivery Method *',
        select: 'Select...',
        delivery: 'Delivery',
        pickup: 'Pickup at Store',
        cep: 'ZIP Code *',
        cepLink: 'I don\'t know my ZIP Code',
        address: 'Address *',
        addressPlaceholder: 'Street, neighborhood',
        number: 'Number *',
        numberPlaceholder: 'House number',
        paymentMethod: 'Payment Method *',
        cash: 'Cash',
        pix: 'PIX',
        card: 'Credit/Debit Card',
        notes: 'Notes',
        notesPlaceholder: 'Special delivery instructions...',
        finalizeOrder: 'Complete Order on WhatsApp',
        total: 'Total:',
        emptyCart: 'Empty cart',
        quantity: 'Quantity:',
        cepNotFound: 'ZIP Code not found!',
        cepError: 'Error fetching address. Please try again.',
        fillFields: 'Please fill in all required fields.',
        confirmDelivery: '_Please confirm delivery!_',
        confirmPickup: '_Please let us know when ready for pickup!_',
        newOrder: '*NEW ORDER - YOUR WINERY*',
        client: '*Client:*',
        deliveryMethodLabel: '*Delivery Method:*',
        cepLabel: '*ZIP Code:*',
        addressLabel: '*Address:*',
        paymentLabel: '*Payment:*',
        notesLabel: '*Notes:*',
        orderLabel: '*ORDER:*'
    }
};

// Idioma atual
let currentLanguage = localStorage.getItem('language') || 'pt';

// Funções utilitárias para cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
}

function updateCheckoutLanguage() {
    const t = checkoutTranslations[currentLanguage];

    // Page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = currentLanguage === 'en' ? 'Purchase Details - Your Winery' : 'Detalhes da Compra - Sua Adega';

    // Header
    const backBtn = document.querySelector('header button');
    if (backBtn) backBtn.textContent = t.back;

    const title = document.querySelector('header h1');
    if (title) title.textContent = t.title;

    const subtitle = document.querySelector('header p');
    if (subtitle) subtitle.textContent = t.subtitle;

    // Order Summary
    const orderSummaryTitle = document.querySelector('#order-summary').previousElementSibling;
    if (orderSummaryTitle) orderSummaryTitle.textContent = t.orderSummary;

    // Customer Data
    const customerDataTitle = document.querySelector('#checkout-form h2');
    if (customerDataTitle) customerDataTitle.textContent = t.customerData;

    // Form labels
    const labels = document.querySelectorAll('#checkout-form label');
    labels.forEach(label => {
        const text = label.textContent.trim();
        if (text.includes('Nome Completo') || text.includes('Full Name')) label.textContent = t.fullName;
        else if (text.includes('Telefone') || text.includes('Phone')) label.textContent = t.phone;
        else if (text.includes('Método de Entrega') || text.includes('Delivery Method')) label.textContent = t.deliveryMethod;
        else if (text.includes('CEP') || text.includes('ZIP Code')) label.textContent = t.cep;
        else if (text.includes('Endereço') || text.includes('Address')) label.textContent = t.address;
        else if (text.includes('Número') || text.includes('Number')) label.textContent = t.number;
        else if (text.includes('Forma de Pagamento') || text.includes('Payment Method')) label.textContent = t.paymentMethod;
        else if (text.includes('Observações') || text.includes('Notes')) label.textContent = t.notes;
    });

    // Select options
    const deliverySelect = document.getElementById('delivery-method');
    if (deliverySelect) {
        deliverySelect.options[0].text = t.select;
        deliverySelect.options[1].text = t.delivery;
        deliverySelect.options[2].text = t.pickup;
    }

    const paymentSelect = document.getElementById('payment-method');
    if (paymentSelect) {
        paymentSelect.options[0].text = t.select;
        paymentSelect.options[1].text = t.cash;
        paymentSelect.options[2].text = t.pix;
        paymentSelect.options[3].text = t.card;
    }

    // Placeholders
    const addressInput = document.getElementById('customer-address');
    if (addressInput) addressInput.placeholder = t.addressPlaceholder;

    const numberInput = document.getElementById('customer-number');
    if (numberInput) numberInput.placeholder = t.numberPlaceholder;

    const notesTextarea = document.getElementById('customer-notes');
    if (notesTextarea) notesTextarea.placeholder = t.notesPlaceholder;

    // CEP link
    const cepLink = document.querySelector('#checkout-form a');
    if (cepLink) cepLink.textContent = t.cepLink;

    // Button
    const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
    if (submitBtn) submitBtn.textContent = t.finalizeOrder;

    // Total label
    const totalLabel = document.querySelector('#order-total').previousElementSibling;
    if (totalLabel) totalLabel.textContent = t.total;
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderOrderSummary();
        updateCheckoutLanguage();
        // Set initial state for delivery method
        toggleAddressFields();
    } else {
        // Redirect back if no cart
        window.location.href = 'index.html';
    }
}

function renderOrderSummary() {
    const summary = document.getElementById('order-summary');
    const total = document.getElementById('order-total');
    const t = checkoutTranslations[currentLanguage];

    if (cart.length === 0) {
        summary.innerHTML = `<p class="text-gray-500">${t.emptyCart}</p>`;
        total.textContent = 'R$ 0,00';
        return;
    }

    let summaryHTML = cart.map(item => `
        <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-lg mb-4">
            <img src="${item.image}" class="w-16 h-16 object-cover rounded-lg">
            <div class="flex-grow">
                <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                <p class="text-sm text-gray-600">${t.quantity} ${item.quantity}</p>
                <p class="font-brand font-bold text-zinc-900">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `).join('');

    // Adicionar endereço se for entrega
    const deliveryMethod = document.getElementById('delivery-method').value;
    if (deliveryMethod === 'entrega') {
        const cep = document.getElementById('customer-cep').value;
        const address = document.getElementById('customer-address').value;
        const number = document.getElementById('customer-number').value;
        if (cep || address || number) {
            summaryHTML += `
                <div class="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 class="font-bold text-sm text-gray-800 mb-2">Endereço de Entrega</h4>
                    <p class="text-sm text-gray-600">CEP: ${cep}</p>
                    <p class="text-sm text-gray-600">Endereço: ${address}, ${number}</p>
                </div>
            `;
        }
    }

    // Adicionar frete sempre
    summaryHTML += `
        <div class="mb-4">
            <p class="font-bold text-sm text-gray-800">Valor do Frete: R$ ${(deliveryMethod === 'entrega' ? currentShippingCost : 0).toFixed(2).replace('.', ',')}</p>
        </div>
    `;

    summary.innerHTML = summaryHTML;

    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalValue = itemsTotal + (deliveryMethod === 'entrega' ? currentShippingCost : 0);
    total.textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;
}

async function fetchAddressByCEP(cep) {
    const t = checkoutTranslations[currentLanguage];
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert(t.cepNotFound);
            return;
        }

        const address = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        document.getElementById('customer-address').value = address;
        // Calcular frete automaticamente se entrega selecionada
        const deliveryMethod = document.getElementById('delivery-method').value;
        if (deliveryMethod === 'entrega') {
            updateShippingCost();
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert(t.cepError);
    }
}



async function updateShippingCost() {
    const deliveryMethod = document.getElementById('delivery-method').value;
    if (deliveryMethod !== 'entrega') {
        currentShippingCost = 0;
        renderOrderSummary();
        return;
    }

    const address = document.getElementById('customer-address').value;

    if (!address) {
        // Manter o valor padrão até o endereço ser preenchido
        return;
    }

    const fullAddress = address; // Usar apenas o endereço para estimativa

    try {
        const result = await calculateShippingCost(fullAddress);
        if (result.cost === null) {
            // Distância > 30km, não atende
            const confirmPickup = confirm("Nossos entregadores não atendem essa região no momento. Deseja retirar na loja?");
            if (confirmPickup) {
                document.getElementById('delivery-method').value = 'retirar';
                // Limpar campos de localização
                document.getElementById('customer-cep').value = '';
                document.getElementById('customer-address').value = '';
                document.getElementById('customer-number').value = '';
                toggleAddressFields();
            } else {
                alert("Atendimento encerrado.");
                window.location.href = 'index.html';
            }
        } else {
            currentShippingCost = result.cost;
            renderOrderSummary();
        }
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        // Em caso de erro, manter o valor padrão
        alert('Erro ao calcular frete. Usando valor estimado.');
    }
}

function handleCEPInput(event) {
    const cep = event.target.value.replace(/\D/g, ''); // Remove non-digits

    if (cep.length === 8) {
        fetchAddressByCEP(cep);
    }
}

function toggleAddressFields() {
    const deliveryMethod = document.getElementById('delivery-method').value;
    const addressFields = document.getElementById('address-fields');
    const cep = document.getElementById('customer-cep');
    const address = document.getElementById('customer-address');
    const number = document.getElementById('customer-number');

    if (deliveryMethod === 'retirar') {
        addressFields.style.display = 'none';
        cep.required = false;
        address.required = false;
        number.required = false;
        currentShippingCost = 0;
        renderOrderSummary();
    } else {
        addressFields.style.display = 'block';
        cep.required = true;
        address.required = true;
        number.required = true;
        // Definir frete mínimo para entrega
        currentShippingCost = 7.00; // R$ 7,00 mínimo
        renderOrderSummary();
        // Calcular frete se endereço já preenchido
        if (address.value && number.value) {
            updateShippingCost();
        }
    }
}

async function handleCheckout(event) {
    event.preventDefault();
    const t = checkoutTranslations[currentLanguage];

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const deliveryMethod = document.getElementById('delivery-method').value;
    const cep = document.getElementById('customer-cep').value;
    const address = document.getElementById('customer-address').value;
    const number = document.getElementById('customer-number').value;
    const payment = document.getElementById('payment-method').value;
    const notes = document.getElementById('customer-notes').value;

    if (!name || !phone || !deliveryMethod || !payment) {
        alert(t.fillFields);
        return;
    }

    if (deliveryMethod === 'entrega' && (!cep || !address || !number)) {
        alert(t.fillFields);
        return;
    }

    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = itemsTotal + (deliveryMethod === 'entrega' ? currentShippingCost : 0);

    // Enviar dados para API gerar PDF
    try {
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
                shippingCost: currentShippingCost
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate PDF');
        }

        const { link } = await response.json();
        var pdfUrl = link;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Erro ao gerar PDF. Tente novamente.');
        return;
    }

    // Clear cart after order
    localStorage.removeItem('cart');

    // Construir mensagem do WhatsApp
    let addressInfo = '';
    if (deliveryMethod === 'entrega') {
        addressInfo = `\nCEP: ${cep}\nEndereço: ${address}, ${number}`;
    }

    const orderItems = cart.map(item => `* ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`).join('\n');

    const msg = `*NOVO PEDIDO - SUA ADEGA*\n\n` +
                `Cliente: ${name}\n` +
                `Telefone: ${phone}\n` +
                `Método de Entrega: ${deliveryMethod === 'entrega' ? 'Entrega' : 'Retirar na Loja'}` +
                addressInfo + `\n` +
                `Pagamento: ${payment}\n` +
                (notes ? `Observações: ${notes}\n\n` : '\n') +
                `PEDIDO:\n${orderItems}\n\n` +
                `Frete: R$ ${currentShippingCost.toFixed(2).replace('.', ',')}\n` +
                `Total: R$ ${total.toFixed(2).replace('.', ',')}\n` +
                `Link para o PDF do pedido: ${pdfUrl}\n\n` +
                `${deliveryMethod === 'entrega' ? '_Por favor, confirme a entrega!_' : '_Por favor, avise quando estiver pronto para retirada!_'}`;

    // Open WhatsApp with message (add small delay for Safari compatibility)
    setTimeout(() => {
        window.open(`https://wa.me/5511991854713?text=${encodeURIComponent(msg)}`, '_blank');
    }, 100);

    // Alert sobre o PDF
    alert('O PDF do pedido foi baixado automaticamente. O link para o PDF foi incluído na mensagem do WhatsApp. Envie a mensagem agora, a página será redirecionada em 1 minuto.');
    // Redirect to main page after 60 seconds
    setTimeout(() => window.location.href = 'index.html', 60000);
}

document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
document.getElementById('customer-cep').addEventListener('input', handleCEPInput);
document.getElementById('customer-address').addEventListener('input', () => {
    const deliveryMethod = document.getElementById('delivery-method').value;
    if (deliveryMethod === 'entrega') {
        updateShippingCost();
    }
});
document.getElementById('customer-number').addEventListener('input', () => {
    const deliveryMethod = document.getElementById('delivery-method').value;
    if (deliveryMethod === 'entrega') {
        updateShippingCost();
    }
});

window.onload = loadCart;
