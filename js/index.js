// index.js - все JavaScript функции для сайта-портфолио D|S

document.addEventListener('DOMContentLoaded', function() {
    // Анимация градиента логотипа
    const logo = document.querySelector('.logo');
    let gradientAngle = 135;
    
    setInterval(() => {
        gradientAngle = (gradientAngle + 0.5) % 360;
        logo.style.background = `linear-gradient(${gradientAngle}deg, #8b0000 0%, #660000 33%, #4a0000 66%, #2a0000 100%)`;
        logo.style.webkitBackgroundClip = 'text';
        logo.style.backgroundClip = 'text';
    }, 50);
    
    // Эффект для галереи
    const galleryItems = document.querySelectorAll('.gallery-item');
    const photoLabels = ['Сказка', 'Энергия', 'Атмосфера', 'Вдохновение', 'История', 'Волшебство'];
    
    galleryItems.forEach((item, index) => {
        // Показываем label при наведении, если фотография не загрузилась
        item.addEventListener('mouseenter', function() {
            if (this.classList.contains('fallback')) {
                this.innerHTML = `<span style="font-family: 'Courier New', monospace; 
                    color: rgba(128, 0, 0, 0.5); 
                    font-size: 1.1rem; 
                    font-weight: 300;
                    z-index: 2;
                    text-align: center;
                    padding: 10px;">${photoLabels[index]}</span>`;
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (this.classList.contains('fallback')) {
                const img = document.createElement('img');
                img.src = this.querySelector('img') ? this.querySelector('img').src : '';
                img.className = 'gallery-image';
                img.alt = `Фотография ${index + 1}`;
                this.innerHTML = '';
                this.appendChild(img);
                this.classList.add('fallback');
            }
        });
        
        // Открытие полноразмерного просмотра при клике
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const imageAlt = this.getAttribute('data-alt');
            const currentIndex = Array.from(galleryItems).indexOf(this);
            
            openModal(imageSrc, imageAlt, currentIndex);
        });
    });
    
    // Эффект для социальных иконок
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Анимация для цитаты
    const quote = document.querySelector('.quote');
    let quoteColor = 0.7;
    let direction = 0.01;
    
    setInterval(() => {
        quoteColor += direction;
        if (quoteColor > 0.9 || quoteColor < 0.5) {
            direction = -direction;
        }
        quote.style.color = `rgba(128, 0, 0, ${quoteColor})`;
    }, 100);
    
    // Эффект для сказочного элемента
    const fairyTale = document.querySelector('.fairy-tale');
    setInterval(() => {
        fairyTale.style.border = `1px dashed rgba(128, 0, 0, ${0.2 + Math.random() * 0.3})`;
        fairyTale.style.transform = `translateY(${Math.sin(Date.now()/1000)*3}px)`;
    }, 100);
    
    // Функционал модального окна для полноразмерного просмотра
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const imageCounter = document.getElementById('imageCounter');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-image'),
        alt: item.getAttribute('data-alt')
    }));
    
    // Открытие модального окна
    function openModal(src, alt, index) {
        currentImageIndex = index;
        updateModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    
    // Обновление содержимого модального окна
    function updateModal() {
        const currentImage = images[currentImageIndex];
        modalImage.src = currentImage.src;
        modalImage.alt = currentImage.alt;
        imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }
    
    // Закрытие модального окна
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Возвращаем скролл
    }
    
    // Навигация по фотографиям
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModal();
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModal();
    }
    
    // События для модального окна
    closeModal.addEventListener('click', closeModalFunc);
    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);
    
    // Закрытие по клику на оверлей
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModalFunc();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
            }
        }
    });
    
    // Предзагрузка следующих и предыдущих изображений
    function preloadImages() {
        const preloadNext = (currentImageIndex + 1) % images.length;
        const preloadPrev = (currentImageIndex - 1 + images.length) % images.length;
        
        const imgNext = new Image();
        imgNext.src = images[preloadNext].src;
        
        const imgPrev = new Image();
        imgPrev.src = images[preloadPrev].src;
    }
    
    // Предзагрузка при открытии модального окна
    modal.addEventListener('transitionend', function() {
        if (modal.classList.contains('active')) {
            preloadImages();
        }
    });
    
    // Плавная смена изображений
    modalImage.addEventListener('load', function() {
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.transition = 'opacity 0.3s ease';
            this.style.opacity = '1';
        }, 10);
    });
});