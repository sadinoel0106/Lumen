# Third-party notices

Lumen's own source code and documentation are licensed under the root [MIT License](LICENSE), copyright (c) 2026 sadinoel0106. Third-party works retain their original copyrights and licenses.

## Bundled extension source

`vendor/reader-extension-source/` contains the user-supplied Bypass Paywalls Clean 4.4.7.7 source distribution, copyright (c) 2020 magnolia1234, under MIT. Its original [LICENSE](vendor/reader-extension-source/LICENSE), [LICENSE.txt](vendor/reader-extension-source/LICENSE.txt), documentation and source files are preserved. The upstream project is identified in its original README as <https://gitflic.ru/project/magnolia1234/bypass-paywalls-chrome-clean>.

Lumen's compatibility code is in `scripts/extension-adapter/`. The preparation script copies the bundled original source, changes the generated manifest's background worker entry, and adds that adapter. It records SHA256 hashes of the unchanged background.js, contentScript.js and sites.js in the generated `LUMEN-INTEGRATION.json`. The generated copy, including the original license, is shipped in the Windows application resources.

## Direct npm dependencies and development tools

| Project | Version used | License | Upstream |
| --- | --- | --- | --- |
| Mozilla Readability | 0.6.0 | Apache-2.0 | <https://github.com/mozilla/readability> |
| LinkeDOM | 0.18.14 | ISC | <https://github.com/WebReflection/linkedom> |
| rss-parser | 3.13.0 | MIT | <https://github.com/bobby-brennan/rss-parser> |
| Electron | 45.0.0 | MIT, with separately licensed bundled components | <https://github.com/electron/electron> |
| electron-builder | 26.15.3 | MIT | <https://github.com/electron-userland/electron-builder> |
| Playwright | 1.61.1 | Apache-2.0 | <https://github.com/microsoft/playwright> |

`package-lock.json` records the complete dependency versions and available license metadata. Installing dependencies retrieves their original license files; preserve those files and any required notices when redistributing their code. Electron's distribution includes its own LICENSE and Chromium third-party notices, which must also be retained.

## Media, article metadata and external services

Publisher names, trademarks, article titles, excerpts, linked articles and external websites belong to their respective owners. The media metadata snapshots in `data/snapshot.json` and `data/newsroom-snapshot.json` retain source links and are not relicensed by Lumen's MIT License. The MIT License does not grant rights in publisher content or the external translation and ChatGPT services.
