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
      title: 'Tapping National Gateways', text: 'To do this, the system collects all internet communication from the national gateway and national internet exchange levels. Copper Tap Modules splits incoming and outgoing data streams and sends them to separate monitoring ports. Meanwhile, a Fibre Tap mirrors high-speed fibre optic traffic and redirects it for analysis. These feeds are then processed by DeepProbe units, which prepare the data for inspection. The SSL decryption platform intercepts secure connections, decrypts the traffic using managed certificates, and forwards the plaintext data for inspection by security tools.'
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
    // Clamp index to valid range to prevent images from vanishing
    activeIndex = Math.max(0, Math.min(steps.length - 1, i));
  }

  function handleStepExit(response) {
    const i = response.index - externalSteps;
    if (response.direction === 'up' && i > 0 && i <= steps.length) {
      // When scrolling up, set activeIndex to the previous step
      activeIndex = Math.max(0, i - 1);
    } else if (response.direction === 'down' && i >= steps.length - 1) {
      // When scrolling down past the last step, keep the last step active
      activeIndex = steps.length - 1;
    }
  }

  onMount(() => {
    scroller = scrollama();
    scroller
      .setup({
        step: '.scrolly-step',
        offset: 0.5, // Adjusted for smoother transitions
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);

    const handleResize = () => scroller.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scroller.destroy();
    };
  });
</script>

<style>
  .scrolly-container {
    max-width: 700px;
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
    margin: 0 auto 2rem;
  }

  .scrolly-steps {
    position: relative;
    z-index: 10;
    padding: 1rem 0;
  }
  
  .scrolly-step {
    margin-bottom: 80vh;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
    padding: 1.5rem 2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    opacity: 0.3;
    transform: translateY(15px);
    transition: all 0.4s ease-out;
  }
  
  .scrolly-step.active {
    opacity: 1;
    transform: translateY(0);
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: #1a1a1a;
    font-size: 1.4rem;
    font-weight: 600;
  }
  
  p {
    margin-bottom: 0;
    color: #444;
    line-height: 1.65;
    font-size: 1rem;
  }

  .graphic-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

  @media (max-width: 768px) {
    h3 {
      font-size: 1.15rem;
    }
    p {
      font-size: 0.9rem;
    }
    .scrolly-step {
      padding: 1.25rem 1.5rem;
    }
  }
</style>

<div class="scrolly-container">
  <div class="graphic-container">
    {#if activeIndex !== null}
      {#key activeIndex}
        <div class="graphic-wrapper" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
          {#if steps[activeIndex].animated}
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