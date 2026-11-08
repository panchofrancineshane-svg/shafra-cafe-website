const currentPage = document.body.dataset.page;

if (currentPage === "beans") {
    beansPage();
} else if (currentPage === "cart") {
    cartPage();
} else if (currentPage === "order_status") {
    orderStatusPage();
}

function escapeHtml(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function peso(amount) {
    return "\u20B1" + amount.toFixed(2);
}

function beansPage() {
    const customer = { beans: 1000, successfulOrders: 2 };
    const ordersNeeded = 10;

    const ordersLeft = ordersNeeded - customer.successfulOrders;
    const unlockMessage = document.getElementById("unlockMessage");

    document.getElementById("beanCount").textContent = customer.beans + " beans";

    if (ordersLeft > 1) {
        unlockMessage.textContent = ordersLeft + " more orders to go, to unlock hidden menu";
    } else if (ordersLeft === 1) {
        unlockMessage.textContent = "1 more order to go, to unlock hidden menu";
    } else {
        unlockMessage.textContent = "Hidden menu unlocked!";
    }
}

function cartPage() {
    const cart = [
        { name: "Iced Latte", image: "images/Iced_Latte.jpg", beans: 100, size: "SMALL", price: 5.56, quantity: 1 },
        { name: "Churro", image: "images/churro.jpg", beans: 100, size: "", price: 3.2, quantity: 1 },
    ];
    const taxRate = 0.12;

    const cartItems = document.getElementById("cartItems");

    function drawCart() {
        let cart_cards = "";

        if (cart.length === 0) {
            cart_cards = "<p class='empty_cart'>Your cart is empty.</p>";
        }

        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];

            let sizeText = "";
            if (item.size !== "") {
                sizeText = "<span class='item_size'>" + escapeHtml(item.size) + "</span>";
            }

            cart_cards += "<div class='cart_item'>";
            cart_cards += "<img class='item_image' src='" + item.image + "' alt='" + escapeHtml(item.name) + "'>";
            cart_cards += "<div class='item_body'>";
            cart_cards += "<div class='item_row'>";
            cart_cards += "<div>";
            cart_cards += "<h3>" + escapeHtml(item.name) + "</h3>";
            cart_cards += "<p class='item_beans'><img src='images/bean.png' alt=''>" + item.beans + " beans</p>";
            cart_cards += "</div>";
            cart_cards += "<span class='unit_price'>" + peso(item.price) + "</span>";
            cart_cards += "</div>";
            cart_cards +=
                "<div class='item_meta'>" + sizeText + "<span class='qty_pill'>Qty: " + item.quantity + "</span></div>";
            cart_cards += "<div class='item_row'>";
            cart_cards += "<div class='item_actions'>";
            cart_cards +=
                "<button class='icon_button' data-action='remove' data-index='" +
                i +
                "'><img src='images/trash.png' alt='Remove'></button>";
            cart_cards +=
                "<button class='icon_button' data-action='edit' data-index='" +
                i +
                "'><img src='images/edit.png' alt='Edit'></button>";
            cart_cards +=
                "<button class='icon_button' data-action='add' data-index='" +
                i +
                "'><img src='images/add.png' alt='Add one more'></button>";
            cart_cards += "</div>";
            cart_cards += "<span class='item_total'>" + peso(item.price * item.quantity) + "</span>";
            cart_cards += "</div>";
            cart_cards += "</div>";
            cart_cards += "</div>";
        }

        cartItems.innerHTML = cart_cards;
        drawReceipt();
    }

    function drawReceipt() {
        let subtotal = 0;
        for (const item of cart) {
            subtotal = subtotal + item.price * item.quantity;
        }
        const tax = subtotal * taxRate;

        document.getElementById("subtotal").textContent = peso(subtotal);
        document.getElementById("tax").textContent = peso(tax);
        document.getElementById("total").textContent = peso(subtotal + tax);
    }

    function removeItem(i) {
        if (confirm("Remove " + cart[i].name + " from your cart?")) {
            cart.splice(i, 1);
        }
    }

    function editItem(i) {
        const answer = prompt("Quantity for " + cart[i].name, cart[i].quantity);
        if (answer !== null && answer !== "" && !isNaN(answer) && Number(answer) >= 1) {
            cart[i].quantity = Math.floor(Number(answer));
        }
    }

    cartItems.onclick = function (event) {
        const button = event.target.closest("button");
        if (button === null) {
            return;
        }
        const i = Number(button.dataset.index);

        if (button.dataset.action === "add") {
            cart[i].quantity = cart[i].quantity + 1;
        } else if (button.dataset.action === "edit") {
            editItem(i);
        } else if (button.dataset.action === "remove") {
            removeItem(i);
        }
        drawCart();
    };

    document.getElementById("checkoutButton").onclick = function () {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        window.location.href = "order_status.html";
    };

    drawCart();
}

function orderStatusPage() {
    const receivedButton = document.getElementById("receivedButton");

    receivedButton.onclick = function () {
        receivedButton.textContent = "Thank you!";
        receivedButton.disabled = true;
    };
}
