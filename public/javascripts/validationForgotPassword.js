var forgotPassword = document.getElementById('forgotPassword');
var email = document.getElementById('email');

email.addEventListener('change', function(event) {
    if (!validateEmail(email.value)) {
        document.getElementById("email").style.borderColor = "red";
        forgotPassword.disabled = true;
    } else
        document.getElementById("email").style.borderColor = "green";
         forgotPassword.disabled = false;
});
function validateEmail(email) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
}
