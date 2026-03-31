// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Fade-up animation observer
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Toast function
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><span>${message}</span>`;
    if (isError) toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Scroll lock functions
let scrollPosition = 0;
function disableScroll() {
    scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}
function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
}

// ============ CALCULATOR CONFIGURATION ============
function getDeadlineMultiplier(days, isPhoto = false) {
    if (isPhoto) {
        const multiplier = 2 - (days - 1) / 6;
        return Math.min(2.0, Math.max(1.0, multiplier));
    }
    const multiplier = 2 - (days - 3) / 27;
    return Math.min(2.0, Math.max(1.0, multiplier));
}

function getMultiplierDescription(days, isPhoto = false) {
    const multiplier = getDeadlineMultiplier(days, isPhoto);
    if (days <= (isPhoto ? 2 : 5)) return `🔥 Сверхсрочно! ×${multiplier.toFixed(2)}`;
    if (days <= (isPhoto ? 3 : 10)) return `⚡ Срочно! ×${multiplier.toFixed(2)}`;
    if (days <= (isPhoto ? 5 : 20)) return `📅 Обычный срок ×${multiplier.toFixed(2)}`;
    return `✅ Оптимальный срок ×${multiplier.toFixed(2)}`;
}

// Options configuration
const serviceOptions = {
    adaptive: { name: "Адаптация под мобильные устройства", price: 500, desc: "Корректное отображение на всех устройствах" },
    hosting: { name: "Хостинг и домен в подарок", price: 500, desc: "Бесплатный хостинг и домен на первый год" },
    support: { name: "Поддержка сайта после разработки", price: 500, desc: "Техническая поддержка в течение месяца" },
    calculator: { name: "Калькулятор расчета стоимости", price: 1000, desc: "Интерактивный калькулятор как на этом сайте" },
    delivery: { name: "Подключение служб доставки (CDEK)", price: 2000, desc: "Интеграция с СДЭК для интернет-магазинов" },
    crm: { name: "Интеграция с CRM", price: 2000, desc: "Подключение CRM-системы для управления клиентами" },
    payment: { name: "Онлайн оплата", price: 5000, desc: "Прием платежей через карты и электронные кошельки" },
    admin: { name: "Административная панель", price: 1700, desc: "Удобное редактирование контента сайта" }
};

// Какие опции доступны для каждого сервиса
const serviceOptionsMap = {
    design: [], // для дизайна нет опций
    dev: ['adaptive', 'hosting', 'support', 'calculator', 'delivery', 'crm', 'payment', 'admin'],
    full: ['adaptive', 'hosting', 'support', 'calculator', 'delivery', 'crm', 'payment', 'admin'],
    shop: ['adaptive', 'hosting', 'support', 'calculator', 'delivery', 'crm', 'payment', 'admin']
};

const servicesConfig = {
    design: {
        title: "Разработка макета (UX/UI)",
        base: 1000,
        perBlock: 200,
        fields: [{ type: "number", label: "Количество блоков", min: 1, default: 3, key: "blocks" }],
        calc: (vals) => servicesConfig.design.base + (vals.blocks * servicesConfig.design.perBlock),
        getDetails: (vals) => `📐 Количество блоков: ${vals.blocks}`
    },
    dev: {
        title: "Вёрстка / Программирование (по готовому макету)",
        base: 5000,
        perBlock: 200,
        perPage: 500,
        fields: [
            { type: "number", label: "Количество блоков", min: 1, default: 5, key: "blocks" },
            { type: "number", label: "Количество страниц", min: 1, default: 2, key: "pages" }
        ],
        calc: (vals) => servicesConfig.dev.base + (vals.blocks * servicesConfig.dev.perBlock) + (vals.pages * servicesConfig.dev.perPage),
        getDetails: (vals) => `📐 Блоков: ${vals.blocks}\n📄 Страниц: ${vals.pages}`
    },
    full: {
        title: "Ваш сайт от идеи до запуска (под ключ)",
        baseDesign: 1000,
        baseDev: 5000,
        perBlock: 200,
        perPage: 500,
        fields: [
            { type: "number", label: "Количество блоков", min: 1, default: 5, key: "blocks" },
            { type: "number", label: "Количество страниц", min: 1, default: 2, key: "pages" }
        ],
        calc: (vals) => servicesConfig.full.baseDesign + servicesConfig.full.baseDev + (vals.blocks * servicesConfig.full.perBlock) + (vals.pages * servicesConfig.full.perPage),
        getDetails: (vals) => `🎨 Макет: 1000 ₽\n💻 Программирование:\n  📐 Блоки: ${vals.blocks} (${vals.blocks * 200} ₽)\n  📄 Страницы: ${vals.pages} (${vals.pages * 500} ₽)`
    },
    shop: {
        title: "Интернет-магазин (под ключ)",
        base: 35000,
        fields: [],
        calc: (vals) => servicesConfig.shop.base,
        getDetails: (vals) => `🛍️ Интернет-магазин под ключ`
    }
};

let currentService = "design";
let currentValues = { blocks: 3 };
let currentDeadline = 14;
let selectedOptions = {};
let messagePreviewElement = null;

// Options rendering
function renderOptions() {
    const container = document.getElementById('optionsCheckboxes');
    const optionsGroup = document.getElementById('optionsGroup');
    if (!container) return;

    const availableOptions = serviceOptionsMap[currentService] || [];

    if (availableOptions.length === 0) {
        optionsGroup.style.display = 'none';
        return;
    }
    optionsGroup.style.display = 'block';

    let html = '';
    for (const key of availableOptions) {
        const opt = serviceOptions[key];
        html += `
            <div class="checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" data-option="${key}" ${selectedOptions[key] ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    <span class="checkbox-text"><strong>${opt.name}</strong> (+${opt.price}₽)<br><small>${opt.desc}</small></span>
                </label>
            </div>
        `;
    }
    container.innerHTML = html;
    document.querySelectorAll('#optionsCheckboxes input').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const key = cb.getAttribute('data-option');
            if (cb.checked) selectedOptions[key] = true;
            else delete selectedOptions[key];
            updateTotal();
            updateMessagePreview();
        });
    });
}

function getOptionsTotal() {
    let total = 0;
    for (const [key, val] of Object.entries(selectedOptions)) {
        if (val && serviceOptions[key]) total += serviceOptions[key].price;
    }
    return total;
}

function getBasePrice() {
    const config = servicesConfig[currentService];
    return config.calc(currentValues);
}

function getFinalPriceWithDeadline() {
    const basePrice = getBasePrice() + getOptionsTotal();
    const multiplier = getDeadlineMultiplier(currentDeadline);
    return Math.round(basePrice * multiplier);
}

function updateTotal() {
    const finalPrice = getFinalPriceWithDeadline();
    const priceBadge = document.getElementById('totalPrice');
    if (priceBadge) priceBadge.innerText = finalPrice + ' ₽';
    updateDeadlineBadge();
}

function updateDeadlineBadge() {
    const multiplier = getDeadlineMultiplier(currentDeadline);
    const deadlineBadge = document.getElementById('deadlineBadge');
    if (deadlineBadge) {
        if (currentDeadline <= 5) deadlineBadge.innerHTML = '🔥🔥 СРОЧНО! +' + Math.round((multiplier - 1) * 100) + '% 🔥🔥';
        else if (currentDeadline <= 10) deadlineBadge.innerHTML = '⚡ Срочный заказ +' + Math.round((multiplier - 1) * 100) + '%';
        else if (currentDeadline <= 20) deadlineBadge.innerHTML = '📅 Стандартный срок';
        else deadlineBadge.innerHTML = '✅ Оптимальный срок';
    }
    const multiplierInfo = document.getElementById('multiplierInfo');
    if (multiplierInfo) {
        multiplierInfo.innerHTML = `⚠️ Коэффициент срочности: ×${multiplier.toFixed(2)} (${getMultiplierDescription(currentDeadline)})`;
        multiplierInfo.style.color = multiplier > 1.05 ? '#f59e0b' : '#22c55e';
    }
}

function generateOrderMessage() {
    const config = servicesConfig[currentService];
    const details = config.getDetails(currentValues);
    const basePrice = getBasePrice();
    const optionsTotal = getOptionsTotal();
    const finalPrice = getFinalPriceWithDeadline();
    const multiplier = getDeadlineMultiplier(currentDeadline);

    let optionsText = '';
    if (Object.keys(selectedOptions).length > 0) {
        optionsText = '\n\n📋 Дополнительные опции:\n';
        for (const [key, val] of Object.entries(selectedOptions)) {
            if (val && serviceOptions[key]) optionsText += `  • ${serviceOptions[key].name} (+${serviceOptions[key].price}₽)\n`;
        }
    }

    let deadlineText = getMultiplierDescription(currentDeadline);

    const message = `Здравствуйте! Я рассчитал стоимость для заказа разработки сайта:

📌 Услуга: ${config.title}

${details}${optionsText}

⏱️ Срок выполнения: ${currentDeadline} дней (${deadlineText})

💰 Расчет стоимости:
   Базовая стоимость: ${basePrice} ₽
   Дополнительные опции: +${optionsTotal} ₽
   × Коэффициент срочности: ${multiplier.toFixed(2)}
   = Итоговая стоимость: ${finalPrice} ₽

Хочу заказать разработку! Жду вашего ответа.`;
    return message;
}

function renderCalculator() {
    const config = servicesConfig[currentService];
    const fieldsContainer = document.getElementById('calculatorFields');
    const serviceTitle = document.getElementById('serviceTitle');
    if (serviceTitle) serviceTitle.innerText = config.title;

    const defaults = {};
    config.fields.forEach(field => {
        if (field.type === 'number') defaults[field.key] = field.default;
        if (field.type === 'checkbox') defaults[field.key] = field.default;
    });
    if (!currentValues || Object.keys(currentValues).length === 0) currentValues = { ...defaults };
    else config.fields.forEach(field => { if (currentValues[field.key] === undefined) currentValues[field.key] = field.default; });

    let html = '';
    config.fields.forEach(field => {
        if (field.type === 'number') {
            html += `<div class="input-group"><label>${field.label}</label><input type="number" id="${field.key}" min="${field.min}" value="${currentValues[field.key]}" step="1"></div>`;
        } else if (field.type === 'checkbox') {
            html += `<div class="input-group"><label style="display: flex; align-items: center; gap: 10px; cursor: pointer;"><input type="checkbox" id="${field.key}" ${currentValues[field.key] ? 'checked' : ''}> ${field.label}</label></div>`;
        }
    });
    if (fieldsContainer) fieldsContainer.innerHTML = html;

    config.fields.forEach(field => {
        const el = document.getElementById(field.key);
        if (el) {
            el.addEventListener('change', (e) => {
                if (field.type === 'checkbox') currentValues[field.key] = e.target.checked;
                else currentValues[field.key] = parseInt(e.target.value) || 0;
                updateTotal();
                updateMessagePreview();
            });
        }
    });
    updateTotal();
    updateMessagePreview();
}

function updateMessagePreview() {
    if (messagePreviewElement) {
        const message = generateOrderMessage();
        messagePreviewElement.innerHTML = message.replace(/\n/g, '<br>');
    }
}

function createMessagePreview() {
    if (!messagePreviewElement) {
        const orderBtn = document.getElementById('orderBtn');
        const previewDiv = document.createElement('div');
        previewDiv.className = 'message-preview';
        previewDiv.innerHTML = `<div class="preview-header"><div class="preview-header-left"><i class="fas fa-comment-dots"></i><span>Предпросмотр сообщения для заказа</span></div><button class="copy-preview-btn" id="copyPreviewBtn"><i class="fas fa-copy"></i> Копировать сообщение</button></div><div class="preview-content" id="messagePreviewContent">Сообщение будет сформировано...</div>`;
        if (orderBtn && orderBtn.parentNode) {
            orderBtn.insertAdjacentElement('afterend', previewDiv);
            messagePreviewElement = document.getElementById('messagePreviewContent');
            document.getElementById('copyPreviewBtn').addEventListener('click', () => copyToClipboard(generateOrderMessage()));
        }
    }
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('✅ Сообщение скопировано в буфер обмена!');
    } catch (err) { showToast('❌ Не удалось скопировать', true); }
}

function sendOrderToVK() {
    const vkGroupLink = 'https://vk.com/krdwebcode';
    const orderMessage = document.getElementById('orderMessage');
    orderMessage.innerHTML = `✅ Открывается сообщество ВКонтакте...`;
    orderMessage.classList.add('success');
    orderMessage.style.display = 'block';
    setTimeout(() => window.open(vkGroupLink, '_blank'), 500);
    setTimeout(() => orderMessage.style.display = 'none', 5000);
}

// ============ PHOTO CALCULATOR ============
let photoCount = 1;
let photoType = 'retouch';
let photoColorize = false;
let photoAnimate = false;
let photoDeadline = 4;
let photoMessagePreviewElement = null;

function getPhotoBasePrice() {
    let pricePerPhoto = photoType === 'retouch' ? 150 : 200;
    let total = photoCount * pricePerPhoto;
    if (photoColorize) total += photoCount * 50;
    if (photoAnimate) total += photoCount * 50;
    return total;
}

function getPhotoFinalPrice() {
    const multiplier = getDeadlineMultiplier(photoDeadline, true);
    return Math.round(getPhotoBasePrice() * multiplier);
}

function updatePhotoTotal() {
    const finalPrice = getPhotoFinalPrice();
    document.getElementById('photoTotalPrice').innerText = finalPrice + ' ₽';
    updatePhotoDeadlineBadge();
}

function updatePhotoDeadlineBadge() {
    const multiplier = getDeadlineMultiplier(photoDeadline, true);
    const badge = document.getElementById('photoDeadlineBadge');
    if (badge) {
        if (photoDeadline <= 2) badge.innerHTML = '🔥🔥 СРОЧНО! +' + Math.round((multiplier - 1) * 100) + '% 🔥🔥';
        else if (photoDeadline <= 3) badge.innerHTML = '⚡ Срочный заказ +' + Math.round((multiplier - 1) * 100) + '%';
        else if (photoDeadline <= 5) badge.innerHTML = '📅 Стандартный срок';
        else badge.innerHTML = '✅ Оптимальный срок';
    }
    const multiplierInfo = document.getElementById('photoMultiplierInfo');
    if (multiplierInfo) {
        multiplierInfo.innerHTML = `⚠️ Коэффициент срочности: ×${multiplier.toFixed(2)} (${getMultiplierDescription(photoDeadline, true)})`;
    }
}

function generatePhotoOrderMessage() {
    const typeText = photoType === 'retouch' ? 'Хорошую фотографию отфотошопить' : 'Восстановление старого/поврежденного фото';
    let details = `📸 Количество фото: ${photoCount}\n🖼️ Тип обработки: ${typeText} (${photoType === 'retouch' ? '150' : '200'}₽/шт)`;
    if (photoColorize) details += `\n🎨 Сделать цветным: Да (+50₽/шт)`;
    if (photoAnimate) details += `\n✨ Оживление фото: Да (+50₽/шт)`;
    const basePrice = getPhotoBasePrice();
    const finalPrice = getPhotoFinalPrice();
    const multiplier = getDeadlineMultiplier(photoDeadline, true);
    const deadlineText = getMultiplierDescription(photoDeadline, true);

    return `Здравствуйте! Я рассчитал стоимость обработки фотографий:

📌 Услуга: Обработка фотографий

${details}

⏱️ Срок выполнения: ${photoDeadline} дней (${deadlineText})

💰 Расчет стоимости:
   Базовая стоимость: ${basePrice} ₽
   × Коэффициент срочности: ${multiplier.toFixed(2)}
   = Итоговая стоимость: ${finalPrice} ₽

Хочу заказать обработку! Жду вашего ответа.`;
}

function updatePhotoMessagePreview() {
    if (photoMessagePreviewElement) {
        const message = generatePhotoOrderMessage();
        photoMessagePreviewElement.innerHTML = message.replace(/\n/g, '<br>');
    }
}

function sendPhotoOrderToVK() {
    const message = generatePhotoOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const vkGroupLink = `https://vk.com/write-225202490?message=${encodedMessage}`;
    const orderMessage = document.getElementById('photoOrderMessage');
    orderMessage.innerHTML = `✅ Сообщение сформировано! Открывается диалог с сообществом...`;
    orderMessage.classList.add('success');
    orderMessage.style.display = 'block';
    setTimeout(() => window.open(vkGroupLink, '_blank'), 500);
    setTimeout(() => orderMessage.style.display = 'none', 5000);
}

