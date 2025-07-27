<script>
  import { onMount } from 'svelte';
  import Papa from 'papaparse';
  import mapboxgl from 'mapbox-gl';

  let map;
  let mapContainer;
  let markers = [];

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

  onMount(async () => {
    // Load CSV and parse markers
    const response = await fetch('/bgb.csv');
    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        markers = result.data
          .map(row => {
            const lat = parseFloat(row['Latitude']);
            const lon = parseFloat(row['Longitude']);
            const title = row['Identifier'] || 'Untitled';
            return { lat, lon, title };
          })
          .filter(({ lat, lon }) => !isNaN(lat) && !isNaN(lon));

        initMap();
      }
    });
  });

  async function initMap() {
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/imrandata/cm0fmeq48000e01pb9z5c7jez',
      center: [90.43626935436227, 23.762475482249783],
      zoom: 14
    });

    // Add markers
    markers.forEach(({ lat, lon, title }) => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setText(title))
        .addTo(map);
    });

    // Wait for map to load before adding polygon and line layers
    map.on('load', async () => {
      // --- POLYGON LAYER ---

      const polyResponse = await fetch('/poly.geojson');
      const polyData = await polyResponse.json();

      // Add polygon source and layers
      map.addSource('polygon', {
        type: 'geojson',
        data: polyData
      });

      map.addLayer({
        id: 'polygon-fill',
        type: 'fill',
        source: 'polygon',
        paint: {
          'fill-color': '#0033aa',
          'fill-opacity': 0.0 // start transparent for animation
        }
      });

      map.addLayer({
        id: 'polygon-outline',
        type: 'line',
        source: 'polygon',
        paint: {
          'line-color': '#0033aa',
          'line-width': 2
        }
      });

      // Animate polygon fill opacity from 0 to 0.8
      let opacity = 0;
      function animatePolygon() {
        if (opacity < 0.8) {
          opacity += 0.02;
          map.setPaintProperty('polygon-fill', 'fill-opacity', opacity);
          requestAnimationFrame(animatePolygon);
        }
      }
      animatePolygon();

      // --- LINE LAYER ---

      const lineResponse = await fetch('/line.geojson');
      const lineData = await lineResponse.json();

      // Prepare empty line source for animation
      const lineFeature = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }]
      };

      map.addSource('animated-line', {
        type: 'geojson',
        data: lineFeature
      });

      map.addLayer({
        id: 'line-layer',
        type: 'line',
        source: 'animated-line',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3
        }
      });

      // Animate line coordinates progressively
const coords = lineData.features[0].geometry.coordinates;
let idx = 0;
const totalDuration = 5000; // total animation duration in ms (2 seconds)
const delayPerPoint = totalDuration / coords.length; // delay between each point

function animateLine() {
  if (idx < coords.length) {
    lineFeature.features[0].geometry.coordinates.push(coords[idx]);
    map.getSource('animated-line').setData(lineFeature);
    idx++;
    setTimeout(animateLine, delayPerPoint); // dynamically adjusted speed
  }
}
animateLine();
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
