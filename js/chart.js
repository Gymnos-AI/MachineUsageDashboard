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


    console.log(formatDate());
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
})


/*
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
*/

function charts(machines, totalTimes){
    
    /* ChartJS
    * -------
    * Data and config for chartjs
    */
    'use strict';
    var data = {
        labels: machines,
        datasets: [{
        label: '# of Seconds',
        data: totalTimes,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        fill: false
        }]
    };

    var options = {
        scales: {
        yAxes: [{
            ticks: {
            beginAtZero: true,
            }
        }]
        },
        legend: {
        display: false
        },
        elements: {
        point: {
            radius: 0
        }
        }

    };


    
    // Get context with jQuery - using jQuery's .get() method.
    if ($("#barChart").length) {
        var barChartCanvas = $("#barChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: data,
        options: options
        });
    }

}