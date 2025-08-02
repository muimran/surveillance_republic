<script>
    // --- 1. ADD THIS IMPORT ---
    import { base } from '$app/paths';
  
    /**
     * Prop for the GIF filename.
     * This is required. If not provided, the GIF will not be rendered.
     * @type {string | undefined}
     */
    export let gifFile;
  
    /**
     * Prop for the SVG filename.
     * This is required. If not provided, the SVG will not be rendered.
     * @type {string | undefined}
     */
    export let svgFile;
  </script>
  
  <div class="animation-artboard">
    
    {#if gifFile}
      <div class="animation-item">
        <!-- --- 2. ADD {base} TO THE PATH --- -->
        <img 
          src="{base}/images/{gifFile}" 
          alt="Top animation" 
        />
      </div>
    {/if}
  
    {#if svgFile}
      <div class="animation-item">
        <!-- --- 3. ADD {base} TO THE PATH --- -->
        <img 
          src="{base}/images/{svgFile}" 
          alt="Bottom animation" 
        />
      </div>
    {/if}
  
  </div>
  
  <style>
    .animation-artboard {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      /* --- START TWEAK (CRITICAL) --- */
      width: 100%;
      height: 100%; /* Make the artboard fill its container */
      max-width: none; /* Remove the old max-width limit */
      margin: 0;
      padding: 0;
      border: none;
      background-color: transparent;
      gap: 0; /* Remove the gap to maximize space */
      /* --- END TWEAK --- */
    }
  
    .animation-item {
      width: 100%;
      
      /* --- START TWEAK (CRITICAL) --- */
      /* This gives each item 50% of the available height */
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      /* --- END TWEAK --- */
    }
  
    .animation-item img {
      width: 100%;
      
      /* --- START TWEAK (CRITICAL) --- */
      height: 100%; /* The image should try to fill its item's height */
      display: block;
      /* This is the magic: scale down to fit without stretching */
      object-fit: contain; 
      /* --- END TWEAK --- */
    }
    /* --- THIS IS THE FIX --- */
/* Target the first .animation-item in the artboard */
.animation-artboard .animation-item:first-child {
  /* Push the eye down from the top */
  padding-top: 15vh; /* TWEAK THIS NUMBER */
}
  </style>