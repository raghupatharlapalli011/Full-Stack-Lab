// Get the elements from HTML
let priceInput = document.getElementById("price");
let quantityInput = document.getElementById("quantity");
let total = document.getElementById("total");

priceInput.addEventListener("input", calculateTotal);
// Function to calculate total price
function calculateTotal() {

    // Get values from input boxes
    let price = priceInput.value;
    let quantity = Number(quantityInput.value);

    // Calculate total
    let result = price * quantity;

    // Display result
    total.textContent = result;
}


// Add event listener to price



// Add event listener to quantity
quantityInput.addEventListener("input", calculateTotal);
