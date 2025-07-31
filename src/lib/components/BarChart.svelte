<script>
    import { onMount } from 'svelte';
    import Highcharts from 'highcharts';
  
    export let data = [];
    let chartContainer;
    let chartInstance;
    let showResetButton = false;
    let showPoliceNote = false;
  
    function transformDataForHighcharts(spendingData) {
      if (!spendingData || spendingData.length === 0) {
        return { categories: [], series: [] };
      }
  
      const categories = [...new Set(spendingData.map(d => d.year))].sort();
      const agencies = [...new Set(spendingData.map(d => d.agency))];
  
      const agencyColors = {
        [agencies[0]]: '#FF6384',
        [agencies[1]]: '#70327f',
        [agencies[2]]: '#e63946',
        [agencies[3]]: '#FEEFB3'
      };
  
      const series = agencies.map(agency => {
        const agencyData = [];
        for (const year of categories) {
          const point = spendingData.find(d => d.year === year && d.agency === agency);
          agencyData.push(point ? point.value : 0);
        }
        return {
          name: agency,
          data: agencyData,
          color: agencyColors[agency]
        };
      });
  
      return { categories, series };
    }
  
    function updateResetButtonVisibility(chart) {
      const visibleSeriesCount = chart.series.filter(s => s.visible).length;
      showResetButton = visibleSeriesCount < chart.series.length;
    }
  
    function handleReset() {
      chartInstance.series.forEach(s => s.setVisible(true, false));
      chartInstance.redraw();
      showResetButton = false;
      showPoliceNote = false;
    }
  
    onMount(() => {
      if (!chartContainer) return;
  
      const { categories, series } = transformDataForHighcharts(data);
  
      chartInstance = Highcharts.chart(chartContainer, {
        chart: {
          type: 'column',
          height: 500,
          marginTop: 120,
          marginBottom: 80,
          backgroundColor: '#ffffff',
        },
        credits: {
    enabled: false
  },
        title: {
          text: 'Agency Spending by Year',
          align: 'center'
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          min: 0,
          title: {
            text: null
          },
          gridLineWidth: 0,
          tickLength: 4,
          tickWidth: 1,
          tickColor: '#999',
          stackLabels: {
            enabled: true,
            formatter: function () {
              if (this.total >= 10000000) {
                return (this.total / 10000000).toFixed(2) + ' cr';
              }
              if (this.total >= 100000) {
                return (this.total / 100000).toFixed(2) + ' L';
              }
              return Highcharts.numberFormat(this.total, 0, '', ',');
            }
          }
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'top',
          y: 25
        },
        tooltip: {
          headerFormat: '<b>{point.key}</b><br/>',
          pointFormat: '{series.name}: {point.y:,.0f}<br/>Total: {point.stackTotal:,.0f}'
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: false
            },
            events: {
              legendItemClick: function (event) {
                const chart = this.chart;
                const series = chart.series;
                const clickedSeries = this;
  
                const onlyClickedVisible = clickedSeries.visible && series.filter(s => s.visible).length === 1;
  
                if (!clickedSeries.visible) {
                  series.forEach(s => s.setVisible(s === clickedSeries, false));
                } else if (onlyClickedVisible) {
                  series.forEach(s => s.setVisible(true, false));
                } else {
                  series.forEach(s => s.setVisible(s === clickedSeries, false));
                }
  
                chart.redraw();
  
                updateResetButtonVisibility(chart);
  
                const visibleSeries = chart.series.filter(s => s.visible).map(s => s.name.toLowerCase());
                showPoliceNote = visibleSeries.length === 1 && visibleSeries[0] === 'police';
  
                event.preventDefault();
              }
            }
          }
        },
        series: series,
        credits: {
          enabled: true,
          position: {
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 10
          }
        }
      });
  
      updateResetButtonVisibility(chartInstance);
    });
  </script>
  
  <style>
    .chart-wrapper {
      position: relative;
    }
  
    /* --- MODIFIED BUTTON STYLE FOR TRUE CENTERING --- */
    .reset-button {
      position: absolute;
      top: 50px; /* Kept it near the top */
      
      /* This is the CSS for true horizontal centering */
      left: 50%;
      transform: translateX(-50%);
      
      /* Your requested style changes */
      padding: 5px 10px; 
      background-color: #6c757d; 
      color: white; 
      border: none;
      border-radius: 4px;
      font-size: 10px;
      
      cursor: pointer;
      z-index: 10;
      transition: background-color 0.2s ease;
    }
  
    .reset-button:hover {
      background-color: #5a6268;
    }
    
    .note {
      /* ... your note styles ... */
      margin-top: 0px;
      font-style: italic;
      color: #e63946;
      text-align: center;
      font-size: 14px;
    }
    :global(.highcharts-credits) {
      display: none !important;
    }
  </style>
  
  <div class="chart-wrapper">
    {#if showResetButton}
      <button class="reset-button" on:click={handleReset}>Reset All</button>
    {/if}
    <div bind:this={chartContainer}></div>
  </div>
  
  {#if showPoliceNote}
    <div class="note">
      Police spent nearly twice as much as all other agencies combined.
    </div>
  {/if}
  