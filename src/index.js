const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const remoteMain = require("@electron/remote/main")

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  remoteMain.enable(mainWindow.webContents)
  // Desative isso na versão final
  // mainWindow.webContents.openDevTools();
};

// Caminho seguro para salvar dados do usuário
const dataFilePath = path.join(app.getPath('userData'), 'data.json');

app.whenReady().then(() => {
  remoteMain.initialize()
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//exportar dados
ipcMain.handle('export-data', async (event, data) => {
  const { dialog } = require('electron');
  const { filePath } = await dialog.showSaveDialog({
    title: "Salvar dados",
    defaultPath: "data-timer.json",
    filters: [
      {
        name: "JSON",
        extensions: ["json"]
      }
    ]
  });

  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true };
    } catch (err) {
      console.error("Erro ao salvar o arquivo:", err);
      return { success: false, error: err.message };
    }
  }

  return { success: false, error: "Nenhum arquivo selecionado." };
});


//salvar os dados
ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (err) {
    console.error('Erro ao salvar dados:', err);
    return { success: false, error: err.message };
  }
});

//carregar os dados
ipcMain.handle('load-data', async () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler arquivo: ', err);
    return {};
  }
});

//importar dados
ipcMain.handle('import-data', async () => {
  const { dialog } = require('electron');
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Importar dados',
    properties: ['openFile'],
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      },
    ],
  });

  if (filePaths && filePaths[0]) {
    try {
      const fileData = fs.readFileSync(filePaths[0], 'utf-8');
      return { success: true, data: JSON.parse(fileData) };
    } catch (err) {
      console.error('Erro ao importar arquivo:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: false, error: 'Nenhum arquivo selecionado.' };
});
