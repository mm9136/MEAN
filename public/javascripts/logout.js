$( document ).ready(function() {
   
  $("#logout").click(function(){
       localStorage.clear();
       window.open('/logout', '_self');
  });
});