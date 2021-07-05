const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const { loadConfig } = require('./load-config');
const configPath = app.isPackaged ? path.join(process.resourcesPath, '/app/pinpon-monitor-config.json') : './app/pinpon-monitor-config.json';
const config = require(configPath);

let win;

function createWindow() {
  // const config = loadConfig();

  win = new BrowserWindow({
    x: config.window.x,
    y: config.window.y,
    width: config.window.width,
    height: config.window.height,
    center: config.window.center,
    kiosk: config.window.kiosk,
    'fullscreen': config.window.fullscreen,
    'frame': config.window.frame,
    backgroundColor: config.window.backgoundcolor,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  
  // load the dist folder from Angular
  const indexPath = `file://${app.isPackaged ? path.join(process.resourcesPath, '/app/dist/index.html') : path.join(__dirname, 'dist/index.html')}`;
  win.loadURL(indexPath);

  // Open the DevTools optionally
  if (config.debug) {
    win.webContents.openDevTools();
  }
  
  win.on('closed', () => {
    win = null;
  });

  if (config.window.maximize) {
    win.maximize();
  }

  if (config.window.minimize) {
    win.minimize();
  }

  if (!config.window.menubar) {
    win.removeMenu();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if(win === null) {
    createWindow();
  }
});

/**
 * AngularからIPC経由で設定情報を要求されたら設定情報を返す
 */
ipcMain.handle('get-config', (event, message) => {
  return config;
});

/**
 * AngularからIPC経由でウィンドウの復元
 */
ipcMain.handle('restore', (event, message) => {
  win.restore();
});

/*
app.whenReady()
.then(() => {
  globalShortcut.register('CommandOrControl+Q', () => {});
});

app.on('will-quit', () => {
  globalShortcut.unregister('CommandOrControl+Q');
});
*/
