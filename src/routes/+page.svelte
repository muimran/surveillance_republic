<script>
  import Map from '$lib/components/Map.svelte';
  import BarChart from '$lib/components/BarChart.svelte';
  import ExplainerScrolly from '$lib/components/ExplainerScrolly.svelte';
  import { page } from '$app/stores';

  export let data;

  // Dynamic URL handling
  const canonicalURL = "https://www.thedailystar.net/surveillance-republic";
  const socialImageURL = "https://www.thedailystar.net/images/surveillance-og.jpg";
  const yourTwitterHandle = "@DailyStarNews";
  
  // Publication dates
  const pubDate = new Date('2025-08-01').toISOString();
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>Surveillance Republic | The Daily Star</title>
  <meta name="description" content="‘Surveillance Republic’ is a data-driven investigation by Muhammad Imran, published in The Daily Star. It explores how surveillance technology is reshaping governance and civil liberties in Bangladesh." />
  <meta name="author" content="Muhammad Imran" />
  <meta name="keywords" content="Surveillance Republic, Muhammad Imran, The Daily Star, data journalism, Bangladesh, surveillance, civil liberties, visual storytelling, investigative reporting" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="Surveillance Republic | The Daily Star" />
  <meta property="og:description" content="A data-rich visual investigation into surveillance in Bangladesh, by Muhammad Imran." />
  <meta property="og:image" content={socialImageURL} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:type" content="article" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Surveillance Republic | The Daily Star" />
  <meta name="twitter:description" content="How surveillance technology is reshaping governance in Bangladesh. A data journalism piece by Muhammad Imran." />
  <meta name="twitter:image" content={socialImageURL} />
  <meta name="twitter:creator" content={yourTwitterHandle} />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalURL} />

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Surveillance Republic",
      "author": {
        "@type": "Person",
        "name": "Muhammad Imran",
        "url": "https://muhammadimran.me"
      },
      "publisher": {
        "@type": "Organization",
        "name": "The Daily Star",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.thedailystar.net/images/logo.png"
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
    .ds-body {
      padding: 0 5vw;
    }
  }

  .ds-body p {
    margin: 1.2em 0;
  }

  /* Accessibility improvements */
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
</style>

<!-- Accessibility Skip Link -->
<a href="#main-content" class="skip-to-content">Skip to main content</a>

