<slot />

<style>
  /* --- GLOBAL STYLES --- */



  :global(.exporter-list) {
  list-style: none;
  padding: 0;
  margin-top: 8px;
  color: #F97316;
  width: 100%;
}

:global(.exporter-item) {
  display: flex;
  flex-direction: row-reverse; /* Reverse order: bar first on the right, then name */
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  /* Set fixed width for the entire item (optional, but helps alignment) */
  width: 280px; 
}

:global(.company-bar) {
  height: 6px;
  min-width: 5px;
  background-color: #3b82f6;
  border-radius: 3px;
  flex-shrink: 0;
  margin-left: auto; /* Push bar to the right inside the flex item */
  transition: width 0.3s ease;
}

:global(.company-name) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Fix width for names so they align nicely */
  width: 150px;
  text-align: left;
  /* prevent growing */
  flex-shrink: 0;
}



:global(.exporters-section) {
  margin-top: 8px;
}

:global(.exporters-heading) {
  display: block;
  font-weight: 600;
  color: #f1c40f; /* matching your popup-title color */
  margin-bottom: 6px;
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-align: center;  /* <-- Add this line to center-align */
}


:global(.importers-section) {
  margin-top: 10px;
}

:global(.importers-heading) {
  display: block;
  font-weight: 600;
  color: #f1c40f;
  margin-bottom: 6px;
  font-size: 11px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}


:global(.circle-label) {
  position: relative;
  left: 30px; /* Push label to the right of the circle */
  top: -5px;  /* Align vertically */
  color: rgb(27, 3, 3)5, 24, 24);
  paddingrgb(10, 10, 10) 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none; /* Let clicks pass through */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}







  body { 
      margin: 0; 
      padding: 0; 
  }
  
  /* --- LEAFLET POPUP STYLES --- */
  /* Remove default Leaflet padding */
  .leaflet-popup-content {
      margin: 0;
      line-height: normal; /* Override default line height */
      overflow: visible !important;
  }

  .leaflet-popup-content-wrapper {
      background: #186abd;
      color: #850e0e;
      border-radius: 8px; /* Slightly larger radius */
      box-shadow: 0 3px 14px rgba(0,0,0,0.4);
      padding: 1px; /* Add 1px padding to contain the custom popup */
  }

  .leaflet-popup-tip {
      background: #2c3e50;
  }

  /* --- CUSTOM POPUP STYLES --- */
  .custom-popup {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 12px; /* Add padding inside our custom div */
      width: 20px;
      font-size: 13px;
      box-sizing: border-box;
            width: 420px;
  }

  .popup-title {
      font-size: 1.2em;
      color: #f10f4f;
  }

  .popup-hr {
      margin: 6px 0;
      border: 0;
      border-top: 1px solid #4a637e;
  }




</style>
