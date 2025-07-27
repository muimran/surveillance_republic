<script>
  import { onMount } from 'svelte';
  import Papa from 'papaparse';
  import mapboxgl from 'mapbox-gl';

  let map;
  let mapContainer;
  let markers = [];

  // Your Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

  onMount(async () => {
    // Load CSV and parse markers from your public folder
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

        // Initialize the map only after the data is parsed
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

    // Add markers to the map
    markers.forEach(({ lat, lon, title }) => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setText(title))
        .addTo(map);
    });

    // Wait for the map to fully load its style before adding layers
    map.on('load', async () => {
      
      // --- POLYGON LAYER ---
      // This section was working correctly and remains unchanged.
      const polyResponse = await fetch('/poly.geojson');
      const polyData = await polyResponse.json();

      map.addSource('polygon', { type: 'geojson', data: polyData });
      map.addLayer({
        id: 'polygon-fill',
        type: 'fill',
        source: 'polygon',
        paint: { 'fill-color': '#0033aa', 'fill-opacity': 0.0 }
      });
      map.addLayer({
        id: 'polygon-outline',
        type: 'line',
        source: 'polygon',
        paint: { 'line-color': '#0033aa', 'line-width': 2 }
      });

      let opacity = 0;
      function animatePolygon() {
        if (opacity < 0.8) {
          opacity += 0.02;
          map.setPaintProperty('polygon-fill', 'fill-opacity', opacity);
          requestAnimationFrame(animatePolygon);
        }
      }
      animatePolygon();

      
      // --- LINE LAYER (CORRECTED IMPLEMENTATION) ---
      
      const lineResponse = await fetch('/line.geojson');
      const lineData = await lineResponse.json();
      
      // The full path of the line from your GeoJSON file
      const allCoords = lineData.features[0].geometry.coordinates;

      // An empty feature collection that we will fill dynamically
      const animatedLineFeature = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [] // Start with an empty line
          }
        }]
      };

      // Add the source and layer for the animated line
      map.addSource('animated-line', {
        type: 'geojson',
        data: animatedLineFeature
      });

      map.addLayer({
        id: 'line-layer',
        type: 'line',
        source: 'animated-line',
        paint: {
          'line-color': '#ff0000', // Red line
          'line-width': 3
        }
      });

      // --- EFFICIENT ANIMATION LOGIC ---
      const totalDuration = 2000; // 2 seconds for the animation
      let startTime;
      let currentIndex = 0; // Tracks the last point we added to the map

      function animateLine(timestamp) {
        if (startTime === undefined) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        // Calculate the target index of the coordinate that should be visible by now
        const targetIndex = Math.floor(allCoords.length * progress);

        // This is the key optimization:
        // Only update the map data if we have new points to add.
        // This avoids calling the expensive setData() on every single frame.
        if (targetIndex > currentIndex) {
          // Get the portion of the line to display
          const coordsToShow = allCoords.slice(0, targetIndex + 1);
          
          animatedLineFeature.features[0].geometry.coordinates = coordsToShow;
          map.getSource('animated-line').setData(animatedLineFeature);
          
          // Update our record of which point was last added
          currentIndex = targetIndex;
        }

        // Continue the animation as long as we are not finished
        if (progress < 1) {
          requestAnimationFrame(animateLine);
        } else {
          // Animation is finished. Do one final update to ensure the full line is drawn.
          animatedLineFeature.features[0].geometry.coordinates = allCoords;
          map.getSource('animated-line').setData(animatedLineFeature);
        }
      }

      // Start the animation loop
      requestAnimationFrame(animateLine);
    });
  }
</script>

<style>
  /* Import the Mapbox GL CSS */
  @import 'mapbox-gl/dist/mapbox-gl.css';

  #map {
    width: 100%;
    height: 90vh;
  }
</style>

<!-- The map container div -->
<div bind:this={mapContainer} id="map"></div>