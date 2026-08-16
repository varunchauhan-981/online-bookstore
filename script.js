// 1. Page khulte hi check karte hain ki kya pehle se koi cart count saved hai ya nahi
let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;

// 2. Elements ko select karna
const cartDisplay = document.querySelector('.cart-btn');
const buttons = document.querySelectorAll('.add-to-cart');
const searchInput = document.getElementById('searchInput');

// 3. Page load hote hi cart ka saved count dikhana
updateCartDisplay();

// 4. 'Add to Cart' buttons par click event lagana
buttons.forEach(button => {
    button.addEventListener('click', () => {
        cartCount++; // Count 1 se badhaya
        
        // LocalStorage mein naye count ko permanent save kiya
        localStorage.setItem('cartCount', cartCount);
        
        updateCartDisplay(); // UI update kiya
        alert("Book added to cart!");
    });
});

// 5. UI update karne wala function
function updateCartDisplay() {
    cartDisplay.innerText = `Cart (${cartCount})`;
}

// 6. Search Bar functionality (Live filtering)
searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        
        // Agar book ka naam search term se match hota hai, toh dikhao; nahi toh chhupa do
        if (title.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});