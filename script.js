// ================= DATA STORAGE =================
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let bag = JSON.parse(localStorage.getItem('bag')) || [];

// ================= DRESSES DATA =================
const dresses = [
    { 
        id: 1, 
        image: "images/dress1.webp", 
        name: "Scoop Neck Backless Bodycon Dress in Burgundy", 
        price: 999.00, 
        tag: "Best Seller" 
    },

    { 
        id: 2, 
        image: "images/dress2.webp", 
        name: "Off Shoulder Tie Up Fitted Long Dress in Navy Blue", 
        price: 1499.00, 
        tag: "New Arrival" 
    },

    { 
        id: 3, 
        image: "images/dress3.webp", 
        name: "Summer Elegant Solid Color Puff Sleeve Cinch Waist Dress In Maroon", 
        price: 1199.00, 
        tag: "Best Seller" 
    },

    { 
        id: 4, 
        image: "images/dress4.webp", 
        name: "White Floral Spaghetti Strap Fit and Flare Dress", 
        price: 1049.00, 
        tag: "New Arrival" 
    }
];

// ================= UTILITY FUNCTIONS =================
function updateWishlistCount() {
    const countElement = document.getElementById('wishlist-count');
    if (countElement) {
        const count = wishlist.length;
        countElement.textContent = count;

        const totalCount = wishlist.reduce((sum, item) => sum + (item.quantity || 1), 0);
        countElement.textContent = count > 0 ? `${totalCount}` : '0';

        // CRITICAL: Show counter if count > 0, hide if count = 0
        if (count > 0) {
            countElement.style.display = 'flex';
        } else {
            countElement.style.display = 'none';
        }

        console.log('Wishlist count updated:', count); // Debug log
    } else {
        console.error('Wishlist count element not found!'); // Debug log
    }
}

function updateBagCount() {
    const bagElement = document.querySelector('.bag-count');
    if (bagElement) {
        const count = bag.length;
        const totalItems = bag.reduce((sum, item) => sum + (item.quantity || 1), 0);
        bagElement.textContent = count > 0 ? `${totalItems}` : 'Bag';

        if (count > 0) {
            bagElement.style.display = 'flex';
        } else {
            bagElement.style.display = 'none';
        }
    }
}

function isInWishlist(dressId) {
    return wishlist.some(item => item.id === dressId);
}

function isInBag(dressId) {
    return bag.some(item => item.id === dressId);
}

function addToWishlist(dress) {
    if (!isInWishlist(dress.id)) {
        wishlist.push(dress);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        console.log('Added to wishlist:', dress.name); // Debug log
        return true;
    }
    return false;
}

function removeFromWishlist(dressId) {
    wishlist = wishlist.filter(item => item.id !== dressId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlistModal(); // Update modal view
    console.log('Removed from wishlist, new count:', wishlist.length); // Debug log
}

function toggleWishlist(dressId) {
    const dress = dresses.find(d => d.id === dressId);
    if (!dress) return;

    if (isInWishlist(dressId)) {
        removeFromWishlist(dressId);
        return false; // Removed from wishlist
    } else {
        addToWishlist(dress);
        return true; // Added to wishlist
    }
}

function addToBag(dress, size = 'M') {
    // Check if item with same ID and size already exists
    const existingItem = bag.find(item => item.id === dress.id && item.size === size);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        bag.push({ ...dress, size, quantity: 1 });
    }

    localStorage.setItem('bag', JSON.stringify(bag));
    updateBagCount();
    console.log('Added to bag:', dress.name); // Debug log
    return true;
}

// ================= WISHLIST MODAL FUNCTIONS =================
function openWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        renderWishlistModal();
    }
}

function closeWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function renderWishlistModal() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <img src="images/heart.svg" alt="Empty wishlist" style="width: 100px; height: 100px; opacity: 0.3; margin-bottom: 20px;">
                <p style="font-size: 40px; color: #666565ff;">Your wishlist is empty</p>
                <p style="font-size: 35px; color: #666565ff; margin-top: 10px;">Add items you love to save them for later</p>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-modal-item" data-id="${item.id}">
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}">
                <button class="remove-from-wishlist" data-id="${item.id}">×</button>
            </div>
            <div class="wishlist-item-details">
                <h3>${item.name}</h3>
                <p class="wishlist-item-price">₹ ${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                <div class="wishlist-item-size-selector">
                    <select class="size-select" data-id="${item.id}">
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M" selected>M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
                <button class="wishlist-add-to-cart" data-id="${item.id}">Add to cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for remove buttons
    container.querySelectorAll('.remove-from-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dressId = parseInt(btn.dataset.id);
            removeFromWishlist(dressId);
            
            // Update heart icons on product pages
            updateHeartIcons();
        });
    });

    // Add event listeners for add to cart buttons
    container.querySelectorAll('.wishlist-add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dressId = parseInt(btn.dataset.id);
            const dress = wishlist.find(d => d.id === dressId);
            const sizeSelect = container.querySelector(`.size-select[data-id="${dressId}"]`);
            const selectedSize = sizeSelect ? sizeSelect.value : 'M';

            if (dress) {
                addToBag(dress, selectedSize);
                
                // Visual feedback
                btn.textContent = '✓ Added';
                btn.style.backgroundColor = '#000';
                btn.style.color = '#fff';

                setTimeout(() => {
                    btn.textContent = 'Add to cart';
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 1500);
            }
        });
    });
}

function updateHeartIcons() {
    // Update heart icons on dress list page
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const dressId = parseInt(btn.dataset.id);
        const heartIcon = btn.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.src = isInWishlist(dressId) ? "images/heart-filled.svg" : "images/heart.svg";
        }
    });

    // Update heart icon on detail page
    document.querySelectorAll('.image-heart-btn').forEach(btn => {
        const dressId = parseInt(btn.dataset.id);
        const heartIcon = btn.querySelector('.heart-icon-detail');
        if (heartIcon) {
            heartIcon.src = isInWishlist(dressId) ? "images/heart-filled.svg" : "images/heart.svg";
        }
    });
}

// ================= SHOPPING BAG MODAL FUNCTIONS =================
function openBagModal() {
    const modal = document.getElementById('bag-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        renderBagModal();
    }
}

function closeBagModal() {
    const modal = document.getElementById('bag-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function removeFromBag(itemIndex) {
    bag.splice(itemIndex, 1);
    localStorage.setItem('bag', JSON.stringify(bag));
    updateBagCount();
    renderBagModal();
}

function updateBagItemQuantity(itemIndex, change) {
    if (bag[itemIndex]) {
        bag[itemIndex].quantity = Math.max(1, (bag[itemIndex].quantity || 1) + change);
        localStorage.setItem('bag', JSON.stringify(bag));
        updateBagCount();
        renderBagModal();
    }
}

function calculateSubtotal() {
    return bag.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);
}

