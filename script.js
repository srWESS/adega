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

const products = [
    { id: 1, name: "Combo Jack Daniels 1L + 4 RedBull", price: 189.90, category: "combos", image: "Combo Jack Daniels 1L + 4 TNT.jpg", description: "Combo especial com Whisky Jack Daniels 1L e 4 latas de energético RedBull. Perfeito para noites animadas." },
    { id: 2, name: "Heineken 330ml Pack 6un", price: 39.90, category: "cervejas", image: "Heineken 330ml Pack 6un.jpg", description: "Cerveja premium Heineken em pack de 6 unidades de 330ml. Sabor único e refrescante." },
    { id: 3, name: "Vodka Smirnoff 998ml", price: 42.00, category: "destilados", image: "Vodka Smirnoff 998ml.jpg", description: "Vodka Smirnoff 998ml, ideal para drinks e coquetéis. Sabor suave e versátil." },
    { id: 4, name: "Narguilé Amazon Pride", price: 249.00, category: "tabacaria", image: "Narguilé Amazon Pride.jpg", description: "Narguilé Amazon Pride de alta qualidade, perfeito para sessões relaxantes." },
    { id: 5, name: "Vinho Casillero del Diablo 750ml", price: 54.90, category: "vinhos", image: "Vinho Casillero del Diablo 750m.jpg", description: "Vinho tinto Casillero del Diablo Cabernet Sauvignon 750ml. Elegante e encorpado." },
    { id: 6, name: "Combo Vodka Absolut 1L + 4 Red Bull", price: 199.90, category: "combos", image: "Combo Vodka Absolut 1L + 4 Red.jpg", description: "Combo com Vodka Absolut 1L e 4 latas de Red Bull. Energia e diversão garantidas." },
    { id: 7, name: "Kit Campari Garibaldi - 1 Campari 998ml + 1 Suco Nectar Tial Laranja 1000ml", price: 89.90, category: "combos", image: "Kit Campari Garibaldi.jpg", description: "Kit com Campari 998ml e suco de laranja Nectar Tial 1000ml. Perfeito para preparar drinks Garibaldi." },
    { id: 8, name: "Whisky White Horse 1 Litro + Energético Red Bull Energy Drink 250ml Pack com 6 Unidades", price: 129.90, category: "combos", image: "Combo Whisky + Energéticos.jpg", description: "Combo com Whisky White Horse 1L e 6 latas de Red Bull 250ml. Energia para a noite toda." },
    { id: 9, name: "Brahma 350ml Pack 6", price: 29.90, category: "cervejas", image: "rahma 350ml Pack 6.jpg", description: "Cerveja Brahma em pack de 6 unidades de 350ml. Clássica e refrescante." },
    { id: 10, name: "Skol 269ml Pack 12", price: 34.90, category: "cervejas", image: "Skol 269ml Pack 12.jpg", description: "Cerveja Skol em pack de 12 unidades de 269ml. Leve e acessível." },
    { id: 11, name: "Stella Artois 330ml Pack 6", price: 49.90, category: "cervejas", image: "Stella Artois 330ml Pack 6.jpg", description: "Cerveja premium Stella Artois em pack de 6 unidades. Sabor europeu." },
    { id: 12, name: "Whisky Johnnie Walker Red Label 1L", price: 159.90, category: "destilados", image: "Whisky Johnnie Walker Red Label 1L.jpg", description: "Whisky Johnnie Walker Red Label 1L. Blend suave e acessível." },
    { id: 13, name: "Gin Tanqueray 750ml", price: 119.90, category: "destilados", image: "Gin Tanqueray 750ml.jpg", description: "Gin Tanqueray 750ml. Clássico com toques de limão e gengibre." },
    { id: 14, name: "Rum Bacardi 1L", price: 89.90, category: "destilados", image: "Rum Bacardi 1L.jpg", description: "Rum Bacardi 1L. Versátil para drinks tropicais." },
    { id: 15, name: "Essências de Narguilé Ziggy unidade", price: 15.90, category: "tabacaria", image: "Essências de Narguilé Ziggy.jpg", description: "Essências Ziggy para narguilé. Sabores variados e intensos." },
    { id: 16, name: "Caixa de Carvão de Coco 1kg", price: 29.90, category: "tabacaria", image: "Caixa de Carvão de Coco 1kg.jpg", description: "Carvão de coco natural 1kg. Queima limpa e duradoura." },
    { id: 17, name: "Alumínio para Narguilé 10m", price: 9.90, category: "tabacaria", image: "Alumínio para Narguilé 10m.jpg", description: "Folha de alumínio para narguilé 10 metros. Essencial para sessões." },
    { id: 18, name: "Vinho Miolo Cabernet Sauvignon 750ml", price: 59.90, category: "vinhos", image: "Vinho Miolo Cabernet Sauvignon 750ml.jpg", description: "Vinho tinto Miolo Cabernet Sauvignon 750ml. Frutado e equilibrado." },
    { id: 19, name: "Vinho Salton Merlot 750ml", price: 49.90, category: "vinhos", image: "Vinho Salton Merlot 750ml.jpg", description: "Vinho tinto Salton Merlot 750ml. Suave e acessível." },
    { id: 20, name: "Vinho Concha y Toro Sauvignon Blanc 750ml", price: 69.90, category: "vinhos", image: "Vinho Concha y Toro Sauvignon Blanck.jpg", description: "Vinho branco Concha y Toro Sauvignon Blanc 750ml. Fresco e cítrico." },
    { id: 21, name: "Whisky + Combo Job 1L", price: 19.90, category: "mansao-maromba", image: "Whisky + Combo Job 1L.jpg", description: "Whisky Job 1L com combo especial. Sabor intenso e marcante." },
    { id: 22, name: "Gin Go Bells 1L", price: 19.90, category: "mansao-maromba", image: "Gin Go Bells 1L.jpg", description: "Gin Go Bells 1L. Refresco cítrico e elegante." },
    { id: 23, name: "Whisky Colors Berry 1L", price: 19.90, category: "mansao-maromba", image: "Whisky Colors Berry 1L.jpg", description: "Whisky Colors Berry 1L. Notas frutadas e suaves." },
    { id: 24, name: "Gin Tigrinho 1L", price: 19.90, category: "mansao-maromba", image: "Gin Tigrinho 1L.jpg", description: "Gin Tigrinho 1L. Clássico com toque especial." }
];

