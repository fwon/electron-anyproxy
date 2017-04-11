(function () {
    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;
    const remote = electron.remote;
    const remoteApi = remote.require('./main-api.js');
    const setting = remote.require('./setting.json');
    
    //only explose these variable
    global.remoteApi = remoteApi;
    global.ipcRenderer = ipcRenderer;
    global.setting = setting;
})();
