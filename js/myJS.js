window.onload = function() {
    // We find out which page we are on currently and based on that we will do something
    let path = window.location.pathname;
    let page = path.split("/").pop().replace(".html", "");

    try{
        displayCartNumber();
    }
    catch(ex){
        console.log(`Error displaying cart number! Error: ${ex}`);
    }

    if(path == "/Drinksology/" || page == "index") {
        try{
            fetchData("types", showTypes);
        }
        catch(ex){
            console.log(`Error displaying types on index page! Error: ${ex}`);
        }
    }

    if(page == "product") {
        try{
            fetchData("types", displayType);
        }
        catch(ex){
            console.log(`Error displaying types and products on product page! Error: ${ex}`);
        }
        document.querySelector("#search").addEventListener("keyup", loadProducts);
        document.querySelector("#sort").addEventListener("change", loadProducts);
        document.querySelector("#types").addEventListener("change", loadProducts);
        document.querySelector("#price").addEventListener("input", loadProducts);
        document.querySelector("#clear").addEventListener("click", clearAllFilters);
    }

    if(page == "contact") {
        try{
            $(document.contactForm).on("submit", function(event) {
                event.preventDefault();
                clearFormErrors();
                let form = document.contactForm;
                let error = false;
                let nameRegex = /^\p{Uppercase_Letter}\p{Letter}{1,14}(\s\p{Uppercase_Letter}\p{Letter}{1,14}){0,2}$/u;
                let emailRegex = /^[a-z]((\.|-)?[a-z0-9]){2,}@[a-z]((\.|-)?[a-z0-9]+){2,}\.[a-z]{2,6}$/;
                let subjectRegex = /^\p{Uppercase_Letter}[\p{Letter}\.,\?!\/-]*(\s[\p{Letter}\.,\?!\/-]+)*$/u;
                if(form.name.value.length <= 30) {
                    if(form.name.value == "") {
                        formError(form.name, "Please input your name.");
                        error = true;
                    }
                    else if(!nameRegex.test(form.name.value)) {
                        formError(form.name, "Please input a valid name. All words must begin with a capital letter.");
                        error = true;
                    }
                }
                else {
                    formError(form.name, "Name can't be more than 30 characters long.");
                    error = true;
                }
                if(form.email.value.length <= 40) {
                    if(form.email.value == "") {
                        formError(form.email, "Please input your email address.");
                        error = true;
                    }
                    else if(!emailRegex.test(form.email.value)) {
                        formError(form.email, "Please input a valid email adress. Use only lowercase letters and symbols .-@");
                        error = true;
                    }
                }
                else {
                    formError(form.email, "Email can't be more than 40 characters long.");
                    error = true;
                }
                if(form.subject.value.length <= 20) {
                    if(form.subject.value == "") {
                        formError(form.subject, "Please provide subject of your question.");
                        error = true;
                    }
                    else if(!subjectRegex.test(form.subject.value)) {
                        formError(form.subject, "Please input a valid subject name. The first letter must be capital. You can use symbols .,-/?!");
                        error = true;
                    }
                }
                else {
                    formError(form.subject, "Subject name can't be more than 20 characters long.");
                    error = true;
                }
                if(form.message.value == "") {
                    formError(form.message, "Please write a message.");
                    error = true;
                }
                else if(form.message.value.length <= 20) {
                    formError(form.message, "Message can't be less than 20 characters long.");
                    error = true;
                }
                else if(form.message.value.length >= 200) {
                    formError(form.message, "Message can't be more than 200 characters long.");
                    error = true;
                }
                if(!error) {
                    $("#submit").next().text("Your message has been successfully sent!").fadeIn().delay(3000).fadeOut();
                    form.reset();
                }
            });
        }
        catch(ex){
            console.log(`Error validating and submiting form on contact page! Error: ${ex}`);
        }
        
    }

    if(page == "cart" || page == "checkout") {
        let productsFromCart = getItemsFromLocalStorage("cart");
        try{
            if(productsFromCart == null || productsFromCart.length === 0) {
                emptyCartMessage();
            }
            else{
                displayCart();
            }
        }
        catch(ex){
            console.log(`Error displaying cart or cart message! Error: ${ex}`);
        }
    }

    if(page == "checkout") {
        $("#removeMe").hide();
        $("#payment").hide();
        try{
            $(document.checkoutForm).on("submit", function(event) {
                event.preventDefault();
                clearFormErrors();
                let form = document.checkoutForm;
                let error = false;
                let nameRegex = /^\p{Uppercase_Letter}\p{Letter}{1,14}(\s\p{Uppercase_Letter}\p{Letter}{1,14}){0,2}$/u;
                let emailRegex = /^[a-z]((\.|-)?[a-z0-9]){2,}@[a-z]((\.|-)?[a-z0-9]+){2,}\.[a-z]{2,6}$/;
                let addressRegex = /^[\w\.]+(,?\s[\w\.]+){2,8}$/;
                if(form.name.value.length <= 30) {
                    if(form.name.value == "") {
                        formError(form.name, "Please input your name.");
                        error = true;
                    }
                    else if(!nameRegex.test(form.name.value)) {
                        formError(form.name, "Please input a valid name. All words must begin with a capital letter.");
                        error = true;
                    }
                }
                else {
                    formError(form.name, "Name can't be more than 30 characters long.");
                    error = true;
                }
                if(form.email.value.length <= 40) {
                    if(form.email.value == "") {
                        formError(form.email, "Please input your email address.");
                        error = true;
                    }
                    else if(!emailRegex.test(form.email.value)) {
                        formError(form.email, "Please input a valid email adress. Use only lowercase letters and symbols .-@");
                        error = true;
                    }
                }
                else {
                    formError(form.email, "Email can't be more than 40 characters long.");
                    error = true;
                }
                if(form.address.value.length <= 30) {
                    if(form.address.value == "") {
                        formError(form.address, "Please input your shipping address.");
                        error = true;
                    }
                    else if(!addressRegex.test(form.address.value)) {
                        formError(form.address, "The address should include the name of your city and street.");
                        error = true;
                    }
                }
                else {
                    formError(form.address, "Shipping address can't be more than 30 characters long.");
                    error = true;
                }
                if(form.country.value == 0) {
                    formError(form.country, "Please select your country.");
                    error = true;
                }
                if(!form.querySelector('input[name="optradio"]:checked')) {
                    $("#payment").show();
                    error = true;
                }
                if(!error) {
                    $("#submit").next().text("You have successfully placed an order! You will be redirected to the product page.").fadeIn().delay(4000).fadeOut();
                    form.reset();
                    removeAllFromCart();
                    setTimeout(function() {
                        window.location.replace("product.html");
                  }, 6000);
                }
            });
        }
        catch(ex){
            console.log(`Error validating and submiting form on checkout page! Error: ${ex}`);
        }
    }

    if(page == "about") {
        try{
            fetchData("types", showTypes);
            fetchData("clients", displayClients);
        }
        catch(ex){
            console.log(`Error displaying types or clients on about page! Error: ${ex}`);
        }
    }
}
function fetchData(file, displayFn) {
    $.ajax({
        url: "data/" + file + ".json",
        method: "get",
        dataType: "json",
        success: function(data) {
            displayFn(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
let typesArray = [];
function displayProducts(products) {
    products = search(products);
    products = sort(products);
    products = filterTypes(products);
    products = filterPrice(products);
    setLocalStorage("allProducts", products);
    let html = "";
    for(let product of products) {
        html += `<div class="col-md-4 d-flex">
                    <div class="product">
                        <div class="img d-flex align-items-center justify-content-center" style="background-image: url(images/${product.img.src});">
                            <div class="desc">
                            <p class="meta-prod d-flex">
                            <button data-id=${product.id} class="border border-1 p-3 d-flex align-items-center justify-content-center button btn add-to-cart"><span class="h5 text-white flaticon-shopping-bag"></span></button>
                            </p>
                            </div>
                        </div>
                        <div class="text text-center">
                            <span class="sale">${product.sale == false ? "" : "Sale"}</span>
                            <span class="category">${getTypeProduct(product.typeId)}</span>
                            <h2>${product.name}</h2>
                            <p class="mb-0"><span class="price price-sale">${product.price.old == null ? "" : product.price.old}</span> <span class="price">${product.price.new}</span></p>
                        </div>
                    </div>
                </div>`;
    }
    document.querySelector("#products").innerHTML = html;
    $('.add-to-cart').click(addToCart);
}
function displayType(types) {
    let html = "";
    for(let type of types) {
        html += `<div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input type" id="check${type.id}" name="categories" value="${type.id}" autocomplete="off">
                    <label class="custom-control-label" for="check${type.id}">${type.name}</label>
                </div>`;
    }
    document.querySelector("#types").innerHTML = html;
    typesArray = types;
    loadProducts();
}
function getTypeProduct(id) {
    let name = typesArray.filter(x=> x.id == id)[0].name;
    return name;
}
function search(products) {
    let searchValue = document.querySelector("#search").value.toLowerCase();
    if(searchValue) {
        return products.filter(function(el) {
            return el.name.toLowerCase().indexOf(searchValue) !== -1;
        });
    }
    return products;
}
function sort(products) {
    const sortType = document.querySelector("#sort").value;
    if(sortType == "recent") {
        return products;
    }
    if(sortType == "pasc") {
        return products.sort((a, b) => a.price.new > b.price.new ? 1 : -1);
    }
    if(sortType == "pdesc") {
        return products.sort((a, b) => a.price.new < b.price.new ? 1 : -1);
    }
    if(sortType == "nasc") {
        return products.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    if(sortType == "ndesc") {
        return products.sort((a, b) => a.name < b.name ? 1 : -1);
    }
}
function filterTypes(products) {
    let selectedTypes = [];
    $(".type:checked").each(function(el) {
        selectedTypes.push(parseInt($(this).val()));
    });
    if(selectedTypes.length != 0) {
        return products.filter(x=> selectedTypes.includes(x.typeId));
    }
    return products;
}
function filterPrice(products) {
    if($('#price').length != 0) {
    let value = parseInt($("#price").val());
    document.querySelector("#output").innerHTML = value + "$";
    return products.filter(x => x.price.new <= value);
    }
    return products;
}
function clearAllFilters(){
    $(".type").prop("checked", false);
    $("#search").val("");
    $("#price").val($("#price").attr("max"));
    loadProducts();
}
function setLocalStorage(name, data){
    localStorage.setItem(name, JSON.stringify(data));
}
function getItemsFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name));
}
function addToCart(){
    let idProduct = $(this).data("id");
    let productsFromCart = getItemsFromLocalStorage("cart");
    if(productsFromCart){
        if(productIsAlreadyInCart()){
            updateQuantity();
        }
        else{
            addNewProductToCart();
            displayCartNumber();
        }
    }
    else{
        addFirstProductToCart();
        displayCartNumber();
    }
    function addFirstProductToCart(){
        let products = [];
            products[0] = {
                id: idProduct,
                quantity: 1
            }
        setLocalStorage("cart", products);
    }
    function productIsAlreadyInCart(){
        return productsFromCart.filter(p => p.id == idProduct).length;
    }
    function updateQuantity(){
        let productsFromLS = getItemsFromLocalStorage("cart");
        for(let product of productsFromLS){
            if(product.id == idProduct){
                product.quantity++;
                break;
            }
        }
        setLocalStorage("cart", productsFromLS);
    }
    function addNewProductToCart(){
        let productsFromLS = getItemsFromLocalStorage("cart");
        productsFromLS.push({
            id: idProduct,
            quantity: 1
        });
        setLocalStorage("cart", productsFromLS);
    }
}
function loadProducts(){
    fetchData("products", displayProducts);
}
function clearFormErrors(){
    $(".error-message").hide();
    $(".success-message").hide();
}
function formError(formElement, message){
    $(formElement).next()
            .text(message)
            .fadeIn()
            .next()
            .fadeIn();
}
function displayCartNumber() {
    let productsFromCart = getItemsFromLocalStorage("cart");
    let productCount = "";

    if(productsFromCart){
        let productNumber = productsFromCart.length;

        if(productNumber == 1){
            productCount = `${productNumber}`
        }
        else{
            productCount = `${productNumber}`
        }
    }
    else{
        productCount = `0`
    }
    document.querySelector(".number-cart").innerHTML = productCount;
}
function emptyCartMessage(){
    let html = `<table class="table"><tr class="alert" role="alert"><thead class="thead-primary"><th>No products in the cart.</th></tr></thead></table>`;
    $("#content").html(html);
}
function displayCart(){
    let allProducts = getItemsFromLocalStorage("allProducts");
    let productsFromCart = getItemsFromLocalStorage("cart");
    let productsForDisplay = allProducts.filter(product =>{
        for(let productLS of productsFromCart){
            if(product.id == productLS.id){
                product.quantity = productLS.quantity
                return true;
            }
        }
        return false;
    });
    displayProductsFromCart(productsForDisplay);
}
function displayProductsFromCart(products){
    let html = `<table class="table">
    <thead class="thead-primary">
      <tr>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
          <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>total</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>`;
        let sum = 0;
        for(let p of products) {
            html += `<tr class="alert" role="alert">
            <td>${p.id}</td>
            <td>
                <div class="img" style="background-image: url(images/${p.img.src});"></div>
            </td>
          <td>
              <div class="email">
                  <span>${p.name}</span>
                  <span></span>
              </div>
          </td>
          <td>${p.price.new}</td>
          <td>${p.quantity}</td>
      </td>
      <td>${p.price.new * p.quantity}</td>
          <td>
              <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick='removeFromCart(${p.id})'>
            <span aria-hidden="true"><i class="fa fa-close"></i></span>
          </button>
        </td>
        </tr>`;
            let total = p.price.new * p.quantity;
            sum += total;
        }
        sum = Number(sum).toFixed(2);
        function displayTotal() {
            let html = "";
            html += `<div class="cart-total mb-3">
            <h3>Cart Totals</h3>
            <hr>
            <p class="d-flex total-price">
                <span>Total</span>
                <span>${sum}</span>
            </p>
        </div>
        <p id="removeMe" class="text-center"><a href="checkout.html" class="btn btn-primary py-3 px-4">Proceed to Checkout</a></p>`;
            document.querySelector("#total").innerHTML = html;
        }
        displayTotal();
        html += `</tbody></table>`;
        $("#content").html(html);
}
function removeFromCart(id) {
    let products = getItemsFromLocalStorage("cart");
    let filteredProducts = products.filter(p => p.id != id);
    setLocalStorage("cart", filteredProducts);
    displayCart();
}
function removeAllFromCart() {
    localStorage.removeItem("cart");
}
function showTypes(types) {
    let html = "";
    for(let type of types) {
        html += `<div class="col-lg-2 col-md-4 ">
        <div class="sort w-100 text-center">
            <div class="img" style="background-image: url(images/${type.img.src});"></div>
            <h3>${type.name}</h3>
        </div></div>`;
    }
    document.querySelector("#typesMain").innerHTML = html;
}
function displayClients(clients) {
    let html = "";
    for(let client of clients) {
        html += `<div class="item">
        <div class="testimony-wrap py-4">
            <div class="icon d-flex align-items-center justify-content-center"><span class="fa fa-quote-left"></div>
          <div class="text">
            <p class="mb-4">${client.impression}</p>
            <div class="d-flex align-items-center">
                <div class="user-img" style="background-image: url(images/${client.img.src})"></div>
                <div class="pl-3">
                    <p class="name">${client.name}</p>
                    <span class="position">${client.feeling}</span>
                  </div>
              </div>
          </div>
        </div>
      </div>`;
    }
    document.querySelector("#testimonials").innerHTML = html;
}





    






