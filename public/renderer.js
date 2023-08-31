const { ipcRenderer } = require('electron');

ipcRenderer.on('change-username', (_, username) => {
  const tiktokUrl = `https://www.tiktok.com/@${username}`;
  window.location.href = tiktokUrl;
});