// Initialize Photo Preview
function createPhotoMessagePreview() {
    const previewDiv = document.getElementById('photoMessagePreview');
    if (previewDiv) {
        photoMessagePreviewElement = document.getElementById('photoPreviewContent');
        const copyBtn = document.getElementById('copyPhotoPreviewBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => copyToClipboard(generatePhotoOrderMessage()));
        }
        updatePhotoMessagePreview();
    }
}

// ============ INITIALIZATION ============
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentService = btn.getAttribute('data-service');
        const config = servicesConfig[currentService];
        const defaults = {};
        config.fields.forEach(field => { if (field.type === 'number') defaults[field.key] = field.default; });
        currentValues = { ...defaults };
        selectedOptions = {};
        renderOptions();
        renderCalculator();
    });
});

const deadlineSlider = document.getElementById('deadlineSlider');
const deadlineValue = document.getElementById('deadlineValue');
if (deadlineSlider) {
    deadlineSlider.addEventListener('input', (e) => {
        currentDeadline = parseInt(e.target.value);
        if (deadlineValue) deadlineValue.innerText = currentDeadline;
        updateTotal();
        updateMessagePreview();
    });
}

document.getElementById('orderBtn').addEventListener('click', sendOrderToVK);

// Photo calculator init
const photoCountInput = document.getElementById('photoCount');
const photoRetouch = document.getElementById('photoRetouch');
const photoRestore = document.getElementById('photoRestore');
const photoColorizeCheck = document.getElementById('photoColorize');
const photoAnimateCheck = document.getElementById('photoAnimate');
const photoDeadlineSlider = document.getElementById('photoDeadlineSlider');
const photoDeadlineValue = document.getElementById('photoDeadlineValue');

