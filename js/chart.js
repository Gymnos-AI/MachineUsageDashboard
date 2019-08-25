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
        var machines = {};
        querySnapshot.forEach(function(doc) {
            doc = doc.data();
            name = doc.Name;
            times = doc.Times;
            machines[name] = times;
        });
        
        convertRawTimes(machines);
        console.table(machines);
        keys = Object.keys(machines);
        values = Object.keys(machines).map(function(key){
            return machines[key];
        });
        // console.log(keys);
        // console.log(values);
        chart.destroy();
        // charts(keys, values);
        
    })
}

function convertRawTimes(machines) {
    var hours = {}; 
    for (var i=0; i<24; i++) {
        hours[i] = 0;
    }
    // console.log(hours);
    for (value in machines) {
        result = machines[value];
    //    console.log(result);
        var diff = 0;
        for (var i=0; i<result.length; i++) {
            res = result[i].split(/#/);
            start = res[0];
            end = res[1];
            diff = (end - start) + diff;

            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var date = new Date(start*1000);
            // Hours part from the timestamp
            var startHour = date.getHours();

            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var date = new Date(end*1000);
            // Hours part from the timestamp
            var endHour = date.getHours();
        }
        hours[startHour] = diff;
        console.log(hours);
        console.log(value);
        machines[value] = hours;
        console.log(machines[value]);
        console.log(machines);
        console.log(start, end, diff);
    }
    return(machines);
}



function charts(keys, values){    
    /* ChartJS
    * -------
    * Data and config for chartjs
    */
    'use strict';

    var latP1 = {
        label:keys[0], //Object.keys(machines[0]),
        data: values[0],
        borderColor: [
        '#587ce4'
        ],
        borderWidth: 2,
        fill: false
    }

    var latP2 = {
        label: keys[1],
        data: values[1],
        borderColor: [
        '#ede190'
        ],
        borderWidth: 2,
        fill: false
    }

    var triceps = {
        label: keys[2],
        data: values[2],
        borderColor: [
        '#f44252'
        ],
        borderWidth: 2,
        fill: false
    }

    var data = {
        labels: ['00:00','01:00', '02:00', '03:00', '04:00', '05:00', 
        '06:00','07:00','08:00','09:00','10:00','11:00',
        '12:00','13:00','14:00','15:00','16:00','17:00','18:00','18:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
        datasets: [latP1, latP2, triceps]
    }

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
                labelString: "Time"
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
        data: data,
        options: options
        });
    }

    drawChart();


}