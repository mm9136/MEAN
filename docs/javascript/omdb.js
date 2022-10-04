document.getElementById("autocomplete").addEventListener("click", ()=>{
    var id = document.getElementById("imdbInput");
    if(id.value != undefined && id.value.trim() != "") var url = "https://www.omdbapi.com/?apikey=e9217139&type=movie&r=json"+"&i="+id.value;
    console.log(url);
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function() {
        var data = JSON.parse(this.responseText);
        if(data.response != "False") {
            document.getElementById("titleInput").value = data.Title;
            document.getElementById("yearInput").value = parseInt(data.Year);
            document.getElementById("genreInput").value = data.Genre[0];
            document.getElementById("descriptionInput").value = data.Plot;
        }
    });
    req.send(null);
});