let cart = [];

function saveCartToStorage() {
    // Usar localStorage para persistência do carrinho
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateUI();
    }
}

function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(product => `
        <div class="product-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="relative overflow-hidden">
                 <img src="${product.image}" onclick="showProductDetail(${product.id})" class="w-full h-40 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer">
                 <div class="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-bold">
                    ${product.category.toUpperCase()}
                 </div>
            </div>
            <div class="p-4">
                <h4 class="font-bold text-sm text-gray-800 line-clamp-2 h-10 mb-1">${product.name}</h4>
                <span class="block text-xl font-brand font-bold text-zinc-900 mb-3">R$ ${product.price.toFixed(2).replace('.', ',')}</span>

                <!-- SELETOR DE QUANTIDADE NO CARD -->
                <div class="flex items-center justify-between bg-gray-50 rounded-xl p-1 mb-3 border border-gray-100">
                    <button onclick="adjustQty(${product.id}, -1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-zinc-900 hover:bg-gray-100 transition-colors">-</button>
                    <input type="number" id="qty-${product.id}" value="1" min="1" class="w-10 bg-transparent text-center font-bold text-sm outline-none" readonly>
                    <button onclick="adjustQty(${product.id}, 1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-zinc-900 hover:bg-gray-100 transition-colors">+</button>
                </div>

                <button onclick="addToCart(${product.id})" class="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-[11px] font-bold uppercase hover:bg-yellow-400 hover:text-black transition-all active:scale-95 shadow-sm">Adicionar</button>
            </div>
        </div>
    `).join('');
}

function adjustQty(id, delta) {
    const input = document.getElementById(`qty-${id}`);
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

// Nova função para ajustar quantidade dentro do carrinho
function adjustCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) {
            remove(id);
        } else {
            updateUI();
            saveCartToStorage();
        }
    }
}