if (photoCountInput) photoCountInput.addEventListener('input', () => { photoCount = parseInt(photoCountInput.value) || 1; updatePhotoTotal(); updatePhotoMessagePreview(); });
if (photoRetouch) photoRetouch.addEventListener('change', () => { if (photoRetouch.checked) photoType = 'retouch'; updatePhotoTotal(); updatePhotoMessagePreview(); });
if (photoRestore) photoRestore.addEventListener('change', () => { if (photoRestore.checked) photoType = 'restore'; updatePhotoTotal(); updatePhotoMessagePreview(); });
if (photoColorizeCheck) photoColorizeCheck.addEventListener('change', () => { photoColorize = photoColorizeCheck.checked; updatePhotoTotal(); updatePhotoMessagePreview(); });
if (photoAnimateCheck) photoAnimateCheck.addEventListener('change', () => { photoAnimate = photoAnimateCheck.checked; updatePhotoTotal(); updatePhotoMessagePreview(); });
if (photoDeadlineSlider) {
    photoDeadlineSlider.addEventListener('input', () => {
        photoDeadline = parseInt(photoDeadlineSlider.value);
        if (photoDeadlineValue) photoDeadlineValue.innerText = photoDeadline;
        updatePhotoTotal();
        updatePhotoMessagePreview();
    });
}
document.getElementById('photoOrderBtn')?.addEventListener('click', sendPhotoOrderToVK);

