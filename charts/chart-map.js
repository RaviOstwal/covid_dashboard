// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zdHdhbCIsImEiOiJja2NpcDMzbjQxZGs4MnNtMm9kbXBiZHRlIn0.c_8YITqc5TGITNRDm7bk2g';

var chartInstance = null;
var echartslayer = null;

const map = new mapboxgl.Map({
    container: 'myMapChart',
    style: $("#theme_switch").attr("val") === 'dark' ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [60,-5], // starting position [lng, lat]
    zoom: 1 // starting zoom
});

function convertData(countries, dataColumn) {
    let res = [];
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;

    $(countries).each((index, country) => {
        res.push({
            name: country["Country"],
            value: [
                country["Lon"],
                country["Lat"],
                country[dataColumn],
                country["TotalConfirmed"],
                country["TotalRecovered"],
                country["TotalDeaths"]
            ]
        });

        min = Math.min(min, country[dataColumn]);
        max = Math.max(max, country[dataColumn]);
    });

    return { data: res, min: min, max: max };
};

function onMapLoad() {

    if (chartInstance) {
        // Already created
        echartslayer.remove();
    }

    let dataColumn = sortColumn === "Country" ? "TotalConfirmed" : sortColumn;
    let evaluatedData = convertData(countriesData, dataColumn);
    let selectionColMeta = columns.filter((val) => val.data === dataColumn)[0];

    let sizeFactor = ((evaluatedData.max - evaluatedData.min) / (30 - 2));

    let option = {
       
        title: {
            subtext: 'Data from https://api.covid19api.com',
            left: 'center',
            textStyle: {
                color: '#000'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            y: 'bottom',
            x: 'right',
            data: ['Covid 19 Worldwide'],
            textStyle: {
                color: '#000'
            }
        },
        GLMap: {
        },
        series: [
            {
                name: 'All Countris',
                type: 'scatter',
                coordinateSystem: 'GLMap',
                data: evaluatedData.data,
                symbolSize: function (val) {
                    return 5 + (val[2] / sizeFactor);
                },  
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false,
                    },
                    emphasis: {
                        show: true,
                    }
                },
                itemStyle: {
                    normal: {
                        color: selectionColMeta.color
                    }
                },
                tooltip: {
                    formatter: (params) => {
                        var datasetLabel = params.data.name + '<br\>';
                        datasetLabel = datasetLabel + "Confirmed" + ': ' + params.data.value[3] + '<br\>';
                        datasetLabel = datasetLabel + "Recovered" + ': ' + params.data.value[4] + '<br\>';
                        datasetLabel = datasetLabel + "Deaths" + ': ' + params.data.value[5];
                        return datasetLabel;
                    }
                }
            },
            {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'GLMap',
                data: isAscSort ? evaluatedData.data.slice(Math.max(evaluatedData.data.length - 5, 0)) : evaluatedData.data.slice(0, 5),
                symbolSize: function (val) {
                    return 5 + (val[2] / sizeFactor);
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: selectionColMeta.color,
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                tooltip: {
                    formatter: (params) => {
                        var datasetLabel = params.data.name + '<br\>';
                        datasetLabel = datasetLabel + "Confirmed" + ': ' + params.data.value[3] + '<br\>';
                        datasetLabel = datasetLabel + "Recovered" + ': ' + params.data.value[4] + '<br\>';
                        datasetLabel = datasetLabel + "Deaths" + ': ' + params.data.value[5];
                        return datasetLabel;
                    }
                },
                zlevel: 1
            }
        ]
    };

    echartslayer = new EchartsLayer(map);

    chartInstance = echartslayer.chart;
    chartInstance.setOption(option);
    
}

function loadMapChart() {

    // option2.GLMap.map=map;
    map.on('load', onMapLoad);

}