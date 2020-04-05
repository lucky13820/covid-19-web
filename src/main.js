import "./assets/css/main.css";
import $ from "jquery";
import Chart from 'chart.js';
import jQuery from "jquery";
import dt from 'datatables.net';

$(document).ready(function() {
  getAllData()
  getYestData()

  $('#breakdown').DataTable( {
    ajax: {
      url: 'https://corona.lmao.ninja/countries',
      dataSrc: '',
    },
    "columnDefs": [ {
      "targets" : 0 ,
      "data": "countryInfo.flag",
      "render" : function ( data, display, full) {
      return '<img height="75%" width="75%" src="'+ data +'"/>';
      }
    } ],
    columns: [
      {data: 'countryInfo.flag'},
      {data: 'country'},
      {data: 'cases'},
      {data: 'deaths'},
      {data: 'recovered'},
      {data: 'active'},
      {data: 'critical'},
      {data: 'todayCases'},
      {data: 'todayDeaths'},
      {data: 'casesPerOneMillion'},
      {data: 'deathsPerOneMillion'},
    ],
    "scrollX": true,
    "orderClasses": true,
    "order": [2, 'desc'],
    fixedHeader: {
      header: true,
      footer: false
    },
} );
});

var covidStatus = {};

function getAllData() {
  var request = new XMLHttpRequest()

  request.open('GET', 'https://corona.lmao.ninja/all', true)
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      covidStatus.totalCases = data.cases
      covidStatus.totalDeaths = data.deaths
      covidStatus.totalRecover = data.recovered
      covidStatus.totalActive = data.active
      covidStatus.updated = new Date(data.updated)
      document.getElementById('totalCases').textContent = covidStatus.totalCases
      document.getElementById('totalDeaths').textContent = covidStatus.totalDeaths
      document.getElementById('totalRecover').textContent = covidStatus.totalRecover
      document.getElementById('totalActive').textContent = covidStatus.totalActive
      document.getElementById('updated').textContent = covidStatus.updated
    } else {
      console.log('error')
    }
    getYestData(covidStatus);
  }
  request.send(covidStatus)
}

function getYestData(covidStatus) {
  var request = new XMLHttpRequest()
  request.open('GET', 'https://corona.lmao.ninja/v2/historical/all', true)
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    covidStatus.casesLabel = []
    covidStatus.casesData = []
    covidStatus.deathLabel = []
    covidStatus.deathData = []
    covidStatus.recoverLabel = []
    covidStatus.recoverData = []

    Object.keys(data.cases).forEach(function (key) {
      var value = data.cases[key];
      covidStatus.casesData.push(value)
      return(covidStatus.casesData)
    });

    covidStatus.casesLabel = [];
    for (var k in data.cases) covidStatus.casesLabel.push(k);

    Object.keys(data.deaths).forEach(function (key) {
      var value = data.deaths[key];
      covidStatus.deathData.push(value)
      return(covidStatus.deathData)
    });

    covidStatus.deathLabel = [];
    for (var k in data.cases) covidStatus.deathLabel.push(k);

    Object.keys(data.recovered).forEach(function (key) {
      var value = data.recovered[key];
      covidStatus.recoverData.push(value)
      return(covidStatus.recoverData)
    });

    covidStatus.recoverLabel = [];
    for (var k in data.cases) covidStatus.recoverLabel.push(k);
    
    casesNum = covidStatus.totalCases - data.cases[ Object.keys(data.cases).reverse().slice(1,2).pop() ]
    deathNum = covidStatus.totalDeaths - data.deaths[ Object.keys(data.deaths).reverse().slice(1,2).pop() ]
    recoverNum = covidStatus.totalRecover - data.recovered[ Object.keys(data.recovered).reverse().slice(1,2).pop() ]
    activeNum = casesNum - recoverNum
    casesPer = ((casesNum * 100) / data.cases[ Object.keys(data.cases).reverse().slice(1,2).pop() ] ).toFixed(1)
    deathPer = ((deathNum * 100) / data.deaths[ Object.keys(data.deaths).reverse().slice(1,2).pop() ] ).toFixed(1)
    recoverPer = ((recoverNum * 100) / data.recovered[ Object.keys(data.recovered).reverse().slice(1,2).pop() ] ).toFixed(1)
    activePer = ((activeNum * 100) / (data.cases[ Object.keys(data.cases).reverse().slice(2,3).pop() ] - data.recovered[ Object.keys(data.recovered).reverse().slice(2,3).pop() ]) ).toFixed(1)


    if (request.status >= 200 && request.status < 400) {
      document.getElementById('casesNum').textContent = casesNum
      document.getElementById('deathNum').textContent = deathNum
      document.getElementById('recoverNum').textContent = recoverNum
      document.getElementById('activeNum').textContent = activeNum
      document.getElementById('activeNum').textContent = activeNum
      document.getElementById('casesPer').textContent = casesPer + "%"
      document.getElementById('deathPer').textContent = deathPer + "%"
      document.getElementById('recoverPer').textContent = recoverPer + "%"
      document.getElementById('activePer').textContent = activePer + "%"
    } else {
      console.log('error')
    }
    createChart(covidStatus)
  }
  request.send(covidStatus)
}

function createChart(covidStatus){
  var ctx = document.getElementById('caseChart').getContext('2d');
  var dtx = document.getElementById('deathChart').getContext('2d');
  var rtx = document.getElementById('recoverChart').getContext('2d');
  let casesData = covidStatus.casesData.toString().split(',').map(Number);
  let casesLabel = covidStatus.casesLabel;
  let deathData = covidStatus.deathData.toString().split(',').map(Number);
  let deathLabel = covidStatus.deathLabel;
  let recoverData = covidStatus.recoverData.toString().split(',').map(Number);
  let recoverLabel = covidStatus.recoverLabel;
  var caseChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: casesLabel,
          datasets: [{
              label: 'Total Cases',
              data: casesData,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 2,
              pointStyle: "circle",
              pointRadius: 3,
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
  var deathChart = new Chart(dtx, {
    type: 'line',
    data: {
        labels: deathLabel,
        datasets: [{
            label: 'Total Deaths',
            data: deathData,
            backgroundColor: [
                'rgba(120, 120, 132, 0.2)',
            ],
            borderColor: [
                'rgba(120, 120, 132, 1)',
            ],
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 3,

        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
var recoverChart = new Chart(rtx, {
  type: 'line',
  data: {
      labels: recoverLabel,
      datasets: [{
          label: 'Total Recovered',
          data: recoverData,
          backgroundColor: [
              'rgba(23, 39, 132, 0.2)',
          ],
          borderColor: [
              'rgba(23, 39, 132, 1)',
          ],
          borderWidth: 2,
          pointStyle: "circle",
          pointRadius: 3,

      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
});
}


