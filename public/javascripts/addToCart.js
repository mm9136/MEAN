function addToCart(data){
    var cart = [];
    if(localStorage.getItem("cart")){
        cart =  JSON.parse(localStorage.getItem("cart"));
    }
    var postoji = 0;
    for(var i =0; i<cart.length; i++){
        if(cart[i].dvd_id == data){
            cart[i].quantity++;
            postoji = 1;
        }
    }
    if(postoji == 0){
        cart.push({"dvd_id": data, "quantity": 1});
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    
     jQuery.ajax({
        url: "/api/DVDs/qty?dvd_id=" + data + "&quantity=1&operation=0",
        async:false,
        success: function (d) {
        },
        error: function (err) {
            if(err.status == 405){
                alert("There is no enough DVDs!");
                if(localStorage.getItem("cart")){
                    cart =  JSON.parse(localStorage.getItem("cart"));
                }
                for(var i =0; i<cart.length; i++){
                    if(cart[i].dvd_id == data){
                        cart[i].quantity--;
                    }
                }
                localStorage.setItem("cart",JSON.stringify(cart));
            }
        }
        });
     $('.toast').toast('show');
}


$( document ).ready(function() {
   
    reloadCart();
});


function reloadCart(){
    var cart =  JSON.parse(localStorage.getItem("cart"));
    var totalPrice = 0;
    $("#table-cart tbody").empty();
    for(var i = 0; i<cart.length; i++){
        jQuery.ajax({
        url: "/api/DVDs/id/"+cart[i].dvd_id,
        success: function (data) {
            totalPrice +=data.info.price * cart[i].quantity;
                 $("#table-cart tbody").append('<tr> <td><p class="margin-top-1">' + data.info.name + '</p></td>' +
               ' <td>'+
                   ' <div class="btn-group btn-group-toggle inline-block margin-top-0 align-items-center" data-toggle="buttons">'+
                       '<button  id = "minus-'+cart[i].dvd_id+'"  data-id = "'+cart[i].dvd_id+'" class="btn" type="button">-</button>'+
                       '<span class="margin-top-10">' + cart[i].quantity + '</span>'+
                        '<button id = "plus-'+cart[i].dvd_id+'"  data-id = "'+cart[i].dvd_id+'" class="btn" type="button">+</button>'+
                    '</div>'+
                '</td>'+
                '<td>'+
                   ' <p class="margin-top-10">'+  (cart[i].quantity * data.info.price) +
                    ' $</p>'+
               ' </td>'+
                '<td>'+
                 '   <button id = "'+cart[i].dvd_id+'" class="btn btn-sm no-borders margin-top-5" type="button">'+
                  '      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                   '         <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>'+
                    '    </svg>'+
                     '   <ion-icon name="trash" role="img" class="md hydrated" aria-label="trash"></ion-icon>'+
                    '</button>'+
                '</td>'+
            '</tr>');
           
           $("#"+ cart[i].dvd_id+"").click(function(){
              removeFromCart($(this).attr("id"));
              reloadCart();
           });
           
           
           $("#plus-"+ cart[i].dvd_id+"").click(function(){
              plus($(this).attr("data-id"));
              reloadCart();
           });
           
           $("#minus-"+ cart[i].dvd_id+"").click(function(){
              minus($(this).attr("data-id"));
              reloadCart();
           });
           
        },
        async: false
    });
    
    
    }
    $("#total_price").text(totalPrice + "$");
}

function removeFromCart(dvd_id){
    var cart =   JSON.parse(localStorage.getItem("cart"));
    var cartNew = [];
    for(var i=0; i<cart.length; i++){
        if(cart[i].dvd_id != dvd_id){
            cartNew.push(cart[i]);
        }else{
             jQuery.ajax({
                    url: "/api/DVDs/qty?dvd_id="+cart[i].dvd_id + "&quantity=" + cart[i].quantity + "&operation=1",
                    async:false,
                    success: function (data) {
                        console.log(data);
                    }
                });
        }
    }
    localStorage.setItem("cart",JSON.stringify(cartNew));
}


function minus(dvd_id){
    var cart =   JSON.parse(localStorage.getItem("cart"));
  
    for(var i=0; i<cart.length; i++){
        if(cart[i].dvd_id == dvd_id){
            if(cart[i].quantity>1)
                cart[i].quantity--;
                jQuery.ajax({
                    url: "/api/DVDs/qty?dvd_id="+cart[i].dvd_id + "&quantity=1&operation=1",
                    async:false,
                    success: function (data) {
                        console.log(data);
                    }
                });
        }
    }
    localStorage.setItem("cart",JSON.stringify(cart));
}


function plus(dvd_id){
    var cart =   JSON.parse(localStorage.getItem("cart"));
  
    for(var i=0; i<cart.length; i++){
        if(cart[i].dvd_id == dvd_id){
            cart[i].quantity++;
             jQuery.ajax({
                url: "/api/DVDs/qty?dvd_id="+cart[i].dvd_id + "&quantity=1&operation=0",
                async:false,
                success: function (data) {
                },
                error: function (err) {
                    if(err.status == 405){
                        alert("There is no enough DVDs!");
                        cart[i].quantity--;
                    }
                }
                });
        }
    }
    localStorage.setItem("cart",JSON.stringify(cart));
}