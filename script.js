/* =====================================================
   PREMIUM GRAB AND GO - JAVASCRIPT
   Multi-Page Optimized Functionality
   ===================================================== */

// ============ GLOBAL VARIABLES ============
let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
let total = parseInt(localStorage.getItem('canteenTotal')) || 0;

// ============ INITIALIZATION ============
window.onload = function() {
    initializeApp();
};

function initializeApp() {
    if(document.getElementById('cart-items')) {
        updateCartUI();
    }
    initializeAnimations();
    initializeMobileMenu();
    initializeRatingStars();
    createParticles();
    initializeScrollAnimations();
}

// ============ GSAP ANIMATIONS ============
function initializeAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Animations will be skipped.');
        return;
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    if(document.querySelector('.hero-title-line')) {
        gsap.from('.hero-title-line', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' });
        gsap.from('.hero-title-main', { opacity: 0, y: 50, duration: 1, delay: 0.3, ease: 'power3.out' });
        gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.6, ease: 'power3.out' });
        gsap.from('.hero-cta', { opacity: 0, y: 30, duration: 0.8, delay: 0.9, ease: 'power3.out' });
    }
    
    gsap.utils.toArray('.card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { 
                trigger: card, 
                start: 'top 98%', 
                toggleActions: 'play none none none'
            },
            clearProps: "all",
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: 'power2.out'
        });
    });
    
    gsap.utils.toArray('.food-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 98%', toggleActions: 'play none none none' },
            clearProps: "all",
            opacity: 0, y: 30, scale: 0.9, duration: 0.6, delay: index * 0.05, ease: 'back.out(1.7)'
        });
    });
}

function initializeScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 95%', toggleActions: 'play none none none' },
            clearProps: "all",
            opacity: 0, y: 40, duration: 0.8, ease: 'power2.out'
        });
    });
    
    if(document.querySelector('.vm-card')) {
        gsap.from('.vm-card', {
            scrollTrigger: { trigger: '.vision-mission-grid', start: 'top 95%', toggleActions: 'play none none none' },
            clearProps: "all",
            opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: 'power2.out'
        });
    }
    
    if(document.querySelector('.step-item')) {
        gsap.from('.step-item', {
            scrollTrigger: { trigger: '.steps-container', start: 'top 98%', toggleActions: 'play none none none' },
            clearProps: "all",
            opacity: 0, x: -30, stagger: 0.15, duration: 0.6, ease: 'power2.out'
        });
    }

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
}

// ============ PARTICLES EFFECT ============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.1})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        
        particlesContainer.appendChild(particle);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(particle, {
                y: Math.random() * 100 - 50,
                x: Math.random() * 100 - 50,
                duration: Math.random() * 10 + 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
}

// ============ MOBILE MENU ============
function initializeMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// ============ CART MANAGEMENT ============
function saveCart() {
    localStorage.setItem('canteenCart', JSON.stringify(cart));
    localStorage.setItem('canteenTotal', total);
}

function addToCart(itemName, itemPrice, btnElement) {
    cart.push({ name: itemName, price: itemPrice });
    total += itemPrice;
    saveCart();
    updateCartUI();
    showToast(`${itemName} added to cart!`);
    if(btnElement) animateAddToCart(btnElement);
}

function addCheckedItems(containerId, portionName, btnElement) {
    const mealTimeElem = document.getElementById('meal-time');
    if (!mealTimeElem) return;
    
    const mealTime = mealTimeElem.value; 
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
        showToast("Please select at least one item.", "warning");
        return;
    }

    let addedCount = 0;
    checkboxes.forEach(cb => {
        const itemName = `[${mealTime}] ${portionName} - ${cb.value}`;
        const itemPrice = parseInt(cb.getAttribute('data-price'));
        
        cart.push({ name: itemName, price: itemPrice });
        total += itemPrice;
        
        cb.checked = false;
        addedCount++;
    });

    saveCart();
    updateCartUI();
    showToast(`${addedCount} item(s) added to cart!`);
    if(btnElement) animateAddToCart(btnElement);
}

function removeFromCart(index) {
    const removedItem = cart[index];
    total -= cart[index].price;
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast(`${removedItem.name} removed from cart`, "info");
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    const emptyCart = document.getElementById('empty-cart');
    
    if(!cartList) return; 

    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'flex';
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        
        cart.forEach((item, index) => {
            let li = document.createElement('li');
            
            let itemText = document.createElement('span');
            itemText.textContent = `${item.name} - Rs. ${item.price}`;
            
            let removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = function() { removeFromCart(index); };
            
            li.appendChild(itemText);
            li.appendChild(removeBtn);
            cartList.appendChild(li);
        });
    }
    
    if (totalSpan) totalSpan.textContent = total;
    if (cartCount) cartCount.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;
}

