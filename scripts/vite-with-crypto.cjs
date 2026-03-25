#!/usr/bin/env node
const crypto = require('node:crypto');

if (typeof crypto.getRandomValues !== 'function' && crypto.webcrypto?.getRandomValues) {
  crypto.getRandomValues = crypto.webcrypto.getRandomValues.bind(crypto.webcrypto);
}

if (typeof globalThis.crypto === 'undefined' && crypto.webcrypto) {
  globalThis.crypto = crypto.webcrypto;
}

import('../node_modules/vite/bin/vite.js');
