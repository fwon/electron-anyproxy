import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import store from './store'
import * as types from './store/mutation-types'
import _ from 'lodash'

//全局插件
Vue.use(ElementUI);
Vue.use({
    install (Vue, options) {
        //添加实例方法
        Vue.prototype.$ipc = global.ipcRenderer || {};
        Vue.prototype.$remoteApi = global.remoteApi;
    }
});

new Vue({
    el: '#app',
    store,
    render: h => h(App)
    // created() {
    //     let self = this;

    //     //第一次主动抓取
    //     self.fetchRecorder();

    //     this.$ipc.on('proxy-reply', (event, res) => {
            
    //         if (res.open && res.ip && res.port) {
    //             self.$notify({
    //                 title: '代理已开启',
    //                 message: 'IP:' + res.ip + '  ' + 'PORT:' + res.port,
    //                 duration: 0,
    //                 type: 'success'
    //             });
    //             self.$store.commit(types.SET_PROXY_IP, res.ip);
    //             self.$store.commit(types.SET_PROXY_PORT, res.port);
    //         } else {
    //             self.$notify({
    //                 message: res.msg,
    //                 type: ['error','success'][res.success],
    //                 duration: 2000,
    //             });
    //         }

    //         if (res.open) {
    //             self.$emit('on-update-recorder');
    //         }
    //     });

    //     this.$once('on-update-recorder', () => {
    //         self.onUpdateRecorder();
    //     })
    // },
    // methods: {
    //     onUpdateRecorder() {
    //         console.log('listening')
    //         let self = this;
    //         //websocket listener
    //         this.$remoteApi.onUpdate((data) => {
    //             self.fetchRecorder();
    //         });
    //     },
    //     fetchRecorder: _.debounce(function() {
    //         let self = this;
    //         this.$remoteApi.getlatestLog().then((data) => {
    //             self.$store.commit(types.UPDATE_RECORDER, data);
    //         });
    //     }, 200)
    // }
})