// ============ CHECKOUT, PDF & WHATSAPP INTEGRATION ============
function checkoutAndPrintPDF() {
    if (cart.length === 0) {
        showToast("Your cart is empty. Please add items first.", "warning");
        return;
    }

    const cusName = document.getElementById('cus-name').value.trim();
    const cusIndex = document.getElementById('cus-index').value.trim();
    const cusPhone = document.getElementById('cus-phone').value.trim();
    const cusHostel = document.getElementById('cus-hostel').value;

    if (!cusName || !cusIndex || !cusPhone || !cusHostel) {
        showToast("Please fill in all delivery details.", "warning");
        return;
    }

    // 1. PDF Generation
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    doc.setFontSize(18);
    doc.text("Grab and Go - Order Receipt", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 30);
    doc.text(`Time: ${time}`, 20, 40);
    doc.text(`Name: ${cusName}`, 120, 30);
    doc.text(`Index: ${cusIndex}`, 120, 40);
    doc.text(`Phone: ${cusPhone}`, 120, 50);
    doc.setFont(undefined, 'bold');
    doc.text(`Deliver to: ${cusHostel} Hostel`, 120, 60);
    doc.setFont(undefined, 'normal');

    doc.text("----------------------------------------------------------------------------------", 20, 70);
    
    let yPosition = 80;
    cart.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name}`, 20, yPosition);
        doc.text(`Rs. ${item.price}`, 170, yPosition);
        yPosition += 10;
        
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
    });
    
    doc.text("----------------------------------------------------------------------------------", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: Rs. ${total}`, 140, yPosition);
    
    doc.save(`GrabAndGo_Order_${cusIndex}_${Date.now()}.pdf`);

    // 2. WhatsApp Order Message Formatting
    let waMessage = `*Grab and Go - New Order* 🛒\n\n`;
    waMessage += `*Delivery Details:*\n`;
    waMessage += `Name: ${cusName}\n`;
    waMessage += `Index: ${cusIndex}\n`;
    waMessage += `Phone: ${cusPhone}\n`;
    waMessage += `Hostel: ${cusHostel}\n\n`;
    waMessage += `*Order Items:*\n`;
    
    cart.forEach((item, index) => {
        waMessage += `${index + 1}. ${item.name} - Rs. ${item.price}\n`;
    });
    
    waMessage += `\n*Total Amount: Rs. ${total}*`;

    const encodedMessage = encodeURIComponent(waMessage);
    
    // ඔබ ලබාදුන් WhatsApp ලින්ක් එක
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=94706741830&text=${encodedMessage}&type=phone_number&app_absent=0`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    showToast("Order confirmed! PDF downloaded and WhatsApp opened.", "success");
    
    // Clear Cart after Checkout
    cart = [];
    total = 0;
    saveCart();
    updateCartUI();
    
    document.getElementById('cus-name').value = '';
    document.getElementById('cus-index').value = '';
    document.getElementById('cus-phone').value = '';
    document.getElementById('cus-hostel').value = '';
}

// ============ FEEDBACK SYSTEM ============
function initializeRatingStars() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('fb-rating');
    
    if (!stars.length || !ratingInput) return;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = index + 1;
            ratingInput.value = rating;
            updateStarDisplay(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStarDisplay(index + 1);
        });
    });
    
    const starsContainer = document.getElementById('rating-stars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            updateStarDisplay(ratingInput.value || 0);
        });
    }
    
    ratingInput.addEventListener('input', function() {
        updateStarDisplay(this.value);
    });
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitFeedback() {
    const date = document.getElementById('fb-date').value.trim();
    const time = document.getElementById('fb-time').value.trim();
    const meal = document.getElementById('fb-meal').value.trim();
    const rating = document.getElementById('fb-rating').value.trim();
    const comment = document.getElementById('fb-comment').value.trim();

    if (date === "" || time === "" || meal === "" || rating === "") {
        showToast("Please fill in all required fields.", "warning");
        return;
    }

    if (parseInt(rating) <= 3) {
        showToast(`Quality alert logged for ${meal}. Thank you for your feedback.`, "info");
    } else {
        showToast(`Thank you for your positive feedback (${rating}/5)!`, "success");
    }

    const message = `*Grab and Go - Feedback Report*\n\nDate: ${date}\nTime: ${time}\nMeal: ${meal}\nRating: ${rating}/5\nComments: ${comment}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=94706741830&text=${encodedMessage}&type=phone_number&app_absent=0`;
    
    window.open(whatsappUrl, '_blank');

    document.getElementById('fb-date').value = '';
    document.getElementById('fb-time').value = '';
    document.getElementById('fb-meal').value = '';
    document.getElementById('fb-rating').value = '';
    document.getElementById('fb-comment').value = '';
    updateStarDisplay(0);
}

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = "success") {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (!toastMessage) return;
    
    toastMessage.textContent = message;
    
    switch(type) {
        case "success":
            toastIcon.textContent = "✓";
            toastIcon.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
            break;
        case "warning":
            toastIcon.textContent = "!";
            toastIcon.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
            break;
        case "info":
            toastIcon.textContent = "i";
            toastIcon.style.background = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
            break;
    }
    
    toast.classList.add('show');
    
    if (typeof gsap !== 'undefined') {
        gsap.from(toast, { y: 100, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
    
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to(toast, {
                y: 100, opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: () => { toast.classList.remove('show'); }
            });
        } else {
            toast.classList.remove('show');
        }
    }, 3000);
}

// ============ BUTTON ANIMATIONS ============
function animateAddToCart(button) {
    if (typeof gsap === 'undefined' || !button) return;
    
    gsap.to(button, {
        scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut'
    });
}

// ============ EVENT LISTENERS ============
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { y: -5, duration: 0.3, ease: 'power2.out' });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { y: 0, duration: 0.3, ease: 'power2.out' });
            }
        });
    });
});
