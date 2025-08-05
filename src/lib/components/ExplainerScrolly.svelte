<script context="module">
  export const ssr = false;
</script>

<script>
  import StepAnimations from './StepAnimations.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';
  import { fade } from 'svelte/transition';
  import scrollama from 'scrollama';

  export let externalSteps = 0;

  const steps = [
    {
      id: 1, animated: true, gifFile: 'eye.gif', svgFile: 'step1.svg',
      title: 'Traffic Interception', text: 'Intercept all types of electronic, data and mobile communication systems originating, terminating and passing through Bangladesh. This includes phone calls and text messages transmitted via both cell phone and messaging applications, as well as, locations.'
    },
    {
      id: 2, animated: true, gifFile: 'eye.gif', svgFile: 'step2.svg',
      title: 'Tapping National Gateways', text: 'To do this, the system collects all internet communication from the national gateway and national internet exchange levels. Copper Tap Modules splits incoming and outgoing data streams and sends them to separate monitoring ports. Meanwhile, a Passive Fibre Tap mirrors high-speed fibre optic traffic and redirects it for analysis. These feeds are then processed by DeepProbe units, which prepare the data for inspection.The SSL decryption platform intercepts secure connections, decrypts the traffic using managed certificates, and forwards the plaintext data for inspection by security tools.'
    },
    {
      id: 3, animated: false, image: `${base}/images/step3.png`,
      title: 'Decryption and Target Profiling', text: 'The DeepProbe units identify which application is being used (e.g., WhatsApp, Signal), timestamps, data volumes, IP addresses, communication types, and user behaviour patterns. Meanwhile, a GSM/Signalling Network Monitoring Platform extracts metadata from voice calls, SMS, and mobile internet traffic. These allow NTMC to build user profiles based on activity patterns, even without accessing message content. In case of encrypted data, a SSL Decryption Platform decrypts secure connections and then re-encrypts it before forwarding the data.'
    },
    {
      id: 4, animated: false, image: `${base}/images/step4.png`,
      title: 'Mass Storage and Mass Surveillance', text: 'A digital command centre inside the NTMC premises collects and collates all the intercepted information in massive volumes. All law enforcement agencies can access this server.'
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
    if (response.index === externalSteps + steps.length - 1 && response.direction === 'down') {
      // activeIndex = null;
    }
  }

  onMount(() => {
    scroller = scrollama();
    scroller
      .setup({
        step: '.scrolly-step',
        offset: 1,
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
    max-width: 700px; /* This remains the outer boundary */
    margin: 4rem auto;
    margin-top: 1rem;
    margin-bottom: 0rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    position: relative;
  }
  .graphic-container {
    position: sticky;
    top: 0vh;
    height: 65vh;
    width: 90%;
    max-width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
  }
  .scrolly-steps {
    position: relative;
    z-index: 10;
    padding: 1rem 0;
  }
  
  .scrolly-step {
    /* --- CORE FUNCTIONALITY --- */
    margin-bottom: 80vh; /* This large margin drives the scrollytelling */
    
    /* --- READABILITY & LAYOUT (IMPROVED) --- */
    max-width: 550px; /* Limits the width of the box for better line length */
    margin-left: auto;   /* Centers the box within the scrolly-container */
    margin-right: auto;
    padding: 1.5rem 2rem; /* Added slightly more horizontal padding */
    
    /* --- VISUAL POLISH (IMPROVED) --- */
    background: rgba(255, 255, 255, 0.95); /* Slightly more opaque background */
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); /* Softer, more modern shadow */
    border-radius: 12px; /* A slightly more pronounced radius */
    border: 1px solid rgba(0, 0, 0, 0.05);
    
    /* --- TRANSITION --- */
    opacity: 0.3;
    transform: translateY(15px);
    transition: all 0.4s ease-out;
  }
  
  .scrolly-step.active {
    opacity: 1;
    transform: translateY(0);
  }

  /* --- TYPOGRAPHY (IMPROVED) --- */
  h3 {
    margin-top: 0;
    margin-bottom: 0.75rem; /* Added space between title and paragraph */
    color: #1a1a1a; /* A darker, richer black */
    font-size: 1.4rem;
    font-weight: 600; /* Bolder for stronger hierarchy */
  }
  
  p {
    margin-bottom: 0;
    color: #444;
    line-height: 1.65; /* Increased for better readability in paragraphs */
    font-size: 1rem;
  }

  /* --- Graphic specific styles --- */
  .graphic-wrapper {
    width: 100%;
    height: 100%;
  }
  .graphic-image-static {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  :global(.graphic-wrapper .animation-artboard) {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background-color: transparent !important;
  }

  /* START: --- MOBILE-SPECIFIC STYLES --- */
  @media (max-width: 768px) {
    /* Reduce the font size for the title */
    h3 {
      font-size: 1.15rem; /* Smaller than the desktop 1.4rem */
    }

    /* Reduce the font size for the paragraph text */
    p {
      font-size: 0.9rem;  /* Smaller than the desktop 1rem */
    }

    /* Optional: Reduce padding on mobile to give text more space */
    .scrolly-step {
      padding: 1.25rem 1.5rem;
    }
  }
  /* END: --- MOBILE-SPECIFIC STYLES --- */

</style>

<div class="scrolly-container">
  <div class="graphic-container">
    {#if activeIndex !== null}
      <div class="graphic-wrapper" in:fade={{ duration: 400 }}>
        {#if steps[activeIndex].animated}
          {#key 'animated-eye-group'}
            <StepAnimations 
              gifFile={steps[activeIndex].gifFile} 
              svgFile={steps[activeIndex].svgFile} 
            />
          {/key}
        {:else}
          <img
            src={steps[activeIndex].image}
            alt={steps[activeIndex].title}
            class="graphic-image-static"
          />
        {/if}
      </div>
    {/if}
  </div>

  <div class="scrolly-steps">
    {#each steps as step, i (step.id)}
      <div class="scrolly-step" class:active={activeIndex === i}>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    {/each}
  </div>
</div>