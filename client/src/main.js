import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import store from './store'
import router from './router'
import * as types from './store/mutation-types'
import _ from 'lodash'
import 'element-ui/lib/theme-default/index.css'

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
    router,
    render: h => h(App)
})