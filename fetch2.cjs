const https = require('https');
https.get('https://britonsremovals.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/removals-to-spain-2/gi);
    const matches2 = data.match(/britons-removals-storage-derby-2/gi);
    console.log('Matches 1:', matches);
    console.log('Matches 2:', matches2);
  });
});
