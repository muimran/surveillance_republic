<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';

  let map;
  let mapContainer;

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

  const allCoordinates = [
    [90.44275857913989, 23.762151498627887],
[90.44246782926804, 23.76217069572667],
[90.4421770793962, 23.76218989282545],
[90.44188632952435, 23.762209089924233],
[90.44159557965252, 23.762228287023015],
[90.44130482978067, 23.7622474841218],
[90.44101407990883, 23.76226668122058],
[90.44072333003699, 23.762285878319362],
[90.44043258016515, 23.762305075418144],
[90.4401418302933, 23.76232427251693],
[90.43985108042146, 23.76234346961571],
[90.43956033054961, 23.762362666714492],
[90.43926958067777, 23.762381863813274],
[90.43897883080593, 23.762401060912056],
[90.43868808093409, 23.76242025801084],
[90.43839733106225, 23.762439455109622],
[90.4381065811904, 23.762458652208404],
[90.43781583131856, 23.76247784930719],
[90.43752508144672, 23.76249704640597],
[90.43723433157488, 23.762516243504753],
[90.43694358170304, 23.762535440603535]


  ];

  function animateLine() {
    let index = 1;
    const interval = setInterval(() => {
      if (index > allCoordinates.length) {
        clearInterval(interval);
        return;
      }

      const coords = allCoordinates.slice(0, index);
      map.getSource('route').setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coords
        }
      });

      index++;
    }, 50);
  }

  onMount(() => {
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: allCoordinates[0],
      zoom: 13
    });

    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [allCoordinates[0]]
          }
        }
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 4
        }
      });

      animateLine();
    });
  });
</script>

<style>
  #map {
    width: 100%;
    height: 100vh;
  }
</style>

<div bind:this={mapContainer} id="map" />
