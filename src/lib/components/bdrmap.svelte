<script>
  import { onMount } from 'svelte';
  import Papa from 'papaparse';
  import mapboxgl from 'mapbox-gl';

  let map;
  let mapContainer;
  let markers = [];

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

  onMount(async () => {
    const response = await fetch('/bgb.csv');
    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log('Parsed CSV:', result.data);

        markers = result.data
          .map(row => {
            const lat = parseFloat(row['Latitude']);
            const lon = parseFloat(row['Longitude']); // spelling fixed
            const title = row['Identifier'] || 'Untitled';
            return { lat, lon, title };
          })
          .filter(({ lat, lon }) => !isNaN(lat) && !isNaN(lon));

        console.log('Valid markers:', markers);

        initMap();
      }
    });
  });

  function initMap() {
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/imrandata/cm0fmeq48000e01pb9z5c7jez',
      center: [90.43626935436227, 23.762475482249783],  
      zoom: 14
    });

    markers.forEach(({ lat, lon, title }) => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setText(title))
        .addTo(map);
    });
  }
</script>

<style>
  @import 'mapbox-gl/dist/mapbox-gl.css';

  #map {
    width: 100%;
    height: 90vh; 
  }
</style>

<div bind:this={mapContainer} id="map"></div>