<!-- ======================= MAIN CONTENT ======================= -->
<main id="main-content">
  <!-- Text above the Bar Chart -->
  <article class="ds-body">
    <p>From snooping devices carried in backpacks to locate people through their phones, to a massive infrastructure that can even intercept end-to-end encryption from a central command centre, the Awami League government had been on an increasingly aggressive trajectory towards building a powerful surveillance state.</p>
    <p>Between 2016 and 2024, the police, Rab, and the National Telecommunications Monitoring Centre collectively purchased surveillance equipment worth over Tk 1,135 crore, according to import data obtained from the National Board of Revenue.</p>
    <p>Rab acquired mobile and vehicle-mounted jammers, backpack IMSI catchers, and mobile communication analysers, allowing them to block signals and conduct surveillance on mobile activities of specific individuals.</p>
    <p>Bangladesh Police built a broader tactical surveillance capacity, and their purchases included high-end IMSI catchers, GPS trackers, satellite communication analysers, speaker recognition systems, and Man-in-the-Middle tools capable of intercepting encrypted communications and injecting spyware.</p>
    <p>NTMC, on the other hand, developed a sweeping infrastructure called the Integrated Lawful Interception System (ILIS) that can intercept, decrypt, inspect, and store enormous volumes of national internet and telecom traffic, enabling real-time, centralised surveillance across agencies.</p>
    <p>While the system can be used to prevent crimes, gather intelligence and neutralise threats to national security, experts warn that without transparency and due process, such a powerful surveillance system can be used to suppress political opponents and snoop on ordinary citizens in violation of their constitutional right to privacy.</p>
  </article>

  <!-- Bar Chart Component -->
  <section class="ds-body" aria-label="Surveillance spending data visualization">
    <BarChart data={data.spending} />
  </section>

  <!-- Continue text after Bar Chart -->

  <article class="ds-body">
    <h2>Mass surveillance</h2>
    <p>While Rab and the police were focusing on specific target-based surveillance, NTMC opted to build a mass surveillance infrastructure and installed an Integrated Lawful Interception System.</p>

    <p>By 2022, they purchased all the components necessary to monitor and intercept the everyday communications of citizens, store that data centrally, and ensure access by various law enforcement agencies.</p>
    
    <p>Of the Tk 1,135 crore spent on surveillance equipment by police, Rab and NTMC between 2016 and 2024, NTMC’s expenditure alone accounted for more than half (Tk 655 crore).</p>
    
    <p>A copy of the contract agreement shows that US-based Yaana Technologies and its UK subsidiary Yaana Limited helped NTMC to set up the ILIS infrastructure for Tk 546.7 crore.</p>
    
    <p>The platform, having 10 components, aims to “collect, collate, analyse and disseminate all information to law enforcing agencies that provides pinpoint targets who are actively and passively threatening national security,” reads the contract.</p>
    
    <p>The first two components are the mobile and data interception systems capable of intercepting “any individual’s all types of electronic communication” as well as data and internet communication “originating, terminating and passing through Bangladesh”.</p>
    
    <p>The third component is a mass data acquisition system capable of collecting all internet communication from the national gateway and national internet exchange levels.</p>
    
    <p>The fourth component allows all law enforcement agencies to monitor, intercept, and analyse any person’s communications across all connected networks and operators, all from a single control point.</p>
    
    <p>The fifth component, called a “unified target profiling system,” can collate all intercepted data, analyse communication patterns and give a “full 360 degree picture of any individual over time, place and communication platform”.</p>
  </article>

  <ExplainerScrolly />

  <!-- Text below the scrolly -->
  <article class="ds-body">
    <p>The sixth and seventh components are a call detail record analysis system and a geolocation system, respectively.</p>

    <p>The eighth and ninth components are a digital command centre inside the NTMC premises and an overall operation and management system.</p>
    
    <p>The 10th component includes an “active intrusion system” which can “stealthily capture from any target device, is not limited by encryption or any encoding mechanism, does not depend on user interaction to perform operation and presents all application, file and communication content,” contract documents show.</p>
    
    <p>This essentially meant capturing the whole device, according to experts.</p>
    
    <p>“The government injected malware into users’ devices using very benign apps that they may have downloaded to access services, and gained access such that they could essentially see the entire device. That is one of the primary ways in which harm was caused,” said Sabhanaz Rashid Diya, executive director of Tech Global Institute, a technology nonprofit which has long been studying the surveillance landscape of Bangladesh.</p>
    
    <p>“There was one malware that could track keyboard strokes, so it could see what you are typing. Another software could create a backdoor in iOS systems, read messages and download contacts,” claimed Diya.</p>
    
    <p>The last component of the ILIS involved a satellite phone interception system.</p>
    
    <p>The Daily Star shared the list of components purchased by the NTMC with its in-house network specialists. Using information about the components, they reconstructed the ILIS network (see the operational and network structure online) as outlined by its contract.</p>
  </article>


 

  <article class="ds-body">
    <h2>How the surveillance works</h2>
  <p>The surveillance with this system begins by intercepting data packets from the internet infrastructure, including undersea fibre optic cables, satellite systems, ISP routes, and telecom networks.</p>

<p>To do this, it uses two Copper Tap Modules (10/100/1000), which split incoming and outgoing data streams and sends them to monitoring ports. A Passive Fibre Tap mirrors high-speed fibre optic traffic and redirects it for analysis.</p>

<p>These feeds are then processed by DeepProbe units, which prepare the data for inspection.</p>

<p>The second step is the decryption of the encrypted traffic. SSL(secure sockets layer) is a way to keep data safe when it travels between a browser and a website by locking it with encryption.</p>

<p>The system uses an SSL Decryption Platform which intercepts secure connections, decrypts the traffic for inspection, then re-encrypts it before forwarding the data.</p>

<p>Data show NTMC purchased six DeepProbe monitor ports from Yaana, which identifies application usage (e.g., WhatsApp, Signal), timestamps, data volumes, IP addresses, communication types, and user behaviour patterns. A GSM/Signalling Network Monitoring Platform is also deployed to extract metadata from voice calls, SMS, and mobile internet traffic. This allows NTMC to build user profiles based on activity patterns, even without accessing message content.</p>

<p>Its Social Media Monitoring System, purchased from Ecomtrade Holdings Pte Ltd for Tk 45.11crore (45,11,36,037.19), is capable of tracking activity across platforms.</p>