function addToCart(id, customQty = null) {
    const product = products.find(p => p.id === id);
    const qtyInput = document.getElementById(`qty-${id}`);
    const quantity = customQty !== null ? customQty : parseInt(qtyInput.value);

    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }

    if (qtyInput) qtyInput.value = 1;
    updateUI();
    saveCartToStorage();

    const btn = event.target;
    if (btn && btn.tagName === 'BUTTON') {
        const originalText = btn.innerText;
        btn.innerText = "ADICIONADO! ✓";
        btn.classList.replace('bg-zinc-900', 'bg-green-500');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.replace('bg-green-500', 'bg-zinc-900');
        }, 800);
    }
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.quantity, 0);
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    const cartContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <p class="text-xs uppercase font-bold tracking-widest">Carrinho vazio</p>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative animate-in fade-in slide-in-from-right-4 duration-300">
            <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl shadow-sm">
            <div class="flex-grow">
                <h5 class="text-[11px] font-bold text-gray-800 uppercase tracking-tight leading-tight mb-1">${item.name}</h5>
                <div class="flex items-center justify-between">
                    <p class="text-sm font-brand font-bold text-zinc-900">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>

                    <!-- CONTROLES DE QUANTIDADE DENTRO DO CARRINHO -->
                    <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-100 ml-2">
                        <button onclick="adjustCartQty(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-colors">-</button>
                        <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                        <button onclick="adjustCartQty(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-xs font-bold hover:bg-green-50 hover:text-green-500 transition-colors">+</button>
                    </div>
                </div>
            </div>
            <button onclick="remove(${item.id})" class="ml-2 text-gray-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `).join('');
}

