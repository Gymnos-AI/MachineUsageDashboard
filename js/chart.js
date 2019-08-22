var chartCanvas;
var chart;
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
    db.collection("Gyms").doc("DewdmGRDsqLyxChcJCKp").collection("Usage").where("Date", ">=", from).where("Date", "<=", to)
    .onSnapshot(function(querySnapshot) {
        var machines = [];
        var totalTimes = [];
        var times = [];
        querySnapshot.forEach(function(doc) {
            machines.push(doc.data().Name);
            totalTimes.push(doc.data().TotalTime);
            times.push(doc.data().Times);
        });
        console.log(times);
        
        // a dictionary of machine and it's total time; "machineTime"
        var machineTime = {};
        machines.forEach((key, i) => machineTime[key] = totalTimes[i]);
        console.table(machineTime);

        for (var i=0; i < times.length; i++) {
            for (var j=0; j < times[i].length; j++) {
                var result = times[i][j];
                res = result.split(/#/);
                var start = res[0];
                var end = res[1];
                
                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                var date = new Date(start*1000);
                // Hours part from the timestamp
                var hours = date.getHours();
                // Minutes part from the timestamp
                var minutes = "0" + date.getMinutes();
                // Seconds part from the timestamp
                var seconds = "0" + date.getSeconds();
                // Will display time in 10:30:23 format
                var startTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                var date = new Date(end*1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var endTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                console.log(startTime + " - " + endTime);

            }   
        }
        
        chart.destroy();
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
        ],
        data: totalTimes,
        borderWidth: 1,
        fill: false
        }],
    };

    var multiLineData = {
        labels: machines,
        datasets: [{
            label: machines[0],
            data: totalTimes,
            borderColor: [
            '#587ce4'
            ],
            borderWidth: 2,
            fill: false
        },
        {
            label: machines[1],
            data: totalTimes,
            borderColor: [
            '#ede190'
            ],
            borderWidth: 2,
            fill: false
        },
        {
            label: machines[2],
            data: totalTimes,
            borderColor: [
            '#f44252'
            ],
            borderWidth: 2,
            fill: false
        }
        ]
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
        chartCanvas = $("#canvas").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        chart = new Chart(chartCanvas, {
        type: 'line',
        data: multiLineData,
        options: options
        });

    }

    drawChart();


}