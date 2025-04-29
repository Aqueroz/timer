const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: () => ipcRenderer.invoke("load-data"),
  exportData: (data) => ipcRenderer.invoke("export-data", data),
  importData: () => ipcRenderer.invoke("import-data")
})

