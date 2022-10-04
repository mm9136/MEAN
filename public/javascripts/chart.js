/*global google*/
// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values

var data;
function drawChart() {
    
data = new google.visualization.DataTable();
data.addColumn('string', 'DVD');
data.addColumn('number', 'Number sold');
    /*data = google.visualization.arrayToDataTable([
        ['Movie', 'Number sold'],
        ['Dorian Gray (2009)', 38],
        ['The Lord of The Rings Trilogy (2001-2004)', 11],
        ['Taxi Driver (1976)', 12],
        ['Kill Bill: Volume.1(2003)', 28],
        [' Alice in Wonderland (2010)', 11]
    ]);*/
    
    var req = new XMLHttpRequest();
        req.open("GET", "/api/bills", true);
        req.addEventListener("load", function() {
            var bills = JSON.parse(req.responseText).info;
            var movies_obj = [];
            var movies_data = []; // [['title', count]]
            if(bills.length > 0){
                for(var bill of bills){
                    for(var dvd of bill.dvd) {
                        var postoji = 0;
                        for(var m of movies_data){
                            if(m[0] == dvd.name){
                                postoji=1;
                                m[1] += dvd.quantity;
                            }
                        }
                        if(postoji == 0){
                            movies_obj.push(dvd);
                            movies_data.push([dvd.name, dvd.quantity]);
                        }
                        
                    }
                }
                
               data.addRows(movies_data);
               // Display the chart inside the <div> element with id="piechart"
               resize();
            }
           
        });
        req.send(null);
    
}

function resize() {
    if(data) {
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data);
    }
}

window.onresize=resize;