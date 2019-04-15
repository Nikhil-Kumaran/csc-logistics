$(document).ready(function(){

    $(".alert").fadeTo(2000, 500).slideUp(500, function(){
        $(".alert").slideUp(500);
    });
    function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
    }

    /*An array containing all the country names in the world:*/
    let prod_list = []
    $.ajax({
        type: 'GET' ,
        url: '/products/list',
        // data: '{"data": "TEST"}',
        //dataType: 'jsonp' - removed
        //jsonpCallback: 'callback' - removed
        success: function (data) {
            console.log(data)
            for(let i in data){
                prod_list.push(data[i].description)
            }
            console.log(prod_list)
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
    
    $.ajax({
        type: 'GET' ,
        url: '/orders/all',
        success: function (data) {
            var order_total = 0;
            for(let i in data){
                // console.log(data[i]._id, data[i].user)
                // for(let j in data[i].order){
                //     console.log(data[i].order[j].description, data[i].order[j].type)
                    
                // }
                order_total = 0;
                for(let j in data[i].order){
                    order_total += data[i].order[j].total_amount;
                }
                $('.order').append(`
                    <div class="card border-primary">
                        <h5 class="card-header text-primary">Order_ID: ${data[i]._id} &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; User: ${data[i].user}</h5>
                        <div class="card-body text-primary">
                            <table class='table'>
                                <thead>
                                    <tr>
                                    <th scope="col">Description</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Piece rate</th>
                                    <th scope="col">Qty per unit</th>
                                    <th scope="col">Rate per unit</th>
                                    <th scope="col">Required unit</th>
                                    <th scope="col">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                ${data[i].order.map( or => `
                                    <tr>
                                        <td>${or.description}</td>
                                        <td>${or.type}</td>
                                        <td>${or.piece_rate}</td>
                                        <td>${or.qty_per_unit}</td>
                                        <td>${or.rate_per_unit}</td>
                                        <td>${or.req_quantity}</td>
                                        <td>${or.total_amount}</td>
                                    </tr>
                                `).join('')}
                                    <tr class='result'>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <th>Total amount</th>
                                        <th>${order_total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div><br>
                `)
                
            }
            console.log(data)
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
    // var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

    /*initiate the autocomplete function on the "myInput" element, and pass along the prod_list array as possible autocomplete values:*/
    autocomplete(document.getElementById("product"), prod_list);

    // add to cart
    let count = 0;
    let total_amount = 0;
    $('#add-btn').click(function(e){
        
        count = count + 1;
        e.preventDefault()
        $('#place-order').css('opacity',1)
        let table = $('#cart');
        let product = $('#product').val()
        $('#product').val('')
        let req_quantity = Number($('#req-quantity').val())
        $('#req-quantity').val('')
        let prod_details = {};
        $('.result').remove();
        $('.result-btn').remove();
        $.ajax({
            type: 'GET' ,
            url: '/products/list/'+product,
            //dataType: 'jsonp' - removed
            //jsonpCallback: 'callback' - removed
            success: function (data) {
                console.log(data)
                prod_details.description = data[0].description
                prod_details.piece_rate = data[0].piece_rate
                prod_details.qty_per_unit = data[0].qty_per_unit
                prod_details.type = data[0].type
                prod_details.rate_per_unit = prod_details.piece_rate * prod_details.qty_per_unit
                prod_details.amount = prod_details.rate_per_unit * req_quantity
                total_amount = total_amount + prod_details.amount;
                $($(table).children('tbody')).append(
                    `
                    <tr>
                        <th scope="row">${count}</th>
                        <td>${product}</td>
                        <td>${prod_details.type}</td>
                        <td>${prod_details.piece_rate}</td>
                        <td>${prod_details.qty_per_unit}</td>
                        <td>${prod_details.piece_rate * prod_details.qty_per_unit}</td>
                        <td>${req_quantity}</td>
                        <td>${prod_details.amount}</td>
                    </tr>
                    <tr class='result'>
                        <th scope="row"></th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total amount</td>
                        <td>${total_amount}</td>
                    </tr>
                    `
                )
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error);
            }
        });
        
    })
    
    $('#place-order').click(function(e){

        e.preventDefault()
        console.log('clicked')
        let rows = $($($('#cart')).children('tbody')).children()
        let order = []
        for(let i = 0;i<rows.length-1;i++){
            let item = {}
            console.log($(rows[i]).children()[1],$(rows[i]).children()[$(rows[i]).children().length-2])
            item.description = $($(rows[i]).children()[1]).text()
            item.type = $($(rows[i]).children()[2]).text()
            item.piece_rate = Number($($(rows[i]).children()[3]).text())
            item.qty_per_unit = Number($($(rows[i]).children()[4]).text())
            item.rate_per_unit= Number($($(rows[i]).children()[5]).text())
            item.req_quantity = Number($($(rows[i]).children()[6]).text())
            item.total_amount = Number($($(rows[i]).children()[7]).text())

            console.log(item)
            order.push(item)
        }
        console.log(order)
        var form = document.createElement("form");
        var element1 = document.createElement("input"); 
        // var element2 = document.createElement("input");  

        form.method = "POST";
        form.action = "/orders/new";   

        element1.value=JSON.stringify({order:order});
        element1.name="order";
        form.appendChild(element1);  

        // element2.value=pw;
        // element2.name="pw";
        // form.appendChild(element2);

        document.body.appendChild(form);

        form.submit();

    });
})
