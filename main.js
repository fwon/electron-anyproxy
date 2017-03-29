const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 780,
        icon: __dirname + '/icon.png',
        titleBarStyle: 'hidden-inset',
        backgroundColor: '#fff'
    });

    mainWindow.loadURL(`file://${__dirname}/client/index.html`);

    // mainWindow.loadURL('http://localhost:4000');
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


app.on('ready', () => {
    createWindow();
    // setUpProxy();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
