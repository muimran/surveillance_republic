<script>
  import { onMount } from 'svelte';

  export let points = [];

  let mapDiv;
  let map;
  let markersLayer;
  let isMapVisible = false;

  let activePoint = null; 
  let tooltipPosition = 'top';

  let isMobile = false;
  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth < 600;
  }

  let initialLat = isMobile ? 20 : 20;
  let initialLng = isMobile ? 15 : 20;
  let mapHeight = isMobile ? '400px' : '800px';
  let initialZoom = isMobile ? 0.5 : 2.5;
  let minZoom = isMobile ? 0.5 : 2.5;

  function valueToPixelSize(value) {
    const baseSize = isMobile ? 10 : 20;
    const scalingFactor = isMobile ? 1000 : 550;
    return baseSize + Math.sqrt(value) / scalingFactor;
  }

  function createCircleIcon(point, size, withAnimation = false) {
    if (!window.L) return;
    const markerColor = '#e63946';
    const className = withAnimation ? 'fixed-marker with-animation leaflet-marker-icon' : 'fixed-marker leaflet-marker-icon';
    return window.L.divIcon({
      className: className,
      html: `<div style="width: ${size}px; height: ${size}px; background-color: ${markerColor}; border-radius: 50%; opacity: 0.6;"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  let closeHandler;

  onMount(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isMapVisible = entry.isIntersecting; });
    }, { threshold: 0.1 });

    import('leaflet').then(L => {
      window.L = L;

      map = L.map(mapDiv, {
        scrollWheelZoom: false,
        touchZoom: isMobile,
        doubleClickZoom: true,
        zoomControl: true,
        minZoom: minZoom,
        maxBounds: [ [-70, -170], [80, 170] ],
        maxBoundsViscosity: 1.0
      }).setView([initialLat, initialLng], initialZoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        minZoom: minZoom,
        attribution: '© <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      
      const countriesInData = new Set(points.map(p => p.country));

      function getCountryStyle(feature) {
        const countryNameFromGeoJSON = feature.properties.ADMIN;
        const isMatch = 
          countriesInData.has(countryNameFromGeoJSON) ||
          (countryNameFromGeoJSON === 'United States of America' && countriesInData.has('USA')) ||
          (countryNameFromGeoJSON === 'United Kingdom' && countriesInData.has('UK')) ||
          (countryNameFromGeoJSON === 'N. Cyprus' && countriesInData.has('Cyprus'));

        if (isMatch) {
          return { fillColor: '#FEEFB3', fillOpacity: 0.7, color: '#E6A23C', weight: 1 };
        } else {
          return { fillOpacity: 0, stroke: false };
        }
      }

      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson')
        .then(response => response.json())
        .then(data => { L.geoJSON(data, { style: getCountryStyle }).addTo(map); });

      markersLayer = L.layerGroup().addTo(map);

      closeHandler = (event) => {
        const onMarker = event.target.closest('.leaflet-marker-icon');
        const onPopup = event.target.closest('.leaflet-popup');
        const onMobileTooltip = event.target.closest('.mobile-tooltip');
        if (!onMarker && !onPopup && !onMobileTooltip) {
          if (map) map.closePopup();
          activePoint = null;
        }
      };
      
      document.addEventListener('click', closeHandler, true);
      document.addEventListener('touchstart', closeHandler, true);

      const createMarker = (point) => {
        const size = valueToPixelSize(point.value);
        const divIcon = createCircleIcon(point, size, true);
        const marker = L.marker([point.lat, point.long], { icon: divIcon });

        if (isMobile) {
          marker.on('click', (e) => {
            const clickY = e.containerPoint.y;
            const mapContainerHeight = map.getSize().y;
            tooltipPosition = (clickY > mapContainerHeight / 2) ? 'top' : 'bottom';
            activePoint = point;
          });
        } else {
          let exporterHtml = '';
          if (point.exporter_companies && point.exporter_companies.length > 0) {
            const exporterListItems = point.exporter_companies.map(exp => `<li>${exp.exporter_company}</li>`).join('');
            exporterHtml = `<div class="tooltip-exporters"><strong>Exporter Companies:</strong><ul>${exporterListItems}</ul></div>`;
          }
          const importerLabel = point.importers.length > 1 ? 'Importer Agencies' : 'Importer Agency';
          const importerListItems = point.importers.map(imp => `<li>${imp.importer_agency}</li>`).join('');
          const importerHtml = `<div class="tooltip-importers"><strong>${importerLabel}:</strong><ul>${importerListItems}</ul></div>`;
          
          // --- CHANGED: Wrapped header content in a new div for styling ---
          const headerHtml = `<div class="tooltip-header"><strong>${point.country}</strong><div class="tooltip-amount">Amount: ${point.label_text}</div></div>`;
          
          marker.bindPopup(`<div class="tooltip-content">${headerHtml}${exporterHtml}${importerHtml}</div>`, {
            className: 'custom-tooltip', maxWidth: 300
          });
        }

        setTimeout(() => {
          const finalIcon = createCircleIcon(point, size, false);
          marker.setIcon(finalIcon);
        }, 1500);

        return marker;
      };

      const updateCircleMarkers = () => {
        markersLayer.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            const point = points.find(p => p.lat === layer.getLatLng().lat && p.long === layer.getLatLng().lng);
            if (point) {
              const size = valueToPixelSize(point.value);
              const newIcon = createCircleIcon(point, size, false);
              layer.setIcon(newIcon);
            }
          }
        });
      };

      if (points && points.length > 0) {
        points.forEach(point => {
          const marker = createMarker(point);
          markersLayer.addLayer(marker);
        });
      }

      map.on('zoomend', updateCircleMarkers);
      observer.observe(mapDiv);
    });

    return () => {
      if (observer) observer.disconnect();
      if (closeHandler) {
        document.removeEventListener('click', closeHandler, true);
        document.removeEventListener('touchstart', closeHandler, true);
      }
    };
  });
</script>

<div class="map-wrapper" style="height: {mapHeight};">
  <div bind:this={mapDiv} id="map" style="height: 100%; width: 100%;"></div>

  {#if activePoint && isMobile}
    <div 
      class="mobile-tooltip"
      class:position-top={tooltipPosition === 'top'}
      class:position-bottom={tooltipPosition === 'bottom'}
    >
      <div class="tooltip-content">
        <!-- --- CHANGED: Wrapped header content in a new div for styling --- -->
        <div class="tooltip-header">
            <strong>{activePoint.country}</strong>
            <div class="tooltip-amount">Amount: {activePoint.label_text}</div>
        </div>
        
        {#if activePoint.exporter_companies && activePoint.exporter_companies.length > 0}
          <div class="tooltip-exporters">
            <strong>Exporter Companies:</strong>
            <ul>
              {#each activePoint.exporter_companies as exporter}
                <li>{exporter.exporter_company}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <div class="tooltip-importers">
          <strong>{activePoint.importers.length > 1 ? 'Importer Agencies' : 'Importer Agency'}:</strong>
          <ul>
            {#each activePoint.importers as importer}
              <li>{importer.importer_agency}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-wrapper {
    position: relative;
    width: 100vw;
  }

  .mobile-tooltip {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 300px;
    z-index: 1001;
    background-color: #ffffff;
    color: black;
    border-radius: 8px;
    padding: 12px 15px; /* This padding creates the space the header will fill */
    font-size: 14px;
    line-height: 1.5;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    transition: top 0.2s ease-out, bottom 0.2s ease-out;
  }

  .mobile-tooltip.position-top { top: 15px; bottom: auto; }
  .mobile-tooltip.position-bottom { bottom: 15px; top: auto; }
  
  #map { touch-action: pan-x pan-y; }

  :global(.leaflet-marker-icon.fixed-marker) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.fixed-marker.with-animation > div) {
    animation: grow-shrink 1.5s ease forwards;
  }

  @keyframes grow-shrink {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.6; }
  }

  :global(.custom-tooltip .leaflet-popup-content-wrapper) {
    background-color: #ffffff !important;
    color: black !important;
    border-radius: 8px;
    padding: 10px; /* This padding creates the space the header will fill */
    font-size: 14px;
    width: auto;
  }

  :global(.custom-tooltip .leaflet-popup-content) {
    margin: 0;
    line-height: 1.5;
  }

  :global(.custom-tooltip .leaflet-popup-tip) {
    background-color: #ffffff !important;
  }

  .tooltip-content {
    width: 100%;
  }

  /* --- START: FIX FOR TOOLTIP HEADER --- */

  /* This is the new shared header container */
  :global(.tooltip-header) {
    background: black;
    color: white;
    /* Round the top corners to match the parent tooltip */
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    /* Add space between the header and the content below */
    margin-bottom: 8px; 
  }

  /* FIX: Specific rule for mobile to remove the white border */
  .mobile-tooltip .tooltip-header {
    /* Use negative margins to cancel out the parent's padding */
    margin-top: -12px;
    margin-left: -15px;
    margin-right: -15px;
    /* Add padding back inside the header itself */
    padding: 12px 15px 0 15px;
  }

  /* FIX: Specific rule for desktop to match the mobile style */
  :global(.custom-tooltip .tooltip-header) {
    /* Use negative margins to cancel out the parent's padding */
    margin-top: -10px;
    margin-left: -10px;
    margin-right: -10px;
    /* Add padding back inside the header itself */
    padding: 10px 10px 0 10px;
  }
  
  /* Style the country name inside the new header */
  :global(.tooltip-header > strong) {
    font-size: 18px;
    color: white; /* Ensure text is white */
  }
  
  /* Style the amount and the line separator */
  :global(.tooltip-amount) {
    padding-top: 5px;
    padding-bottom: 8px;
    margin-bottom: 0; /* Margin is now on the header container */
    /* Change border color to be visible on the black background */
    border-bottom: 1.5px solid #444; 
  }

  /* --- END: FIX FOR TOOLTIP HEADER --- */

  :global(.tooltip-importers),
  :global(.tooltip-exporters) {
    word-wrap: break-word;
  }

  :global(.tooltip-importers) {
    margin-top: 8px;
  }

  :global(.tooltip-importers strong),
  :global(.tooltip-exporters strong) {
    font-size: 14px;
    font-weight: bold;
    color: black;
  }

  :global(.tooltip-importers ul),
  :global(.tooltip-exporters ul) {
    list-style-type: none;
    padding-left: 0;
    margin-top: 4px;
    margin-bottom: 0;
  }

  :global(.tooltip-importers li),
  :global(.tooltip-exporters li) {
    line-height: 1.3;
    padding-bottom: 2px;
  }

  @media (max-width: 600px) {
    .mobile-tooltip .tooltip-content,
    :global(.custom-tooltip .leaflet-popup-content) {
      max-height: 300px;
      overflow-y: auto;
    }
  }
</style>