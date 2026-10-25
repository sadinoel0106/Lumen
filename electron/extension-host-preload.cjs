const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('lumenExtensionHost',{request:(method,args)=>ipcRenderer.invoke('reader-extension-rpc',method,args)});
