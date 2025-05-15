// This file is used to force Netlify to rebuild the entire site
// It contains a timestamp to ensure it's always different on each commit
console.log('Forcing rebuild at:', new Date().toISOString());
module.exports = { timestamp: new Date().toISOString() };
