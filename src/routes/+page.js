// src/routes/+page.js

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  // --- This part stays the same ---
  // 1. Fetch the data for your map points
  const pointsResponse = await fetch('/data_map.json');
  const pointsData = await pointsResponse.json();

  // --- This is the new part ---
  // 2. Fetch the data for your new streamgraph chart
  const spendingResponse = await fetch('/spending_by_year.json');
  const spendingData = await spendingResponse.json();

  // --- This part is updated ---
  // 3. Return BOTH datasets so your page component can use them.
  // Your page will now have access to `data.points` and `data.spending`.
  return {
    points: pointsData,
    spending: spendingData 
  };
}