<script>
	import { onMount, onDestroy } from 'svelte';

	export let cityData;

	let mapContainer;
	let map;

	onMount(async () => {
		if (typeof window === 'undefined') return;

		const L = (await import('leaflet')).default;
		await import('overlapping-marker-spiderfier-leaflet');
		const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;

		map = L.map(mapContainer).setView([25, 0], 3);

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
			maxZoom: 19,
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
		}).addTo(map);

		const oms = new OverlappingMarkerSpiderfier(map, {
			keepSpiderfied: true,
			spiderfyDistanceMultiplier: 4
		});

		function getAutoScaleFactor(data, desiredMaxRadius, baseRadius) {
			const maxValue = Math.max(...data.map(d => d.value || 0));
			const maxValueSqrt = Math.sqrt(maxValue);
			if (maxValueSqrt === 0) return 0;
			return (desiredMaxRadius - baseRadius) / maxValueSqrt;
		}

		function getCircleRadius(amount, scaleFactor, baseRadius) {
			return baseRadius + (Math.sqrt(amount) * scaleFactor);
		}

		function getResponsiveMaxRadius() {
			const width = window.innerWidth;
			if (width > 1200) return 35;
			if (width > 992) return 30;
			if (width > 768) return 25;
			if (width > 480) return 20;
			return 15;
		}

		function getMinWidth(width, minWidth = 8) {
			return width > 0 && width < minWidth ? minWidth : width;
		}

		const baseRadius = 5;
		const maxRadius = getResponsiveMaxRadius();
		const scaleFactor = getAutoScaleFactor(cityData, maxRadius, baseRadius);

		cityData.forEach(countryData => {
			if (countryData.lat && countryData.long && countryData.value) {
				const latNum = countryData.lat;
				const lonNum = countryData.long;
				const valueNum = countryData.value;

				if (typeof latNum === 'number' && typeof lonNum === 'number' && typeof valueNum === 'number') {
					const circleRadius = getCircleRadius(valueNum, scaleFactor, baseRadius);
					if (circleRadius > 0) {
						const markerHtmlStyles = `
							background-color: #1434A4; border: 1.5px solid #000000;
							border-radius: 50%; opacity: 0.9;
							width: ${circleRadius * 2}px; height: ${circleRadius * 2}px;
							display: block;
						`;
						const customIcon = L.divIcon({
							className: "animated-marker",
							iconAnchor: [circleRadius, circleRadius],
							popupAnchor: [0, -circleRadius],
							html: `<span style="${markerHtmlStyles}"></span>`
						});

						const marker = L.marker([latNum, lonNum], { icon: customIcon });

						const maxExportValue = countryData.exporter_companies && countryData.exporter_companies.length > 0
							? Math.max(...countryData.exporter_companies.map(e => e.export_value || 0))
							: 0;

                            const exportersHTML = (countryData.exporter_companies && countryData.exporter_companies.length > 0)
  ? `<div class="exporters-section">
       <strong class="exporters-heading">Exporting Companies</strong>
       <div class="exporter-list">` +
      countryData.exporter_companies
        .slice()
        .sort((a, b) => (b.export_value || 0) - (a.export_value || 0))
        .map(exp => {
          const exportValue = exp.export_value || 0;
          const barWidthRaw = maxExportValue > 0 ? (exportValue / maxExportValue) * 100 : 0;
          const barWidth = getMinWidth(barWidthRaw);
          return `
            <div class="exporter-item">
              <span class="company-name">${exp.exporter_company || 'Unknown'}</span>
              <div class="company-bar" style="width: ${barWidth}px;"></div>
            </div>`;
        }).join('') +
      `</div>
     </div>`
  : `<div class="no-exporters">No exporters data</div>`;



  const importersHTML = (countryData.importers && countryData.importers.length > 0)
  ? `<div class="importers-section">
       <strong class="importers-heading">Importing Agencies</strong>
       <div class="exporter-list">` +
      countryData.importers
        .slice()
        .sort((a, b) => (b.import_value || 0) - (a.import_value || 0))
        .map(imp => {
          const importValue = imp.import_value || 0;
          const maxImportValue = Math.max(...countryData.importers.map(e => e.import_value || 0));
          const barWidthRaw = maxImportValue > 0 ? (importValue / maxImportValue) * 100 : 0;
          const barWidth = getMinWidth(barWidthRaw);
          return `
            <div class="exporter-item">
              <span class="company-name">${imp.importer_agency || 'Unknown'}</span>
              <div class="company-bar" style="width: ${barWidth}px;"></div>
            </div>`;
        }).join('') +
      `</div>
     </div>`
  : '';



						const popupContent = `
							<div class="custom-popup">
								<strong class="popup-title">${countryData.country}</strong><br>
                                <span>${valueNum.toLocaleString()}</span>
								<div class="fixed-bar"></div>
								${exportersHTML}
                                ${importersHTML}
							</div>
						`;

						marker.bindPopup(popupContent, { className: 'data-story-popup' });
						marker.addTo(map);

                        if (countryData.label_text) {
  const labelIcon = L.divIcon({
    className: 'label-icon',
    html: `<div class="circle-label">${countryData.label_text}</div>`,
    iconSize: null, // Let CSS handle size
  });

  const labelMarker = L.marker([latNum, lonNum], {
    icon: labelIcon,
    interactive: false // Prevent hover/click
  }).addTo(map);
}

						oms.addMarker(marker);
					}
				}
			}
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<style>
:global(.data-story-popup .leaflet-popup-content-wrapper) {
    background-color: rgba(43, 72, 95, 0.95) !important;
    color: #333 !important;
  border-radius: 10px !important;
  padding: 12px !important;
}

:global(.data-story-popup .leaflet-popup-tip) {
  background-color: #f0f0ff !important;
}

:global(.data-story-popup .popup-title) {
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 14px;  /* fix typo here */
  font-weight: bold;
  color: #dedfef;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  display: block;
  margin-bottom: 0px;  /* reduce space below */
}

:global(.data-story-popup .custom-popup > span) {
  font-size: 14px !important;  /* change 14px to whatever size you want */ /* change 14px to whatever size you want */
  line-height: 1.2;
  color: #dedfef;
  margin-top: -2;
}

  </style>
  

<div bind:this={mapContainer} style="height: 100%; width: 100%;"></div>

<slot />
