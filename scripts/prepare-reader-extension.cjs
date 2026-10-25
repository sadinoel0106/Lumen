const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function prepareReaderExtension(options = {}) {
  const source = path.resolve(options.source || process.env.LUMEN_EXTENSION_SOURCE || path.join(__dirname, '../vendor/reader-extension-source'));
  const target = path.resolve(options.target || path.join(__dirname, '../vendor/reader-extension'));
  const adapter = path.resolve(options.adapter || path.join(__dirname, 'extension-adapter'));
  if (source === target) throw new Error('Extension source and generated output must be different directories.');
  if (!fs.existsSync(path.join(source, 'manifest.json')) || !fs.existsSync(path.join(source, 'LICENSE'))) {
    throw new Error('Missing extension source or LICENSE. Restore vendor/reader-extension-source, or set LUMEN_EXTENSION_SOURCE to a complete source directory.');
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json'), 'utf8'));
  const originals = ['background.js', 'contentScript.js', 'sites.js'];
  const hashes = Object.fromEntries(originals.map(name => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join(source, name))).digest('hex')]));
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true, filter: p => !['.git', 'node_modules'].includes(path.basename(p)) });
  manifest.background = { ...manifest.background, service_worker: 'lumen-background.js' };
  fs.writeFileSync(path.join(target, 'manifest.json'), JSON.stringify(manifest, null, 2));
  for (const name of fs.readdirSync(adapter)) fs.copyFileSync(path.join(adapter, name), path.join(target, name));
  const integration = {
    source: 'Bundled Bypass Paywalls Clean source', version: manifest.version,
    sourceFilesUnmodified: hashes,
    adapter: ['lumen-background.js', 'lumen-compat.js', 'lumen-host.html', 'lumen-host.js'],
    license: 'MIT; original LICENSE preserved'
  };
  fs.writeFileSync(path.join(target, 'LUMEN-INTEGRATION.json'), JSON.stringify(integration, null, 2));
  return integration;
}

if (require.main === module) console.log('Prepared reader extension ' + prepareReaderExtension().version);
module.exports = { prepareReaderExtension };
