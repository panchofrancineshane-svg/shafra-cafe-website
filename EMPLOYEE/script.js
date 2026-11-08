const currentPage = document.body.dataset.page;

if (currentPage === "login") {
    loginPage();
} else if (currentPage === "orders") {
    ordersPage();
} else if (currentPage === "qr-generator") {
    qrGeneratorPage();
} else if (currentPage === "menu-items") {
    menuItemsPage();
} else if (currentPage === "hidden-menu-items") {
    hiddenMenuItemsPage();
} else if (currentPage === "sales-report") {
    salesReportPage();
} else if (currentPage === "best-sellers") {
    bestSellersPage();}

function escapeHtml(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");}

function loginPage() {
    const loginForm = document.getElementById("loginForm");
    const forgotButton = document.getElementById("forgot");

    forgotButton.onclick = function () {
        alert("Please contact your manager to reset your password.");};

    loginForm.onsubmit = function (event) {
        event.preventDefault();

        const username = document.getElementById("user").value.trim();
        const password = document.getElementById("pass").value;
        const error = document.getElementById("err");

        if (username === "" || password === "") {
            error.textContent = "Please enter your username and password.";
            return;}
        window.location.href = "orders.html";};
}

function ordersPage() {
    const filterButtons = document.querySelectorAll(".pills button");
    const rows = document.querySelectorAll("tbody tr");
    const statusDropdowns = document.querySelectorAll("select.act");

    function mark(select) {
        select.className = "act " + select.value;
        const status = select.closest("tr").querySelector(".status");
        if (select.value === "done") {
            status.textContent = "Completed";
        } else {
            status.textContent = "Dropped";}
    }

    function filterOrders(clickedButton) {
        for (const button of filterButtons) {
            button.classList.remove("on");
        }
        clickedButton.classList.add("on");

        const type = clickedButton.dataset.f;
        for (const row of rows) {
            const rowType = row.querySelector(".tag").textContent;
            if (type === "All" || rowType === type) {
                row.hidden = false;
            } else {
                row.hidden = true;}
        }
    }

    for (const button of filterButtons) {
        button.onclick = function () {
            filterOrders(button);};
    }

    for (const select of statusDropdowns) {
        select.onchange = function () {
            mark(select);};
    }
}

function qrGeneratorPage() {
    const newStatus = {
        "Mark As Being Prepared": "Preparing",
        "Mark As Ready for Pick-up": "Ready for Pick-up",
        "Mark As Done": "Completed",
        "Mark As Dropped": "Dropped",};

    document.getElementById("processButton").onclick = function () {
        const status = newStatus[document.getElementById("action").value];
        document.getElementById("status").textContent = status;
        document.getElementById("message").textContent = "Order 4769 updated to " + status + ".";};
}

function menuItemsPage() {
    const items = [
        {   name: "Espresso Shot",
            category: "Coffee",
            subCategory: "Milk",
            price: 135,
            bestSeller: true,
            available: true,
            image: "images/menu_item1.jpg",},
        {   name: "Iced Americano",
            category: "Coffee",
            subCategory: "Milk",
            price: 135,
            bestSeller: true,
            available: true,
            image: "images/menu_item2.jpg",},
        {   name: "Heart Latte",
            category: "Coffee",
            subCategory: "Milk",
            price: 135,
            bestSeller: true,
            available: true,
            image: "images/menu_item3.jpg",},
        {   name: "Ube Latte",
            category: "Coffee",
            subCategory: "Milk",
            price: 135,
            bestSeller: true,
            available: true,
            image: "images/menu_item4.jpg",},
    ];

    const grid = document.getElementById("grid");

    function drawMenu() {
        let menu_cards = "";

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            let imageStyle = "";
            if (item.image !== "") {
                imageStyle = "background-image:url(" + item.image + ")";
            }

            let bestClass = "chip";
            if (item.bestSeller === false) {
                bestClass = "chip off";
            }

            let availableClass = "chip";
            let availableText = "Available";
            if (item.available === false) {
                availableClass = "chip off";
                availableText = "Unavailable";
            }

            menu_cards += "<div class='mi'>";
            menu_cards += "<div class='img' style='" + imageStyle + "'></div>";
            menu_cards += "<h3>" + escapeHtml(item.name) + "</h3>";
            menu_cards +=
                "<p>Drinks | " +
                escapeHtml(item.category) +
                " | " +
                escapeHtml(item.subCategory) +
                " | &#8369;" +
                item.price +
                "</p>";
            menu_cards += "<div class='b'>";
            menu_cards +=
                "<button class='" + bestClass + "' data-action='best' data-index='" + i + "'>Best Seller</button>";
            menu_cards +=
                "<button class='" +
                availableClass +
                "' data-action='available' data-index='" +
                i +
                "'>" +
                availableText +
                "</button>";
            menu_cards += "</div>";
            menu_cards += "<div class='b'>";
            menu_cards += "<button class='cr' data-action='edit' data-index='" + i + "'>Edit</button>";
            menu_cards += "<button class='cr' data-action='remove' data-index='" + i + "'>Remove</button>";
            menu_cards += "</div>";
            menu_cards += "</div>";}

        grid.innerHTML = menu_cards;
    }

    function removeItem(i) {
        if (confirm("Remove " + items[i].name + "?")) {
            items.splice(i, 1);}
    }

    function editItem(i) {
        const newName = prompt("Item name", items[i].name);
        if (newName === null) {
            return;}
        const newPrice = prompt("Price", items[i].price);

        if (newName.trim() !== "") {
            items[i].name = newName.trim();}
        if (newPrice !== null && newPrice !== "" && !isNaN(newPrice)) {
            items[i].price = Number(newPrice);}
    }

    grid.onclick = function (event) {
        const action = event.target.dataset.action;
        if (action === undefined) {
            return;}
        const i = Number(event.target.dataset.index);

        if (action === "best") {
            items[i].bestSeller = !items[i].bestSeller;
        } else if (action === "available") {
            items[i].available = !items[i].available;
        } else if (action === "edit") {
            editItem(i);
        } else if (action === "remove") {
            removeItem(i);}
        drawMenu();
    };

    document.getElementById("add").onclick = function () {
        const name = document.getElementById("name").value.trim();
        const price = document.getElementById("price").value;
        const imageFile = document.getElementById("image").files[0];

        if (name === "" || price === "") {
            alert("Enter a name and price.");
            return;}

        let imageUrl = "";
        if (imageFile !== undefined) {
            imageUrl = URL.createObjectURL(imageFile);}

        items.push({
            name: name,
            category: document.getElementById("category").value,
            subCategory: document.getElementById("subCategory").value,
            price: Number(price),
            bestSeller: false,
            available: true,
            image: imageUrl,
        });

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
        drawMenu();
    };
    drawMenu();
}

