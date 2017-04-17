module.exports = {
    ap: {
        bigtab: {
            a: '抓包列表',
            b: '拦截修改',
            c: '接口Mock'
        },
        menubtn: {
            starttip: '启动代理服务器',
            stoptip: '关闭代理服务器',
            cleartip: '清空列表',
            showlist: '抓包列表',
            catip: '下载证书',
            cabtn: '证书'
        },
        menuset: {
            port: '端口',
            global: '全局代理',
            throttle: '限速(kb/s)',
            save: '保存',
            restart: '重启'
        },
        menumsg: {
            proxy: '代理地址',
            notopen: '未开启代理',
            tips: '提示'
        },

        rulelist: {
            addbtn: '添加规则',
            title1: '状态',
            title2: '规则',
            title3: '操作',
            editbtn: '编辑',
            delbtn: '删除',
            cancelbtn: '取消',
            usebtn: '应用',
            tip: '注意：应用规则后要重新启动代理'
        },
        rulepop: {
            title: '规则编辑',
            sample: '导入样例',
            sample1: '修改请求数据',
            sample2: '修改请求头',
            sample3: '修改请求目标地址',
            sample4: '修改请求协议',
            sample5: '修改返回内容并延迟',
            sample6: '修改返回头',
            sample7: '修改返回状态码',
            sample8: '使用本地数据',
            name: '名称（自定义）',
            content: '规则代码',
            cancelbtn: '取消',
            savebtn: '保存'
        },

        mocklist: {
            addbtn: '添加项目',
            currentpro: '当前项目：',
            currenttip: '注意：切换项目或勾选接口后要重新启动代理',
            delprotip: '确定要删除该项目吗?',
            addapibtn: '添加接口',
            title1: '接口',
            title2: '操作',
            editbtn: '编辑',
            delbtn: '删除',
            delapitip: '确定要删除这个接口吗?'
        },
        mockpop: {
            title: '接口设置',
            cancelbtn: '取消',
            savebtn: '保存'
        },

        message: {
            MSG_HAD_OPEN_PROXY: '代理开启成功!',
            MSG_OPEN_PROXY_SUCCESS: '代理已开启',
            MSG_OPEN_PROXY_ERROR: '开启失败',
            MSG_HASNOT_OPEN_PROXY: '代理未开启!',
            MSG_CLOSE_PROXY_SUCCESS: '关闭成功',

            MSG_RULE_GET_FAIL: '样例获取失败',
            MSG_RULE_FORMAT_FAIL: '请正确填写',
            MSG_RULE_NAME_REPEAT: '规则名已存在',

            MSG_MOCK_PRO_EXIST: '项目已存在',
            MSG_MOCK_NAME_EMPTY: '项目名称不能为空',
            MSG_MOCK_CONFIRM_DEL: '确定要删除吗?',
            MSG_MOCK_SAVE_SUCCESS: '保存成功',
            MSG_MOCK_DEL_SUCCESS: '删除成功',


            MSG_CA_DOWN_SUCCESS: '证书下载成功，请双击安装',
            MSG_CA_EXIST: '证书已经存在',
            MSG_CA_DOWN_FAIL: '证书下载失败'
        }
    }
}