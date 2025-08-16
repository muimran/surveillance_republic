<script>
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { base } from '$app/paths'; // For SvelteKit projects

  export let points = [];

  let mapDiv;
  let map;
  let markersLayer;
  let countriesLayer;
  let isMapVisible = false;

  let activePoint = null; 
  let tooltipPosition = 'top';
  
  let isZoomSticky = false;

  // --- Generic state and data for the dynamic magnifier ---
  let magnifiedCountry = null; // Will hold { name, feature, code } of the hovered country
  let magnifierContainer;
  let magnifierMap = null;
  const countryFeaturesMap = new Map(); // Stores all country GeoJSON features for quick lookup

  const COUNTRY_NAME_TO_CODE_MAP = {
    'Singapore': 'sg', 'United States of America': 'us', 'United Kingdom': 'gb', 'Canada': 'ca', 'France': 'fr', 'Germany': 'de', 'Italy': 'it', 'Spain': 'es', 'Australia': 'au', 'China': 'cn', 'Japan': 'jp', 'India': 'in', 'Brazil': 'br', 'Russian Federation': 'ru', 'Switzerland': 'ch', 'Netherlands': 'nl', 'Sweden': 'se', 'Norway': 'no', 'Denmark': 'dk', 'Finland': 'fi', 'Ireland': 'ie', 'Belgium': 'be', 'Austria': 'at', 'Portugal': 'pt', 'Greece': 'gr', 'Turkey': 'tr', 'Israel': 'il', 'United Arab Emirates': 'ae', 'Saudi Arabia': 'sa', 'South Africa': 'za', 'South Korea': 'kr', 'New Zealand': 'nz', 'Argentina': 'ar', 'Mexico': 'mx', 'Cyprus': 'cy', 'Czechia': 'cz', 'Bulgaria': 'bg', 'Malaysia': 'my', 'Philippines': 'ph', 'Poland': 'pl', 'Taiwan': 'tw',
    'USA': 'us', 'UK': 'gb', 'Czech Republic': 'cz'
  };

  let isMobile = false;
  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth < 600;
  }

  let initialLat = isMobile ? 20 : 20;
  let initialLng = isMobile ? 7 : 4; 
  let mapHeight = isMobile ? '300px' : '1000px';
  let initialZoom = isMobile ? 0.5 : 2.5;
  let minZoom = isMobile ? 0.5 : 2.5;

  let wheelZoomTimeout;

  // --- Svelte reactive statement handles ANY country with automatic zoom and positioning ---
  $: if (typeof window !== 'undefined' && window.L) {
    if (magnifiedCountry && magnifierContainer && !magnifierMap) {
      magnifierMap = L.map(magnifierContainer, {
        zoomControl: false, dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, tap: false, attributionControl: false
      });
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png').addTo(magnifierMap);

      let featureToDisplay = magnifiedCountry.feature;

      if (magnifiedCountry.name === 'United States of America' && magnifiedCountry.feature.geometry.type === 'MultiPolygon') {
        let mainLandPolygon = null;
        let maxPoints = 0;
        for (const polygon of magnifiedCountry.feature.geometry.coordinates) {
          const pointCount = polygon[0].length;
          if (pointCount > maxPoints) {
            maxPoints = pointCount;
            mainLandPolygon = polygon;
          }
        }
        if (mainLandPolygon) {
          featureToDisplay = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: mainLandPolygon,
            },
          };
        }
      }
      
      const countryLayer = L.geoJSON(featureToDisplay);
      const bounds = countryLayer.getBounds();

      magnifierMap.fitBounds(bounds, { padding: [20, 20], animate: false });

      const zoom = magnifierMap.getZoom();
      const initialCenter = magnifierMap.getCenter();
      const centerPoint = magnifierMap.latLngToContainerPoint(initialCenter);
      const yShift = magnifierContainer.clientHeight * 0.15;
      centerPoint.y -= yShift;
      const newCenter = magnifierMap.containerPointToLatLng(centerPoint);
      magnifierMap.setView(newCenter, zoom, { animate: false });


      L.geoJSON(featureToDisplay, {
        style: {
          fillColor: '#c00007', fillOpacity: 0.9, color: '#333333', weight: 2
        }
      }).addTo(magnifierMap);

    } else if (!magnifiedCountry && magnifierMap) {
      magnifierMap.remove();
      magnifierMap = null;
    }
  }

  function valueToPixelSize(value) {
    const baseSize = isMobile ? 5 : 15;
    const scalingFactor = isMobile ? 3000 : 700;
    return baseSize + Math.sqrt(value) / scalingFactor;
  }
  
  function formatNumberForList(value) {
    if (value === null || typeof value === 'undefined') {
        return '';
    }
    if (value >= 10000000) {
        return `${(value / 10000000).toFixed(2)} cr`;
    }
    if (value >= 100000) {
        return `${(value / 100000).toFixed(2)} lakh`;
    }
    return new Intl.NumberFormat('en-IN').format(value);
  }

  function createCircleIcon(point, size, currentZoom, color = '#e63946') {
    if (!window.L) return;
    const className = 'fixed-marker leaflet-marker-icon';
    
    let markerHtml = '';

    if (currentZoom >= 4 && point.label_text) {
      const fontSize = Math.min(12, Math.max(11, size / 4));
      const displayText = point.label_text.replace('Tk', '').replace('৳', '').trim();

      if (fontSize <= 11) {
        const labelHtml = `<span style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 2px; color: #333; font-weight: bold; font-size: 11px; white-space: nowrap;">${displayText}</span>`;
        markerHtml = `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; opacity: 0.6; position: relative;">${labelHtml}</div>`;
      } else {
        const labelHtml = `<span style="color: white; font-weight: bold; font-size: ${fontSize.toFixed(1)}px; line-height: 1;">${displayText}</span>`;
        markerHtml = `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; opacity: 0.6; display: flex; justify-content: center; align-items: center;">${labelHtml}</div>`;
      }
    } else {
      markerHtml = `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; opacity: 0.6;"></div>`;
    }
    
    return window.L.divIcon({
      className: className,
      html: markerHtml,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  let closeHandler;
  let wheelHandler; 
  let visibilityObserver;
  let stickyObserver;

  onMount(() => {
    if (typeof window === 'undefined') return;
    
    function triggerMarkerAnimations() {
      if (!markersLayer) return;
      markersLayer.eachLayer(layer => {
        const icon = layer._icon;
        if (icon) {
          icon.classList.remove('with-animation');
          void icon.offsetWidth;
          icon.classList.add('with-animation');
        }
      });
    }

    visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        isMapVisible = entry.isIntersecting;
        if (isMapVisible) {
          setTimeout(triggerMarkerAnimations, 100);
        }
      });
    }, { threshold: 0.1 });

    stickyObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        const stickyTopPosition = 20;
        const controlHeight = 150;
        
        isZoomSticky = 
          entry.isIntersecting &&
          entry.boundingClientRect.top <= stickyTopPosition &&
          entry.boundingClientRect.bottom >= (stickyTopPosition + controlHeight);

    }, {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)
    });

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

      function resetMapView() {
        if (map) {
          map.flyTo([initialLat, initialLng], initialZoom);
        }
      }

      L.Control.ResetView = L.Control.extend({
          onAdd: function(map) {
              const container = L.DomUtil.create('div', 'leaflet-control-reset leaflet-bar');
              const button = L.DomUtil.create('a', 'leaflet-control-reset-button', container);
              
              button.innerHTML = `<img src="${base}/images/zoom_reset.svg" alt="Reset View" />`;
              
              button.href = '#';
              button.role = 'button';
              button.title = 'Reset View';

              L.DomEvent.on(button, 'click', L.DomEvent.stop);
              L.DomEvent.on(button, 'click', resetMapView);
              
              return container;
          },
          onRemove: function(map) {}
      });

      new L.Control.ResetView({ position: 'topleft' }).addTo(map);

      if (!isMobile) {
        wheelHandler = (event) => {
          if (event.ctrlKey) {
            event.preventDefault();
            if (map) {
              map.scrollWheelZoom.enable();
              clearTimeout(wheelZoomTimeout);
              wheelZoomTimeout = setTimeout(() => {
                if(map) map.scrollWheelZoom.disable();
              }, 200);
            }
          } else {
            if(map) map.scrollWheelZoom.disable();
          }
        };
        mapDiv.addEventListener('wheel', wheelHandler, { passive: false });
      }

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        minZoom: minZoom,
        attribution: '© <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      
      const countriesInData = new Set(points.map(p => p.country));
      const countryAliasMap = {
        'United States of America': 'USA',
        'United Kingdom': 'UK',
        'N. Cyprus': 'Cyprus',
        'Czechia': 'Czech Republic'
      };

      function getCountryStyle(feature) {
        const countryName = feature.properties.ADMIN;
        const isMatch = countriesInData.has(countryName) || countriesInData.has(countryAliasMap[countryName]);

        if (isMatch) {
          return { fillColor: '#FEEFB3', fillOpacity: 0.7, color: '#E6A23C', weight: 1 };
        } else {
          return { fillOpacity: 0, stroke: false };
        }
      }

      function updateMapHighlight(highlightedCountry = null, highlightColor = null) {
        if (countriesLayer) {
          const dimStyle = { fillColor: '#dcdcdc', fillOpacity: 0.5, color: '#aaaaaa', weight: 1 };

          if (highlightedCountry) {
            countriesLayer.setStyle(dimStyle);
          } else {
            countriesLayer.setStyle(getCountryStyle);
          }
        }
        
        if (markersLayer) {
            const defaultColor = '#e63946';
            const dimmedColor = '#cccccc';
            const targetColor = highlightedCountry ? dimmedColor : defaultColor;

            markersLayer.eachLayer(layer => {
                if (layer instanceof L.Marker && layer.pointData) {
                    const point = layer.pointData;
                    const size = valueToPixelSize(point.value);
                    const currentZoom = map.getZoom();
                    const newIcon = createCircleIcon(point, size, currentZoom, targetColor);
                    layer.setIcon(newIcon);
                }
            });
        }
      }

      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson')
        .then(response => response.json())
        .then(data => { 
          data.features.forEach(feature => {
            const countryName = feature.properties.ADMIN;
            countryFeaturesMap.set(countryName, feature);
          });

          countriesLayer = L.geoJSON(data, { 
            style: getCountryStyle,
            interactive: true,
            onEachFeature: (feature, layer) => { 
              layer.options.className = 'country-polygon';
            }
          }).addTo(map); 
        });

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
        const currentZoom = map.getZoom();
        const divIcon = createCircleIcon(point, size, currentZoom);
        const marker = L.marker([point.lat, point.long], { icon: divIcon });
        marker.pointData = point;

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
            const sortedExporters = [...point.exporter_companies].sort((a, b) => b.export_value - a.export_value);
            const exporterListItems = sortedExporters.map((exp, i) => {
                const companyColor = (exp.base_country && exp.base_country !== point.country) ? '#c00007' : '#0056b3';
                let companyStyle = `color: ${companyColor};`;
                let dataAttribute = '';

                if (exp.base_country) {
                    dataAttribute = `data-tooltip-text="${exp.exporter_company} is based in ${exp.base_country}" data-base-country="${exp.base_country}" data-highlight-color="${companyColor}"`;
                    companyStyle += ' cursor: help;';
                }
                const companyNameHtml = `<strong class="exporter-company" style="${companyStyle}" ${dataAttribute}>${exp.exporter_company}</strong>`;
                const formattedValue = formatNumberForList(exp.export_value);
                return `<li class="tooltip-list-item" style="animation-delay: ${i * 50}ms">
                          <span class="item-name">${companyNameHtml}</span>
                          <span class="item-value"><strong>${formattedValue}</strong></span>
                        </li>`;
            }).join('');
            exporterHtml = `<div class="tooltip-exporters"><strong>Notable Exporters:</strong><ul>${exporterListItems}</ul></div>`;
          }
          const importerLabel = point.importers.length > 1 ? 'Importer Agencies' : 'Importer Agency';
          const sortedImporters = [...point.importers].sort((a, b) => b.import_value - a.import_value);
          const importerListItems = sortedImporters.map((imp, i) => {
            const formattedValue = formatNumberForList(imp.import_value);
            const exporterCount = point.exporter_companies ? point.exporter_companies.length : 0;
            const delay = (exporterCount + i) * 50;
            return `<li class="tooltip-list-item" style="animation-delay: ${delay}ms">
                      <span class="item-name"><strong>${imp.importer_agency}</strong></span>
                      <span class="item-value"><strong>${formattedValue}</strong></span>
                    </li>`;
          }).join('');
          const importerHtml = `<div class="tooltip-importers"><strong>${importerLabel}:</strong><ul>${importerListItems}</ul></div>`;
          let barrierHtml = '';
          if (point.export_barriers === 'Y') {
            barrierHtml = `<div class="tooltip-barrier-notice">${point.country} bans exporting surveillance equipment to repressive regimes.</div>`;
          }
          const headerHtml = `<div class="tooltip-header"><strong>${point.country}</strong><div class="tooltip-amount">Amount: ${point.label_text.replace('Tk', '৳')}</div></div>`;
          
          const controlsContainer = map.getContainer().querySelector('.leaflet-control-container .leaflet-top.leaflet-left');
          let leftPadding = 25;
          if (controlsContainer) {
              const controlsWidth = controlsContainer.offsetWidth;
              const margin = 25;
              leftPadding = controlsWidth + margin;
          }
          const autoPanPadding = L.point(leftPadding, 25);

          marker.bindPopup(`<div class="tooltip-content">${headerHtml}${exporterHtml}${importerHtml}${barrierHtml}</div>`, {
            className: 'custom-tooltip', 
            maxWidth: 300,
            closeButton: false,
            autoPan: true,
            autoPanPadding: autoPanPadding
          });
          
          marker.on('mouseover', function (e) {
            if (e.target._icon) e.target._icon.classList.add('marker-hover');
            e.target.setZIndexOffset(1000);
          });
          marker.on('mouseout', function (e) {
            if (e.target._icon) e.target._icon.classList.remove('marker-hover');
            e.target.setZIndexOffset(0);
          });

          marker.on('popupopen', (e) => {
            const popupContent = e.popup.getElement().querySelector('.leaflet-popup-content');
            if (!popupContent) return;
            
            const companyElements = popupContent.querySelectorAll('.exporter-company');
            companyElements.forEach(el => {
              const baseCountry = el.dataset.baseCountry;
              const highlightColor = el.dataset.highlightColor;
              
              el.addEventListener('mouseover', () => {
                if (baseCountry) {
                  updateMapHighlight(baseCountry, highlightColor);
                  
                  const feature = countryFeaturesMap.get(baseCountry);
                  const code = COUNTRY_NAME_TO_CODE_MAP[baseCountry];

                  if (feature && code) {
                    magnifiedCountry = { name: baseCountry, feature, code };
                  }
                }
              });
              el.addEventListener('mouseout', () => {
                updateMapHighlight(null, null);
                magnifiedCountry = null;
              });
            });
          });

          marker.on('popupclose', () => {
            magnifiedCountry = null;
          });
        }
        return marker;
      };
      
      const updateCircleMarkers = () => {
        const currentZoom = map.getZoom();
        markersLayer.eachLayer(layer => {
          if (layer instanceof L.Marker && layer.pointData) {
            const point = layer.pointData;
            const size = valueToPixelSize(point.value);
            const newIcon = createCircleIcon(point, size, currentZoom);
            layer.setIcon(newIcon);
          }
        });
        updateMapHighlight(null, null);
      };

      if (points && points.length > 0) { points.forEach(point => markersLayer.addLayer(createMarker(point))); }
      map.on('zoomend', updateCircleMarkers);

      visibilityObserver.observe(mapDiv);
      stickyObserver.observe(mapDiv);
    });

    return () => {
      if (visibilityObserver) visibilityObserver.disconnect();
      if (stickyObserver) stickyObserver.disconnect();
      if (closeHandler) {
        document.removeEventListener('click', closeHandler, true);
        document.removeEventListener('touchstart', closeHandler, true);
      }
      if (wheelHandler && mapDiv) {
        mapDiv.removeEventListener('wheel', wheelHandler);
      }
      clearTimeout(wheelZoomTimeout);
      if (magnifierMap) {
        magnifierMap.remove();
        magnifierMap = null;
      }
    };
  });
