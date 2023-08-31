// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Node.js modüllerini kullanmak için gerekli olan özellik
      contextIsolation: false, // Güvenlik için varsayılan olarak etkinleştirilen özelliği devre dışı bırakıyoruz
      preload: path.join(__dirname, 'preload.js') // Electron 12+ sürümlerinde preload.js kullanımı zorunlu hale getirildi
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
