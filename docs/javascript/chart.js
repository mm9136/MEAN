/*global google*/
// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
var data;
function drawChart() {
        data = google.visualization.arrayToDataTable([
        ['Movie', 'Number sold'],
        ['Dorian Gray (2009)', 38],
        ['The Lord of The Rings Trilogy (2001-2004)', 11],
        ['Taxi Driver (1976)', 12],
        ['Kill Bill: Volume.1(2003)', 28],
        [' Alice in Wonderland (2010)', 11]
        
]);

  // Display the chart inside the <div> element with id="piechart"
  resize();
}

function resize() {
    if(data) {
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data);
    }
}

window.onresize=resize;