</script>
<div class="map-wrapper" style="height: {mapHeight};" class:is-sticky={isZoomSticky}>
  <div bind:this={mapDiv} id="map" style="height: 100%; width: 100%;"></div>
  
  {#if magnifiedCountry}
    <div class="sticky-wrapper">
      <div 
        bind:this={magnifierContainer}
        class="magnifier-container"
        transition:scale={{ duration: 200, start: 0.8 }}
      >
        <div class="magnifier-flag-container">
          <img 
            src={`https://flagcdn.com/w80/${magnifiedCountry.code}.png`} 
            alt={`${magnifiedCountry.name} Flag`} 
          />
        </div>
      </div>
    </div>
  {/if}

  {#if activePoint && isMobile}
  <div
  class="mobile-tooltip"
  class:position-top={tooltipPosition === 'top'}
  class:position-bottom={tooltipPosition === 'bottom'}
  in:scale={{ duration: 150, start: 0.95, easing: (t) => t * (2 - t) }}
  out:fade={{ duration: 100 }}
  >
  <div class="tooltip-content">
  <div class="tooltip-header">
  <strong>{activePoint.country}</strong>
  <div class="tooltip-amount">Amount: {activePoint.label_text.replace('Tk', '৳')}</div>
  </div>
  {#if activePoint.exporter_companies && activePoint.exporter_companies.length > 0}
  <div class="tooltip-exporters">
  <strong>Notable Exporters:</strong>
  <ul>
  {#each [...activePoint.exporter_companies].sort((a,b) => b.export_value - a.export_value) as exporter, i}
  {@const formattedValue = formatNumberForList(exporter.export_value)}
  <li class="tooltip-list-item" in:fade={{ duration: 250, delay: 50 + i * 50 }}>
  <span class="item-name">
  {#if exporter.base_country && exporter.base_country !== activePoint.country}
  <strong style="color: #c00007;">{exporter.exporter_company}</strong>
  {:else}
  <strong style="color: #0056b3;">{exporter.exporter_company}</strong>
  {/if}
  </span>
  {#if formattedValue}
  <span class="item-value"><strong>{formattedValue}</strong></span>
  {/if}
  </li>
  {/each}
  </ul>
  </div>
  {/if}
  <div class="tooltip-importers">
    <strong>{activePoint.importers.length > 1 ? 'Importer Agencies' : 'Importer Agency'}:</strong>
    <ul>
      {#each [...activePoint.importers].sort((a,b) => b.import_value - a.import_value) as importer, i}
        {@const formattedValue = formatNumberForList(importer.import_value)}
        <li class="tooltip-list-item" in:fade={{ duration: 250, delay: 50 + (activePoint.exporter_companies.length + i) * 50 }}>
          <span class="item-name"><strong>{importer.importer_agency}</strong></span>
          {#if formattedValue}
            <span class="item-value"><strong>{formattedValue}</strong></span>
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  {#if activePoint.export_barriers === 'Y'}
    <div class="tooltip-barrier-notice">
      {activePoint.country} prohibits export of surveillance equipment to repressive regimes.
    </div>
  {/if}
    </div>
  </div>
  {/if}
</div>
<style>
  :global(.country-polygon) {
    cursor: default !important;
  }
@keyframes subtle-pop-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes fade-in-item { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.sticky-wrapper {
  position: sticky;
  bottom: 100px;
  height: 0;
  z-index: 1002;
  pointer-events: none;
}

.magnifier-container {
  position: absolute;
  bottom: 0;
  right: 25px;
  width: 180px;
  height: 180px;
  pointer-events: auto;
  border-radius: 50%;
  border: 4px solid #6c757d;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  overflow: hidden;
  background-color: #e9ecef;
}

.magnifier-flag-container {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 54px;
  height: 36px;
  z-index: 1003; 
}

.magnifier-flag-container img {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  border: 1px solid #fff;
}


:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]) {
    position: relative;
}

:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]::before),
:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]::after) {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
    transition: all 0.2s ease-in-out;
}

:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]:hover::before),
:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]:hover::after) {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
}

:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]::before) {
    content: attr(data-tooltip-text);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff;
    color: #333;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: normal;
    white-space: nowrap;
    z-index: 10002;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 1px solid #eee;
}

:global(.custom-tooltip .tooltip-list-item .item-name [data-tooltip-text]::after) {
    content: '';
    position: absolute;
    bottom: calc(120% - 6px);
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    border-width: 0;
    width: 12px;
    height: 12px;
    background-color: #ffffff;
    z-index: 10001;
    box-shadow: 2px 2px 4px -1px rgba(0,0,0,0.1);
}

.map-wrapper {
position: relative;
width: 100vw;
left: 50%;
right: 50%;
margin-left: -50vw;
margin-right: -50vw;
}
#map {
touch-action: pan-x pan-y;
}
:global(.leaflet-marker-icon.with-animation > div) {
animation: grow-shrink 1.5s ease forwards;
}
@keyframes grow-shrink {
0% { transform: scale(0); opacity: 0; }
50% { transform: scale(1.2); opacity: 0.6; }
100% { transform: scale(1); opacity: 0.6; }
}
.mobile-tooltip {
position: absolute;
left: 50%;
transform: translateX(-50%);
width: 90%;
max-width: 300px;
padding-top: 56px;
background: #fff;
border-radius: 8px;
box-shadow: 0 4px 12px rgba(0,0,0,0.4);
padding-left: 15px;
padding-right: 15px;
padding-bottom: 12px;
z-index: 1001;
}
.mobile-tooltip.position-top { top: 15px; bottom: auto; }
.mobile-tooltip.position-bottom { bottom: 15px; top: auto; }

