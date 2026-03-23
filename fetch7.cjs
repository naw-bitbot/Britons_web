const https = require('https');
https.request('https://britonsremovals.com/wp-content/themes/britons/images/removals-to-spain-2.png', { method: 'HEAD' }, (res) => {
  console.log('Status 1:', res.statusCode);
}).end();
https.request('https://britonsremovals.com/wp-content/themes/britons/images/britons-removals-storage-derby-2.png', { method: 'HEAD' }, (res) => {
  console.log('Status 2:', res.statusCode);
}).end();
