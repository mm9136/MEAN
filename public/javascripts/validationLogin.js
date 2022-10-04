var password = document.getElementById('password');
var login = document.getElementById('login');
var email = document.getElementById('email');

password.addEventListener('keyup', function(event) {
    if (validateEmail(email.value) &&  email.value!="" &&  password.value!="") {
        login.disabled = false;
    }
    else {
        login.disabled = true;
    }
});
email.addEventListener('change', function(event) {
    if (!validateEmail(email.value)) {
        document.getElementById("email").style.borderColor = "red";
    } else
        document.getElementById("email").style.borderColor = "green";
});


function validateEmail(email) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
}
