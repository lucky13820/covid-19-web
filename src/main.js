import "./assets/css/main.css";
import $ from "jquery";
import Chart from 'chart.js';
import jQuery from "jquery";
import dt from 'datatables.net';
import 'datatables.net-fixedcolumns-dt';

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
      return '<img src="'+ data +'"/>';
      },
    } ],
    columns: [
      {data: 'countryInfo.flag'},
      {data: 'country'},
      {data: 'cases',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'deaths',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'recovered',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'active',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'critical',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'todayCases',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'todayDeaths',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'casesPerOneMillion',render: $.fn.dataTable.render.number( ',', '.')},
      {data: 'deathsPerOneMillion',render: $.fn.dataTable.render.number( ',', '.')},
    ],
    "scrollX": true,
    "scrollY": true,
    "orderClasses": true,
    "order": [2, 'desc'],
    language: {
      searchPlaceholder: "Search for countries",
      thousands: ","
    },
    fixedColumns: true,
    fixedColumns: {
      leftColumns: 2
    },
  } );

  var l = $('#breakdown_filter label');
  l.html(l.find('input'));

  var themeSwitch = document.getElementById("themeSwitch");
  initTheme();
  themeSwitch.addEventListener("change", resetTheme, function() {});

  function activateDarkMode() {
    document.documentElement.classList.add('mode-dark');
    localStorage.setItem("mode", "dark");
    $("#themeSwitch").prop("checked", true);
  }

  function activateLightMode() {
    document.documentElement.classList.remove('mode-dark');
    localStorage.setItem("mode", "light");
    $("#themeSwitch").prop("checked", false);
  }

  function initTheme() {
    var isDarkMode = '';
    var isLightMode = '';
    const isNotSpecified = window.matchMedia(
      "(prefers-color-scheme: no-preference)"
    ).matches;
    const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addListener(e => e.matches && activateDarkMode());
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addListener(e => e.matches && activateLightMode());

      if (window.matchMedia("(prefers-color-scheme: dark)")
      .matches) {
        isDarkMode = true
      }
      if (window.matchMedia("(prefers-color-scheme: light)")
      .matches) {
        isDarkMode = false
      }
    if (localStorage.getItem("mode") === "dark") {
      isDarkMode = true
    };

    if (localStorage.getItem("mode") === "light") {
      isDarkMode = false
    };

    if (isDarkMode == true) activateDarkMode();
    if (isDarkMode == false) activateLightMode();
  }

  function resetTheme(e) {
    if (e.target.checked) {
      // dark theme has been selected
      activateDarkMode();
    } else {
      activateLightMode();
    }
  }


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
      document.getElementById('totalCases').textContent = covidStatus.totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      document.getElementById('totalDeaths').textContent = covidStatus.totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      document.getElementById('totalRecover').textContent = covidStatus.totalRecover.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      document.getElementById('totalActive').textContent = covidStatus.totalActive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      document.getElementById('updated').textContent = "Updated at " + covidStatus.updated
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

    if (request.status >= 200 && request.status < 400) {

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
      
      casesNum = covidStatus.totalCases - data.cases[ Object.keys(data.cases).pop() ]
      deathNum = covidStatus.totalDeaths - data.deaths[ Object.keys(data.deaths).pop() ]
      recoverNum = covidStatus.totalRecover - data.recovered[ Object.keys(data.recovered).pop() ]
      activeNum = casesNum - recoverNum
      casesPer = ((casesNum * 100) / data.cases[ Object.keys(data.cases).pop() ] ).toFixed(1)
      deathPer = ((deathNum * 100) / data.deaths[ Object.keys(data.deaths).pop() ] ).toFixed(1)
      recoverPer = ((recoverNum * 100) / data.recovered[ Object.keys(data.recovered).pop() ] ).toFixed(1)
      activePer = ((activeNum * 100) / (data.cases[ Object.keys(data.cases).reverse().slice(1,2).pop() ] - data.recovered[ Object.keys(data.recovered).reverse().slice(1,2).pop() ]) ).toFixed(1)

      if (casesNum > 0){
        document.getElementById('casesNum').textContent = "from yesterday (+" + casesNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else if (casesNum == 0){
        document.getElementById('casesNum').textContent = "from yesterday (" + casesNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else{
        document.getElementById('casesNum').textContent = "from yesterday (" + casesNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }

      if (deathNum > 0){
        document.getElementById('deathNum').textContent = "from yesterday (+" + deathNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else if (deathNum == 0){
        document.getElementById('deathNum').textContent = "from yesterday (" + deathNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else{
        document.getElementById('deathNum').textContent = "from yesterday (" + deathNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }

      if (recoverNum > 0){
        document.getElementById('recoverNum').textContent = "from yesterday (+" + recoverNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else if (recoverNum == 0){
        document.getElementById('recoverNum').textContent = "from yesterday (" + recoverNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else{
        document.getElementById('recoverNum').textContent = "from yesterday (" + recoverNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }

      if (activeNum > 0){
        document.getElementById('activeNum').textContent = "from yesterday (+" + activeNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else if (activeNum == 0){
        document.getElementById('activeNum').textContent = "from yesterday (" + activeNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }else{
        document.getElementById('activeNum').textContent = "from yesterday (" + activeNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")"
      }

      if (casesPer > 0){
        document.getElementById('casesPer').textContent = casesPer + "% increase"
        document.getElementById("casesPer").classList.add("increase");
      }else if (casesPer == 0){
        document.getElementById('casesPer').textContent = casesPer + "% increase"
        document.getElementById("casesPer").classList.add("same");
      }else{
        casesPer = casesPer * -1
        document.getElementById('casesPer').textContent = casesPer + "% decrease"
        document.getElementById("casesPer").classList.add("decrease");
      }

      if (deathPer > 0){
        document.getElementById('deathPer').textContent = deathPer + "% increase"
        document.getElementById("deathPer").classList.add("increase");
      }else if (deathPer == 0){
        document.getElementById('deathPer').textContent = deathPer + "% increase"
        document.getElementById("deathPer").classList.add("same");
      }else{
        deathPer = deathPer * -1
        document.getElementById('deathPer').textContent = deathPer + "% decrease"
        document.getElementById("deathPer").classList.add("decrease");
      }

      if (recoverPer > 0){
        document.getElementById('recoverPer').textContent = recoverPer + "% increase"
        document.getElementById("recoverPer").classList.add("increaseGreen");
      }else if (recoverPer == 0){
        document.getElementById('recoverPer').textContent = recoverPer + "% increase"
        document.getElementById("recoverPer").classList.add("same");
      }else{
        recoverPer = recoverPer * -1
        document.getElementById('recoverPer').textContent = recoverPer + "% decrease"
        document.getElementById("recoverPer").classList.add("decrease");
      }

      if (activePer > 0){
        document.getElementById('activePer').textContent = activePer + "% increase"
        document.getElementById("activePer").classList.add("increase");
      }else if (activePer == 0){
        document.getElementById('activePer').textContent = activePer + "% increase"
        document.getElementById("activePer").classList.add("same");
      }else{
        activePer = activePer * -1
        document.getElementById('activePer').textContent = activePer + "% decrease"
        document.getElementById("activePer").classList.add("decrease");
      }
    
      
      
      
      
     
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
              label: '',
              data: casesData,
              backgroundColor: [
                  'rgba(237, 137, 54, 0.16)',
              ],
              borderColor: [
                  'rgba(237, 137, 54, 1)',
              ],
              borderWidth: 3,
              pointStyle: "circle",
              pointRadius: 4,
              pointBackgroundColor: [
                'rgba(237, 137, 54, 0.16)',
              ],
              pointBorderColor:[
                'rgba(255, 255, 255, 1)',
              ],
              pointBorderWidth: 1,
              borderJoinStyle: 'round',
              fill: 'origin'
          }]
      },
      options: {
          scales: {
              xAxes: [{
                gridLines: {
                  drawBorder: false,
                  lineWidth: 0,
                },
                type: 'time',
                time: {
                  displayFormats: {
                    day: 'D MMM'
                  }
                } 
              }],
              yAxes: [{
                gridLines: {
                  drawBorder: false
                },
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                      if (value >= 0 && value < 1000) return value;
                      if (value >= 1000 && value < 1000000) return (value / 1000) + "k";
                      if (value >= 1000000 && value < 1000000000) return (value / 1000000) + "m";
                      return value;
                  }
                }
              }]
          },
          legend: {
            display: false,
          },
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
            borderWidth: 3,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: [
              'rgba(237, 137, 54, 0.16)',
            ],
            pointBorderColor:[
              'rgba(255, 255, 255, 1)',
            ],
            pointBorderWidth: 1,
            borderJoinStyle: 'round',
            fill: 'origin'

        }]
    },
    options: {
      scales: {
          xAxes: [{
            gridLines: {
              drawBorder: false,
              lineWidth: 0,
            },
            type: 'time',
                time: {
                  displayFormats: {
                    day: 'D MMM'
                  }
                }
          }],
          yAxes: [{
            gridLines: {
              drawBorder: false
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                  if (value >= 0 && value < 1000) return value;
                  if (value >= 1000 && value < 1000000) return (value / 1000) + "k";
                  if (value >= 1000000 && value < 1000000000) return (value / 1000000) + "m";
                  return value;
              }
            }
          }]
      },
      legend: {
        display: false,
      },
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
              'rgba(56, 161, 105, 0.2)',
          ],
          borderColor: [
              'rgba(56, 161, 105, 1)',
          ],
          borderWidth: 3,
          pointStyle: "circle",
          pointRadius: 4,
          pointBackgroundColor: [
            'rgba(556, 161, 105, 0.16)',
          ],
          pointBorderColor:[
            'rgba(56, 161, 105, 1)',
          ],
          pointBorderWidth: 1,
          borderJoinStyle: 'round',
          fill: 'origin'
      }]
  },
  options: {
    scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            lineWidth: 0,
          },
          type: 'time',
                time: {
                  displayFormats: {
                    day: 'D MMM'
                  }
                },
        }],
        yAxes: [{
          gridLines: {
            drawBorder: false
          },
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
                if (value >= 0 && value < 1000) return value;
                if (value >= 1000 && value < 1000000) return (value / 1000) + "k";
                if (value >= 1000000 && value < 1000000000) return (value / 1000000) + "m";
                return value;
            }
          }
        }]
    },
    legend: {
      display: false,
    },
}
});
}


