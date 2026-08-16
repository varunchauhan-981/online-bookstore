// 1. Cart ka counter shuru mein 0 rakhte hain
let cartCount = 0;

// 2. Hum HTML ke 'Add to Cart' buttons ko select kar rahe hain
const buttons = document.querySelectorAll('.add-to-cart');
const cartDisplay = document.querySelector('.cart-btn'); // Navbar wala Cart link

// 3. Har button ke liye ek "listener" laga rahe hain (Jo click ka intezar karega)
buttons.forEach(button => {
    button.addEventListener('click', () => {
        cartCount++; // Counter badha diya
        updateCartDisplay(); // UI update karne wala function call kiya
        alert("Book added to cart!"); // User ko feedback diya
    });
});

// 4. UI update karne wala function
function updateCartDisplay() {
    cartDisplay.innerText = `Cart (${cartCount})`;
}
// 1. Search input ko select karna
const searchInput = document.getElementById('searchInput');

// 2. 'keyup' event listener lagana (Matlab jaise hi user type karega, yeh chalega)
searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase(); // Jo user ne type kiya, use chote aksharon me badla
    const bookCards = document.querySelectorAll('.book-card'); // Sabhi books ke dabe

    bookCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase(); // Book ka naam
        
        // Agar book ke naam me search term match hota hai, toh dikhao; nahi toh chhupa do
        if (title.includes(searchTerm)) {
            card.style.display = "block"; // Dikhayein
        } else {
            card.style.display = "none";  // Chhupayein
        }
    });
});