import './assets/css/main.css'
import $ from 'jquery'
import Chart from 'chart.js'
import 'datatables.net'
import 'datatables.net-fixedcolumns-dt'

$(document).ready(function () {
  getAllData()

  // Initiate breakdown table
  $('#breakdown').DataTable({
    ajax: {
      url: 'https://disease.sh/v2/countries',
      dataSrc: ''
    },
    columnDefs: [{
      targets: 0,
      data: 'countryInfo.flag',
      render: function (data, display, full) {
        return '<img src="' + data + '"/>'
      }
    }],
    columns: [
      { data: 'countryInfo.flag' },
      { data: 'country' },
      { data: 'cases', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'deaths', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'recovered', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'active', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'critical', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'tests', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'todayCases', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'todayDeaths', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'casesPerOneMillion', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'deathsPerOneMillion', render: $.fn.dataTable.render.number(',', '.') },
      { data: 'testsPerOneMillion', render: $.fn.dataTable.render.number(',', '.') }
    ],
    scrollX: true,
    scrollY: true,
    orderClasses: true,
    order: [2, 'desc'],
    language: {
      searchPlaceholder: 'Search for countries'
    },
    fixedColumns: true,
    fixedColumns: {
      leftColumns: 2
    }
  })
})

// Dark mode
var themeSwitch = document.getElementById('themeSwitch')
initTheme()
themeSwitch.addEventListener('change', resetTheme, function () {})

function activateDarkMode () {
  document.documentElement.classList.add('mode-dark')
  localStorage.setItem('mode', 'dark')
  themeSwitch.checked = true
}

function activateLightMode () {
  document.documentElement.classList.remove('mode-dark')
  localStorage.setItem('mode', 'light')
  themeSwitch.checked = false
}

function initTheme () {
  var isDarkMode = ''
  var isLightMode = ''
  const isNotSpecified = window.matchMedia(
    '(prefers-color-scheme: no-preference)'
  ).matches
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addListener(e => e.matches && activateDarkMode())
  window
    .matchMedia('(prefers-color-scheme: light)')
    .addListener(e => e.matches && activateLightMode())

  if (window.matchMedia('(prefers-color-scheme: dark)')
    .matches) {
    isDarkMode = true
  }
  if (window.matchMedia('(prefers-color-scheme: light)')
    .matches) {
    isDarkMode = false
  }
  if (localStorage.getItem('mode') === 'dark') {
    isDarkMode = true
  };

  if (localStorage.getItem('mode') === 'light') {
    isDarkMode = false
  };

  if (isDarkMode == true) activateDarkMode()
  if (isDarkMode == false) activateLightMode()
}

function resetTheme (e) {
  if (e.target.checked) {
    // dark theme has been selected
    activateDarkMode()
  } else {
    activateLightMode()
  }
}

// Get data for global status
var covidStatus = {}

function getAllData () {
  var request = new XMLHttpRequest()

  request.open('GET', 'https://disease.sh/v2/all', true)
  request.setRequestHeader('Access-Control-Allow-Origin', 'https://disease.sh')
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      covidStatus.totalCases = data.cases
      covidStatus.totalDeaths = data.deaths
      covidStatus.totalRecover = data.recovered
      covidStatus.totalActive = data.active
      covidStatus.updated = new Date(data.updated)
      document.getElementById('totalCases').textContent = covidStatus.totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      document.getElementById('totalDeaths').textContent = covidStatus.totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      document.getElementById('totalRecover').textContent = covidStatus.totalRecover.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      document.getElementById('totalActive').textContent = covidStatus.totalActive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      document.getElementById('updated').textContent = 'Updated at ' + covidStatus.updated
    } else {
      console.log('error')
    }
    getYestData(covidStatus)
  }
  request.send(covidStatus)
}

// Calculation for history chart
function diff (ary) {
  var newA = []
  for (var i = 1; i < ary.length; i++) newA.push(ary[i] - ary[i - 1])
  newA.unshift(ary[0])
  return newA
}

// Calculation for active cases chart
function active (ary1, ary2, ary3) {
  var newA = []
  for (var i = 1; i < ary1.length; i++) newA.push(ary1[i] - ary2[i] - ary3[i])
  return newA
}

// Format update numbers then put them in DOM
function formatNum (num, name) {
  if (num > 0) {
    document.getElementById(name).textContent = 'from yesterday (+' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')'
  } else {
    document.getElementById(name).textContent = 'from yesterday (' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')'
  }
}

