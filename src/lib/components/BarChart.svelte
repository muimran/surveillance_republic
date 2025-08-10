<script>
  import { onMount } from 'svelte';
  import Highcharts from 'highcharts';

  let chartContainer;

  const rawData = [
    { name: 'NTMC', amount: 9043902697.41, color: '#c00007' },
    { name: 'POLICE', amount: 3787581626.71, color: '#c00007' },
    { name: 'RAB', amount: 987474332.19, color: '#c00007' }   
  ];



  const formattedData = rawData.map(d => ({
    name: d.name,
    y: d.amount / 10000000,  // convert to crore
    color: d.color
  }));

  onMount(() => {
    Highcharts.chart(chartContainer, {
      chart: {
        type: 'column'
      },
      title: {
        text: 'How much agencies spent on surveillance (in crore ৳)',
        align: 'center',
        style: {
          fontSize: window.innerWidth < 600 ? '14px' : '20px'
        }
      },
      xAxis: {
        type: 'category',
        title: {
          text: ''
        },
        labels: {
          style: {
            fontWeight: 'normal', // not bold
            fontSize: '13px' // optional, adjust as needed
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        tickLength: 5,
        tickWidth: 1,
        tickColor: '#000'
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y:.2f} crore ৳</b>'
      },
      series: [{
        name: 'Spending',
        data: formattedData
      }],
      credits: {
        enabled: false
      }
    });
  });
</script>

<div bind:this={chartContainer}></div>
