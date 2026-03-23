const https = require('https');
https.get('https://britonsremovals.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https?:\/\/[^"'\s]*removals-to-spain-2\.png/gi);
    const matches2 = data.match(/https?:\/\/[^"'\s]*britons-removals-storage-derby-2\.png/gi);
    console.log('Matches 1:', matches);
    console.log('Matches 2:', matches2);
  });
});
