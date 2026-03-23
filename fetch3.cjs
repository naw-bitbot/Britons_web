const https = require('https');
https.get('https://www.google.com/search?q=site:britonsremovals.com+removals-to-spain-2.png', {headers: {'User-Agent': 'Mozilla/5.0'}}, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const matches = data.match(/https?:\/\/[^"'\s]*removals-to-spain-2\.png/gi);
    console.log('Matches 1:', matches);
  });
});
