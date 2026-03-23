const https = require('https');
const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const files = ['removals-to-spain-2.png', 'britons-removals-storage-derby-2.png'];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      if (res.statusCode === 200) {
        console.log('FOUND:', url);
        resolve(true);
      } else {
        resolve(false);
      }
    }).end();
  });
}

async function run() {
  for (const file of files) {
    let found = false;
    for (const year of years) {
      for (const month of months) {
        const url = `https://britonsremovals.com/wp-content/uploads/${year}/${month}/${file}`;
        if (await checkUrl(url)) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) {
      const url2 = `https://britonsremovals.com/wp-content/themes/britons/images/${file}`;
      if (await checkUrl(url2)) {
        found = true;
      }
    }
  }
}
run();