function remove(id) {
    cart = cart.filter(i => i.id !== id);
    updateUI();
    saveCartToStorage();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('translate-x-full');
    document.getElementById('cart-overlay').classList.toggle('hidden');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    menu.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

function filterCategory(cat) {
    if (cat === 'todos') renderProducts(products);
    else renderProducts(products.filter(p => p.category === cat));
    const t = translations[currentLanguage];
    document.getElementById('category-title').innerText = t.categories[cat] || cat;
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

function searchProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

function checkout() {
    if (cart.length === 0) return;

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Traduções
const translations = {
    pt: {
        title: 'A Bebida Gelada & O Rosh No Ponto!',
        searchPlaceholder: 'O que vamos beber hoje?',
        categoryTitle: 'Destaques',
        categories: {
            todos: 'Todos',
            combos: 'Combos',
            cervejas: 'Cervejas',
            destilados: 'Destilados',
            tabacaria: 'Tabacaria',
            vinhos: 'Vinhos',
            mansaoMaromba: 'Mansão Maromba'
        },
        cartTitle: 'Meu Carrinho',
        close: 'Fechar',
        emptyCart: 'Carrinho vazio',
        total: 'Total:',
        purchaseDetails: 'Detalhes da Compra',
        addToCart: 'Adicionar ao Carrinho',
        addButton: 'Adicionar',
        contact: 'Contato',
        footerButtons: {
            whatsapp: 'WhatsApp',
            location: 'Localização',
            instagram: 'Instagram'
        },
        ageWarning: '🚫 Venda proibida para menores de 18 anos',
        copyright: '&copy; 2023 Sua Adega. Todos os direitos reservados.',
        cookieText: 'Este site usa cookies para melhorar sua experiência. Cookies essenciais são sempre permitidos. Aceite para cookies não essenciais (preferências, marketing).',
        accept: 'Aceitar',
        reject: 'Rejeitar'
    },
    en: {
        title: 'The Cold Drink & The Perfect Rosh!',
        searchPlaceholder: 'What are we drinking today?',
        categoryTitle: 'Highlights',
        categories: {
            todos: 'All',
            combos: 'Combos',
            cervejas: 'Beers',
            destilados: 'Spirits',
            tabacaria: 'Tobacco',
            vinhos: 'Wines',
            mansaoMaromba: 'Mansao Maromba'
        },
        cartTitle: 'My Cart',
        close: 'Close',
        emptyCart: 'Empty cart',
        total: 'Total:',
        purchaseDetails: 'Purchase Details',
        addToCart: 'Add to Cart',
        addButton: 'Add',
        contact: 'Contact',
        footerButtons: {
            whatsapp: 'WhatsApp',
            location: 'Location',
            instagram: 'Instagram'
        },
        ageWarning: '🚫 Sale prohibited to minors under 18',
        copyright: '&copy; 2023 Your Winery. All rights reserved.',
        cookieText: 'This site uses cookies to improve your experience. Essential cookies are always allowed. Accept for non-essential cookies (preferences, marketing).',
        accept: 'Accept',
        reject: 'Reject'
    }
};

// Preferências persistentes com localStorage
let currentLanguage = localStorage.getItem('language') || 'pt';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
}

function updateLanguage() {
    const t = translations[currentLanguage];

    // Título principal
    const title = document.querySelector('h2');
    if (title) {
        title.textContent = t.title;
    }

    // Placeholder da busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = t.searchPlaceholder;
    }

    // Título da categoria
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
        categoryTitle.textContent = t.categoryTitle;
    }

    // Botões de categoria desktop
    const desktopCategoryButtons = document.querySelectorAll('nav button[onclick*="filterCategory"]');
    desktopCategoryButtons.forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const match = onclick.match(/filterCategory\('(\w+)'\)/);
        if (match) {
            const cat = match[1];
            btn.textContent = t.categories[cat] || cat;
        }
    });

    // Botões de categoria mobile
    const mobileCategoryButtons = document.querySelectorAll('#mobile-menu button[onclick*="filterCategory"]');
    mobileCategoryButtons.forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const match = onclick.match(/filterCategory\('([^']+)'\)/);
        if (match) {
            const cat = match[1];
            const textNode = btn.querySelector('.uppercase');
            if (textNode) {
                textNode.textContent = t.categories[cat] || cat;
            }
        }
    });

    // Carrinho
    const cartTitle = document.querySelector('#cart-sidebar h3');
    if (cartTitle) {
        cartTitle.textContent = t.cartTitle;
    }

    const closeBtn = document.querySelector('#cart-sidebar button');
    if (closeBtn) {
        closeBtn.textContent = t.close;
    }

    const emptyCartText = document.querySelector('#cart-items p');
    if (emptyCartText) {
        emptyCartText.textContent = t.emptyCart;
    }

    const totalLabel = document.querySelector('#cart-sidebar span:first-child');
    if (totalLabel) {
        totalLabel.textContent = t.total;
    }

    const purchaseBtn = document.querySelector('#cart-sidebar button:last-child');
    if (purchaseBtn) {
        purchaseBtn.textContent = t.purchaseDetails;
    }

    // Modal
    const modalBtn = document.querySelector('#product-modal button:last-child');
    if (modalBtn) {
        modalBtn.textContent = t.addToCart;
    }

    // Botões de adicionar produto
    const addButtons = document.querySelectorAll('.product-card button');
    addButtons.forEach(btn => {
        if (btn.textContent.toLowerCase() === 'adicionar' || btn.textContent.toLowerCase() === 'add') {
            btn.textContent = t.addButton;
        }
    });

    // Footer
    const contactTitle = document.querySelector('footer h3');
    if (contactTitle) {
        contactTitle.textContent = t.contact;
    }

    const footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(link => {
        if (link.textContent === 'WhatsApp' || link.textContent === 'Localização' || link.textContent === 'Instagram') {
            if (link.textContent === 'WhatsApp') link.textContent = t.footerButtons.whatsapp;
            else if (link.textContent === 'Localização') link.textContent = t.footerButtons.location;
            else if (link.textContent === 'Instagram') link.textContent = t.footerButtons.instagram;
        }
    });

    // Age warning removed as we have cookie verification

    // Removed to allow HTML copyright text

    // Cookie banner
    const cookieText = document.querySelector('#cookie-banner p');
    if (cookieText) {
        cookieText.textContent = t.cookieText;
    }

    const acceptBtn = document.getElementById('accept-cookies');
    if (acceptBtn) {
        acceptBtn.textContent = t.accept;
    }

    const rejectBtn = document.getElementById('reject-cookies');
    if (rejectBtn) {
        rejectBtn.textContent = t.reject;
    }

    // Botão de idioma
    const langBtn = document.getElementById('lang-text');
    if (langBtn) {
        langBtn.textContent = currentLanguage.toUpperCase();
    }
}



// Verificação de idade
function showAgeBanner() {
    if (getCookie('ageVerified')) return;
    const banner = document.getElementById('age-banner');
    if (banner) banner.classList.remove('hidden');
}

function acceptAge() {
    setCookie('ageVerified', 'true', 365);
    document.getElementById('age-banner').classList.add('hidden');
}

window.onload = () => {
    renderProducts(products);
    loadCartFromStorage();
    updateLanguage();
    showAgeBanner();
};

// Event listeners para banner
document.addEventListener('DOMContentLoaded', () => {
    const acceptBtn = document.getElementById('accept-age');
    if (acceptBtn) acceptBtn.addEventListener('click', acceptAge);
});

// Funções do modal de detalhes do produto
let currentModalProductId = null;

function showProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentModalProductId = id;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-category').textContent = product.category.toUpperCase();
    document.getElementById('modal-qty').value = 1;

    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    currentModalProductId = null;
}

function adjustQtyModal(delta) {
    const input = document.getElementById('modal-qty');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function addToCartFromModal() {
    if (!currentModalProductId) return;

    const qty = parseInt(document.getElementById('modal-qty').value);
    addToCart(currentModalProductId, qty);
    closeProductModal();
}
