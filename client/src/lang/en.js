module.exports = {
    ap: {
        bigtab: {
            a: 'Records',
            b: 'Intercept',
            c: 'API Mock'
        },
        menubtn: {
            starttip: 'start recording',
            stoptip: 'stop recording',
            cleartip: 'clear records',
            showlist: 'show records',
            catip: 'download CA',
            cabtn: 'CA'
        },
        menuset: {
            port: 'port',
            global: 'global',
            throttle: 'throttle(kb/s)',
            save: 'save',
            restart: 'restart'
        },
        menumsg: {
            proxy: 'proxy message',
            notopen: 'proxy closed',
            tips: 'Tips'
        },

        rulelist: {
            addbtn: 'New Rule',
            title1: 'status',
            title2: 'rule',
            title3: 'operating',
            editbtn: 'edit',
            delbtn: 'delete',
            cancelbtn: 'cancel',
            usebtn: 'apply',
            tip: 'Notice: must restart proxy after choose'
        },
        rulepop: {
            title: 'Rule Editor',
            sample: 'Import Sample',
            sample1: 'Modify Request Data',
            sample2: 'Modify Request Headers',
            sample3: 'Modify Request Destination',
            sample4: 'Modify Request Protocal',
            sample5: 'Modify Response Data',
            sample6: 'Modify Response Headers',
            sample7: 'Modify Response Code',
            sample8: 'Response local Data',
            name: 'Name(custom)',
            content: 'Rule Code',
            cancelbtn: 'cancel',
            savebtn: 'save'
        },

        mocklist: {
            addbtn: 'New Project',
            currentpro: 'Current Project:',
            currenttip: 'Notice: You need to restart proxy after switch project or api',
            delprotip: 'Confirm to delete this project?',
            addapibtn: 'New Api',
            title1: 'Url',
            title2: 'Operating',
            editbtn: 'edit',
            delbtn: 'delete',
            delapitip: 'Confirm to delete this api?'
        },
        mockpop: {
            title: 'API setting',
            cancelbtn: 'cancel',
            savebtn: 'save'
        },

        message: {
            MSG_HAD_OPEN_PROXY: 'Proxy Opend!',
            MSG_OPEN_PROXY_SUCCESS: 'Started',
            MSG_OPEN_PROXY_ERROR: 'Failed',
            MSG_HASNOT_OPEN_PROXY: 'Proxy is disable!',
            MSG_CLOSE_PROXY_SUCCESS: 'Closed!',

            MSG_RULE_GET_FAIL: 'Get sample fail',
            MSG_RULE_FORMAT_FAIL: 'Please Fill Correctly',
            MSG_RULE_NAME_REPEAT: 'Cannot repeate same name',

            MSG_MOCK_PRO_EXIST: 'Project has exist',
            MSG_MOCK_NAME_EMPTY: 'Name cannot be empty',
            MSG_MOCK_CONFIRM_DEL: 'Confirm to delete?',
            MSG_MOCK_SAVE_SUCCESS: 'Save Success',
            MSG_MOCK_DEL_SUCCESS: 'Delete Success',


            MSG_CA_DOWN_SUCCESS: 'CA download, dbclick to install',
            MSG_CA_EXIST: 'CA had existed',
            MSG_CA_DOWN_FAIL: 'CA download failed'
        }
    }
}