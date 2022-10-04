var password = document.getElementById('password');
var confirm = document.getElementById('confirm');
var register = document.getElementById('register');
var email = document.getElementById('email');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');

confirm.addEventListener('keyup', function(event) {
    if (validateEmail(email.value) && firstname.value != "" && lastname.value != "" && password.value == confirm.value && validatePassword(password.value)) {
        register.disabled = false;
        document.getElementById("confirm").style.borderColor = "green";
    } else if (password.value == confirm.value){
        document.getElementById("confirm").style.borderColor = "green";
    } else if ((password.value != confirm.values) || (confirm.value== "")) {
        document.getElementById("confirm").style.borderColor = "red";
        register.disabled = true;
    }
    else {
        register.disabled = true;
    }
});
email.addEventListener('change', function(event) {
    if (!validateEmail(email.value)) {
        document.getElementById("email").style.borderColor = "red";
    } else
        document.getElementById("email").style.borderColor = "green";
});
firstname.addEventListener('change', function(event) {
    if (firstname.value == "") {
        document.getElementById("firstname").style.borderColor = "red";
    } else
        document.getElementById("firstname").style.borderColor = "green";
});
lastname.addEventListener('change', function(event) {
    if (lastname.value == "") {
        document.getElementById("lastname").style.borderColor = "red";
    } else
        document.getElementById("lastname").style.borderColor = "green";
});
password.addEventListener('change', function(event) {
    if (!validatePassword(password.value)) {
        document.getElementById("password").style.borderColor = "red";
    } else
        document.getElementById("password").style.borderColor = "green";
});
function validatePassword(pass) {
    if (/^[\w@#$%*()!?]{3,20}$/.test(pass)) return true; //Accepts alphanumerical symbols, underscore, @, #, $, *, (, ), ?, !.
    else return false;
}

function validateEmail(email) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
}