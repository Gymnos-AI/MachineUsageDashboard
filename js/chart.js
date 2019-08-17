var barChartCanvas;
var barChart;
$(document).ready(function(){       
    let db;
    let config = {
        apiKey: "AIzaSyBE9mbRB6CrEraoJmFavU4xIZH23p6IsNg",
        authDomain: "tutorial-76162.firebaseapp.com",
        projectId: "tutorial-76162"
    };
    let app = firebase.initializeApp(config);
    db = firebase.firestore(app);

    //firebase.firestore.setLogLevel("debug");

    
    //console.log(formatDate());
    
    db.collection("Gyms").doc("DewdmGRDsqLyxChcJCKp").collection("Usage").where("Date", "==", formatDate())
    .onSnapshot(function(querySnapshot) {
        var machines = [];
        var totalTimes = [];
        querySnapshot.forEach(function(doc) {
            machines.push(doc.data().Name);
            totalTimes.push(doc.data().TotalTime);
        });
        charts(machines, totalTimes);
    })

    let from = null;
    let to = null;

    function stuff(){ 
        query_date(from, to, db);
    }


    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
        }, function(start, end, label, db) {
            from = start.format('YYYY/MM/DD');
            to = end.format('YYYY/MM/DD');
            stuff();

            //query_date(start.format('YYYY/MM/DD'), end.format('YYYY/MM/DD'), db);
        //console.log("A new date selection was made: " + start.format('YYYY/MM/DD') + ' to ' + end.format('YYYY/MM/DD'));
        });

    
})

// a function that grabs todays date and formats it in yyyy/mm/dd
function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}

function query_date(from, to, db){
    //removeData(charts)
    db.collection("Gyms").doc("DewdmGRDsqLyxChcJCKp").collection("Usage").where("Date", ">=", from).where("Date", "<=", to)
    .onSnapshot(function(querySnapshot) {
        var machines = [];
        var totalTimes = [];
        querySnapshot.forEach(function(doc) {
            machines.push(doc.data().Name);
            totalTimes.push(doc.data().TotalTime);
        });

        //let canvas = $('#canvas').get(0).getContext("2d");
        //console.log(canvas);
        //console.log(barChart);\
        barChart.destroy();
        //removeData(barChart);

        charts(machines, totalTimes);
    })

}



function charts(machines, totalTimes){
    
    /* ChartJS
    * -------
    * Data and config for chartjs
    */
    'use strict';
    var data = {
        labels: machines,
        datasets: [{
        label: "# of seconds",
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',

            'rgba(25, 99, 132, 0.2)',
            'rgba(5, 162, 235, 0.2)',
            'rgba(25, 206, 86, 0.2)',
            'rgba(7, 192, 192, 0.2)',
            'rgba(15, 102, 255, 0.2)',
            'rgba(25, 159, 64, 0.2)',

            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',

            'rgba(25, 99, 132, 0.2)',
            'rgba(5, 162, 235, 0.2)',
            'rgba(25, 206, 86, 0.2)',
            'rgba(7, 192, 192, 0.2)',
            'rgba(15, 102, 255, 0.2)',
            'rgba(25, 159, 64, 0.2)',

            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',

            'rgba(25, 99, 132, 0.2)',
            'rgba(5, 162, 235, 0.2)',
            'rgba(25, 206, 86, 0.2)',
            'rgba(7, 192, 192, 0.2)',
            'rgba(15, 102, 255, 0.2)',
            'rgba(25, 159, 64, 0.2)',
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',

            'rgba(25, 99, 132, 1)',
            'rgba(5, 162, 235, 1)',
            'rgba(25, 206, 86, 1)',
            'rgba(7, 192, 192, 1)',
            'rgba(15, 102, 255, 1)',
            'rgba(25, 159, 64, 1)',

            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',

            'rgba(25, 99, 132, 1)',
            'rgba(5, 162, 235, 1)',
            'rgba(25, 206, 86, 1)',
            'rgba(7, 192, 192, 1)',
            'rgba(15, 102, 255, 1)',
            'rgba(25, 159, 64, 1)',

            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',

            'rgba(25, 99, 132, 1)',
            'rgba(5, 162, 235, 1)',
            'rgba(25, 206, 86, 1)',
            'rgba(7, 192, 192, 1)',
            'rgba(15, 102, 255, 1)',
            'rgba(25, 159, 64, 1)',
        ],
        data: totalTimes,
        borderWidth: 1,
        fill: false
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: machines
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Total Usage Times Per Machine (in seconds)'
        },
        scales: {
        yAxes: [{
            ticks: {
            beginAtZero: true,
            },
            scaleLabel: {
                display: true,
                labelString: "# of Seconds"
            }
        }],
        xAxes: [{
            scaleLabel: {
                display: true,
                labelString: "Machines"
            }
        }], 
        },
        legend: {
        display: true,
        },
        elements: {
        point: {
            radius: 0
        }
        },

    };

    function drawChart() {
        // Get context with jQuery - using jQuery's .get() method.
        barChartCanvas = $("#canvas").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: data,
        options: options
        });

    }

    drawChart();


}