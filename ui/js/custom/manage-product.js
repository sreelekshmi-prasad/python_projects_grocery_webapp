var productModal = $("#productModal");
    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td>' +
                            '<span class="btn btn-xs btn-warning edit-product">Edit</span> ' + // Added Edit button
                            '<span class="btn btn-xs btn-danger delete-product">Delete</span>' +
                        '</td>' +
                    '</tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    // Save Product
    $(document).ready(function () {
        $("#saveProduct").on("click", function () {
            var productUpdateApiUrl = "/editProduct";
            var productSaveApiUrl = "/insertProduct";
    
            var productId = $("#id").val(); // Get the product ID
            
            var data = $("#productForm").serializeArray();
            var requestPayload = {
                product_id: productId !== "0" ? productId : null, // Include ID if editing
                product_name: null,
                uom_id: null,
                price_per_unit: null
            };
        
            data.forEach(function (element) {
                switch (element.name) {
                    case "name":
                        requestPayload.product_name = element.value;
                        break;
                    case "uoms":
                        requestPayload.uom_id = element.value;
                        break;
                    case "price":
                        requestPayload.price_per_unit = element.value;
                        break;
                }
            });
        
            var apiUrl = productId !== "0" ? productUpdateApiUrl : productSaveApiUrl; // Choose API
        
            console.log("API URL:", apiUrl);
            console.log("Payload:", requestPayload);
        
            callApi("PUT", productUpdateApiUrl, { id: 1, name: "New Name" });

        });
    });
    

    $("#addNewProduct").on("click", function () {
        $("#id").val("0"); // Reset ID to indicate a new product
        $("#name, #price").val(""); // Clear form fields
        $("#uoms").val(""); // Reset unit dropdown
        productModal.find(".modal-title").text("Add New Product"); // Change modal title
        productModal.modal("show");
    });
    

    $(document).on("click", ".delete-product", function (){
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    $(document).on("click", ".edit-product", function () {
        var tr = $(this).closest("tr");
        var productModal = $("#productModal");  // Ensure the modal exists
    
        $("#id").val(tr.data("id"));
        $("#name").val(tr.data("name"));
        $("#price").val(tr.data("price"));
    
        // API URL for UOM list
        let uomListApiUrl = "http://127.0.0.1:5000/getUOM";
    
        // Fetch UOM list and pre-select the existing unit
        $.get(uomListApiUrl, function (response) {
            if (response) {
                let options = '<option value="">--Select--</option>';
                $.each(response, function (index, uom) {
                    options += `<option value="${uom.uom_id}" ${uom.uom_id == tr.data("unit") ? "selected" : ""}>
                                    ${uom.uom_name}
                                </option>`;
                });
                $("#uoms").empty().html(options);
            }
        });
    
        productModal.find(".modal-title").text("Edit Product");
        productModal.modal("show");
    });
    
    
    
    

    

    productModal.on("hide.bs.modal", function () {
        $("#id").val("0"); // Reset ID
        $("#name, #price").val(""); // Clear input fields
        $("#uoms").val(""); // Reset dropdown
        productModal.find(".modal-title").text("Add New Product"); // Reset title
    });


    productModal.on('show.bs.modal', function(){
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        });
    });