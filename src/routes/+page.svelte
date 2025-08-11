<script>
  import Map from '$lib/components/Map.svelte';
  import BarChart from '$lib/components/BarChart.svelte';
  import ExplainerScrolly from '$lib/components/ExplainerScrolly.svelte';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment'; // <-- FIX #1: Import the 'browser' check

  export let data;

  // --- START: DOCUMENT MODAL LOGIC ---

  // 1. Define your documents.
  const documents = [
    {
      previewImageSrc: `${base}/noa.png`, // Your portrait preview image
      pdfSrc: `${base}/noa.pdf`,      // The full PDF document
      caption: 'Agreement showing NTMC onboarding Yaana Technologies to establishing a massive surveillance platform'
    },
    {
      previewImageSrc: `${base}/ntmc.png`, // Your portrait preview image
      pdfSrc: `${base}/ntmc.pdf`,          // The full PDF document
      caption: 'Import document of NTMC'
    }
  ];

  // 2. State variables to control the modal
  let modalVisible = false;
  let selectedDocument = null;

  // 3. Functions to open and close the modal
  function openModal(doc) {
    selectedDocument = doc;
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
    selectedDocument = null;
  }

  // 4. Handle 'Escape' key press to close the modal
  function handleKeydown(event) {
    if (event.key === 'Escape' && modalVisible) {
      closeModal();
    }
  }
  // --- END: DOCUMENT MODAL LOGIC ---

  // Dynamic URL handling
  const canonicalURL = "https://www.thedailystar.net/surveillance-republic";
  const socialImageURL = "https://www.thedailystar.net/images/surveillance-og.jpg";
  const yourTwitterHandle = "@DailyStarNews";
  
  // Publication dates
  const pubDate = new Date('2025-08-11').toISOString();

  // --- Progress Bar Logic ---
  let scrollPercent = 0;

  function handleScroll() {
    // This function uses `document`, so it must only run in the browser
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      scrollPercent = (scrollTop / scrollHeight) * 100;
    } else {
      scrollPercent = 0;
    }
  }

  // --- FIX #2: Wrap all browser-specific code inside an `if (browser)` block ---
  // This ensures window/document are never accessed on the server.
  if (browser) {
    // Set initial scroll position and add event listeners only on the client
    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeydown);
  }

  // The onMount and onDestroy hooks are alternatives, but the `if (browser)` block is often cleaner for this use case.
  // We'll leave them here for completeness, though the listeners are now handled above.
  onMount(() => {
    // You could also move the `if (browser)` block content here.
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<!-- REMOVED: <svelte:window on:scroll... /> We handle this in the script now -->

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>Awami League Government's Secret Surveillance State | The Daily Star</title>
  <meta name="description" content="Awami League Government Phone Spying: From snooping devices carried in backpacks for locating people through their phones to a massive infrastructure that can intercept even end-to-end encryption from a central command centre, the Awami League government had been on an increasingly aggressive trajectory towards building a powerful surveillance state." />
  <meta name="author" content="Zyma Islam, Mohammad Suman, Mahmudul Hasan, Muhammad Imran, Martin Swapan Pandey" />
  <meta name="keywords" content="Surveillance Republic, The Daily Star, data journalism, Bangladesh, surveillance, civil liberties, visual storytelling, investigative reporting, Bangladesh government phone spying, Sheikh Hasina surveillance allegations, Bangladesh mass surveillance system, NTMC ILIS interception Bangladesh, Awami League surveillance scandal, Bangladesh privacy rights violation, IMSI catcher Bangladesh police, Lawful Telecommunication Interception Act Bangladesh, Yaana Technologies Bangladesh deal, RAB surveillance equipment Bangladesh" />
  
  <!-- Open Graph / Facebook / LinkedIn -->
  <meta property="og:title" content="Awami League Government's Secret Surveillance State | The Daily Star" />
  <meta property="og:description" content="Awami League Government Phone Spying: From snooping devices carried in backpacks for locating people through their phones to a massive infrastructure that can intercept even end-to-end encryption from a central command centre, the Awami League government had been on an increasingly aggressive trajectory towards building a powerful surveillance state." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://surveillancestate.thedailystar.net/" />
  <meta property="og:image" content="https://surveillancestate.thedailystar.net/images/header.gif" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />


  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Awami League Government's Secret Surveillance State | The Daily Star" />
  <meta name="twitter:description" content="Surveillance Republic, The Daily Star, data journalism, Bangladesh, surveillance, civil liberties, visual storytelling, investigative reporting, Bangladesh government phone spying, Sheikh Hasina surveillance allegations, Bangladesh mass surveillance system, NTMC ILIS interception Bangladesh, Awami League surveillance scandal, Bangladesh privacy rights violation, IMSI catcher Bangladesh police, Lawful Telecommunication Interception Act Bangladesh, Yaana Technologies Bangladesh deal, RAB surveillance equipment Bangladesh." />
  <meta name="twitter:image" content="https://surveillancestate.thedailystar.net/images/header.gif" />


  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalURL} />

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Surveillance State",
      "author": {
        "@type": "Person",
        "name": "Muhammad Imran",
        "url": "https://muhammadimran.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "The Daily Star",
        "logo": {
          "@type": "ImageObject",
          "url": "https://tds-images.thedailystar.net/sites/all/themes/sloth/logo.svg"
        }
      },
      "image": socialImageURL,
      "datePublished": pubDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalURL
      }
    }
  </script>
