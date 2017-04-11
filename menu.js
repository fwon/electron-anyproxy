const {app} = require('electron');
const fs = require('fs');
const defaultSetting = require('./setting.json');

const settingPath = __dirname + '/setting.json';

function settingLang(label, win) {
    let setting = require('./setting.json');
    const lang = setting.lang;
    if (label !== lang) {
        setting.lang = label;
        fs.writeFile(settingPath, JSON.stringify(setting), 'utf8', (err) => {
            if (err) {
                return;
            } else {
                win.reload();
            }
        });
    }
}

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'forcereload'
      },
    //   {
    //     role: 'toggledevtools'
    //   },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
          label: 'language',
          submenu: [
              {
                  label: 'en',
                  type: 'radio',
                  checked: defaultSetting.lang == 'en',
                  click(menuItem, browserWindow, event) {
                      settingLang(menuItem.label, browserWindow);
                  }
              },
              {
                  label: 'zh-CN',
                  type: 'radio',
                  checked: defaultSetting.lang == 'zh-CN',
                  click(menuItem, browserWindow, event) {
                      settingLang(menuItem.label, browserWindow);
                  }
              }
          ]
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://fwon.github.io/e-anyproxy/help.html') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

module.exports = template;