import { ipcRenderer } from 'electron'
declare global {
    interface Window {
        ipcRenderer:any;
    }
}

window.ipcRenderer = ipcRenderer
console.log('preload loaded')