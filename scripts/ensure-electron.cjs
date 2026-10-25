// Electron 45 downloads its binary on first use rather than during npm ci.
// Its official downloader runs in a child Node process and can honor proxy settings.
function ensureElectron() {
  process.env.NODE_USE_ENV_PROXY ??= '1';
  return require('electron');
}

if (require.main === module) console.log('Electron ready: ' + ensureElectron());
module.exports = { ensureElectron };
