const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');

const iconURL = path.join(__dirname, './assets/icons/capture.png');
let mainWindow;

app.isQuiting = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconURL,
    webPreferences: {
      preload: path.join(__dirname, './renderer/preload.js'),
    },
  });
  
  const appIcon = new Tray(iconURL);
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show App',
      click: () => {
        mainWindow.show();
      } 
    },
    { 
      label: 'Quit', click: () => {
        app.isQuiting = true;
        app.quit();
    } }
  ]);

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('close', (event) => {
    if(!app.isQuiting){
        event.preventDefault();
        mainWindow.hide();
        app.isQuiting = true;
    } else {
      mainWindow = null;
      app.quit();
    }

    return false;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-close-all', app.quit);

app.on('before-quit', () => {
  mainWindow.removeAllListeners('close');
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
