import Vue from 'vue'
import Router from 'vue-router'
import proxyNetwork from '../components/network.vue'
import proxyRule from '../components/rule.vue'
import proxyMock from '../components/mock.vue'

Vue.use(Router);

const routes = [
    {path: '/', component: proxyNetwork},
    {path: '/network', component: proxyNetwork},
    {path: '/rule', component: proxyRule},
    {path: '/mock', component: proxyMock}
];

export default new Router({
    routes
});