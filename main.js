const electron = require('electron');
const menuTemplate = require('./menu.js');
const ipcMain = electron.ipcMain;
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
let loadingParams = {
    width: 580,
    height: 200,
    frame: false,
    show: false
};
let mainParams = {
    width: 1300,
    height: 780,
    icon: __dirname + '/icon.png',
    // titleBarStyle: 'hidden-inset',
    backgroundColor: '#fff',
    show: false
};

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow(mainParams);
    mainWindow.setTitle(require('./package.json').name);

    //setting in .vscode/launch.json
    if (process.env.NODE_ENV === 'development') {
        console.log('develop');
        mainWindow.loadURL('http://localhost:4000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL(`file://${__dirname}/client/index.html`); 
    }

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        if (loadingScreen) {
            loadingScreen.close();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createLoadingScreen() {
    loadingScreen = new BrowserWindow(Object.assign(loadingParams, {parent: mainWindow}));
    
    if (process.env.NODE_ENV === 'development') {
        loadingScreen.loadURL('http://localhost:4000/loading.html');
    } else {
        loadingScreen.loadURL(`file://${__dirname}/client/loading.html`);
    }
    
    loadingScreen.on('closed', () => loadingScreen = null);
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
}

function createMenu() {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
    createLoadingScreen();
    createWindow();
    createMenu();
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