// Swiper for reviews
new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
});

// Privacy modal
const consentCheckbox = document.getElementById('consentCheckbox');
const submitBtn = document.getElementById('submitBtn');
const privacyPolicyLink = document.getElementById('privacyPolicyLink');
const privacyModal = document.getElementById('privacyModal');
const modalClose = document.querySelector('.modal-close');
const modalCloseBtn = document.querySelector('.modal-close-btn');

function updateSubmitButtonState() {
    if (submitBtn && consentCheckbox) submitBtn.disabled = !consentCheckbox.checked;
}
if (consentCheckbox) consentCheckbox.addEventListener('change', updateSubmitButtonState);
if (privacyPolicyLink) {
    privacyPolicyLink.addEventListener('click', (e) => { e.preventDefault(); if (privacyModal) { disableScroll(); privacyModal.style.display = 'block'; } });
}
function closePrivacyModal() { if (privacyModal) { privacyModal.style.display = 'none'; enableScroll(); } }
if (modalClose) modalClose.addEventListener('click', closePrivacyModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePrivacyModal);
window.addEventListener('click', (e) => { if (e.target === privacyModal) closePrivacyModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && privacyModal && privacyModal.style.display === 'block') closePrivacyModal(); });

// Initialize
renderCalculator();
renderOptions();
createMessagePreview();
createPhotoMessagePreview();
updatePhotoTotal();