// Format update percentage then put them in DOM
function formatPer (per, name) {
  if (per > 0) {
    document.getElementById(name).textContent = per + '% increase'
    document.getElementById(name).classList.add('increase')
    if (name == 'recoverPer') {
      document.getElementById(name).classList.add('increaseGreen')
    }
  } else if (per == 0) {
    document.getElementById(name).textContent = per + '% increase'
    document.getElementById(name).classList.add('same')
  } else {
    per = per * -1
    document.getElementById(name).textContent = per + '% decrease'
    document.getElementById(name).classList.add('decrease')
  }
}

// Get historocal data for global status
function getYestData (covidStatus) {
  var request = new XMLHttpRequest()
  request.open('GET', 'https://disease.sh/v2/historical/all?lastdays=all', true)
  request.setRequestHeader('Access-Control-Allow-Origin', 'https://disease.sh')
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      // Getting data for cases, deaths, recovers, then save them as arrays, used for chart data
      covidStatus.casesData = []
      covidStatus.deathData = []
      covidStatus.recoverData = []

      Object.keys(data.cases).forEach(function (key) {
        var value = data.cases[key]
        covidStatus.casesData.push(value)
        return (covidStatus.casesData)
      })

      Object.keys(data.deaths).forEach(function (key) {
        var value = data.deaths[key]
        covidStatus.deathData.push(value)
        return (covidStatus.deathData)
      })

      Object.keys(data.recovered).forEach(function (key) {
        var value = data.recovered[key]
        covidStatus.recoverData.push(value)
        return (covidStatus.recoverData)
      })

      // Get each date for cases, deaths, recovers, then save them as arrays, used for chart labels
      covidStatus.deathLabel = []
      for (var k in data.cases) covidStatus.deathLabel.push(k)

      covidStatus.casesLabel = []
      for (var k in data.cases) covidStatus.casesLabel.push(k)

      covidStatus.recoverLabel = []
      for (var k in data.cases) covidStatus.recoverLabel.push(k)

      // Calculate update numbers and perfectage for total cases, total deaths, total recoveries, and total actives
      var casesNum = ''
      var deathNum = ''
      var recoverNum = ''
      var activeNum = ''
      var casesPer = ''
      var deathPer = ''
      var recoverPer = ''
      var activePer = ''
      casesNum = covidStatus.totalCases - data.cases[Object.keys(data.cases).pop()]
      deathNum = covidStatus.totalDeaths - data.deaths[Object.keys(data.deaths).pop()]
      recoverNum = covidStatus.totalRecover - data.recovered[Object.keys(data.recovered).pop()]
      activeNum = casesNum - recoverNum - deathNum
      casesPer = ((casesNum * 100) / data.cases[Object.keys(data.cases).pop()]).toFixed(1)
      deathPer = ((deathNum * 100) / data.deaths[Object.keys(data.deaths).pop()]).toFixed(1)
      recoverPer = ((recoverNum * 100) / data.recovered[Object.keys(data.recovered).pop()]).toFixed(1)
      activePer = ((activeNum * 100) / (data.cases[Object.keys(data.cases).reverse().slice(1, 2).pop()] - data.recovered[Object.keys(data.recovered).reverse().slice(1, 2).pop()])).toFixed(1)

      // Format update numbers and percentage
      formatNum(casesNum, Object.keys({ casesNum })[0])
      formatNum(deathNum, Object.keys({ deathNum })[0])
      formatNum(recoverNum, Object.keys({ recoverNum })[0])
      formatNum(activeNum, Object.keys({ activeNum })[0])

      formatPer(casesPer, Object.keys({ casesPer })[0])
      formatPer(deathPer, Object.keys({ deathPer })[0])
      formatPer(recoverPer, Object.keys({ recoverPer })[0])
      formatPer(activePer, Object.keys({ activePer })[0])
    } else {
      console.log('error')
    }
    createChart(covidStatus)
  }
  request.send(covidStatus)
}

