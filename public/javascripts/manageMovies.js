var METHOD = "POST";
var movieList = [];

// Had to use js so I can implement updatable list

document.getElementById("autocomplete").addEventListener("click", ()=>{
    var id = document.getElementById("id");
    var imdbid = document.getElementById("imdbInput");
    var title = document.getElementById("titleInput");
    var genre = document.getElementById("genreInput");
    var year = document.getElementById("yearInput");
    var desc = document.getElementById("descriptionInput");
    
    var url = "/api/movies/autocomplete?";
    
    var send = true;
    
    if(typeof imdbid.value != "undefined" && imdbid.value.trim() != "") url+="i="+imdbid.value;
    else if(typeof title.value != "undefined" && title.value.trim() != "" && typeof year.value != "undefined" && year.value.trim() != "") 
        url+="t="+title.value.replace(" ", "+")+"&y="+year.value;
    else if(typeof title.value != "undefined" && title.value.trim() != "") url+="t="+title.value.replace(" ", "+");
    else {
        var feedback = document.getElementById("movie_warning")
        send = false;
        if(feedback) {
            feedback.innerHTML = "Either IMDB ID or title must be valid for autocomplete!"
            feedback.style.display = "";
            setTimeout(()=>{feedback.style.display="none"}, 5000);
        }
    }
    
    if(send) {
        var addbtn = document.getElementById("add");
        var rmbtn = document.getElementById("remove");
        var form = document.getElementById("add_movie_form");
        if(addbtn) addbtn.disabled = true;
        if(rmbtn) rmbtn.disabled = true;
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", function() {
            var data = JSON.parse(req.responseText);
            METHOD = req.status==200?"POST":"PUT";
            if(req.status == 200 || req.status == 201) {
                id.value = data.info._id;
                imdbid.value = data.info.imdb_id;
                title.value = data.info.title;
                year.value = data.info.year;
                desc.value = data.info.description;
                var n = true;
                for(var option of genre.options)
                    if(option.value == data.info.genre) {
                        n=false;
                        break;
                    }
                if(n) {
                    var option = document.createElement("option");
                    option.text = data.info.genre;
                    option.value = data.info.genre;
                    genre.appendChild(option);
                }
                genre.value = data.info.genre;
            } else {
                var feedback = document.getElementById("movie_danger");
                if(feedback) {
                    if(req.status == 404) if(feedback) feedback.innerHTML = "Autocomplete unsuccessful due to user error (code: "+req.status+" msg: "+data.info+")";
                    else feedback.innerHTML = "Autocomplete unsuccessful due to server-side error (code: "+req.status+" msg: "+data.info+")";
                    feedback.style.display = "";
                    feedback.style.display = "";
                    setTimeout(()=>{feedback.style.display="none"}, 5000);
                }
            }
            if(addbtn) addbtn.disabled = false;
            if(rmbtn) rmbtn.disabled = false;
        });
        req.send(null);
    }
});

document.getElementById("add").addEventListener("click", ()=>{
    var id = document.getElementById("id");
    var imdbid = document.getElementById("imdbInput");
    var title = document.getElementById("titleInput");
    var genre = document.getElementById("genreInput");
    var year = document.getElementById("yearInput");
    var desc = document.getElementById("descriptionInput");
    
    if(typeof imdbid.value != "undefined" && imdbid.value.trim() != ""
        && typeof title.value != "undefined" && title.value.trim() != ""
        && typeof year.value != "undefined" && year.value.trim() != ""
        && typeof genre.value != "undefined" && genre.value.trim() != ""
        && typeof desc.value != "undefined" && desc.value.trim() != "") {
            var addbtn = document.getElementById("add");
            var rmbtn = document.getElementById("remove");
            addbtn.disabled = true;
            rmbtn.disabled = true;
            
            var movie = {
                "imdb": imdbid.value,
                "title": title.value,
                "genre": genre.value,
                "year": year.value,
                "description": desc.value
            }
            
            var url = "/api/movies";
            
            if(typeof id.value == "undefined" || id.value.trim() == "") METHOD = "POST";
            
            if(METHOD == "PUT") url += "/id/"+id.value;
            
            var req = new XMLHttpRequest();
            req.open(METHOD, url, true);
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.addEventListener("load", function() {
                var data = JSON.parse(req.responseText);
                //console.log(data);
                if(req.status == 201) {
                    addMovieToList(data.info._id);
                    var feedback = document.getElementById("movie_success");
                    feedback.innerHTML = "Movie was successfully added!";
                    feedback.style.display = "";
                    setTimeout(()=>{feedback.style.display="none"}, 5000);
                } else if(req.status == 200) {
                    addMovieToList(data.info._id);
                    var feedback = document.getElementById("movie_success");
                    feedback.innerHTML = "Movie was successfully modified!";
                    feedback.style.display = "";
                    setTimeout(()=>{feedback.style.display="none"}, 5000);
                } else {
                    var feedback = document.getElementById("movie_danger");
                    if(req.status == 400) feedback.innerHTML = "Adding movie unsuccessful due to user error (code: "+req.status+" msg: "+data.info+")";
                    else feedback.innerHTML = "Adding movie unsuccessful due to server-side error (code: "+req.status+" msg: "+data.info+")";
                    feedback.style.display = "";
                    setTimeout(()=>{feedback.style.display="none"}, 5000);
                }
                addbtn.disabled = false;
                rmbtn.disabled = false;
            });
            req.send(JSON.stringify(movie));
    } else {
        var feedback = document.getElementById("movie_warning");
        feedback.innerHTML = "No field can be left empty!";
        feedback.style.display = "";
        setTimeout(()=>{feedback.style.display="none"}, 5000);
    }
});

