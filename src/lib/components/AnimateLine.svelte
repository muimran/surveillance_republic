<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import * as turf from '@turf/turf';
  
    let mapContainer;
    let map;
    let disabled = true;
    const steps = 200;
    let counter = 0;

    let pointData;
    let origin;
    let routeData;
  
    function handleClick() {
      pointData.features[0].geometry.coordinates = origin;
      map.getSource('point').setData(pointData);
      counter = 0;
      animate();
      disabled = true;
    }
  
    function animate() {
      const coords = routeData.features[0].geometry.coordinates;
  
      const start = coords[counter >= steps ? counter - 1 : counter];
      const end = coords[counter >= steps ? counter : counter + 1];
  
      if (!start || !end) {
        disabled = false;
        return;
      }
  
      pointData.features[0].geometry.coordinates = coords[counter];
      pointData.features[0].properties.bearing = turf.bearing(
        turf.point(start),
        turf.point(end)
      );
  
      map.getSource('point').setData(pointData);
  
      if (counter < steps) {
        requestAnimationFrame(animate);
      }
  
      counter += 1;
    }
  
    onMount(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';
  
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/standard',
        config: {
          basemap: {
            theme: 'monochrome',
            lightPreset: 'night'
          }
        },
        center: [90.44150795671293, 23.762713445898452],  
        zoom: 14
      });
  
      origin = [90.44275857913989, 23.762151498627887];
      const destination = [90.4368333963124, 23.76258119624564];
  
      routeData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [origin, destination]
            }
          }
        ]
      };
  
      pointData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: origin
            }
          }
        ]
      };
  
      const lineDistance = turf.length(routeData.features[0]);
      const arc = [];
  
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(routeData.features[0], i);
        arc.push(segment.geometry.coordinates);
      }
  
      routeData.features[0].geometry.coordinates = arc;
  
      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: routeData
        });
  
        map.addSource('point', {
          type: 'geojson',
          data: pointData
        });
  
        map.addLayer({
          id: 'route',
          source: 'route',
          type: 'line',
          paint: {
            'line-width': 2,
            'line-color': '#007cbf',
            'line-emissive-strength': 1
          }
        });
  
        map.addLayer({
          id: 'point',
          source: 'point',
          type: 'circle',
          paint: {
            'circle-radius': 6,
            'circle-color': '#007cbf',
            'circle-emissive-strength': 1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
  
        animate();
      });
  
      return () => {
        map.remove();
      };
    });
  </script>
  
  <style>
    #map-container {
      height: 100%;
      width: 100%;
      position: relative;
    }
  
    .replay-button {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: #3386c0;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
  
    .replay-button:disabled {
      background-color: #f5f5f5;
      color: #c3c3c3;
      cursor: not-allowed;
    }
  </style>
  
  <div id="map-container" bind:this={mapContainer}></div>
  
  <button class="replay-button" on:click={handleClick} disabled={disabled}>
    Replay
  </button>
  