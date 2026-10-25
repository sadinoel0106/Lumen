require('./prepare-reader-extension.cjs').prepareReaderExtension();
require('./ensure-electron.cjs').ensureElectron();
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),cache=path.join(root,'build-cache'),tmp=path.join(root,'build-tmp');for(const p of [cache,tmp])fs.mkdirSync(p,{recursive:true});
const cli=path.join(path.dirname(require.resolve('electron-builder/package.json')),'cli.js');
const result=spawnSync(process.execPath,[cli,'--win','nsis','--x64','--config.electronDist='+path.join(root,'node_modules/electron/dist')],{cwd:root,stdio:'inherit',env:{...process.env,ELECTRON_BUILDER_CACHE:cache,TEMP:tmp,TMP:tmp}});process.exit(result.status??1);