<p>Kamal Shakil, the manager of foreign trade at Ecomtrade, told The Daily Star that this platform was procured from a Netherlands-based supplier and that they were only the reseller.</p>

<p>To store the large volume of data, NTMC acquired two DRS Hadoop Data Node Hardware units. GPS-disciplined NTP servers ensured all intercepted data was timestamped accurately and consistently across systems.</p>

<p>All these were permitted by as many as 22 laws, including the Bangladesh Telecommunications Regulation Act, 2001, said Diya.</p>

<p>"Bangladesh’s surveillance regime is rooted in colonial-era laws that permit spyware use, communication interception, and broad law enforcement access without adequate safeguards,” she said.</p>

<p>She called it a “security-first framework” and said that it “spans not just telecom and cyber laws, but also narcotics, anti-terrorism, trade regulations, and import controls—creating a system ripe for abuse.”</p>
</article>

  <!-- Map component -->
  <section aria-label="Surveillance locations map">
    <Map points={data.points} />
  </section>


  <!-- Final text section -->
  <article class="ds-body">
    <h2>Target-based surveillance</h2>
    <p>Import data obtained by this newspaper begins with the purchase of a radio frequency jammer by Rab in 2016, from Samel 90, a Bulgarian electronics and defence manufacturer.</p>

<p>A radio frequency jammer is not a surveillance device per se – it is a device that deliberately disrupts wireless communication by transmitting interfering signals on the same frequencies used by phones, GPS, or Wi-Fi, effectively blocking them.</p>

<p>However, it can silently thwart gatherings. On multiple occasions during the 15-year rule of the AL regime, BNP leaders, activists, and journalists reported that they were unable to place or receive calls from the rally spots.</p>

<p>In 2017, Rab bought a similar network jammer, but this one could be mounted on a vehicle.</p>

<p>The same year, police purchased an IMSI catcher from Cyprus-based Tiersec for Tk 8.7 crore.</p>

<p>An IMSI catcher, or International Mobile Subscriber Identity catcher, is a surveillance tool designed to monitor, locate, and occasionally intercept mobile phone activity. It operates by mimicking a real cell tower, causing nearby phones to connect to it rather than to an authentic cellular network. The IMSI is a unique number assigned to each mobile SIM card and is used to pinpoint a target within a larger crowd.</p>

<p>The police bought more IMSI catchers – one of them bike-mounted – in 2019 and 2022 from Canadian firm Octasic. In total, the police spent Tk 43 crore (431,182,731.5) on IMSI catchers, signifying police’s dependence on such snooping devices.</p>

<p>In 2019, they also purchased a mobile tracker server from a German supplier, cleared through Bangladeshi-owned, Singapore-based Panmark Impex.</p>

<p>Two years later, the police acquired a Man-in-the-Middle (MitM) System Detector and Locator — a specialised tool designed to intercept and monitor communications in real time.</p>

<p>The system works by mimicking trusted networks or devices to gain access to sensitive information, including phone calls, messages, emails, and online activity. It can sometimes also break through encrypted connections to expose protected data. Additionally, it can track the physical location of those being monitored.</p>

<p>In 2022, both police and Rab stocked up on their interception infrastructure.</p>

<p>That year, police purchased a Satcom Analyser produced by Swiss surveillance company ATECS AG via a Singaporean firm. A Satcom analyser is a tool that can be used to monitor, intercept, and analyse satellite-based communications, including satellite phones and terminals.</p>

<p>Rab, on the other hand, armed itself with a backpack IMSI catcher and two units of unspecified mobile communication analysers from Octasic. These analysers can generally track which devices are connecting to which networks, their unique identification numbers, phone numbers, locations, and collect information on call logs and text messages.</p>

<p>In 2023, police purchased a portable surveillance and signal intelligence (SIGINT) device from Cyprus-based company Delhaze Ltd. This device can detect, intercept and geolocate wireless communications like mobile phones, radios and satellite links.</p>

