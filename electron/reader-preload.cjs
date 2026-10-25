const {ipcRenderer}=require('electron');
function selection(){const sel=window.getSelection();const text=sel?.toString().trim();if(!text||text.length>1500)return;const node=sel.anchorNode?.parentElement;if(node?.closest('input,textarea,[contenteditable="true"]'))return;ipcRenderer.send('reader-selection',{text,context:node?.closest('p,blockquote,li')?.textContent?.trim().slice(0,2000)||''});}
window.addEventListener('mouseup',()=>setTimeout(selection,30));
window.addEventListener('keyup',e=>{if(e.key==='Shift')selection();});