.mobile-tooltip .tooltip-header {
position: absolute;
top: 0; left: 0; right: 0;
height: 56px;
background: #000;
color: #fff;
border-top-left-radius: 8px;
border-top-right-radius: 8px;
padding: 0 15px;
box-sizing: border-box;
display: flex;
flex-direction: column;
justify-content: center;
}
.mobile-tooltip .tooltip-header > strong { font-size: 18px; }

:global(.custom-tooltip .tooltip-amount) { border-bottom: 1.5px solid #444; }

.mobile-tooltip .tooltip-importers,
.mobile-tooltip .tooltip-exporters { word-wrap: break-word; }

.mobile-tooltip .tooltip-exporters {
margin-top: 16px;
}

.mobile-tooltip .tooltip-importers > strong,
.mobile-tooltip .tooltip-exporters > strong {
font-size: 14px;
font-weight: bold;
color: black;
}
.mobile-tooltip .tooltip-importers ul,
.mobile-tooltip .tooltip-exporters ul {
list-style-type: none;
padding-left: 0;
margin-top: 4px;
margin-bottom: 0;
}

:global(.custom-tooltip .leaflet-popup-content-wrapper) {
background-color: #ffffff !important;
color: black !important;
border-radius: 8px;
padding: 10px;
font-size: 14px;
width: auto;
animation: subtle-pop-in 150ms ease-out;
}
:global(.custom-tooltip .leaflet-popup-content) { margin: 0; line-height: 1.5; }
:global(.custom-tooltip .leaflet-popup-tip) { background-color: #ffffff !important; }
:global(.custom-tooltip .tooltip-header) {
background: black;
color: white;
border-top-left-radius: 8px;
border-top-right-radius: 8px;
margin: -10px -10px 8px -10px;
padding: 10px 10px 0 10px;
}
:global(.custom-tooltip .tooltip-header > strong) { font-size: 18px; }

:global(.custom-tooltip .tooltip-importers),
:global(.custom-tooltip .tooltip-exporters) { word-wrap: break-word; }

:global(.custom-tooltip .tooltip-importers > strong),
:global(.custom-tooltip .tooltip-exporters > strong) {
font-weight: bold;
color: black;
}
:global(.custom-tooltip .tooltip-importers ul),
:global(.custom-tooltip .tooltip-exporters ul) {
list-style-type: none;
padding-left: 0;
margin-top: 4px;
margin-bottom: 0;
}

.mobile-tooltip .tooltip-importers,
:global(.custom-tooltip .tooltip-importers) { margin-top: 16px; }

.mobile-tooltip .tooltip-barrier-notice,
:global(.custom-tooltip .tooltip-barrier-notice) {
color: #c00007;
font-size: 12px;
font-style: italic;
margin-top: 16px;
padding-top: 12px;
border-top: 1px solid #eee;
line-height: 1.4;
}

.mobile-tooltip .tooltip-importers li,
.mobile-tooltip .tooltip-exporters li,
:global(.custom-tooltip .tooltip-importers li),
:global(.custom-tooltip .tooltip-exporters li),
:global(.custom-tooltip .tooltip-amount) {
line-height: 1.4;
padding-bottom: 4px;
font-size: 11.5px;
}

.mobile-tooltip .tooltip-list-item,
:global(.custom-tooltip .tooltip-list-item) {
display: flex;
justify-content: space-between;
align-items: baseline;
gap: 1em;
}

:global(.custom-tooltip .tooltip-list-item) {
opacity: 0;
animation: fade-in-item 300ms ease-out forwards;
}

.mobile-tooltip .item-name,
:global(.custom-tooltip .item-name) { flex-grow: 1; text-align: left; color: #333; }
.mobile-tooltip .item-value,
:global(.custom-tooltip .item-value) { flex-shrink: 0; text-align: right; font-family: 'Menlo', 'Consolas', 'Monaco', monospace; }

:global(.leaflet-marker-icon.fixed-marker) { display: flex; justify-content: center; align-items: center; }
:global(.leaflet-marker-icon.fixed-marker > div) { transition: all 0.3s ease-in-out; }
:global(.leaflet-marker-icon.marker-hover > div) {
box-shadow: 0 0 15px 5px rgba(230, 57, 70, 0.7);
transform: scale(1.1);
z-index: 1000;
}

@media (max-width: 600px) {
.mobile-tooltip .tooltip-content,
:global(.custom-tooltip .leaflet-popup-content) { max-height: 300px; overflow-y: auto; }
.mobile-tooltip,
:global(.custom-tooltip .leaflet-popup-content-wrapper) { font-size: 12px; }
.mobile-tooltip .tooltip-header > strong,
:global(.custom-tooltip .tooltip-header > strong) { font-size: 14px; }
.mobile-tooltip .tooltip-amount { border-bottom: none; }
.mobile-tooltip .tooltip-importers > strong,
.mobile-tooltip .tooltip-exporters > strong,
:global(.custom-tooltip .tooltip-importers > strong),
:global(.custom-tooltip .tooltip-exporters > strong) { font-size: 13px; }
.mobile-tooltip .tooltip-importers li,
.mobile-tooltip .tooltip-exporters li,
:global(.custom-tooltip .importers li),
:global(.custom-tooltip .exporters li),
.mobile-tooltip .tooltip-amount,
:global(.custom-tooltip .tooltip-amount) { font-size: 9px; }
}

:global(.leaflet-bar) { border: none !important; background: #ffffff !important; box-shadow: 0 1px 5px rgba(0,0,0,0.4) !important; border-radius: 8px !important; }
:global(.leaflet-control-zoom a) { width: 30px !important; height: 30px !important; line-height: 30px !important; background: transparent !important; color: #333333 !important; font-size: 22px !important; font-weight: normal !important; border: none !important; border-radius: 0 !important; box-shadow: none !important; text-shadow: none !important; transition: background-color 0.16s ease-out; }
:global(.leaflet-control-zoom-in) { border-top-left-radius: 8px !important; border-top-right-radius: 8px !important; border-bottom: 1px solid #cccccc !important; }
:global(.leaflet-control-zoom-out) { margin-top: 0 !important; border-bottom-left-radius: 8px !important; border-bottom-right-radius: 8px !important; }
:global(.leaflet-control-zoom a:hover) { background-color: #f4f4f4 !important; transform: none; }

:global(.leaflet-control-reset) {
margin-top: 10px;
}
:global(.leaflet-control-reset-button) {
display: flex !important;
justify-content: center;
align-items: center;
width: 30px !important;
height: 30px !important;
background-color: #ffffff;
border-radius: 8px !important;
cursor: pointer;
color: #333333 !important;
transition: background-color 0.16s ease-out;
}
:global(.leaflet-control-reset-button:hover) {
background-color: #f4f4f4 !important;
}
/* This rule now styles the <img> tag inside the reset button */
:global(.leaflet-control-reset-button img) {
  width: 18px;
  height: 18px;
}

@media (min-width: 601px) {
:global(.leaflet-control-zoom),
:global(.leaflet-control-reset) {
left: 25px;
z-index: 1001;
}

.map-wrapper.is-sticky :global(.leaflet-control-zoom),
.map-wrapper.is-sticky :global(.leaflet-control-reset) {
  position: fixed !important;
}

.map-wrapper.is-sticky :global(.leaflet-control-zoom) {
  top: 20px;
}

.map-wrapper.is-sticky :global(.leaflet-control-reset) {
  top: 102px;
}

:global(.leaflet-control-zoom.leaflet-bar),
:global(.leaflet-control-reset.leaflet-bar) {
  border: 2px solid #e63946 !important;
}

:global(.leaflet-control-zoom a) {
  width: 35px !important;
  height: 35px !important;
  line-height: 35px !important;
}

:global(.leaflet-control-reset-button) {
  width: 35px !important;
  height: 35px !important;
}
}
</style>