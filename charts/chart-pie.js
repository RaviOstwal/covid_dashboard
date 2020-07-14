// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var myPieChart = null;

// Pie Chart Example
function loadPieChart() {

  if (myPieChart) {
    // Already rendered
    return;
  }

  var ctx = document.getElementById("myPieChart");
  myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Confirmed", "Recovered", "Deaths"],
      datasets: [{
        data: [global.NewConfirmed, global.NewRecovered, global.NewDeaths],
        backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b'],
        hoverBackgroundColor: ['#3f5db3', '#159e6d', '#ca4033'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });

}