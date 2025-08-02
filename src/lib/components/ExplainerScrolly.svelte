<script context="module">
  export const ssr = false;
</script>

<script>
  // --- 1. FIXED IMPORT ---
  // We now import your component with its correct name: StepAnimations.svelte
  import StepAnimations from './StepAnimations.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';
  import { fade } from 'svelte/transition';
  import scrollama from 'scrollama';

  export let externalSteps = 0;

  // The 'steps' data array is correct
  const steps = [
    {
      id: 1, animated: true, gifFile: 'eye.gif', svgFile: 'step1.svg',
      title: '1. Traffic Interception', text: 'Intercept all types of electronic, data and mobile communication systems originating, terminating and passing through Bangladesh. This includes phone calls and text messages transmitted via both cell phone and messaging applications, as well as, locations.'
    },
    {
      id: 2, animated: true, gifFile: 'eye.gif', svgFile: 'step2.svg',
      title: '2. Tapping National Gateways', text: 'To do this, the system collects all internet communication from the national gateway and national internet exchange levels. Copper Tap Modules splits incoming and outgoing data streams and sends them to separate monitoring ports. Meanwhile, a Passive Fibre Tap mirrors high-speed fibre optic traffic and redirects it for analysis. These feeds are then processed by DeepProbe units, which prepare the data for inspection.The SSL decryption platform intercepts secure connections, decrypts the traffic using managed certificates, and forwards the plaintext data for inspection by security tools.'
    },
    {
      id: 3, animated: false, image: `${base}/images/step3.png`,
      title: '3. Decryption and Target Profiling', text: 'The DeepProbe units identify which application is being used (e.g., WhatsApp, Signal), timestamps, data volumes, IP addresses, communication types, and user behaviour patterns. Meanwhile, a GSM/Signalling Network Monitoring Platform extracts metadata from voice calls, SMS, and mobile internet traffic. These allow NTMC to build user profiles based on activity patterns, even without accessing message content. In case of encrypted data, a SSL Decryption Platform decrypts secure connections and then re-encrypts it before forwarding the data.'
    },
    {
      id: 4, animated: false, image: `${base}/images/step4.png`,
      title: '4. Mass Storage and Mass Surveillance', text: 'A digital command centre inside the NTMC premises collects and collates all the intercepted information in massive volumes. All law enforcement agencies can access this server.'
    }
  ];

  // --- FULL SCRIPT LOGIC (UNABBREVIATED) ---
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
        offset: 1, // This offset determines the trigger point
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
  /* All original styles are correct and included */
  .scrolly-container { max-width: 700px; margin: 4rem auto; margin-top: 1rem; margin-bottom: 0rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: relative; }
  .graphic-container { position: sticky; top: 20vh; height: 60vh; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
  .scrolly-steps { position: relative; z-index: 10; padding: 1rem 0; }
  
  /* THIS IS THE STEP DISTANCE MECHANISM. It creates a large gap between steps, forcing the user to scroll a significant distance. */
  .scrolly-step { margin-bottom: 80vh; padding: 1.5rem; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 8px; border: 1px solid rgba(0, 0, 0, 0.05); opacity: 0.3; transform: translateY(15px); transition: all 0.4s ease-out; }
  
  .scrolly-step.active { opacity: 1; transform: translateY(0); }
  h3 { margin-top: 0; color: #222; font-size: 1.3rem; }
  p { margin-bottom: 0; color: #444; line-height: 1.5; }

  /* Specific styles for this component's layout */
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
/* This is the corrected rule for ExplainerScrolly.svelte */
.graphic-container {
  position: sticky;
  top: 10vh;
  height: 65vh;
  width: 90%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* --- THE FIX IS HERE --- */
  /* This sets top-margin: 0, left/right-margin: auto, bottom-margin: 2rem */
  margin: 0 auto 2rem; 
}
</style>

<div class="scrolly-container">
  <div class="graphic-container">
    {#if activeIndex !== null}
    {#key (activeIndex === 0 || activeIndex === 1) ? 'animated-eye-group' : activeIndex}
    <div class="graphic-wrapper" in:fade={{ duration: 400 }}>
          
          {#if steps[activeIndex].animated}
            <!-- --- 2. FIXED COMPONENT USAGE --- -->
            <!-- Using the <StepAnimations> tag with the correct name -->
            <StepAnimations 
              gifFile={steps[activeIndex].gifFile} 
              svgFile={steps[activeIndex].svgFile} 
            />
          {:else}
            <img
              src={steps[activeIndex].image}
              alt={steps[activeIndex].title}
              class="graphic-image-static"
            />
          {/if}

        </div>
      {/key}
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