<script>
  import { base } from '$app/paths';
</script>

<div class="header-container">
    <div class="header-half logo-side">
      <div class="content-wrapper">
        <a href="https://www.thedailystar.net/" rel="noopener noreferrer">
          <img src={`${base}/images/ds_logo.svg`} alt="The Daily Star Logo" class="logo-image" />
        </a>
        
        
        <div class="embellishment">
          <hr class="separator-line" />
        </div>

        <p class="kicker">AL govt’s secret</p>
        
        <h1 class="article-headline">
          <span class="line-1">SURVEILLANCE</span>
          <span class="line-2">STATE</span>
        </h1>
        
        <p class="dek">
          The regime spent at least Tk 1,382cr to equip NTMC, Rab, police with surveillance infrastructure from 2016-24
        </p>

        <div class="credits-section">
            <!-- --- START: MODIFIED HTML STRUCTURE FOR CREDITS --- -->
            <div class="credit-line published-line">
                <span class="role">Published:</span>
                <span class="names">Monday, August 11, 2025</span>
            </div>
            <div class="credit-line">
                <span class="role">Reporting:</span>
                <span class="names">Zyma Islam, Mohammad Suman and Mahmudul Hasan</span>
            </div>
            <div class="credit-line">
                <span class="role">Data Visualisation:</span>
                <span class="names">Muhammad Imran</span>
            </div>
            <div class="credit-line">
                <span class="role">Graphics:</span>
                <span class="names">Anwar Sohel</span>
            </div>

            <div class="credit-line">
              <span class="role">Editing:</span>
              <span class="names">Martin Swapan Pandey</span>
          </div>
            <!-- --- END: MODIFIED HTML STRUCTURE --- -->
        </div>
      </div>
    </div>
  
    <div class="header-half image-side">
      <img src="{base}/images/header.gif" alt="An illustration of an eye made of circuitry." class="header-image" />
    </div>
</div>
  
<style>
/* --- BASE DESKTOP STYLES --- */
.header-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.header-half {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-side { background-color: white; }

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  box-sizing: border-box;
}

.logo-image { width: 200px; }
.embellishment { margin: 1.5rem 0; width: 100%; text-align: center; }
.separator-line { border: none; height: 1px; background-color: #e0e0e0; width: 60px; margin: 0 auto; }
.image-side { background-color: #f0f0f0; }
.header-image { width: 100%; height: 100%; object-fit: contain; }

.kicker {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 1.2rem; font-weight: 600; color: #555; text-transform: uppercase;
  letter-spacing: 0.05em; margin: 0 0 0.75rem 0; text-align: center;
}

.article-headline {
  text-align: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 700; color: #111; line-height: 1.1; margin: 0; width: 100%;
}
.article-headline span { display: block; }
.line-1 { font-size: 5rem; color: #c00007; margin-bottom: 0.05em; letter-spacing: -0.01em; }
.line-2 { font-size: 5rem; letter-spacing: -0.01em; }

.dek {
  font-family: 'Georgia', serif; font-size: 1.3rem; line-height: 1.4; color: #333;
  text-align: center; margin: 1.5rem 0 0 0; max-width: 450px;
}

/* --- CREDITS SECTION STYLES --- */
.credits-section {
    align-self: flex-start; 
    width: 100%;
    max-width: 500px; /* Increased max-width slightly to give more room */
    margin: 3rem auto 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 1rem;
    color: #2d3748;
}

/* --- START: CSS GRID FIX FOR ONE-LINE NAMES --- */
.credit-line {
    display: grid;
    /* This creates two columns: 
       'auto' makes the first column (role) only as wide as its content.
       '1fr' makes the second column (names) take up all the remaining space. */
    grid-template-columns: auto 1fr;
    gap: 0.75rem; /* The space between the role and the names */
    align-items: start; /* Aligns items to the top of the line */
}

.credit-line:not(:last-child) {
    margin-bottom: 0.5rem;
}
/* --- END: CSS GRID FIX --- */


.credits-section .published-line {
    margin-bottom: 2rem !important;
}

.role {
    font-weight: 600;
    color: #1a202c;
}

/* No special style needed for .names, it inherits from .credits-section */


/* --- MOBILE STYLES --- */
@media (max-width: 768px) {
  .header-container { flex-direction: column; height: auto; min-height: 100vh; }
  .header-half { width: 100%; }
  .image-side { order: -1; height: 40vh; min-height: 250px; }
  .header-image { object-fit: cover; }
  .content-wrapper { padding: 2rem 1.5rem 3rem 1.5rem; }
  .logo-image { width: 150px; }
  .embellishment { margin: 1rem 0; }
  .line-1, .line-2 { font-size: 10vw; }
  .dek { font-size: 1.1rem; }

  .credits-section {
    margin-top: 2.5rem;
    font-size: 0.9rem;
    max-width: 100%;
  }

  /* On mobile, we can stack them for better readability */
  .credit-line {
      display: block; /* Go back to stacking */
  }
  .names {
      display: block; /* Ensure names are on a new line below the role */
  }
  .role {
      margin-bottom: 0.25rem;
  }
}
</style>