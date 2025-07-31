<script context="module">
    export const ssr = false;
  </script>
  
  <script>
    import { onMount, onDestroy } from 'svelte';
    import scrollama from 'scrollama';
  
    export let externalSteps = 0; // Number of external scrolly-step divs above this component
  
    const steps = [
      {
        id: 1,
        image: '/images/step1.gif',
        title: "1. Traffic Interception",
        text: "Copper Tap M odules clone unencrypted ethernet traffic from network links, providing a complete and passive copy of all data for analysis without impacting network performance."
      },
      {
        id: 2,
        image: '/images/step2.gif',
        title: "2. SSL Decryption",
        text: "The SSL decryption platform intercepts secure connections, decrypts the traffic using managed certificates, and forwards the plaintext data for inspection by security tools."
      },
      {
        id: 3,
        image: '/images/step3.png',
        title: "3. Behavior Analysis",
        text: "DeepProbe monitors analyze metadata patterns and content flows from the decrypted traffic, using machine learning to detect anomalies and identify potential threats in real-time."
      },
      {
        id: 4,
        image: '/images/step4.png',
        title: "4. Behavior Analysis",
        text: "Step:4  monitors analyze metadata patterns and content flows from the decrypted traffic, using machine learning to detect anomalies and identify potential threats in real-time."
      }
    ];
  
    let activeIndex = 0;
    let scroller;
  
    function handleStepEnter(response) {
      const i = response.index - externalSteps;
      if (i >= 0 && i < steps.length) {
        activeIndex = i;
      } else {
        activeIndex = null;
      }
    }
  
    function handleStepExit(response) {

      if (
        response.index === externalSteps + steps.length - 1 &&
        response.direction === 'down'
      ) {
        // Uncomment this if you want the last image to disappear
        // activeIndex = null;
      }
    }
  
    onMount(() => {
      scroller = scrollama();
  
      scroller
        .setup({
          step: '.scrolly-step',
          offset: 0.85,
          debug: false
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);
  
      const handleResize = () => scroller.resize();
      window.addEventListener('resize', handleResize);
  
      onDestroy(() => {
        window.removeEventListener('resize', handleResize);
        scroller.destroy();
      });
    });
  </script>
  
  <style>
    .scrolly-container {
      max-width: 700px;
      margin: 4rem auto;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      position: relative;
    }
  
    .graphic-container {
      position: sticky;
      top: 20vh;
      height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }
  
    .scrolly-steps {
      position: relative;
      z-index: 10;
    }
  
    .scrolly-step {
      margin-bottom: 90vh;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      opacity: 0.3;
      transform: translateY(15px);
      transition: all 0.4s ease-out;
    }
  
    .scrolly-step:first-child {
      margin-bottom: 50vh;
    }
  
    .scrolly-step:last-child {
      margin-bottom: 30vh;
    }
  
    .scrolly-step.active {
      opacity: 1;
      transform: translateY(0);
    }
  
    .graphic-container {
  position: sticky; /* change from relative to sticky */
  top: 20vh;
  height: 60vh;
  margin-bottom: 2rem;
  overflow: hidden;
}

.graphic-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  z-index: 0;
  transition: opacity 0.4s ease;
}

.graphic-image.active {
  opacity: 1;
  z-index: 1;
}


  
@media (max-width: 768px) {
  .graphic-container {
    position: sticky;
    top: 10vh;
    height: 40vh;
    margin-bottom: 1rem;
    width: 100%;
  }

  .scrolly-step {
    margin: 0 auto 4rem auto;
    width: 90%;
  }
}

  </style>
  
  <div class="scrolly-container">
    <!-- Sticky Graphic Area -->
    <div class="graphic-container">
      {#each steps as step, i (step.id)}
        <img
          src={step.image}
          alt={step.title}
          class="graphic-image"
          class:active={activeIndex === i}
        />
      {/each}
    </div>
  
    <!-- Scrollable Text Steps -->
    <div class="scrolly-steps">
      {#each steps as step, i (step.id)}
        <div
          class="scrolly-step"
          class:active={activeIndex === i}
        >
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </div>
      {/each}
    </div>
  </div>
  