document.getElementById("remove").addEventListener("click", ()=>{
    var id = document.getElementById("id");
    if(typeof id != "undefined") 
        removeMovieFromList(id.value);
    else {
        var feedback = document.getElementById("movie_warning");
        feedback.innerHTML = "Use autocomplete to retrieve id before removing!";
        feedback.style.display = "";
        setTimeout(()=>{feedback.style.display="none"}, 5000);
    }
});

function autocompleteDVD() {
    const select = document.getElementById("existing_dvd");
    const addBtn = document.getElementById("add_dvd");
    const rmBtn = document.getElementById("remove_dvd");
    const mdBtn = document.getElementById("modify_dvd_btn");
    const title = document.getElementById("dvd_title");
    const description = document.getElementById("dvd_description");
    const quantity = document.getElementById("dvd_quantity");
    const price = document.getElementById("dvd_price");
    const movies = document.getElementById("movieList");
    document.getElementById("movieList").innerHTML = "";
    movieList = [];
    
    if(select.value == "new") {
        addBtn.disabled = false;
        rmBtn.disabled = true;
        mdBtn.disabled = true;
        title.value = "";
        description.value = "";
        quantity.value = "";
        price.value = "";
        return;
    }
    addBtn.disabled = true;
    mdBtn.disabled = false;
    rmBtn.disabled = false;
    var req = new XMLHttpRequest();
    req.open("GET", "/api/DVDs/id/"+select.value, true);
    req.addEventListener("load", function() {
        var data = JSON.parse(req.responseText);
        //console.log(data);
        if(req.status == 200) {
            title.value = data.info.name;
            description.value = data.info.description;
            quantity.value = data.info.quantity;
            price.value = data.info.price;
            console.log(data.info.movies);
            for(var m of data.info.movies) {
                addMovieToList(m._id);
            }
        }
    });
    req.send(null);
}

function addMovieToList(movie) {
    var movie_list = document.getElementById("movieList");
    var addToDVD = true;
    for(var mov of movie_list.children)
        if(mov.value == movie) addToDVD = false;
    var m = document.createElement("input");
    m.type = "hidden";
    m.name = "movies";
    m.value = movie;
    if(addToDVD) {
        movie_list.appendChild(m);
        movieList.push(movie);
    }
    console.log(movieList);
    
    document.getElementById("id").value = "";
    document.getElementById("imdbInput").value = "";
    document.getElementById("titleInput").value = "";
    document.getElementById("yearInput").value = "";
    document.getElementById("descriptionInput").value = "";
}

function removeMovieFromList(movie) {
    var movie_list = document.getElementById("movieList");
    var index = movieList.indexOf(movie);
    if(index >= 0) {
        movieList.splice(index, 1); 
        movie_list.children[index].remove();
        var feedback = document.getElementById("movie_success");
        feedback.innerHTML = "Movie was successfully removed from DVD!";
        feedback.style.display = "";
        setTimeout(()=>{feedback.style.display="none"}, 5000);
        return;
    }
    
    var feedback = document.getElementById("movie_warning");
    feedback.innerHTML = "Could not find movie on current DVD";
    feedback.style.display = "";
    setTimeout(()=>{feedback.style.display="none"}, 5000);
}