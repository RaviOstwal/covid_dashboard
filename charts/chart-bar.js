// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var myBarChart =  null;

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Bar Chart Example
function loadBarChart() {

  if (myBarChart) {
    // Already renedered, destroy the existing
    myBarChart.destroy();
  }

  countriesData.sort(function(rowA, rowB) {
    var valueA = rowA[sortColumn];
    var valueB = rowB[sortColumn];

    valueA = typeof(valueA) == "string" ? valueA.toUpperCase() : valueA;
    valueB = typeof(valueB) == "string" ? valueB.toUpperCase() : valueB;

    return (valueA < valueB) ? (isAscSort ? -1 : 1) : (valueA > valueB) ? (isAscSort ? 1 : -1) : 0;
  });

  let dataColumn = sortColumn === "Country" ? "TotalConfirmed" : sortColumn;
  let axisMin = Number.MAX_SAFE_INTEGER;
  let axisMax = 0;

  let labels = [];
  let data = [];

  let topReords = countriesData.slice(0, 20);

  let selectionColMeta = columns.filter((val) => val.data === dataColumn)[0];

  $(topReords).each((index, element) => {
    labels.push(element["Country"]);

    let dataValue = element[dataColumn];
    data.push(dataValue);

    axisMin = Math.min(axisMin, dataValue);
    axisMax = Math.max(axisMax, dataValue);

  });

  var ctx = document.getElementById("myBarChart");
  myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: dataColumn,
        backgroundColor: selectionColMeta.color,
        hoverBackgroundColor: selectionColMeta.hoverColor,
        borderColor: "#4e73df",
        minBarLength: 2,
        maxBarThickness: 25,
        data: data,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 20
          }
        }],
        yAxes: [{
          ticks: {
            min: axisMin,
            max: axisMax,
            maxTicksLimit: 10,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
              return number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#fff',
        titleFontSize: 14,
        backgroundColor: "rgba(50,50,50,0.7)",
        bodyFontColor: "#fff",
        borderColor: '#333',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            return selectionColMeta.label + ': ' + number_format(tooltipItem.yLabel);
          }
        }
      },
    }
  });

}