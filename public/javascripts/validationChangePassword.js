var password = document.getElementById('password');
var confirm = document.getElementById('confirm');
var changePassword = document.getElementById('changePassword');
var newPassword = document.getElementById('newPassword');


confirm.addEventListener('keyup', function(event) {
    if (password.value!= "" && newPassword.value == confirm.value && validatePassword(newPassword.value)) {
        changePassword.disabled = false;
        document.getElementById("confirm").style.borderColor = "green";
    } else if (newPassword.value == confirm.value){
        document.getElementById("confirm").style.borderColor = "green";
    } else if ((newPassword.value != confirm.values) || (confirm.value== "")) {
        document.getElementById("confirm").style.borderColor = "red";
        changePassword.disabled = true;
    }
    else {
        changePassword.disabled = true;
    }
});
password.addEventListener('change', function(event) {
    if (!validatePassword(password.value)) {
        document.getElementById("password").style.borderColor = "red";
    } else
        document.getElementById("password").style.borderColor = "green";
});
newPassword.addEventListener('change', function(event) {
    if (!validatePassword(newPassword.value)) {
        document.getElementById("newPassword").style.borderColor = "red";
    } else
        document.getElementById("newPassword").style.borderColor = "green";
});
function validatePassword(pass) {
    if (/^[\w@#$%*()!?]{3,20}$/.test(pass)) return true; //Accepts alphanumerical symbols, underscore, @, #, $, *, (, ), ?, !.
    else return false;
}
