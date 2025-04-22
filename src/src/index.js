const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

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

  // Desative isso na versão final
  // mainWindow.webContents.openDevTools();
};

// Caminho seguro para salvar dados do usuário
const dataFilePath = path.join(app.getPath('userData'), 'data.json');

app.whenReady().then(() => {
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

ipcMain.on('save-data', (event, data) => {
  fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Erro ao salvar o arquivo:', err);
    } else {
      console.log('Dados salvos com sucesso!');
    }
  });
});

ipcMain.handle('load-data', async () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler arquivo: ', err);
    return {};
  }
});
