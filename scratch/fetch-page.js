const http = require('http');

const steps = [3, 4, 5, 6];

function fetchStep(stepIndex) {
  if (stepIndex >= steps.length) return;
  const step = steps[stepIndex];
  
  http.get(`http://localhost:3001/onboarding/step/${step}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`STEP ${step} STATUS:`, res.statusCode);
      // Find if there is any error message in the output
      if (res.statusCode !== 200) {
        console.log(`STEP ${step} ERROR:`, data.slice(0, 500));
      } else {
        console.log(`STEP ${step} OK, length:`, data.length);
      }
      fetchStep(stepIndex + 1);
    });
  }).on('error', (err) => {
    console.error(`Error fetching step ${step}:`, err.message);
    fetchStep(stepIndex + 1);
  });
}

fetchStep(0);
