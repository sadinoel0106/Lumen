const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { prepareReaderExtension } = require('../scripts/prepare-reader-extension.cjs');

test('extension preparation works from bundled source and preserves licensed original scripts', t => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'lumen-extension-build-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(target)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(target).startsWith('lumen-extension-build-'));
    fs.rmSync(target, { recursive: true, force: true });
  });
  const source = path.resolve(__dirname, '../vendor/reader-extension-source');
  const sourceManifest = fs.readFileSync(path.join(source, 'manifest.json'), 'utf8');
  const result = prepareReaderExtension({ source, target });
  const generated = JSON.parse(fs.readFileSync(path.join(target, 'manifest.json'), 'utf8'));
  assert.equal(generated.background.service_worker, 'lumen-background.js');
  assert.equal(fs.readFileSync(path.join(source, 'manifest.json'), 'utf8'), sourceManifest);
  for (const name of ['background.js', 'contentScript.js', 'sites.js', 'LICENSE']) {
    assert.deepEqual(fs.readFileSync(path.join(source, name)), fs.readFileSync(path.join(target, name)));
  }
  for (const [name, hash] of Object.entries(result.sourceFilesUnmodified)) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(target, name))).digest('hex'), hash);
  }
  for (const name of result.adapter) assert.ok(fs.existsSync(path.join(target, name)));
});

test('extension preparation rejects missing licensed source before generating output', () => {
  const target = path.join(os.tmpdir(), 'lumen-missing-' + crypto.randomUUID());
  assert.throws(() => prepareReaderExtension({ source: target + '-source', target }), /Missing extension source or LICENSE/);
  assert.equal(fs.existsSync(target), false);
});
