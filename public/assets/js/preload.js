const { app, BrowserWindow } = require('electron');

let win;

const usernames = ['oyun_aze', 'growaz', 'slotaze'];


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  setInterval(() => {
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    win.loadURL(`https://www.tiktok.com/@${username}`);
  }, 10000);
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
