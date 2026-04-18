// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => { navLinks.classList.toggle('active'); });
document.querySelectorAll('.nav-links a').forEach(link => { link.addEventListener('click', () => { navLinks.classList.remove('active'); }); });

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
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    });
});

// Fade-up animation observer
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><span>${message}</span>`;
    if (isError) toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

let scrollPosition = 0;
function disableScroll() { scrollPosition = window.scrollY; document.body.style.overflow = 'hidden'; document.body.style.position = 'fixed'; document.body.style.top = `-${scrollPosition}px`; document.body.style.width = '100%'; }
function enableScroll() { document.body.style.overflow = ''; document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = ''; window.scrollTo(0, scrollPosition); }

// ============ ЗАГРУЗКА ДАННЫХ ============
let prices = {};
function loadPrices() {
    const saved = localStorage.getItem('webcode_prices');
    if (saved) { prices = JSON.parse(saved); }
    else {
        prices = {
            designBase: 1500, designPerBlock: 500,
            devBase: 8000, devPerPage: 700, devPerBlock: 400,
            fullBase: 7000, fullPerPage: 700, fullPerBlock: 400,
            shopBase: 50000,
            adaptive: 650, hosting: 650, support: 500, calculator: 1500, delivery: 2000, crm: 2000, payment: 5000, adminPanel: 1700,
            photoRetouch: 150, photoRestore: 200, photoColorize: 50, photoAnimate: 50
        };
    }
}
loadPrices();

// ============ ОТПРАВКА НА ПОЧТУ ============
async function sendToEmail(orderData) {
    const formData = new FormData();
    formData.append('name', orderData.name);
    formData.append('phone', orderData.contact);
    formData.append('service', orderData.serviceType);
    formData.append('details', orderData.details || '');
    formData.append('price', orderData.finalPrice);
    formData.append('_subject', `Новая заявка с сайта WEBCODE!`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    try {
        const response = await fetch('https://formsubmit.co/ajax/artem.26.2004@bk.ru', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            console.log('Письмо отправлено');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Ошибка отправки письма:', error);
        return false;
    }
}

// ============ ПОРТФОЛИО ============
function loadPortfolio() {
    const saved = localStorage.getItem('webcode_portfolio');
    if (saved) { renderPortfolio(JSON.parse(saved)); }
    else { fetchDefaultPortfolio(); }
}
function fetchDefaultPortfolio() {
    const defaultPortfolio = [
        { id: 1, title: "Gourmet Restaurant", description: "Сайт ресторана с онлайн-бронированием", image: "images/project1.png", link: "https://skyson8.github.io/Gourmet-Food/", year: "2025", days: "21", tags: ["HTML5","CSS3","JavaScript","React","Node.js"] },
        { id: 2, title: "IT AURORA", description: "Лендинг для IT-компании", image: "images/project2.png", link: "https://skyson8.github.io/Aurora/", year: "2024", days: "14", tags: ["HTML5","CSS3","JavaScript","GSAP"] },
        { id: 3, title: "Business Group", description: "Корпоративный сайт с CRM", image: "images/project3.png", link: "https://skyson8.github.io/BusinessGroup/", year: "2025", days: "28", tags: ["HTML5","CSS3","JavaScript","Vue.js","Laravel"] },
        { id: 4, title: "Точка Моды", description: "Интернет-магазин одежды", image: "images/project4.png", link: "https://skyson8.github.io/tochkamody/", year: "2026", days: "21", tags: ["HTML5","CSS3","JavaScript","Vue.js","Laravel"] },
        { id: 5, title: "Портфолио монтажера", description: "Сайт-визитка видеомонтажера", image: "images/project5.png", link: "https://www.portfolio-arsen-useinov.ru", year: "2026", days: "7", tags: ["HTML5","CSS3","JavaScript","Vue.js","Laravel"] }
    ];
    renderPortfolio(defaultPortfolio);
}
function renderPortfolio(items) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    grid.innerHTML = items.map(item => `
        <div class="gallery-card">
            <div class="gallery-card-image"><img src="${item.image}" alt="${item.title}"></div>
            <div class="gallery-card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="project-details"><div class="detail-item"><i class="fas fa-calendar-alt"></i><span>${item.year}</span></div><div class="detail-item"><i class="fas fa-clock"></i><span>${item.days} дней</span></div></div>
                <div class="tech-tags">${item.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <div class="gallery-card-buttons"><a href="${item.link}" class="btn-visit-site" target="_blank"><i class="fas fa-external-link-alt"></i> Посмотреть сайт</a></div>
            </div>
        </div>
    `).join('');
}
loadPortfolio();

// ============ ОТЗЫВЫ ============
const reviewsData = [
    { name: "Арсен У.", project: "Видеомонтажер", text: "Стильный минималистичный дизайн для портфолио - это вам к этим ребятам )) Спасибо!" },
    { name: "Дмитрий В.", project: "Студия дизайна", text: "Профессиональный подход, учли все пожелания. Сайт получился стильным, с калькулятором, как я и хотел. Спасибо команде!" },
    { name: "Елена М.", project: "Интернет-магазин", text: "Быстро, качественно, с душой. Даже после запуска помогали с настройками. Обращусь ещё!" },
    { name: "Михаил С.", project: "Частный клиент", text: "Заказал обработку старых семейных фото. Результат превзошёл ожидания! Фотографии стали как новые, а оживление фото добавило магии." },
    { name: "Сергей К.", project: "Fashion Store", text: "Разработали интернет-магазин с интеграцией CRM и службой доставки. Всё работает отлично, клиенты довольны." },
    { name: "Ольга Н.", project: "Частный клиент", text: "Очень понравилась работа с фото. Сделали цветным старое черно-белое фото и оживили его. Технологии на высоте!" }
];

function renderReviewsSwiper() {
    const container = document.getElementById('reviewsSwiperWrapper');
    if (!container) return;
    let html = '';
    reviewsData.forEach((review, index) => {
        html += `
            <div class="swiper-slide">
                <div class="review-card" itemscope itemtype="https://schema.org/Review">
                    <div class="stars">★★★★★</div>
                    <p class="review-text" itemprop="reviewBody">"${review.text}"</p>
                    <div class="reviewer" itemprop="author">— ${review.name}, ${review.project}</div>
                    <meta itemprop="reviewRating" content="5">
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    new Swiper('.reviews-swiper', {
        slidesPerView: 1, spaceBetween: 30, loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

// ============ ОСНОВНОЙ КАЛЬКУЛЯТОР ============
let currentStep = 1, selectedService = null, serviceParams = {}, selectedOptions = {};

function renderStep() {
    const container = document.getElementById('stepContent');
    if (!container) return;
    if (currentStep === 1) {
        container.innerHTML = `
            <div class="service-selector">
                <div class="service-card" data-service="design"><i class="fas fa-pen-fancy"></i><h3>Разработка макета (UX/UI)</h3><p>Создание дизайн-макета вашего будущего сайта.</p><div class="service-price">от ${prices.designBase} ₽</div></div>
                <div class="service-card" data-service="dev"><i class="fas fa-laptop-code"></i><h3>Вёрстка / Программирование</h3><p>Разработка сайта по готовому макету.</p><div class="service-price">от ${prices.devBase} ₽</div></div>
                <div class="service-card" data-service="full"><i class="fas fa-rocket"></i><h3>Сайт (Под ключ) <span class="badge">Выгодно</span></h3><p>Полный цикл: макет + вёрстка.</p><div class="service-price">от ${prices.fullBase} ₽</div></div>
                <div class="service-card" data-service="shop"><i class="fas fa-store"></i><h3>Интернет-магазин (Под ключ)</h3><p>Полноценный интернет-магазин с корзиной и оплатой.</p><div class="service-price">от ${prices.shopBase} ₽</div></div>
            </div>
        `;
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', () => { selectedService = card.dataset.service; updateStep(2); });
        });
    } else if (currentStep === 2) {
        if (selectedService === 'design') {
            container.innerHTML = `<div class="params-form"><div class="info-tooltip"><i class="fas fa-info-circle"></i> <span>Блок — раздел сайта (шапка, преимущества, услуги, отзывы, футер).</span></div><div class="input-group"><label>Количество блоков:</label><input type="number" id="blocksCount" min="1" value="3" step="1"><small>Первый блок входит в базовую стоимость</small></div><div class="price-preview" id="step2Price">Текущая стоимость: ${prices.designBase} ₽</div></div>`;
            const input = document.getElementById('blocksCount');
            input.addEventListener('input', () => {
                const blocks = parseInt(input.value) || 1;
                const total = prices.designBase + Math.max(0, blocks - 1) * prices.designPerBlock;
                document.getElementById('step2Price').innerText = `Текущая стоимость: ${total} ₽`;
                serviceParams = { blocks };
            });
            input.dispatchEvent(new Event('input'));
        } else if (selectedService === 'dev' || selectedService === 'full') {
            const base = selectedService === 'dev' ? prices.devBase : prices.fullBase;
            const perPage = selectedService === 'dev' ? prices.devPerPage : prices.fullPerPage;
            const perBlock = selectedService === 'dev' ? prices.devPerBlock : prices.fullPerBlock;
            container.innerHTML = `<div class="params-form"><div class="info-tooltip"><i class="fas fa-info-circle"></i> <span>Страница — отдельный HTML-документ (главная, контакты, услуги). Блок — раздел страницы.</span></div><div class="input-group"><label>Количество страниц:</label><input type="number" id="pagesCount" min="1" value="2" step="1"><small>Первая страница входит в базовую стоимость</small></div><div class="input-group"><label>Количество блоков (суммарно):</label><input type="number" id="blocksCount" min="1" value="5" step="1"><small>Первый блок входит в базовую стоимость</small></div><div class="price-preview" id="step2Price">Текущая стоимость: ${base} ₽</div></div>`;
            const pagesInput = document.getElementById('pagesCount');
            const blocksInput = document.getElementById('blocksCount');
            const updatePrice = () => {
                const pages = parseInt(pagesInput.value) || 1;
                const blocks = parseInt(blocksInput.value) || 1;
                const total = base + Math.max(0, pages - 1) * perPage + Math.max(0, blocks - 1) * perBlock;
                document.getElementById('step2Price').innerText = `Текущая стоимость: ${total} ₽`;
                serviceParams = { pages, blocks };
            };
            pagesInput.addEventListener('input', updatePrice);
            blocksInput.addEventListener('input', updatePrice);
            updatePrice();
        } else if (selectedService === 'shop') {
            container.innerHTML = `<div class="params-form"><div class="price-preview" id="step2Price">Базовая стоимость: ${prices.shopBase} ₽</div></div>`;
            serviceParams = {};
        }
    } else if (currentStep === 3) {
        const optionsList = [
            { key: 'adaptive', name: 'Адаптация под мобильные устройства', price: prices.adaptive, desc: 'Корректное отображение на всех устройствах' },
            { key: 'hosting', name: 'Хостинг и домен от нашей студии (на 1 год)', price: prices.hosting, desc: 'Бесплатный хостинг и домен на первый год' },
            { key: 'support', name: 'Поддержка сайта после разработки (1 месяц)', price: prices.support, desc: 'Техническая поддержка' },
            { key: 'calculator', name: 'Интерактивный калькулятор', price: prices.calculator, desc: 'Расчёт стоимости, как на этом сайте' },
            { key: 'delivery', name: 'Подключение служб доставки (CDEK)', price: prices.delivery, desc: 'Интеграция с СДЭК' },
            { key: 'crm', name: 'Интеграция с CRM', price: prices.crm, desc: 'Подключение CRM-системы' },
            { key: 'payment', name: 'Онлайн оплата', price: prices.payment, desc: 'Приём платежей через карты' },
            { key: 'admin', name: 'Административная панель', price: prices.adminPanel, desc: 'Удобное редактирование контента' }
        ];
        let html = `<div class="options-list">`;
        optionsList.forEach(opt => {
            html += `<label class="checkbox-label option-item"><input type="checkbox" data-option="${opt.key}" ${selectedOptions[opt.key] ? 'checked' : ''}><span class="checkmark"></span><span><strong>${opt.name}</strong> (+${opt.price}₽)<br><small>${opt.desc}</small></span></label>`;
        });
        html += `</div><div class="price-preview" id="step3Price">Доп. опции: 0 ₽</div>`;
        container.innerHTML = html;
        document.querySelectorAll('#stepContent input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const key = cb.dataset.option;
                if (cb.checked) selectedOptions[key] = true;
                else delete selectedOptions[key];
                let total = 0;
                for (const [k, v] of Object.entries(selectedOptions)) if (v) total += getOptionPrice(k);
                document.getElementById('step3Price').innerText = `Доп. опции: ${total} ₽`;
            });
        });
    } else if (currentStep === 4) {
        const total = calculateTotalPrice();
        let serviceName = { design: 'Разработка макета', dev: 'Вёрстка/Программирование', full: 'Сайт (Под ключ)', shop: 'Интернет-магазин' }[selectedService];
        let details = '';
        if (selectedService === 'design') details = `Блоков: ${serviceParams.blocks || 1}`;
        else if (selectedService === 'dev' || selectedService === 'full') details = `Страниц: ${serviceParams.pages || 1}, Блоков: ${serviceParams.blocks || 1}`;
        let optionsText = '';
        for (const [key, val] of Object.entries(selectedOptions)) if (val) optionsText += `<li>${getOptionName(key)} (+${getOptionPrice(key)}₽)</li>`;
        container.innerHTML = `<div class="order-summary"><h3>Ваш заказ</h3><p><strong>Услуга:</strong> ${serviceName}</p><p><strong>Параметры:</strong> ${details}</p>${optionsText ? `<p><strong>Дополнительно:</strong><ul>${optionsText}</ul></p>` : ''}<p><strong>Итоговая стоимость:</strong> ${total} ₽</p><button class="btn btn-primary" id="submitFinalOrderBtn" style="margin-top:20px;">Оформить заказ</button></div>`;
        document.getElementById('submitFinalOrderBtn')?.addEventListener('click', () => showOrderModal(total, serviceName, details));
    }
    updateProgressBar();
    updateNavButtons();
}
function getOptionName(key) { return { adaptive: 'Адаптация', hosting: 'Хостинг+домен', support: 'Поддержка', calculator: 'Калькулятор', delivery: 'CDEK', crm: 'CRM', payment: 'Онлайн оплата', admin: 'Админ-панель' }[key] || key; }
function getOptionPrice(key) { return { adaptive: prices.adaptive, hosting: prices.hosting, support: prices.support, calculator: prices.calculator, delivery: prices.delivery, crm: prices.crm, payment: prices.payment, admin: prices.adminPanel }[key] || 0; }
function calculateTotalPrice() {
    let base = 0;
    if (selectedService === 'design') base = prices.designBase + Math.max(0, (serviceParams.blocks || 1) - 1) * prices.designPerBlock;
    else if (selectedService === 'dev') base = prices.devBase + Math.max(0, (serviceParams.pages || 1) - 1) * prices.devPerPage + Math.max(0, (serviceParams.blocks || 1) - 1) * prices.devPerBlock;
    else if (selectedService === 'full') base = prices.fullBase + Math.max(0, (serviceParams.pages || 1) - 1) * prices.fullPerPage + Math.max(0, (serviceParams.blocks || 1) - 1) * prices.fullPerBlock;
    else if (selectedService === 'shop') base = prices.shopBase;
    let optionsTotal = 0;
    for (const [key, val] of Object.entries(selectedOptions)) if (val) optionsTotal += getOptionPrice(key);
    return base + optionsTotal;
}
function updateProgressBar() {
    const fill = document.getElementById('progressFill');
    fill.style.width = `${(currentStep - 1) * 33.33}%`;
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) step.classList.add('active');
        if (stepNum < currentStep) step.classList.add('completed');
    });
}
function updateNavButtons() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.innerText = currentStep === 4 ? 'Отправить' : 'Далее →';
}
function updateStep(step) { currentStep = step; renderStep(); }
function nextStep() {
    if (currentStep === 4) return;
    if (currentStep === 1 && !selectedService) { showToast('Выберите услугу', true); return; }
    if (currentStep === 2 && (selectedService !== 'shop') && (!serviceParams.blocks || (selectedService !== 'design' && !serviceParams.pages))) { showToast('Заполните параметры', true); return; }
    updateStep(currentStep + 1);
}
function prevStep() { if (currentStep > 1) updateStep(currentStep - 1); }
document.getElementById('prevStepBtn')?.addEventListener('click', prevStep);
document.getElementById('nextStepBtn')?.addEventListener('click', nextStep);

