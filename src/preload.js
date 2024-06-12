const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMainReceipt: (content) => ipcRenderer.send('sendToMainReceipt', content),
  sendToMainKOT: (content) => ipcRenderer.send('sendToMainKOT', content),
  printReceipt: (content) => ipcRenderer.on('printReceipt', content),
  printKOT: (content) => ipcRenderer.on('printKOT', content),
  readyToPrint: (content) => ipcRenderer.send('readyToPrint', content),
  readyToKOT: (content) => ipcRenderer.send('readyToKOT', content)
})