<p>The next year, it purchased an even powerful network-jammer – a drone that could sweep across an area blocking communications.</p>
  </article>



  <article class="ds-body">
    <h2>Israeli links and circumventing export bans</h2>
    <p>At least 13 companies from 16 countries exported surveillance equipment to Bangladesh.</p>

    <p>Seven of those countries – UK, US, Bulgaria, Czech Republic, Germany, Cyprus, France – prohibit export of surveillance equipment to repressive regimes.</p>
    
    <p>The US Department of Commerce’s Bureau of Industry and Security’s Entity List blocks American suppliers from providing technology to actors committing human rights abuses.</p>
    
    <p>The European Union’s export regulations also do not allow for surveillance sales to countries if there is proof that they could be used to commit human rights abuses.</p>
    
    <p>Many of these countries used clearing houses in Singapore, Cyprus and the United Arab Emirates to circumvent the export restrictions.</p>
    
    <p>Ecomtrade’s manager Shakil told this newspaper, “NTMC contacted the Netherlands-based supplier directly. The supplier did not want to export directly to Bangladesh and wanted to come through a reseller. We did not even know what the product being sent to Bangladesh was. We faced no restrictions in the Netherlands. Singapore provides transshipment facilities for many imports coming into Bangladesh.”</p>
    
    <p>At least three of the companies Bangladesh sourced from – Passitora, Teledyne and Tiersec have Israeli links.</p>
    
    <p>According to its company registration documents, Passitora Ltd, headquartered in Cyprus, is a rebranded version of WiSpear and is linked to Israeli intelligence networks through its founder, Tal Jonathan Dilian, a former Israeli army officer currently under US sanctions for rights abuse. One of its shareholders at the time of NTMC’s purchase was Mivtah Shamir Technologies, a Tel Aviv-based firm.</p>
    
    <p>The NTMC purchased a portable surveillance system from Passitora, costing Tk 50 crore.</p>
    
    <p>The company Tiersec is located in Cyprus, but its director is Israeli surveillance entrepreneur Yaron Baratz, and is effectively an Israeli company operating out of Cyprus.</p>
    
    <p>Baratz is the founder of an Israeli surveillance company called Septier.</p>
    
    <p>Teledyne FLIR Detection, Inc, a US manufacturer of thermal and surveillance technologies, maintains a research and development centre in Israel. Its subsidiaries and DVTEL Israel Ltd. are incorporated in Israel.</p>
    
    <p>While Yaana Technologies scored the most expensive bid,  Singapore-based, Bangladeshi-owned logistics firm Panmark Impex came in second place, having exported surveillance equipment worth Tk 366 crore. They sent 20 shipments, of which 75 percent went to the police and the rest went to Rab.</p>
    
    <p>The company’s Managing Director Khorshed Alam Chowdhury said that they are not legally liable for any abuse of the devices they supplied.</p>
    
    <p>“Our supplied equipment are tactical “IMSI’’ device having no surveillance capabilities; primarily used for finding convicted criminals. To tell you the truth, we are unaware of any instances where our supplied equipment has been used in any act of human rights violations,” said Chowdhury.</p>
    
    <p>“Even then, if any misuse of supplied equipment occurred towards violation of human rights in that case it is the end users who have to take the total responsibility for such an  occurrence,” he said.</p>
    
    <p>The third-highest value of surveillance goods was supplied by Passitora, while Singapore-based Ecomtrade Holdings Pte Ltd came in fourth place. Ecomtrade Holdings Pte Ltd is led by Bangladeshi-origin businessman Nurul Amin. [</p>
    
    <p>Nine other companies supplied goods in 23 shipments worth Tk 127 crore.</p>
    
    <p>Another supplying company, called Spider Digital Innovation FZE, despite being UAE-based, is Bangladeshi-led. The company belongs to Kazi Monirul Kabir, who was formerly the communications lead at two major telecom operators in Bangladesh. He is also the former country manager for Google in Bangladesh.</p>
    
    <p>They provided NTMC with at least 10 shipments, including the SSL decryption platform, and components for an internet traffic inspection system called the Gigamon GigaVUE-HC3 visibility platform.</p>
    
    <p>Kabir categorically stated that they never supplied systems that could be used for human rights abuses. Regarding the Gigamon platform, he said, “You have correctly noted that it gives network traffic visibility but the project is based on metadata collection, focusing solely on gathering metadata for visibility purposes. There is no option to collect user content.”</p>
    
    <p>“We explicitly state that we did not supply components for, nor were we involved in the construction of a broader network traffic visibility infrastructure that collects user content,” said Kabir, adding that there were no export restrictions.</p>
    
    <p>The Daily Star also emailed Yaana, Teledyne, Octasic, Vehere and Roya International, the company which had supplied goods from the Swiss surveillance company ATECS AG but did not receive any response.</p>
  </article>




</main>