function renderBagModal() {
    const container = document.getElementById('bag-items-container');
    if (!container) return;

    if (bag.length === 0) {
        container.innerHTML = `
            <div class="empty-bag">
                <img src="images/bag-icon.svg" alt="Empty bag" style="width: 100px; height: 100px; opacity: 0.3; margin-bottom: 20px;">
                <p style="font-size: 40px; color: #666565ff;">Your bag is empty</p>
                <p style="font-size: 35px; color: #666565ff; margin-top: 10px;">Add items to start shopping</p>
            </div>
        `;
        
        // Hide checkout section
        const checkoutSection = document.querySelector('.bag-checkout-section');
        if (checkoutSection) {
            checkoutSection.style.display = 'none';
        }
        return;
    }

    // Show checkout section
    const checkoutSection = document.querySelector('.bag-checkout-section');
    if (checkoutSection) {
        checkoutSection.style.display = 'block';
    }

    // Render bag items
    container.innerHTML = bag.map((item, index) => `
        <div class="bag-modal-item" data-index="${index}">
            <div class="bag-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="bag-item-details">
                <div class="bag-item-header">
                    <h3>${item.name}</h3>
                    <button class="remove-from-bag" data-index="${index}">
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
                <p class="bag-item-price">₹ ${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                
                <div class="bag-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-index="${index}" data-action="decrease">−</button>
                        <span class="quantity-display">${item.quantity || 1}</span>
                        <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                    </div>
                    
                    <div class="bag-item-size">
                        <select class="bag-size-select" data-index="${index}">
                            <option value="XS" ${item.size === 'XS' ? 'selected' : ''}>XS</option>
                            <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
                            <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
                            <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
                            <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Update subtotal
    const subtotal = calculateSubtotal();
    const subtotalElement = document.getElementById('bag-subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    }

    // Add event listeners for remove buttons
    container.querySelectorAll('.remove-from-bag').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeFromBag(index);
        });
    });

    // Add event listeners for quantity buttons
    container.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const action = btn.dataset.action;
            const change = action === 'increase' ? 1 : -1;
            updateBagItemQuantity(index, change);
        });
    });

    // Add event listeners for size changes
    container.querySelectorAll('.bag-size-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(select.dataset.index);
            if (bag[index]) {
                bag[index].size = e.target.value;
                localStorage.setItem('bag', JSON.stringify(bag));
            }
        });
    });
}

// ================= DRESS LIST PAGE =================
const dressContainer = document.getElementById("dressContainer");

if (dressContainer) {
    dresses.forEach(dress => {
        const dressCard = document.createElement("div");
        dressCard.classList.add("dress-items");

        const isWishlisted = isInWishlist(dress.id);
        const heartIcon = isWishlisted ? "images/heart-filled.svg" : "images/heart.svg";

        dressCard.innerHTML = `
            <a href="dress-details.html?id=${dress.id}">
                <img src="${dress.image}" alt="${dress.name}">
            </a>

            <div class="heart-btn" data-id="${dress.id}">
                <img src="${heartIcon}" alt="Add to wishlist" class="heart-icon">
            </div>

            <div class="dress-info">
                <h3>${dress.name}</h3>
                <p>₹ ${dress.price.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}</p>
            </div>
            
            <div class="tag ${dress.tag.replace(" ", "-").toLowerCase()}">
                ${dress.tag}
            </div>
        `;

        dressContainer.appendChild(dressCard);
    });

    // Event delegation for heart buttons
    dressContainer.addEventListener('click', (e) => {
        const heartBtn = e.target.closest('.heart-btn');
        if (heartBtn) {
            e.preventDefault(); // Prevent navigation
            e.stopPropagation(); // Stop event bubbling

            const dressId = parseInt(heartBtn.dataset.id);
            const heartIcon = heartBtn.querySelector('.heart-icon');

            const isAdded = toggleWishlist(dressId);

            // Update heart icon
            heartIcon.src = isAdded ? "images/heart-filled.svg" : "images/heart.svg";

            // Animation feedback
            heartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                heartBtn.style.transform = 'scale(1)';
            }, 200);

            console.log('Heart clicked, wishlist count:', wishlist.length); // Debug log
        }
    });
}

// ================= DRESS DETAILS PAGE =================
const dressDetailsContainer = document.getElementById("dress-details");
const breadcrumbContainer = document.getElementById("breadcrumb");

if (dressDetailsContainer) {
    const params = new URLSearchParams(window.location.search);
    const dressId = parseInt(params.get("id"));

    const selectedDress = dresses.find(d => d.id === dressId);

    if (selectedDress) {
        const isWishlisted = isInWishlist(selectedDress.id);
        const heartIcon = isWishlisted ? "images/heart-filled.svg" : "images/heart.svg";


        breadcrumbContainer.innerHTML = `
            <a href="index.html">Home  &gt;</a>
            <a href="dress.html">Dress  &gt;</a>
            <a>${selectedDress.name}</a>
        `;


        dressDetailsContainer.innerHTML = `
            <div class="single-dress">

            <div class="dress-image-section">
                <div class="main-image-container">
                    <img src="${selectedDress.image}" alt="${selectedDress.name}">

                    <div class="image-heart-btn" data-id="${selectedDress.id}">
                            <img src="${heartIcon}" alt="Add to wishlist" class="heart-icon-detail">
                    </div>
                </div>
            </div>



                <div class="single-dress-info">
                    <h1>${selectedDress.name}</h1>
                    <p class="price">₹ ${selectedDress.price.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}</p>

                    <p class="tax">Inclusive of all taxes</p>

                    <h4>★  Free shipping on all pre-paid orders  ★</h4>

                    <div class="sizes">
                        <h1>Size</h1>
                        <button data-size="XS">XS</button>
                        <button data-size="S">S</button>
                        <button data-size="M" class="selected">M</button>
                        <button data-size="L">L</button>
                        <button data-size="XL">XL</button>
                    </div>

                    <button class="add-to-bag" id="add-to-bag-btn">Add to Bag</button>

                    <button class="buy-it-now" id="buy-now-btn">Buy it now</button>
                </div>
            </div>
        `;


        dressDetailsContainer.addEventListener('click', (e) => {
        const heartBtn = e.target.closest('.image-heart-btn');
        if (heartBtn) {
            e.preventDefault(); // Prevent navigation
            e.stopPropagation(); // Stop event bubbling

            const dressId = parseInt(heartBtn.dataset.id);
            const heartIcon = heartBtn.querySelector('.heart-icon-detail');

            const isAdded = toggleWishlist(dressId);

            // Update heart icon
            heartIcon.src = isAdded ? "images/heart-filled.svg" : "images/heart.svg";

            // Animation feedback
            heartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                heartBtn.style.transform = 'scale(1)';
            }, 200);

            console.log('Heart clicked, wishlist count:', wishlist.length); // Debug log
        }
    });

        // Size selection
        let selectedSize = 'M';
        const sizeButtons = dressDetailsContainer.querySelectorAll('.sizes button');

        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedSize = btn.dataset.size;
            });
        });

        // Add to bag functionality
        const addToBagBtn = document.getElementById('add-to-bag-btn');
        addToBagBtn.addEventListener('click', () => {
            addToBag(selectedDress, selectedSize);

            // Visual feedback
            addToBagBtn.textContent = '✓ Added to Bag';
            addToBagBtn.style.backgroundColor = '#000';
            addToBagBtn.style.color = '#fff';

            setTimeout(() => {
                addToBagBtn.textContent = 'Add to Bag';
                addToBagBtn.style.backgroundColor = '';
                addToBagBtn.style.color = '';
            }, 2000);
        });

        // Buy now functionality
        const buyNowBtn = document.getElementById('buy-now-btn');
        buyNowBtn.addEventListener('click', () => {
            addToBag(selectedDress, selectedSize);
            // Redirect to checkout page (create this page later)
            alert('Proceeding to checkout...');
            // window.location.href = 'checkout.html';
        });
    }
}

// ================= MODAL EVENT LISTENERS =================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing counts...'); // Debug log
    console.log('Current wishlist:', wishlist); // Debug log
    updateWishlistCount();
    updateBagCount();

    // Wishlist trigger - works with or without specific ID
    const wishlistTrigger = document.getElementById('wishlist-trigger') || document.querySelector('.wishlist');
    if (wishlistTrigger) {
        wishlistTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openWishlistModal();
        });
        wishlistTrigger.style.cursor = 'pointer'; // Make it clear it's clickable
    }

    // Bag trigger
    const bagTrigger = document.querySelector('.container-item');
    if (bagTrigger) {
        bagTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openBagModal();
        });
        bagTrigger.style.cursor = 'pointer';
    }

    // Close wishlist button
    const closeWishlistBtn = document.getElementById('close-wishlist');
    if (closeWishlistBtn) {
        closeWishlistBtn.addEventListener('click', closeWishlistModal);
    }

    // Close bag button
    const closeBagBtn = document.getElementById('close-bag');
    if (closeBagBtn) {
        closeBagBtn.addEventListener('click', closeBagModal);
    }

    // Wishlist overlay click
    const wishlistOverlay = document.getElementById('wishlist-overlay');
    if (wishlistOverlay) {
        wishlistOverlay.addEventListener('click', closeWishlistModal);
    }

    // Bag overlay click
    const bagOverlay = document.getElementById('bag-overlay');
    if (bagOverlay) {
        bagOverlay.addEventListener('click', closeBagModal);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('bag-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Proceeding to checkout...');
            // window.location.href = 'checkout.html';
        });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWishlistModal();
            closeBagModal();
        }
    });
});

// Also update immediately (in case DOMContentLoaded already fired)
updateWishlistCount();
updateBagCount();