function hiddenMenuItemsPage() {
    const items = [
        { name: "Honey Lemon Special", category: "Drinks", beanCost: 5, active: true },
        { name: "Cortado Special", category: "Drink", beanCost: 2, active: true },
        { name: "Cookie Crossant Swirl", category: "Pastry", beanCost: 2, active: true },
        { name: "Dubai Chocolate Special", category: "Pastry", beanCost: 5, active: true },];

    const tableBody = document.getElementById("tableBody");

    function drawTable() {
        let hidden_menu_table = "";

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            let statusClass = "badge";
            let statusText = "Active";
            if (item.active === false) {
                statusClass = "badge off";
                statusText = "Inactive";}

            hidden_menu_table += "<tr>";
            hidden_menu_table += "<td>" + escapeHtml(item.name) + "</td>";
            hidden_menu_table += "<td>" + escapeHtml(item.category) + "</td>";
            hidden_menu_table += "<td>" + item.beanCost + " Beans</td>";
            hidden_menu_table +=
                "<td><button class='" +
                statusClass +
                "' data-action='status' data-index='" +
                i +
                "'>" +
                statusText +
                "</button></td>";
            hidden_menu_table += "<td>";
            hidden_menu_table += "<button class='ed' data-action='edit' data-index='" + i + "'>Edit</button>";
            hidden_menu_table += "<button class='rm' data-action='remove' data-index='" + i + "'>Remove</button>";
            hidden_menu_table += "</td>";
            hidden_menu_table += "</tr>";}

        tableBody.innerHTML = hidden_menu_table;
    }

    function removeItem(i) {
        if (confirm("Remove " + items[i].name + "?")) {
            items.splice(i, 1);
        }
    }

    function editItem(i) {
        const newCost = prompt("Bean cost", items[i].beanCost);
        if (newCost !== null && newCost !== "" && !isNaN(newCost) && Number(newCost) > 0) {
            items[i].beanCost = Number(newCost);
        }
    }

    tableBody.onclick = function (event) {
        const action = event.target.dataset.action;
        if (action === undefined) {
            return;}
        const i = Number(event.target.dataset.index);

        if (action === "status") {
            items[i].active = !items[i].active;
        } else if (action === "edit") {
            editItem(i);
        } else if (action === "remove") {
            removeItem(i);}
        drawTable();
    };

    document.getElementById("add").onclick = function () {
        const name = document.getElementById("name").value.trim();
        const beanCost = document.getElementById("beanCost").value;

        if (name === "" || beanCost === "") {
            alert("Enter a name and bean cost.");
            return;}

        items.push({
            name: name,
            category: document.getElementById("category").value,
            beanCost: Number(beanCost),
            active: true,
        });

        document.getElementById("name").value = "";
        document.getElementById("beanCost").value = "";
        document.getElementById("image").value = "";
        drawTable();};

    drawTable();
}

