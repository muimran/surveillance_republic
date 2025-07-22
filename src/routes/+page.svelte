<script>
    import { onMount } from 'svelte';
    import Map from '$lib/components/Map.svelte';

    let cityData = null;

    onMount(async () => {
        try {
            // Use fetch to get the JSON file directly.
            const response = await fetch('/data_map.json'); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Use .json() to parse the response.
            const data = await response.json();
            
            cityData = data;

        } catch (error) {
            // This will catch errors like the file not being found (404) or invalid JSON.
            console.error('!!! ERROR loading or parsing data_map.json:', error);
        }
    });
</script>

<svelte:head>
    <title>Global Surveillance Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier-Leaflet/0.2.6/oms.css" />
</svelte:head>

<main>
        <!-- Introductory Text -->
        <section style="max-width: 700px; margin: 3rem auto; padding: 0 1rem; font-family: sans-serif;">
            <h1>How Countries Export Surveillance Technology</h1>
            <p>
                This visual map explores the global export of surveillance equipment. Scroll down to explore which countries are involved, who they’re exporting to, and which companies are behind the deals.
            </p>
        </section>
    <div id="map-container" style="height: 100vh; width: 100vw;">
        {#if cityData}
            <Map {cityData} />
        {:else}
            <p style="text-align: center; padding-top: 40px; font-family: sans-serif;">
                Loading map data...
            </p>
        {/if}
    </div>
    <section style="max-width: 700px; margin: 3rem auto; padding: 0 1rem; font-family: sans-serif;">

        <p>
            This visual map explores the global export of surveillance equipment. Scroll down to explore which countries are involved, who they’re exporting to, and which companies are behind the deals.
        </p>
    </section>
</main>

<style>

:global(body) {
    background-color: #D4DADC;
    margin: 0;
    font-family: sans-serif;
  }
    main {
        margin: 0;
        padding: 0;
    }
</style>