<!-- src/lib/components/Header.svelte -->
<script>
    import { base } from '$app/paths';
  </script>
  
  <div class="header-container">
      <!-- Left half with Logo -->
      <div class="header-half logo-side">
        <a href="{base}/" rel="noopener noreferrer">
          <img src="{base}/images/ds_logo.svg" alt="Your Company Logo" class="logo-image" />
        </a>
      </div>
    
      <!-- Right half with Image -->
      <div class="header-half image-side">
        <img src="{base}/images/header.gif" alt="A descriptive alt text" class="header-image" />
      </div>
  </div>
    
  <style>
      .header-container {
        display: flex;
        width: 100%;
        /* This makes the header take the full screen height. 
           Change this if you want a smaller header */
        height: 100vh; 
        overflow: hidden;
      }
    
      .header-half {
        flex: 1; /* This makes both halves take up 50% of the width */
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .logo-side {
        background-color: white;
        padding: 2rem;
        align-items: flex-start;
      }
    
      .logo-image {
        width: 100%;
        max-width: 300px; /* Adjust as needed */
      }
    
      .image-side {
        /* No extra styles needed here unless you want an overlay */
      }
    
      .header-image {
        width: 100%;
        height: 100%;
        object-fit: contain; /* This makes the image cover the area without stretching */
      }
  </style>