function salesReportPage() {
    const todayOrders = [
        { date: "Sept 5, 2026", id: 4769, type: "Grab", amount: 135, completed: true },
        { date: "Sept 5, 2026", id: 4770, type: "Pick-up", amount: 155, completed: true },
        { date: "Sept 5, 2026", id: 4771, type: "FoodPanda", amount: 115, completed: true },
        { date: "Sept 5, 2026", id: 4772, type: "Pick-up", amount: 135, completed: true },
        { date: "Sept 5, 2026", id: 4773, type: "FoodPanda", amount: 560, completed: false },];

    const earlierOrders = [
        { date: "Sept 4, 2026", id: 4765, type: "Grab", amount: 270, completed: true },
        { date: "Sept 4, 2026", id: 4766, type: "Pick-up", amount: 135, completed: true },
        { date: "Sept 3, 2026", id: 4762, type: "FoodPanda", amount: 210, completed: true },
        { date: "Sept 2, 2026", id: 4758, type: "Pick-up", amount: 150, completed: false },];

    const tableBody = document.getElementById("tableBody");
    const periodButtons = document.querySelectorAll(".tog");

    function showSales(period) {
        let orders = todayOrders;
        if (period === "week") {
            orders = todayOrders.concat(earlierOrders);}

        let sales_table = "";
        let revenue = 0;
        let dropped = 0;

        for (const order of orders) {
            let typeClass = order.type;
            if (order.type === "Pick-up") {
                typeClass = "Pickup";}

            let statusClass = "drop";
            let statusText = "Dropped";
            if (order.completed) {
                statusClass = "done";
                statusText = "Completed";
                revenue = revenue + order.amount;
            } else {
                dropped = dropped + 1; }

            sales_table += "<tr>";
            sales_table += "<td>" + order.date + "</td>";
            sales_table += "<td>" + order.id + "</td>";
            sales_table += "<td><span class='tag " + typeClass + "'>" + order.type + "</span></td>";
            sales_table += "<td>&#8369;" + order.amount + "</td>";
            sales_table += "<td><span class='st " + statusClass + "'>" + statusText + "</span></td>";
            sales_table += "</tr>";}

        tableBody.innerHTML = sales_table;
        document.getElementById("totalOrders").textContent = orders.length;
        document.getElementById("totalRevenue").innerHTML = "&#8369;" + revenue;
        document.getElementById("totalDropped").textContent = dropped;
    }

    function selectPeriod(clickedButton) {
        for (const button of periodButtons) {
            button.classList.remove("on"); }
        clickedButton.classList.add("on");
        showSales(clickedButton.dataset.r);
    }

    for (const button of periodButtons) {
        button.onclick = function () {
            selectPeriod(button);};
    }

    showSales("today");
}

function bestSellersPage() {
    const products = [
        { name: "Iced Latte", category: "Drinks", price: 135, today: 6, week: 20 },
        { name: "Butter Croissant", category: "Pastry", price: 150, today: 4, week: 14 },
        { name: "Spanish Latte", category: "Drinks", price: 135, today: 3, week: 14 },
        { name: "Ube Latte", category: "Drinks", price: 135, today: 5, week: 13 },
        { name: "Cookie Swirl", category: "Pastry", price: 150, today: 2, week: 11 } ];

    const tableBody = document.getElementById("tableBody");
    const timeButtons = document.querySelectorAll("[data-t]");
    const categoryButtons = document.querySelectorAll("[data-c]");

    let period = "week";
    let category = "All";

    function drawTable() {
        const filtered_products = [];
        for (const product of products) {
            if (category === "All" || product.category === category) {
                filtered_products.push(product); }
        }

        filtered_products.sort(function (a, b) {
            return b[period] - a[period];});

        let best_sellers_table = "";
        for (let i = 0; i < filtered_products.length; i++) {
            const product = filtered_products[i];
            const sold = product[period];
            best_sellers_table += "<tr>";
            best_sellers_table += "<td>" + (i + 1) + "</td>";
            best_sellers_table += "<td>" + product.name + "</td>";
            best_sellers_table += "<td><span class='cat " + product.category + "'>" + product.category + "</span></td>";
            best_sellers_table += "<td>" + sold + "</td>";
            best_sellers_table += "<td>&#8369;" + sold * product.price + "</td>";
            best_sellers_table += "</tr>"; }
        tableBody.innerHTML = best_sellers_table;
    }

    function highlight(buttons, clickedButton) {
        for (const button of buttons) {
            button.classList.remove("on");   }
        clickedButton.classList.add("on");
    }

    for (const button of timeButtons) {
        button.onclick = function () {
            period = button.dataset.t;
            highlight(timeButtons, button);
            drawTable();  };
    }

    for (const button of categoryButtons) {
        button.onclick = function () {
            category = button.dataset.c;
            highlight(categoryButtons, button);
            drawTable(); };
    }
    drawTable();
}
