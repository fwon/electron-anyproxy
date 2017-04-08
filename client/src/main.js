import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import store from './store'
import VueRouter from 'vue-router'
import * as types from './store/mutation-types'
import _ from 'lodash'

import proxyNetwork from './components/network.vue'
import proxyRule from './components/rule.vue'
import proxyMock from './components/mock.vue'

//全局插件
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use({
    install (Vue, options) {
        //添加实例方法
        Vue.prototype.$ipc = global.ipcRenderer || {};
        Vue.prototype.$remoteApi = global.remoteApi;
    }
});

const routes = [
    {path: '/', component: proxyNetwork},
    {path: '/network', component: proxyNetwork},
    {path: '/rule', component: proxyRule},
    {path: '/mock', component: proxyMock}
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})