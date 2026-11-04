const quantityInputs = Array.from(document.querySelectorAll('.quantity-input'));
const itemCount = document.querySelector('#item-count');
const orderTotal = document.querySelector('#order-total');
const orderItems = document.querySelector('#order-items');
const clearOrderButton = document.querySelector('#clear-order');
const placeOrderButton = document.querySelector('#place-order');
const orderStatus = document.querySelector('#order-status');
const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

function updateOrderSummary() {
    let totalItems = 0;
    let totalAmount = 0;
    const selectedItems = [];

    quantityInputs.forEach((input) => {
        const quantity = Number(input.value);
        const price = Number(input.dataset.price);

        if (quantity > 0) {
            totalItems += quantity;
            totalAmount += quantity * price;
            selectedItems.push(`${input.dataset.name} × ${quantity}`);
        }
    });

    itemCount.textContent = String(totalItems);
    orderTotal.textContent = inrFormatter.format(totalAmount);
    orderItems.textContent = selectedItems.length
        ? selectedItems.join(' · ')
        : 'No items selected yet.';
}

quantityInputs.forEach((input) => {
    input.addEventListener('input', () => {
        const quantity = Number(input.value);
        const max = Number(input.max);

        if (!Number.isFinite(quantity) || quantity < 0) {
            input.value = '0';
        } else if (quantity > max) {
            input.value = String(max);
        }

        orderStatus.textContent = '';
        updateOrderSummary();
    });
});

document.querySelectorAll('[data-quantity-change]').forEach((button) => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('.quantity-input');
        const change = Number(button.dataset.quantityChange);
        const currentQuantity = Number(input.value) || 0;
        const nextQuantity = Math.min(Number(input.max), Math.max(0, currentQuantity + change));

        input.value = String(nextQuantity);
        orderStatus.textContent = '';
        updateOrderSummary();
    });
});

clearOrderButton.addEventListener('click', () => {
    quantityInputs.forEach((input) => {
        input.value = '0';
    });
    orderStatus.textContent = '';
    updateOrderSummary();
});

placeOrderButton.addEventListener('click', () => {
    const selectedItems = quantityInputs
        .filter((input) => Number(input.value) > 0)
        .map((input) => `${input.dataset.name} × ${input.value}`);

    if (selectedItems.length === 0) {
        orderStatus.textContent = 'Please add at least one menu item before placing your order.';
        return;
    }

    orderStatus.textContent = `Order ready: ${selectedItems.join(', ')} — ${orderTotal.textContent}. Please visit the counter to complete your order.`;
});

updateOrderSummary();
