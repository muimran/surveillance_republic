<script>
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let points = [];

  let mapDiv;
  let map;
  let markersLayer;
  let countriesLayer;
  let isMapVisible = false;

  let activePoint = null; 
  let tooltipPosition = 'top';
  
  let customHoverTooltip;

  // Reactive variable to control the sticky state of the zoom controls
  let isZoomSticky = false;

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

  function valueToPixelSize(value) {
    const baseSize = isMobile ? 5 : 15;
    const scalingFactor = isMobile ? 3000 : 700;
    return baseSize + Math.sqrt(value) / scalingFactor;
  }

  function formatCurrencyValue(value) {
    if (value === null || typeof value === 'undefined') {
      return '';
    }
    const takaSymbol = '৳';
    if (value >= 10000000) { 
      return `${takaSymbol} ${(value / 10000000).toFixed(2)} cr`;
    }
    if (value >= 100000) {
      return `${takaSymbol} ${(value / 100000).toFixed(2)} lakh`;
    }
    return `${takaSymbol} ${new Intl.NumberFormat('en-IN').format(value)}`;
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
        const stickyTopPosition = 20; // Matches the `top` value in our CSS
        const controlHeight = 100; // An estimate for the height of the controls + padding
        
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
          const highlightStyle = { 
            fillColor: highlightColor || '#FEEFB3', 
            fillOpacity: 0.9, 
            color: '#333333', 
            weight: 2 
          };
          const dimStyle = { fillColor: '#dcdcdc', fillOpacity: 0.5, color: '#aaaaaa', weight: 1 };

          countriesLayer.eachLayer(layer => {
            if (highlightedCountry) {
              const countryName = layer.feature.properties.ADMIN;
              const isMatch = (countryName === highlightedCountry) || 
                              (countryAliasMap[countryName] === highlightedCountry) || 
                              (Object.keys(countryAliasMap).find(key => countryAliasMap[key] === highlightedCountry) === countryName);
              layer.setStyle(isMatch ? highlightStyle : dimStyle);
            } else {
              countriesLayer.setStyle(getCountryStyle);
            }
          });
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
          countriesLayer = L.geoJSON(data, { 
            style: getCountryStyle,
            interactive: true,
            onEachFeature: (feature, layer) => { layer.options.className = 'country-polygon'; }
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
            exporterHtml = `<div class="tooltip-exporters"><strong>Exporter Companies:</strong><ul>${exporterListItems}</ul></div>`;
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
          marker.bindPopup(`<div class="tooltip-content">${headerHtml}${exporterHtml}${importerHtml}${barrierHtml}</div>`, {
            className: 'custom-tooltip', 
            maxWidth: 300,
            closeButton: false
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
              const tooltipText = el.dataset.tooltipText;
              const baseCountry = el.dataset.baseCountry;
              const highlightColor = el.dataset.highlightColor;

              if (tooltipText) {
                el.addEventListener('mousemove', (moveEvent) => {
                  const tooltipWidth = customHoverTooltip.offsetWidth;
                  const tooltipHeight = customHoverTooltip.offsetHeight;
                  const viewportWidth = window.innerWidth;
                  const viewportHeight = window.innerHeight;
                  const offset = 15;
                  let x = moveEvent.clientX + offset;
                  let y = moveEvent.clientY + offset;
                  if (x + tooltipWidth > viewportWidth - offset) x = moveEvent.clientX - tooltipWidth - offset;
                  if (y + tooltipHeight > viewportHeight - offset) y = moveEvent.clientY - tooltipHeight - offset;
                  customHoverTooltip.style.left = `${x}px`;
                  customHoverTooltip.style.top = `${y}px`;
                });
              }
              
              el.addEventListener('mouseover', () => {
                if (tooltipText) {
                  customHoverTooltip.innerHTML = tooltipText;
                  customHoverTooltip.style.display = 'block';
                }
                if (baseCountry) {
                  updateMapHighlight(baseCountry, highlightColor);
                }
              });
              el.addEventListener('mouseout', () => {
                if (tooltipText) customHoverTooltip.style.display = 'none';
                updateMapHighlight(null, null);
              });
            });
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
    };
  });
</script>

<div class="map-wrapper" style="height: {mapHeight};" class:is-sticky={isZoomSticky}>
  <div bind:this={mapDiv} id="map" style="height: 100%; width: 100%;"></div>
  <div bind:this={customHoverTooltip} id="custom-hover-tooltip"></div>
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
                {#if exporter.base_country}
                  <span style="font-size: 10px; color: #555; font-style: italic;"> (based in {exporter.base_country})</span>
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

  #custom-hover-tooltip {
    position: fixed;
    display: none;
    background-color: black;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: .85em;
    z-index: 10001;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
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
    :global(.custom-tooltip .tooltip-importers li),
    :global(.custom-tooltip .tooltip-exporters li),
    .mobile-tooltip .tooltip-amount,
    :global(.custom-tooltip .tooltip-amount) { font-size: 9px; }
  }

  :global(.leaflet-bar) { border: none !important; background: #ffffff !important; box-shadow: 0 1px 5px rgba(0,0,0,0.4) !important; border-radius: 8px !important; }
  :global(.leaflet-control-zoom a) { width: 30px !important; height: 30px !important; line-height: 30px !important; background: transparent !important; color: #333333 !important; font-size: 22px !important; font-weight: normal !important; border: none !important; border-radius: 0 !important; box-shadow: none !important; text-shadow: none !important; transition: background-color 0.16s ease-out; }
  :global(.leaflet-control-zoom-in) { border-top-left-radius: 8px !important; border-top-right-radius: 8px !important; border-bottom: 1px solid #cccccc !important; }
  :global(.leaflet-control-zoom-out) { margin-top: 0 !important; border-bottom-left-radius: 8px !important; border-bottom-right-radius: 8px !important; }
  :global(.leaflet-control-zoom a:hover) { background-color: #f4f4f4 !important; transform: none; }

  /* --- DESKTOP ZOOM CONTROL STYLES --- */
  @media (min-width: 601px) {
    /* Default state: controls are positioned normally within the map div */
    :global(.leaflet-control-zoom) {
      left: 25px; 
      z-index: 1001; 
    }
    
    /* When the wrapper has the .is-sticky class, we make the controls fixed */
    .map-wrapper.is-sticky :global(.leaflet-control-zoom) {
      position: fixed !important;
      top: 20px; /* Position from top of the screen */
    }
    
    /* Add the red outline/border to the control's container */
    :global(.leaflet-control-zoom.leaflet-bar) {
      border: 2px solid #e63946 !important;
    }

    /* Target the individual + and - buttons to make them bigger */
    :global(.leaflet-control-zoom a) {
      width: 35px !important;
      height: 35px !important;
      line-height: 35px !important;
    }
  }
</style>