function showOrderModal(total, serviceName, details) {
    const modal = document.getElementById('orderFormModal');
    document.getElementById('orderSummary').innerHTML = `<strong>${serviceName}</strong><br>${details}<br><strong>Итого: ${total} ₽</strong>`;
    modal.style.display = 'flex';
    window.currentOrderData = { total, serviceName, details };
    disableScroll();
}
document.getElementById('closeOrderModal')?.addEventListener('click', () => { document.getElementById('orderFormModal').style.display = 'none'; enableScroll(); });
document.getElementById('orderConsent')?.addEventListener('change', (e) => { document.getElementById('submitOrderBtn').disabled = !e.target.checked; });
document.getElementById('orderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const email = document.getElementById('orderEmail').value;
    if (!name || !phone) { showToast('Заполните имя и телефон', true); return; }
    if (!document.getElementById('orderConsent').checked) { showToast('Примите согласие на обработку данных', true); return; }
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        name: name,
        contact: phone + (email ? ` (${email})` : ''),
        serviceType: window.currentOrderData.serviceName,
        details: window.currentOrderData.details,
        finalPrice: window.currentOrderData.total,
        status: 'pending'
    };
    
    // Сохраняем в localStorage для админ-панели
    let applications = JSON.parse(localStorage.getItem('webcode_applications') || '[]');
    applications.unshift(order);
    localStorage.setItem('webcode_applications', JSON.stringify(applications));
    
    showToast('⏳ Отправка заявки...');
    const success = await sendToEmail(order);
    
    if (success) {
        showToast('✅ Заявка отправлена! Мы свяжемся с вами');
    } else {
        showToast('⚠️ Ошибка отправки. Заявка сохранена локально', true);
    }
    
    document.getElementById('orderFormModal').style.display = 'none';
    enableScroll();
    document.getElementById('orderForm').reset();
    document.getElementById('orderConsent').checked = false;
    document.getElementById('submitOrderBtn').disabled = true;
    selectedService = null; serviceParams = {}; selectedOptions = {}; currentStep = 1;
    renderStep();
});

