const https = require('https');
const fs = require('fs');

const payload = JSON.stringify({
  manifestUrl: 'https://munnartools.vercel.app/manifest.json',
  appUrl: 'https://munnartools.vercel.app',
  packageId: 'app.vercel.munnartools.twa',
  name: 'TripTools',
  shortName: 'TripTools',
  themeColor: '#059669',
  backgroundColor: '#080c14',
  version: '1.0.0',
  versionCode: 1,
  signing: {
    file: null,
    alias: 'my-key-alias',
    signatureAlgorithm: 'SHA256withRSA'
  }
});

const options = {
  hostname: 'pwabuilder-cloudapk.azurewebsites.net',
  port: 443,
  path: '/generateAppPackage',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('Requesting APK from cloud build service...');
const req = https.request(options, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  if (res.statusCode === 200) {
    const fileStream = fs.createWriteStream('./public/TripTools.zip');
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log('Successfully saved to public/TripTools.zip');
    });
  } else {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { console.log('Response body:', data); });
  }
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(payload);
req.end();