// Initiate charts
function createChart (covidStatus) {
  var ctx = document.getElementById('caseChart').getContext('2d')
  var dtx = document.getElementById('deathChart').getContext('2d')
  var rtx = document.getElementById('recoverChart').getContext('2d')
  var atx = document.getElementById('activeChart').getContext('2d')
  var cdtx = document.getElementById('caseDailyChart').getContext('2d')
  var ddtx = document.getElementById('deathDailyChart').getContext('2d')
  var rdtx = document.getElementById('recoverDailyChart').getContext('2d')
  var adtx = document.getElementById('activeDailyChart').getContext('2d')

  // Formate data to be used for chart data
  const casesData = covidStatus.casesData.toString().split(',').map(Number)
  const deathData = covidStatus.deathData.toString().split(',').map(Number)
  const recoverData = covidStatus.recoverData.toString().split(',').map(Number)
  const activeData = active(casesData, deathData, recoverData)

  const casesLabel = covidStatus.casesLabel
  const deathLabel = covidStatus.deathLabel
  const recoverLabel = covidStatus.recoverLabel

  const casesDailyData = diff(covidStatus.casesData).toString().split(',').map(Number)
  const deathDailyData = diff(covidStatus.deathData).toString().split(',').map(Number)
  const recoverDailyData = diff(covidStatus.recoverData).toString().split(',').map(Number)
  const activeDailyData = diff(activeData).toString().split(',').map(Number)

  console.log(casesData)

  // Total cases chart
  var caseChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: casesLabel,
      datasets: [{
        label: '',
        data: casesData,
        backgroundColor: 'rgba(237, 137, 54, 0.2)',
        borderColor: 'rgba(237, 137, 54, 1)',
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBackgroundColor: 'rgba(237, 137, 54, 0.6)',
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
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Daily new cases chart
  var caseDailyChart = new Chart(cdtx, {
    type: 'bar',
    data: {
      labels: casesLabel,
      datasets: [{
        label: '',
        data: casesDailyData,
        backgroundColor: 'rgba(237, 137, 54, 0.5)',
        borderColor: 'rgba(237, 137, 54, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Total deaths chart
  var deathChart = new Chart(dtx, {
    type: 'line',
    data: {
      labels: deathLabel,
      datasets: [{
        label: 'Total Deaths',
        data: deathData,
        backgroundColor: 'rgba(120, 120, 132, 0.2)',
        borderColor: 'rgba(120, 120, 132, 1)',
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBackgroundColor: 'rgba(120, 120, 132, 0.6)',
        pointBorderColor: 'rgba(120, 120, 132, 1)',
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
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Daily deaths chart
  var deathDailyChart = new Chart(ddtx, {
    type: 'bar',
    data: {
      labels: casesLabel,
      datasets: [{
        label: '',
        data: deathDailyData,
        backgroundColor: 'rgba(120, 120, 132, 0.5)',
        borderColor: 'rgba(120, 120, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Total recover chart
  var recoverChart = new Chart(rtx, {
    type: 'line',
    data: {
      labels: recoverLabel,
      datasets: [{
        label: 'Total Recovered',
        data: recoverData,
        backgroundColor: 'rgba(56, 161, 105, 0.2)',
        borderColor: 'rgba(56, 161, 105, 1)',
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBackgroundColor: 'rgba(56, 161, 105, 0.6)',
        pointBorderColor: 'rgba(56, 161, 105, 1)',
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
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Daily recover charts
  var recoverDailyChart = new Chart(rdtx, {
    type: 'bar',
    data: {
      labels: casesLabel,
      datasets: [{
        label: '',
        data: recoverDailyData,
        backgroundColor: 'rgba(56, 161, 105, 0.5)',
        borderColor: 'rgba(56, 161, 105, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Total active chart
  var activeChart = new Chart(atx, {
    type: 'line',
    data: {
      labels: casesLabel,
      datasets: [{
        label: 'Total Active',
        data: activeData,
        backgroundColor: 'rgba(90, 103, 216, 0.2)',
        borderColor: 'rgba(90, 103, 216, 1)',
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBackgroundColor: 'rgba(90, 103, 216, 0.6)',
        pointBorderColor: 'rgba(90, 103, 216, 1)',
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
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })

  // Daily active chart
  var activeDailyChart = new Chart(adtx, {
    type: 'bar',
    data: {
      labels: casesLabel,
      datasets: [{
        label: '',
        data: activeDailyData,
        backgroundColor: 'rgba(90, 103, 216, 0.5)',
        borderColor: 'rgba(90, 103, 216, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            lineWidth: 0
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
            callback: function (value, index, values) {
              if (value >= 0 && value < 1000) return value
              if (value >= 1000 && value < 1000000) return (value / 1000) + 'k'
              if (value >= 1000000 && value < 1000000000) return (value / 1000000) + 'm'
              return value
            }
          }
        }]
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  })
}
