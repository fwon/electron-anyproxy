
console.log('entry');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;
const remoteApi = remote.require('./main-api.js');
// ipcRenderer.on('recorder-ready', (event, res) => {

// });
global.remoteApi = remoteApi;
global.ipcRenderer = ipcRenderer;