</svelte:head>

<style>
  /* --- Progress Bar Styles --- */
  .progress-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    height: 4px; 
    background-color: #e0e0e0;
  }
  .progress-bar {
    height: 100%;
    background-color: #b30000; 
  }

  /* --- Main Body Styles --- */
  .ds-body {
    max-width: 680px;
    margin: 2.5rem auto;
    font-family: 'Georgia', serif;
    font-size: 1.16rem;
    line-height: 1.5;
    color: #222;
    padding: 0 25px;
  }
  @media (max-width: 700px) {
    :global(.ds-body) {
      padding: 0 12px;
      font-size: 1.05rem;
    }
  }
  :global(.ds-body p) {
    margin: 1.2em 0;
  }
  
/* --- Drop Cap Style for the first paragraph --- */
/* --- Drop Cap Style for the first paragraph --- */
main article.ds-body:first-of-type p:first-of-type::first-letter {
  float: left;
  font-size: 3.5rem; /* Made font slightly smaller to fit in the box */
  line-height: 1;  /* Adjusted for better vertical alignment in the box */
  font-weight: 700;
  color: #ffffff; /* Changed letter color to white */
  background-color: rgba(204, 24, 24, 0.75); /* Red background with 70% opacity */
  padding: 0.5rem 1rem;      /* Added padding to create space inside the box */
  margin-right: 0.8rem;      /* Increased margin for more space next to the box */
  margin-top: 0.3rem;
  border-radius: 4px;        /* Added rounded corners to the box */
}

  /* --- Accessibility --- */
  .skip-to-content {
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background-color: #fff;
  }
  .skip-to-content:focus {
    left: 50%;
    transform: translateX(-50%);
  }

  /* --- Q&A Section Styles --- */
  .qa-section {
    background-color: #f8f9fa;
    border-left: 4px solid #b30000;
    padding: 1.5rem 2rem;
    margin: 2.5rem auto;
    border-radius: 3px;
  }
  .qa-section h2 { margin-top: 0; font-size: 1.4rem; }
  .qa-section p { margin: 0; font-size: 1.05rem; line-height: 1.6; }
  .qa-question { font-weight: 700; color: #343a40; margin-bottom: 0.5rem; }
  .qa-answer { color: #212529; margin-bottom: 2.5rem; }
  .qa-section p:last-of-type { margin-bottom: 0; }

  /* --- START: REUSABLE HIGHLIGHT BOX STYLE --- */
  .highlight-box {
    background-color: #f8f9fa;
    border-left: 4px solid #b30000;
    padding: 1.5rem 2rem;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    border-radius: 3px;
  }
  /* --- END: REUSABLE HIGHLIGHT BOX STYLE --- */

  /* --- START: DOCUMENT IMAGE & MODAL STYLES --- */
  .doc-image-grid {
    display: flex;
    gap: 1.5rem; /* Space between the two images */
    /* REMOVED: margin-top: 1.5rem; The parent's padding now handles the spacing. */
  }

  .doc-preview-item {
    flex: 1; /* This makes each item take up half the available space */
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0;
    background: none;
    transition: box-shadow 0.2s ease-in-out;
    min-width: 0; /* Prevents flexbox overflow issues */
  }
  
  .doc-preview-item:hover,
  .doc-preview-item:focus {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    outline: 2px solid #b30000;
    outline-offset: 2px;
  }

  .doc-preview-item img {
    width: 100%; /* Makes the image fill its container */
    height: auto; /* Maintains the image's aspect ratio */
    display: block;
    border-radius: 3px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(10, 10, 10, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    box-sizing: border-box;
  }

  .modal-content {
    background-color: #fff;
    border-radius: 5px;
    max-width: 90vw;
    max-height: 90vh;
    width: 1200px; /* Max width for large screens */
    height: 90vh;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }

  .modal-close-button {
    position: absolute;
    top: -35px; /* Position it outside the white box */
    right: 0;
    background: none;
    border: none;
    font-size: 2.5rem;
    color: #fff;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    font-weight: 200;
  }
  .modal-close-button:hover {
    color: #ccc;
  }

  .modal-body {
    flex-grow: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-body iframe {
    flex-grow: 1;
    border: 1px solid #ccc;
    width: 100%;
  }

  .modal-caption {
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 0.9rem;
    color: #555;
    text-align: center;
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    margin: 0;
  }
  /* --- END: DOCUMENT IMAGE & MODAL STYLES --- */
</style>

<!-- Main Progress Bar -->
<div class="progress-container">
  <div class="progress-bar" style="width: {scrollPercent}%" ></div> <!-- FIX: Added closing tag -->
</div>

<!-- Accessibility Skip Link -->
<a href="#main-content" class="skip-to-content">Skip to main content</a>

<!-- ======================= MODAL HTML (controlled by script) ======================= -->
{#if modalVisible}
  <!-- FIX: Added keyboard event and role for accessibility -->
  <div 
    class="modal-overlay" 
    on:click={closeModal} 
    on:keydown|self={handleKeydown}
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="modal-caption"
    tabindex="-1"
  >
    <div class="modal-content" on:click|stopPropagation>
      <button class="modal-close-button" on:click={closeModal} aria-label="Close document viewer">&times;</button>
      <div class="modal-body">
        <iframe src={selectedDocument.pdfSrc} title={selectedDocument.caption}></iframe>
        <p id="modal-caption" class="modal-caption">{selectedDocument.caption}</p>
      </div>
    </div>
  </div>
{/if}

<!-- ======================= MAIN CONTENT ======================= -->
<main id="main-content">
  <!-- Text above the Bar Chart -->
  <article class="ds-body">
    <p>From snooping devices carried in backpacks to locate people through their phones to a massive infrastructure that can intercept even end-to-end encryption from a central command centre, the Awami League government had been on an increasingly aggressive trajectory towards building a powerful surveillance state.&nbsp;</p>

    <p>Between 2016 and 2024, the National Telecommunications Monitoring Centre (NTMC), police and Rab collectively purchased surveillance equipment worth over Tk 1,382&nbsp; crore, according to import data and a contract agreement.</p>
    
    <p>Over the years, NTMC developed a sweeping infrastructure called "Integrated Lawful Interception System (ILIS)" that can intercept, decrypt, inspect, and store enormous volumes of national internet and telecom traffic, enabling real-time, centralised surveillance across agencies.</p>
    
    <p>Rab and police, on the other hand, acquired mostly target-based snooping devices.&nbsp;</p>
    
    <p>Such devices in Rab's possession include mobile and vehicle-mounted jammers, backpack IMSI catchers, and mobile communication analysers, allowing them to block signals and conduct surveillance on mobile activities of specific individuals, documents show.&nbsp;</p>
    
    <p>Police built a broader tactical surveillance capacity, and their purchases included high-end IMSI catchers, GPS trackers, satellite communication analysers, speaker recognition systems, and Man-in-the-Middle tools capable of intercepting encrypted communications and injecting spyware.</p>
    
    <p>The equipment listed and the total value calculated for this story are based on a limited dataset and imports recorded under specific Harmonised System (HS) codes. Similar products may have been imported under different HS codes, which are not reflected in this report.&nbsp;</p>
    
    <p>While surveillance systems are essential to prevent crimes, track criminals, gather intelligence and neutralise threats to national security, experts warn that without transparency and due process, such a powerful surveillance system can be abused to suppress political opponents and snoop on ordinary citizens in violation of their constitutional right to privacy.</p>
  </article>

  <!-- Bar Chart Component -->
  <section class="ds-body" aria-label="Surveillance spending data visualization">
    <BarChart data={data.spending} />
  </section>

  <!-- Continue text after Bar Chart -->
  <article class="ds-body">
    <h2>Mass surveillance system</h2>
    <p>While Rab and the police had been focusing on building specific target-based surveillance, NTMC opted to build a mass surveillance infrastructure by installing an "Integrated Lawful Interception System".&nbsp;&nbsp;</p>

    <p>By 2022, it purchased the components necessary to monitor and intercept the everyday communications of citizens, store that data centrally, and ensure access by various law enforcement agencies, documents show.&nbsp;&nbsp;</p>
    
    <p>Of the Tk 1,382 crore spent on surveillance equipment by NTMC, police and Rab between 2016 and 2024, NTMC's expenditure alone accounted for more than 65 percent&nbsp; (Tk 904.39 crore).</p>
    
    <p>A copy of a contract agreement shows that US-based Yaana Technologies and its UK subsidiary Yaana Limited helped NTMC to set up the ILIS infrastructure for Tk 546.7 crore.&nbsp;</p>
    
    <p>The ILIS platform, having 10 components, aims to "collect, collate, analyse and disseminate all information to law enforcing agencies that provides pinpoint targets who are actively and passively threatening national security," reads the contract.&nbsp;</p>
    
    <p>The first two components are the mobile and data interception systems capable of intercepting "any individual's all types of electronic communication" as well as data and internet communication "originating, terminating and passing through Bangladesh".&nbsp;</p>
    
    <p>The third component is a mass data acquisition system capable of collecting all internet communication from the national gateway and national internet exchange levels.&nbsp;</p>
    
    <p>The fourth component allows law enforcement agencies to monitor, intercept, and analyse any person's communications across all connected networks and operators, all from a single control point.&nbsp;</p>
    
    <p>The fifth component, called a "unified target profiling system," can collate all intercepted data, analyse communication patterns and give a "full 360 degree picture of any individual over time, place and communication platform".&nbsp;</p>
    
    <p>The sixth and seventh components are a call detail record analysis system and a geolocation system, respectively.&nbsp;</p>
    
    <p>The eighth and ninth components are a digital command centre inside the NTMC premises and an overall operation and management system.</p>
    
    <p>The 10th component includes an "active intrusion system" which can "stealthily capture from any target device, is not limited by encryption or any encoding mechanism, does not depend on user interaction to perform operation and presents all application, file and communication content," contract documents show.&nbsp;</p>
    
    <p>This essentially meant capturing the whole device, according to experts.&nbsp;&nbsp;</p>
    
    <p>Through this system the government can inject malware into users' devices using very benign apps that they may have downloaded to access services, and gain access such that the authorities can essentially see the entire device, said Sabhanaz Rashid Diya, executive director of Tech Global Institute, a technology nonprofit which has long been studying the surveillance landscape of Bangladesh.&nbsp;&nbsp;</p>
    
    <p>"There is one malware that can track keyboard strokes, so it can see what you are typing. Another software can create a backdoor in iOS systems, read messages and download contacts," she added.</p>
    
    <p>The last component of the ILIS also involved a satellite phone interception system.&nbsp;</p>
    
    <p>The Daily Star has no information on the extent to which citizens were targeted by this system during Sheikh Hasina's rule. It is also unclear how the system is being used at the moment.</p>
    
    <p>In a rewritten response to The Daily Star, NTMC admitted having installed the ILIS systems and said that some of its components are still in operation for intelligence gathering and investigation purposes.&nbsp;</p>
    
    <p>"As part of the reform process, NTMC, under the Ministry of Home Affairs, is working on formulating an Act/Ordinance related to Lawful Telecommunication Interception with special attention to Privacy of the Citizens and maintaining International Standard," it said.&nbsp;</p>
    
  </article>

  <ExplainerScrolly />

  <!-- Text below the scrolly -->
  <article class="ds-body">
    <h2>How the surveillance works</h2>
    <p>The Daily Star shared the list of components purchased by the NTMC with our in-house network specialists. Using information about the components, they <strong>r</strong>econstructed the ILIS network (see the operational and network structure online) as outlined by its contract.&nbsp;</p>

    <p>The surveillance with ILIS begins by intercepting data packets from the internet infrastructure, including undersea fibre optic cables, satellite systems, ISP routes, and telecom networks.&nbsp;</p>
    
    <p>To do this, it uses three&nbsp; Copper Tap Modules (10/100/1000), which split incoming and outgoing data streams and sends them to monitoring ports. Fibre Taps mirrors high-speed fibre optic traffic and redirects it for analysis.&nbsp;</p>
    
    <p>These feeds are then processed by DeepProbe units, which prepare the data for inspection.</p>
    
    <p>The second step is the decryption of the encrypted traffic. SSL(secure sockets layer) is a way to keep data safe when it travels between a browser and a website by locking it with encryption.</p>
    
    <p>The ILIS uses a SSL Decryption Platform which intercepts secure connections, decrypts the traffic for inspection, then re-encrypts it before forwarding the data.</p>
    
    <p>Data show NTMC purchased 15 DeepProbe monitor ports from Yaana, which identifies application usage (e.g., WhatsApp, Signal), timestamps, data volumes, IP addresses, communication types, and user behaviour patterns. A GSM/Signalling Network Monitoring The Platform is also deployed to extract metadata from voice calls, SMS, and mobile internet traffic. This allows NTMC to build user profiles based on activity patterns, even without accessing message content.</p>
    
    <p>Its Social Media Monitoring System, purchased from Ecomtrade Holdings Pte Ltd for Tk 45.11 crore, is capable of tracking activity across platforms.&nbsp;</p>
    
    <p>Kamal Shakil, the manager of foreign trade at Ecomtrade, told The Daily Star that this platform was procured from a Netherlands-based supplier and that they were only the reseller.&nbsp;</p>
    
    <p>To store the large volume of data, NTMC acquired two DRS Hadoop Data Node Hardware units. GPS-disciplined NTP servers ensured all intercepted data was timestamped accurately and consistently across systems.</p>
    
    <p>All these were permitted by as many as 22 laws, including the Bangladesh Telecommunications Regulation Act, 2001, said Diya.&nbsp;&nbsp;</p>
    
    <p>"Bangladesh's surveillance regime is rooted in colonial-era laws that permit spyware use, communication interception, and broad law enforcement access without adequate safeguards," she said.</p>
    
    <p>She called it a "security-first framework" and said that it "spans not just telecom and cyber laws, but also narcotics, anti-terrorism, trade regulations, and import controls—creating a system ripe for abuse."&nbsp;</p>
  </article>

  <!-- Q&A SECTION -->
  <article class="ds-body qa-section">
    <h2>NTMC's reply to our questions</h2>
  
    <p class="qa-question"><strong>TDS:</strong> What steps have been taken to take out the ILIS from operation?</p>
    <p class="qa-answer"><strong>NTMC:</strong> Lawful Telecommunication Interception Systems are technical platforms essential for law enforcement agencies, investigation agencies and intelligence agencies to collect necessary information to investigate cases and identify the accused. Countries around the world have such practice. NTMC established and maintains a few basic LI platforms to support mentioned agencies.</p>
  <br/>
    <p class="qa-question"><strong>TDS:</strong> NTMC had installed Deep Packet Inspection (DPI) devices for monitoring and filtering subscriber internet usage. Are these still operational in Data Centres 3 and 4?</p>
    <p class="qa-answer"><strong>NTMC:</strong> DPI devices are not in operation now. Their functionality is being tested. However, a few online betting sites prohibited by the government have been blocked as test purposes. The future usage of this system will depend on proper guidelines/policy.</p>  
    <br/>
    <p class="qa-question"><strong>TDS:</strong> In 2022, NTMC purchased a system from Intersec (France) that allowed NTMC to get instant, precise instant and historical location of individuals. Is the system installed by Intersec still active?</p>
    <p class="qa-answer"><strong>NTMC:</strong> Yes, the system is active now. Law enforcement agencies, investigation agencies and intelligence agencies utilise the service to locate the accused and victims. More importantly, 999 and Fire Services use this system to instantly locate the victims.</p> 
    <br/>
    <p class="qa-question"><strong>TDS:</strong> Does NTMC still pull customer data (Registration information, CDR, SMS content, NID, roaming status, recharge details, package details etc) using an API plugin provided by telecom operators? If yes, then do you obtain a warrant from a magistrate beforehand?</p>
    <p class="qa-answer"><strong>NTMC:</strong> As said before, law enforcement agencies, investigation agencies and intelligence agencies utilise the platform to investigate cases and identify the accused. Mentioned agencies complete necessary processes at their end before collecting information.</p>
  </article>
  


  <!-- Map component -->
  <section aria-label="Surveillance locations map">
    <Map points={data.points} />
  </section>

  <!-- Final text section -->
  <article class="ds-body">
    <h2>Target-based surveillance</h2>
    <p>Import data obtained by this newspaper begins with the purchase of a radio frequency jammer by Rab in 2016, from Samel 90, a Bulgarian electronics and defence manufacturer.&nbsp;</p>

    <p>A radio frequency jammer is not a surveillance device per se – it is a device that deliberately disrupts wireless communication by transmitting interfering signals on the same frequencies used by phones, GPS, or Wi-Fi, effectively blocking them.</p>
    
    <p>However, it can silently thwart gatherings. On multiple occasions during the 15-year rule of the Awami League rule, BNP leaders, activists, and journalists reported that they were unable to place or receive calls from the rally venues.</p>
    
    <p>In 2017, Rab bought a similar network jammer, but this one could be mounted on a vehicle.&nbsp;</p>
    
    <p>The same year, police purchased an IMSI catcher from Cyprus-based Tiersec.</p>
    
    <p>An IMSI catcher, or International Mobile Subscriber Identity catcher, is a surveillance tool designed to monitor, locate, and occasionally intercept mobile phone activity. It operates by mimicking a real cell tower, causing nearby phones to connect to it rather than to an authentic cellular network. The IMSI is a unique number assigned to each mobile SIM card and is used to pinpoint a target within a larger crowd.&nbsp;</p>
    
    <p>Import data show that the police bought more IMSI catchers – one of them bike-mounted – in 2019 and 2022 from Canadian firm Octasic. In total, the police spent Tk 43 crore on IMSI catchers, signifying police's dependence on such snooping devices.&nbsp;</p>
    
    <p>In 2019, they also purchased a mobile tracker server from a German supplier, cleared through Bangladeshi-owned, Singapore-based Panmark Impex.</p>
    
    <p>Two years later, the police acquired a Man-in-the-Middle (MitM) System Detector and Locator — a specialised tool designed to intercept and monitor communications in real time.&nbsp;</p>
    
    <p>The system works by mimicking trusted networks or devices to gain access to sensitive information, including phone calls, messages, emails, and online activity. It can sometimes also break through encrypted connections to expose protected data. Additionally, it can track the physical location of those being monitored.</p>
    
    <p>In 2022, both police and Rab stocked up on their interception infrastructure.&nbsp;</p>
    
    <p>That year, police purchased a Satcom Analyser produced by Swiss surveillance company ATECS AG via a Singaporean firm. A Satcom analyser is a tool that can be used to monitor, intercept, and analyse satellite-based communications, including satellite phones and terminals.&nbsp;</p>
    
    <p>Rab, on the other hand, armed itself with a backpack IMSI catcher and two units of unspecified mobile communication analysers from Octasic. These analysers can generally track which devices are connecting to which networks, their unique identification numbers, phone numbers, locations, and collect information on call logs and text messages.&nbsp;</p>
    
    <p>In 2023, police purchased a portable surveillance and signal intelligence (SIGINT) device from Cyprus-based company Delhaze Ltd. This device can detect, intercept and geolocate wireless communications like mobile phones, radios and satellite links.&nbsp;</p>
    
    <p>The next year, it purchased an even powerful network-jammer – a drone that could sweep across an area blocking communications.&nbsp;&nbsp;</p>
  </article>

  <!-- ============================================= -->
  <!-- == DOCUMENT PREVIEW SECTION == -->
  <!-- ============================================= -->
  <article class="ds-body highlight-box">


    <div class="doc-image-grid">
      {#each documents as doc}
        <button class="doc-preview-item" on:click={() => openModal(doc)}>
          <img src={doc.previewImageSrc} alt="Preview of {doc.caption}" />
        </button>
      {/each}
    </div>
  </article>
  <!-- ============================================= -->
  <!-- == END DOCUMENT PREVIEW SECTION == -->
  <!-- ============================================= -->

  <article class="ds-body">
    <h2>Circumventing export bans</h2>
    <p>At least 20 companies from 23 countries exported surveillance equipment to Bangladesh.&nbsp;</p>

    <p>Twelve of those countries – UK, US, Bulgaria, Czech Republic, Germany, Cyprus, France, Italy, Denmark, Netherlands, Poland, Belgium – prohibit export of surveillance equipment to repressive regimes.&nbsp;</p>

    <p>The US Department of Commerce's Bureau of Industry and Security's Entity List blocks American suppliers from providing technology to actors committing human rights abuses.&nbsp;</p>

    <p>The European Union's export regulations also do not allow for surveillance sales to countries if there is proof that they could be used to commit human rights abuses.&nbsp;</p>

    <p>Many of these countries used clearing houses in Singapore, Cyprus and the United Arab Emirates to circumvent the export restrictions.&nbsp;</p>

    <p>Kamal Shakil, the manager at Ecomtrade which supplied some surveillance equipment to NTMC, said, "NTMC contacted the Netherlands-based supplier directly. The supplier did not want to export directly to Bangladesh and wanted to come through a reseller. We did not even know what the product being sent to Bangladesh was. We faced no restrictions in the Netherlands. Singapore provides transshipment facilities for many imports coming into Bangladesh."&nbsp;</p>

    <p>At least three of the companies Bangladesh sourced from – Passitora, Teledyne and Tiersec – have Israeli links.&nbsp;</p>

    <p>According to its company registration documents, Passitora Ltd, headquartered in Cyprus, is a rebranded version of WiSpear and is linked to Israeli intelligence networks through its founder, Tal Jonathan Dilian, a former Israeli army officer currently under US sanctions for rights abuse. One of its directors at the time of NTMC's purchase was Mivtah Shamir Technologies, a Tel Aviv-based firm.&nbsp;</p>

    <p>The NTMC purchased a portable surveillance system from Passitora, costing Tk 52.1 crore.&nbsp;</p>

    <p>The company Tiersec is located in Cyprus, but its director is Israeli surveillance entrepreneur Yaron Baratz, and is effectively an Israeli company operating out of Cyprus.&nbsp;</p>

    <p>Baratz is the founder of an Israeli surveillance company called Septier.&nbsp;</p>

    <p>Teledyne FLIR Detection, Inc, a US manufacturer of thermal and surveillance technologies, maintains a research and development centre in Israel. Its subsidiaries and DVTEL Israel Ltd are incorporated in Israel.</p>

    <p>While Yaana Technologies scored the most expensive bid,&nbsp; Singapore-based, Bangladeshi-owned logistics firm Panmark Impex came in second place, having exported surveillance equipment worth Tk 366 crore. They sent 20 shipments, of which 75 percent went to the police and the rest went to Rab.&nbsp;</p>

    <p>The company's Managing Director Khorshed Alam Chowdhury said they are not legally liable for any abuse of the devices they supplied.&nbsp;</p>

    <p>"Our supplied equipment are tactical "IMSI'' device having no surveillance capabilities; primarily used for finding convicted criminals. To tell you the truth, we are unaware of any instances where our supplied equipment has been used in any act of human rights violations," said Chowdhury.&nbsp;</p>

    <p>"Even then, if any misuse of supplied equipment occurred towards violation of human rights in that case it is the end users who have to take the total responsibility for such an&nbsp; occurrence," he said.&nbsp;</p>

    <p>Singapore-based Ecomtrade Holdings Pte Ltd is in the top ten suppliers, providing Tk 45.1 crore of equipment. The company is led by Bangladeshi-origin businessman Nurul Amin.</p>

    <p>Sixteen other companies supplied goods in 146 shipments worth Tk 418 crore.&nbsp;</p>

    <p>One of those suppliers, called Spider Digital Innovation FZE, despite being UAE-based, is Bangladeshi-led. The company belongs to Kazi Monirul Kabir, who was formerly the communications lead at two major telecom operators in Bangladesh. He is also the former country manager for Google in Bangladesh.&nbsp;</p>

    <p>They provided NTMC with at least 30 shipments, including the SSL decryption platform, a covert surveillance tool that silently eavesdrops on mobile calls and data called Tactical Passive Cellular Interceptor, and components for an internet traffic inspection system called the Gigamon GigaVUE-HC3 visibility platform.&nbsp;</p>

    <p>Kabir categorically stated that they never supplied systems that could be used for human rights abuses. Regarding the Gigamon platform, he said, "You have correctly noted that it gives network traffic visibility, but the project is based on metadata collection, focusing solely on gathering metadata for visibility purposes. There is no option to collect user content."&nbsp;</p>

    <p>"We explicitly state that we did not supply components for, nor were we involved in the construction of a broader network traffic visibility infrastructure that collects user content," said Kabir, adding that there were no export restrictions.&nbsp;</p>

    <p>The Daily Star also emailed Yaana, Teledyne, Octasic, Vehere and Roya International, the company which had supplied goods from the Swiss surveillance company ATECS AG but did not receive any response. We also sent written questions to Rab and police, but they did not respond.&nbsp;</p>
  </article>
<br />

</main>