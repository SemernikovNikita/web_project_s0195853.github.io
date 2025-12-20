// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню с правильной анимацией
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    // ФУНКЦИЯ ДЛЯ ОТКРЫТИЯ БУРГЕР-МЕНЮ
    function openBurgerMenu() {
        if (nav && window.innerWidth <= 768) {
            nav.style.display = 'block';
            setTimeout(() => {
                nav.classList.add('active');
            }, 10);
            
            // Добавляем класс для блокировки прокрутки страницы
            body.classList.add('menu-open');
            
            // Фокусируемся на первом элементе меню для доступности
            const firstNavItem = nav.querySelector('a');
            if (firstNavItem) {
                setTimeout(() => {
                    firstNavItem.focus();
                }, 100);
            }
            
            console.log('Бургер-меню открыто');
        }
    }
    
    // ФУНКЦИЯ ДЛЯ ЗАКРЫТИЯ БУРГЕР-МЕНЮ
    function closeBurgerMenu() {
        if (nav && window.innerWidth <= 768) {
            nav.classList.remove('active');
            
            // Ждем окончания анимации перед скрытием
            setTimeout(() => {
                nav.style.display = 'none';
                body.classList.remove('menu-open');
            }, 300);
            
            console.log('Бургер-меню закрыто');
        }
    }
    
    // ФУНКЦИЯ ДЛЯ ПЕРЕКЛЮЧЕНИЯ БУРГЕР-МЕНЮ
    function toggleBurgerMenu() {
        if (nav && window.innerWidth <= 768) {
            if (nav.classList.contains('active') || nav.style.display === 'block') {
                closeBurgerMenu();
            } else {
                openBurgerMenu();
            }
        }
    }
    
    // Инициализация меню
    if (mobileMenuBtn && nav) {
        // На мобильных устройствах меню изначально скрыто
        if (window.innerWidth <= 768) {
            nav.style.display = 'none';
        }
        
        // Обработчик клика по кнопке бургера
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBurgerMenu();
        });
        
        // Обработчик клика по ссылкам в меню
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Получаем href ссылки
                const href = this.getAttribute('href');
                
                // Если это якорная ссылка (начинается с #)
                if (href && href.startsWith('#')) {
                    // Закрываем меню
                    closeBurgerMenu();
                    
                    // Прокручиваем к якорю
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Ждем закрытия меню перед прокруткой
                        setTimeout(() => {
                            const headerHeight = document.querySelector('header').offsetHeight;
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }, 350); // Ждем пока меню закроется
                    }
                } 
                // Если это обычная ссылка (не якорь)
                else {
                    // Просто закрываем меню и позволяем браузеру обработать переход
                    closeBurgerMenu();
                }
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 && 
                nav.classList.contains('active') && 
                !nav.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                closeBurgerMenu();
            }
        });
        
        // Закрытие меню при нажатии клавиши Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeBurgerMenu();
                mobileMenuBtn.focus();
            }
        });
    }
    
    // Слайдер
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.getElementById('sliderDots');
    
    if (slider && sliderDots) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        // Создаем точки для слайдера
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function() {
                goToSlide(i, false);
            });
            sliderDots.appendChild(dot);
        }
        
        const dots = document.querySelectorAll('.dot');
        
        function goToSlide(n, animate = false) {
            currentSlide = n;
            if (currentSlide >= totalSlides) currentSlide = 0;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            
            // Убираем transition для мгновенного переключения
            if (!animate) {
                slider.style.transition = 'none';
            } else {
                slider.style.transition = 'transform 0.3s ease';
            }
            
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Сразу возвращаем transition обратно для следующих анимаций
            if (!animate) {
                setTimeout(() => {
                    slider.style.transition = 'transform 0.3s ease';
                }, 10);
            }
            
            // Обновляем активную точку
            dots.forEach(function(dot) {
                dot.classList.remove('active');
            });
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        // Автопрокрутка слайдера
        let slideInterval = setInterval(function() {
            goToSlide(currentSlide + 1, true);
        }, 5000);
        
        // Остановка автопрокрутки при наведении
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', function() {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', function() {
                slideInterval = setInterval(function() {
                    goToSlide(currentSlide + 1, true);
                }, 5000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                goToSlide(currentSlide + 1, false);
                slideInterval = setInterval(function() {
                    goToSlide(currentSlide + 1, true);
                }, 5000);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                goToSlide(currentSlide - 1, false);
                slideInterval = setInterval(function() {
                    goToSlide(currentSlide + 1, true);
                }, 5000);
            });
        }
    }
    
    // Форма
    const feedbackForm = document.getElementById('orderForm');
    const STORAGE_KEY = 'feedbackFormData';
    
    if (feedbackForm) {
        // Создаем элементы для сообщений
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success-message';
        successMessage.style.cssText = 'display: none; padding: 15px; background: #d4edda; color: #155724; border-radius: 8px; margin-top: 20px; border: 1px solid #c3e6cb; text-align: center;';
        successMessage.textContent = 'Спасибо! Ваш заказ принят. Мы свяжемся с вами в ближайшее время.';
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error-message';
        errorMessage.style.cssText = 'display: none; padding: 15px; background: #f8d7da; color: #721c24; border-radius: 8px; margin-top: 20px; border: 1px solid #f5c6cb; text-align: center;';
        errorMessage.textContent = 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.';
        
        // Вставляем сообщения после формы
        feedbackForm.appendChild(successMessage);
        feedbackForm.appendChild(errorMessage);
        
        // Функция сохранения данных формы в localStorage
        function saveFormData() {
            const formData = {
                name: document.getElementById('name')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                bouquet: document.getElementById('bouquet')?.value || '',
                message: document.getElementById('message')?.value || ''
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
        
        // Функция восстановления данных из localStorage
        function restoreFormData() {
            const savedData = localStorage.getItem(STORAGE_KEY);
            
            if (savedData) {
                try {
                    const formData = JSON.parse(savedData);
                    
                    if (document.getElementById('name')) {
                        document.getElementById('name').value = formData.name || '';
                    }
                    
                    if (document.getElementById('phone')) {
                        document.getElementById('phone').value = formData.phone || '';
                    }
                    
                    if (document.getElementById('bouquet')) {
                        document.getElementById('bouquet').value = formData.bouquet || 'black-moon';
                    }
                    
                    if (document.getElementById('message')) {
                        document.getElementById('message').value = formData.message || '';
                    }
                } catch (e) {
                    console.error('Ошибка при восстановлении данных:', e);
                }
            }
        }
        
        // Функция очистки данных формы
        function clearFormData() {
            localStorage.removeItem(STORAGE_KEY);
        }
        
        // Функция скрытия сообщений
        function hideMessages() {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }
        
        // Функция валидации формы
        function validateForm() {
            const name = document.getElementById('name')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            
            if (!name) {
                alert('Пожалуйста, введите ваше имя.');
                return false;
            }
            
            if (!phone) {
                alert('Пожалуйста, введите ваш телефон.');
                return false;
            }
            
            // Простая валидация телефона
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone)) {
                alert('Пожалуйста, введите корректный номер телефона.');
                return false;
            }
            
            return true;
        }
        
        // Функция отправки формы
        async function submitForm(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            saveFormData();
            
            const formData = new FormData(feedbackForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                bouquet: formData.get('bouquet'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };
            
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Отключаем кнопку и показываем индикатор загрузки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            hideMessages();
            
            try {
                const response = await fetch('https://formcarry.com/s/sZ1WwW-HhtP', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                    
                    clearFormData();
                    feedbackForm.reset();
                    
                    setTimeout(() => {
                        hideMessages();
                    }, 5000);
                } else {
                    throw new Error('Ошибка сервера');
                }
            } catch (error) {
                console.error('Ошибка отправки формы:', error);
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
        
        // Восстанавливаем данные при загрузке
        restoreFormData();
        
        // Сохраняем данные при изменении формы
        feedbackForm.addEventListener('input', saveFormData);
        
        // Обработка отправки формы
        feedbackForm.addEventListener('submit', submitForm);
    }
    
    // Плавная прокрутка к якорям (для ссылок вне меню)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            // Проверяем, не является ли это ссылкой из меню
            if (this.closest('nav')) {
                return; // Если ссылка в меню, уже обработано выше
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Адаптивное меню при ресайзе
    window.addEventListener('resize', function() {
        if (nav) {
            if (window.innerWidth > 768) {
                nav.style.display = 'flex';
                nav.classList.remove('active');
                body.classList.remove('menu-open');
            } else {
                if (!nav.classList.contains('active')) {
                    nav.style.display = 'none';
                }
            }
        }
    });
    
    // Инициализация меню при загрузке
    if (nav) {
        if (window.innerWidth > 768) {
            nav.style.display = 'flex';
        }
    }
    
    window.openBurgerMenu = openBurgerMenu;
    window.closeBurgerMenu = closeBurgerMenu;
    window.toggleBurgerMenu = toggleBurgerMenu;
});
