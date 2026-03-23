const https = require('https');
https.request('https://www.britonsremovals.com/wp-content/themes/britons/images/removals-to-spain-2.png', { method: 'HEAD' }, (res) => {
  console.log('Location 1:', res.headers.location);
}).end();
https.request('https://www.britonsremovals.com/wp-content/themes/britons/images/britons-removals-storage-derby-2.png', { method: 'HEAD' }, (res) => {
  console.log('Location 2:', res.headers.location);
}).end();
