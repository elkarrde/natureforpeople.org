$(function () {
    var ctx1 = $('#chart-area-1');
    var ctx2 = $('#chart-area-2');
    var ctx3 = $('#chart-area-3');
    var options = {
        animation:{
            animateScale:true
        },
        scaleShowLabels : false, // to hide vertical lables,
        responsive: true
    }
    var dataDoughnut = {
        labels: [
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };
    var dataLine = {
        labels: ["2009", "2010", "2011", "2012", "2013", "2014", "2015"],
        datasets: [
            {
                label: "Progress",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [80, 90, 110, 115, 119, 125, 131],
            }
        ]
    };
    var dataBar = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Emissions",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [65, 59, 57, 57, 56, 55, 40],
            }
        ]
    };
    var myDoughnutChart1 = new Chart(ctx1, {
        type: 'doughnut',
        data: dataDoughnut,
        options: options
    });
    var myDoughnutChart2 = new Chart(ctx2, {
        type: 'line',
        data: dataLine,
        options: options
    });
    var myDoughnutChart3 = new Chart(ctx3, {
        type: 'bar',
        data: dataBar,
        options: options
    });
});