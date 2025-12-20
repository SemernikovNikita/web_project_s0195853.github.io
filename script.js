document.addEventListener('DOMContentLoaded', function() {
    // Бургер-меню
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const body = document.body;
    
    function toggleBurgerMenu(state) {
        if (!nav || window.innerWidth > 768) return;
        
        if (state === 'open' || (!nav.classList.contains('active') && nav.style.display !== 'block')) {
            nav.style.display = 'block';
            setTimeout(() => nav.classList.add('active'), 10);
            body.classList.add('menu-open');
            nav.querySelector('a')?.focus();
        } else {
            nav.classList.remove('active');
            setTimeout(() => {
                nav.style.display = 'none';
                body.classList.remove('menu-open');
            }, 300);
        }
    }
    
    if (mobileMenuBtn && nav) {
        nav.style.display = window.innerWidth <= 768 ? 'none' : 'flex';
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBurgerMenu();
        });
        
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (window.innerWidth <= 768) {
                    toggleBurgerMenu('close');
                    
                    if (href?.startsWith('#')) {
                        e.preventDefault();
                        setTimeout(() => {
                            const target = document.querySelector(href);
                            if (target) {
                                const headerHeight = document.querySelector('header').offsetHeight;
                                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                                window.scrollTo({top: targetPosition, behavior: 'smooth'});
                            }
                        }, 350);
                    }
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && nav.classList.contains('active') &&
                !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                toggleBurgerMenu('close');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleBurgerMenu('close');
                mobileMenuBtn.focus();
            }
        });
    }
    
    // Слайдер
    const slider = document.getElementById('slider');
    const sliderDots = document.getElementById('sliderDots');
    
    if (slider && sliderDots) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        // Создание точек
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i, false));
            sliderDots.appendChild(dot);
        }
        
        const dots = document.querySelectorAll('.dot');
        
        function goToSlide(n, animate = true) {
            currentSlide = (n + totalSlides) % totalSlides;
            
            slider.style.transition = animate ? 'transform 0.3s ease' : 'none';
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            if (!animate) {
                setTimeout(() => slider.style.transition = 'transform 0.3s ease', 10);
            }
            
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide]?.classList.add('active');
        }
        
        // Автопрокрутка
        let slideInterval = setInterval(() => goToSlide(currentSlide + 1, true), 5000);
        
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => goToSlide(currentSlide + 1, true), 5000);
            });
        }
        
        document.getElementById('nextBtn')?.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(currentSlide + 1, false);
            slideInterval = setInterval(() => goToSlide(currentSlide + 1, true), 5000);
        });
        
        document.getElementById('prevBtn')?.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(currentSlide - 1, false);
            slideInterval = setInterval(() => goToSlide(currentSlide + 1, true), 5000);
        });
    }
    
    // Форма обратной связи
    const feedbackForm = document.getElementById('orderForm');
    const STORAGE_KEY = 'feedbackFormData';
    
    if (feedbackForm) {
        // Создание сообщений
        const createMessage = (className, text, bgColor, borderColor, textColor) => {
            const div = document.createElement('div');
            div.className = `form-message ${className}`;
            div.style.cssText = `display: none; padding: 15px; background: ${bgColor}; color: ${textColor}; border-radius: 8px; margin-top: 20px; border: 1px solid ${borderColor}; text-align: center;`;
            div.textContent = text;
            return div;
        };
        
        const successMessage = createMessage('success-message', 
            'Спасибо! Ваш заказ принят. Мы свяжемся с вами в ближайшее время.',
            '#d4edda', '#c3e6cb', '#155724');
        const errorMessage = createMessage('error-message',
            'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.',
            '#f8d7da', '#f5c6cb', '#721c24');
        
        feedbackForm.append(successMessage, errorMessage);
        
        // Работа с localStorage
        const saveFormData = () => {
            const formData = {
                name: document.getElementById('name')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                bouquet: document.getElementById('bouquet')?.value || 'black-moon',
                message: document.getElementById('message')?.value || ''
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        };
        
        const restoreFormData = () => {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                try {
                    const formData = JSON.parse(savedData);
                    Object.keys(formData).forEach(key => {
                        const el = document.getElementById(key);
                        if (el) el.value = formData[key];
                    });
                } catch (e) {
                    console.error('Ошибка восстановления данных:', e);
                }
            }
        };
        
        const clearFormData = () => localStorage.removeItem(STORAGE_KEY);
        const hideMessages = () => {
            successMessage.style.display = errorMessage.style.display = 'none';
        };
        
        // Валидация
        const validateForm = () => {
            const name = document.getElementById('name')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            
            if (!name) return alert('Пожалуйста, введите ваше имя.');
            if (!phone) return alert('Пожалуйста, введите ваш телефон.');
            if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
                return alert('Пожалуйста, введите корректный номер телефона.');
            }
            return true;
        };
        
        // Отправка формы
        const submitForm = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;
            
            saveFormData();
            
            const formData = new FormData(feedbackForm);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            hideMessages();
            
            try {
                const response = await fetch('https://formcarry.com/s/sZ1WwW-HhtP', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    successMessage.style.display = 'block';
                    clearFormData();
                    feedbackForm.reset();
                    setTimeout(hideMessages, 5000);
                } else {
                    throw new Error('Ошибка сервера');
                }
            } catch (error) {
                console.error('Ошибка отправки формы:', error);
                errorMessage.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        };
        
        // Инициализация
        restoreFormData();
        feedbackForm.addEventListener('input', saveFormData);
        feedbackForm.addEventListener('submit', submitForm);
    }
    
    // Плавная прокрутка для якорей вне меню
    document.querySelectorAll('a[href^="#"]:not(nav a)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement && targetId !== '#') {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({top: targetPosition, behavior: 'smooth'});
            }
        });
    });
    
    // Адаптивность меню
    window.addEventListener('resize', () => {
        if (!nav) return;
        
        if (window.innerWidth > 768) {
            nav.style.display = 'flex';
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        } else if (!nav.classList.contains('active')) {
            nav.style.display = 'none';
        }
    });
    
    // Экспорт функций
    window.toggleBurgerMenu = toggleBurgerMenu;
});
