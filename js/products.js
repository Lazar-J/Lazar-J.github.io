window.onload = function() {

    let path = window.location.pathname;
    let page = path.split("/").pop().replace(".html", "");
    console.log(page);
    if(page == "product") {
        console.log("ovo je product bre");
    }
    if(page == "author") {
        console.log("ovo je autor");
    }



    //For help
    let typesArray = [];

    // Calling functions
    fetchData("types", displayType);

    // Getting data
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

    // Displaying our products
    function displayProducts(products) {
        let html = "";
        for(let product of products) {
            html += `<div class="col-md-4 d-flex">
                        <div class="product">
                            <div class="img d-flex align-items-center justify-content-center" style="background-image: url(images/${product.img});">
                                <div class="desc">
                                    <p class="meta-prod d-flex">
                                        <a href="#" class="d-flex align-items-center justify-content-center"><span class="flaticon-shopping-bag"></span></a>
                                    </p>
                                </div>
                            </div>
                            <div class="text text-center">
                                <span class="sale">${product.sale == null ? "" : "Sale"}</span>
                                <span class="category">${getTypeProduct(product.typeId)}</span>
                                <h2>${product.name}</h2>
                                <p class="mb-0"><span class="price price-sale">${product.price.old == null ? "" : product.price.old}</span> <span class="price">${product.price.new}</span></p>
                            </div>
                        </div>
                    </div>`;
        }
        document.querySelector("#products").innerHTML = html;
    }
    // Displaying types of products
    function displayType(types) {
        let html = "";
        for(let type of types) {
            html += `<div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="check${type.id}" name="categories" value="${type.id}" autocomplete="off">
                        <label class="custom-control-label" for="check${type.id}">${type.name}</label>
                    </div>`;
        }
        document.querySelector("#types").innerHTML = html;
        typesArray = types;
        filterChange();
    }


    // Getting type of our products
    function getTypeProduct(id) {
        let name = typesArray.filter(x=> x.id == id)[0].name;
        return name;
    }

    // Help function
    function filterChange(){
        fetchData("products", displayProducts);
    }

    //
}
