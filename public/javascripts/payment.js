 const holder_name = document.getElementById('holder_name');
    const cardNumber = document.getElementById('cardNumber');
    const expityMonth = document.getElementById('expityMonth');
    const expityYear = document.getElementById('expityYear');
    const cvCode = document.getElementById('cvCode');
 const payment = document.getElementById('payment');
 
    [ cardNumber, expityMonth, expityYear, cvCode ].forEach(function(element) {
        element.addEventListener('keyup', function (event) {
            
            if ( validate_creditcardnumber(cardNumber.value) && cardNumber.value != "" && expityMonth.value != "" && yearValidate(expityYear) 
            && cvCode.value != "" && cvvValidate(cvCode)) {
                payment.disabled = false;
            } else {
                payment.disabled = true;
            }
        });
    });
    
    [ cardNumber, expityMonth, expityYear, cvCode ].forEach(function(element) {
        element.addEventListener('click', function (event) {
            
            if ( validate_creditcardnumber(cardNumber.value) && cardNumber.value != "" && expityMonth.value != "" && yearValidate(expityYear) 
            && cvCode.value != "" && cvvValidate(cvCode)) {
                payment.disabled = false;
            } else {
                payment.disabled = true;
            }
        });
    });
    
    var cvvValidate = function(cvv){
        return (cvv.value.length == 3) && (Number(cvv.value) ? true : false);
    };
    
    var yearValidate = function(year){
        return (year.value.length == 4) && (Number(year.value) ? true : false);
    };
    
    function validate_creditcardnumber(inputNum) {
        var digit, digits, flag, sum, _i, _len;
        flag = true;
        sum = 0;
        digits = (inputNum + '').split('').reverse();
        for (_i = 0, _len = digits.length; _i < _len; _i++) {
            digit = digits[_i];
            digit = parseInt(digit, 10);
            if ((flag = !flag)) {
                digit *= 2;
            }
            if (digit > 9) {
                digit -= 9;
            }
                sum += digit;
        }
        return sum % 10 === 0;
    }
    
    
   $( document ).ready(function() {
      
       $("#payment").click(function(){
           var user = $("#user").val();
           //user = "5fbe9d9c9af7242974a78fbb";
           console.log(user);
           var cart = JSON.parse(localStorage.getItem("cart"));
         var total = 0;
          var bill = {};
          bill.dvd = [];
        for(var i = 0; i<cart.length; i++){
            jQuery.ajax({
                url: "/api/DVDs/id/"+cart[i].dvd_id,
                async:false,
                success: function (d) {
                     var dvdinfo = {
                        "price": d.info.price,
                        "quantity": cart[i].quantity,
                        "name": d.info.name,
                        "movies": []
                    };
                    
                for(var m of d.info.movies) {
                    if(typeof m == "undefined") continue;
                    dvdinfo.movies.push({"id": m._id, "title": m.title, "year": m.year});
                }
                total += dvdinfo.price*dvdinfo.quantity;
                bill.dvd.push(dvdinfo);
                if(i == cart.length-1) {
                    bill.total = total;
                    bill.user=user;
                   
                   jQuery.ajax({
                        url: "/api/bills",
                        contentType: 'application/json',
                        data:JSON.stringify(bill),
                        method: "post",
                        async:false,
                        success: function (data) {
                            localStorage.clear();
                            window.open("/successfulTransaction?id=" + data.info._id, "_self");
                        },
                        error: function(err){
                            console.log(err.info);
                        }
                    });
                }
                
                }
            });
        }
         
         
         
         
            
           
       });
   });