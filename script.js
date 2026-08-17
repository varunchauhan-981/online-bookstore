// LocalStorage safely load
let cart = {};
try {
    const saved = localStorage.getItem('cartItems');
    if (saved) cart = JSON.parse(saved);
} catch (e) {
    cart = {};
}

// Elements Reference
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const searchInput = document.getElementById('searchInput');
const bookGrid = document.getElementById('bookGrid');

// Modal Elements
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

let allBooks = [];

// Server se books fetch karna
async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        if (!response.ok) throw new Error("API request failed");
        allBooks = await response.json();
        displayBooks(allBooks);
        updateTotalCartBadge();
    } catch (error) {
        console.error("Error fetching books:", error);
        bookGrid.innerHTML = `<p style="color: red; text-align: center;">Books load nahi ho paayi. Server check karein.</p>`;
    }
}

// Books Display on Home Grid
function displayBooks(books) {
    bookGrid.innerHTML = '';
    books.forEach(book => {
        const qty = cart[book.id] || 0;
        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <div>
                <h3>${book.title}</h3>
                <p class="author">By ${book.author}</p>
            </div>
            <div>
                <p class="price">₹${book.price}</p>
                <div class="qty-controller">
                    <button class="qty-btn minus-btn" data-id="${book.id}">−</button>
                    <span class="qty-count" id="qty-${book.id}">${qty}</span>
                    <button class="qty-btn plus-btn" data-id="${book.id}">+</button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

// Cart Drawer Open / Close
cartBtn.addEventListener('click', () => {
    renderCartModal();
    cartModal.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('active');
});

// Render Cart Drawer
function renderCartModal() {
    cartItemsList.innerHTML = '';
    let totalAmount = 0;
    const addedBookIds = Object.keys(cart);

    if (addedBookIds.length === 0) {
        cartItemsList.innerHTML = `<p class="empty-cart-msg">Your cart is empty 🛍️</p>`;
        cartTotalPrice.innerText = `₹0`;
        return;
    }

    addedBookIds.forEach(id => {
        const book = allBooks.find(b => b.id === parseInt(id));
        const qty = cart[id];
        if (book && qty > 0) {
            const itemTotal = book.price * qty;
            totalAmount += itemTotal;

            const row = document.createElement('div');
            row.classList.add('cart-item-row');
            row.innerHTML = `
                <div class="cart-item-info">
                    <h4>${book.title}</h4>
                    <p>₹${book.price} × ${qty} = ₹${itemTotal}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn modal-minus-btn" data-id="${book.id}">−</button>
                    <span class="qty-count">${qty}</span>
                    <button class="qty-btn modal-plus-btn" data-id="${book.id}">+</button>
                </div>
            `;
            cartItemsList.appendChild(row);
        }
    });

    cartTotalPrice.innerText = `₹${totalAmount}`;
}

// Global Quantity Change
function changeQuantity(bookId, delta) {
    const currentQty = cart[bookId] || 0;
    const newQty = currentQty + delta;

    if (newQty > 0) {
        cart[bookId] = newQty;
    } else {
        delete cart[bookId];
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateTotalCartBadge();

    const gridQtySpan = document.getElementById(`qty-${bookId}`);
    if (gridQtySpan) gridQtySpan.innerText = cart[bookId] || 0;

    if (cartModal.classList.contains('active')) {
        renderCartModal();
    }
}

// Events for Main Grid (+ / -)
bookGrid.addEventListener('click', (e) => {
    const bookId = e.target.dataset.id;
    if (!bookId) return;

    if (e.target.classList.contains('plus-btn')) changeQuantity(bookId, 1);
    else if (e.target.classList.contains('minus-btn')) changeQuantity(bookId, -1);
});

// Events inside Cart Modal (+ / -)
cartItemsList.addEventListener('click', (e) => {
    const bookId = e.target.dataset.id;
    if (!bookId) return;

    if (e.target.classList.contains('modal-plus-btn')) changeQuantity(bookId, 1);
    else if (e.target.classList.contains('modal-minus-btn')) changeQuantity(bookId, -1);
});

function updateTotalCartBadge() {
    const totalCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    cartBadge.innerText = totalCount;
}

// Real Backend Order Placement Logic
checkoutBtn.addEventListener('click', async () => {
    const orderItems = Object.keys(cart).map(id => {
        const book = allBooks.find(b => b.id === parseInt(id));
        return {
            id: book.id,
            title: book.title,
            price: book.price,
            quantity: cart[id]
        };
    }).filter(item => item.quantity > 0);

    if (orderItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: orderItems, totalAmount: totalAmount })
        });

        const data = await response.json();

        if (data.success) {
            alert(`🎉 Order Confirmed!\n\nOrder ID: ${data.orderId}\nTotal Amount: ₹${totalAmount}\n\nCheck terminal to see the received order payload.`);
            
            // Clear cart
            cart = {};
            localStorage.removeItem('cartItems');
            updateTotalCartBadge();
            displayBooks(allBooks);
            renderCartModal();
            cartModal.classList.remove('active');
        }
    } catch (err) {
        console.error("Order failed:", err);
        alert("Something went wrong while placing your order.");
    }
});

// Live Search Filter
searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    displayBooks(filteredBooks);
});

// Initial Load
fetchBooks();