// ============ ФОТО КАЛЬКУЛЯТОР ============
let photoCount = 1, photoType = 'retouch', photoColorize = false, photoAnimate = false, photoDeadline = 4;
function getDeadlineMultiplier(days) { return Math.min(2.0, Math.max(1.0, 2 - (days - 1) / 6)); }
function getPhotoBasePrice() {
    let pricePerPhoto = photoType === 'retouch' ? prices.photoRetouch : prices.photoRestore;
    let total = photoCount * pricePerPhoto;
    if (photoColorize) total += photoCount * prices.photoColorize;
    if (photoAnimate) total += photoCount * prices.photoAnimate;
    return total;
}
function getPhotoFinalPrice() { return Math.round(getPhotoBasePrice() * getDeadlineMultiplier(photoDeadline)); }
function updatePhotoTotal() {
    document.getElementById('photoTotalPrice').innerText = getPhotoFinalPrice() + ' ₽';
    const multiplier = getDeadlineMultiplier(photoDeadline);
    document.getElementById('photoMultiplierInfo').innerHTML = `⚠️ Коэффициент срочности: ×${multiplier.toFixed(2)}`;
    const badge = document.getElementById('photoDeadlineBadge');
    if (badge) {
        if (photoDeadline <= 2) badge.innerHTML = '🔥🔥 СРОЧНО! +' + Math.round((multiplier - 1) * 100) + '% 🔥🔥';
        else if (photoDeadline <= 3) badge.innerHTML = '⚡ Срочный заказ +' + Math.round((multiplier - 1) * 100) + '%';
        else if (photoDeadline <= 5) badge.innerHTML = '📅 Стандартный срок';
        else badge.innerHTML = '✅ Оптимальный срок';
    }
    updatePhotoMessagePreview();
}
function generatePhotoOrderMessage() {
    const typeText = photoType === 'retouch' ? 'Хорошую фотографию отфотошопить' : 'Восстановление старого/поврежденного фото';
    let details = `📸 Количество фото: ${photoCount}\n🖼️ Тип обработки: ${typeText} (${photoType === 'retouch' ? prices.photoRetouch : prices.photoRestore}₽/шт)`;
    if (photoColorize) details += `\n🎨 Сделать цветным: Да (+${prices.photoColorize}₽/шт)`;
    if (photoAnimate) details += `\n✨ Оживление фото: Да (+${prices.photoAnimate}₽/шт)`;
    const finalPrice = getPhotoFinalPrice();
    const multiplier = getDeadlineMultiplier(photoDeadline);
    return `Здравствуйте! Я рассчитал стоимость обработки фотографий:\n\n📌 Услуга: Обработка фотографий\n\n${details}\n\n⏱️ Срок выполнения: ${photoDeadline} дней (коэффициент ×${multiplier.toFixed(2)})\n\n💰 Итоговая стоимость: ${finalPrice} ₽\n\nХочу заказать обработку! Жду вашего ответа.`;
}
function updatePhotoMessagePreview() {
    const preview = document.getElementById('photoPreviewContent');
    if (preview) preview.innerHTML = generatePhotoOrderMessage().replace(/\n/g, '<br>');
}
async function sendPhotoOrder() {
    const message = generatePhotoOrderMessage();
    const name = prompt('Введите ваше имя для оформления заявки:');
    const phone = prompt('Введите ваш телефон для связи:');
    if (!name || !phone) {
        showToast('Необходимо указать имя и телефон для оформления заявки', true);
        return;
    }
    const finalPrice = getPhotoFinalPrice();
    const serviceName = 'Обработка фотографий';
    let details = `Количество фото: ${photoCount}\nТип: ${photoType === 'retouch' ? 'Ретушь' : 'Восстановление'}`;
    if (photoColorize) details += `\nСделать цветным: Да (+${prices.photoColorize}₽/шт)`;
    if (photoAnimate) details += `\nОживление: Да (+${prices.photoAnimate}₽/шт)`;
    details += `\nСрок: ${photoDeadline} дней`;
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        name: name,
        contact: phone,
        serviceType: serviceName,
        details: details,
        finalPrice: finalPrice,
        status: 'pending'
    };
    
    // Сохраняем в localStorage для админ-панели
    let applications = JSON.parse(localStorage.getItem('webcode_applications') || '[]');
    applications.unshift(order);
    localStorage.setItem('webcode_applications', JSON.stringify(applications));
    
    showToast('⏳ Отправка заявки...');
    const success = await sendToEmail(order);
    
    if (success) {
        showToast('✅ Заявка отправлена! Мы свяжемся с вами');
    } else {
        showToast('⚠️ Ошибка отправки. Заявка сохранена локально', true);
    }
    
    const encodedMessage = encodeURIComponent(message);
    const vkGroupLink = `https://vk.com/write-225202490?message=${encodedMessage}`;
    const orderMessage = document.getElementById('photoOrderMessage');
    orderMessage.innerHTML = `✅ Заявка отправлена! Открывается диалог с сообществом...`;
    orderMessage.classList.add('success');
    orderMessage.style.display = 'block';
    setTimeout(() => window.open(vkGroupLink, '_blank'), 500);
    setTimeout(() => orderMessage.style.display = 'none', 5000);
}
document.getElementById('photoCount')?.addEventListener('input', (e) => { photoCount = parseInt(e.target.value) || 1; updatePhotoTotal(); });
document.getElementById('photoRetouch')?.addEventListener('change', () => { if (document.getElementById('photoRetouch').checked) photoType = 'retouch'; updatePhotoTotal(); });
document.getElementById('photoRestore')?.addEventListener('change', () => { if (document.getElementById('photoRestore').checked) photoType = 'restore'; updatePhotoTotal(); });
document.getElementById('photoColorize')?.addEventListener('change', (e) => { photoColorize = e.target.checked; updatePhotoTotal(); });
document.getElementById('photoAnimate')?.addEventListener('change', (e) => { photoAnimate = e.target.checked; updatePhotoTotal(); });
document.getElementById('photoDeadlineSlider')?.addEventListener('input', (e) => { photoDeadline = parseInt(e.target.value); document.getElementById('photoDeadlineValue').innerText = photoDeadline; updatePhotoTotal(); });
document.getElementById('photoOrderBtn')?.addEventListener('click', sendPhotoOrder);
document.getElementById('copyPhotoPreviewBtn')?.addEventListener('click', () => copyToClipboard(generatePhotoOrderMessage()));
async function copyToClipboard(text) { try { await navigator.clipboard.writeText(text); showToast('✅ Сообщение скопировано!'); } catch (err) { showToast('❌ Ошибка копирования', true); } }

// ============ ИНИЦИАЛИЗАЦИЯ ============
renderReviewsSwiper();
renderStep();
updatePhotoTotal();

// Privacy modal
const privacyPolicyLink = document.getElementById('privacyPolicyLinkModal');
const privacyModal = document.getElementById('privacyModal');
const modalClose = document.querySelector('.modal-close');
const modalCloseBtn = document.querySelector('.modal-close-btn');
if (privacyPolicyLink) privacyPolicyLink.addEventListener('click', (e) => { e.preventDefault(); privacyModal.style.display = 'flex'; disableScroll(); });
function closePrivacyModal() { privacyModal.style.display = 'none'; enableScroll(); }
if (modalClose) modalClose.addEventListener('click', closePrivacyModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePrivacyModal);
window.addEventListener('click', (e) => { if (e.target === privacyModal) closePrivacyModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && privacyModal && privacyModal.style.display === 'flex') closePrivacyModal(); });
