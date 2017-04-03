import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import _ from 'lodash';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state: {
        ipc: 'abc',
        proxy_is_open: false,
        recorder_len: 0,
        recorder: [],   //存储用于显示列表的请求头
        // recorder_detail: [], //存储请求头详情
        recorder_filter: '',
        proxy_ip: '',
        proxy_port: '',
        proxy_rules: [], //代理配置规则
        current_rule: {}, //当前运用规则
        mock_paths: [] //mock接口
    },
    mutations: {
        [types.INCREMENT] (state) {
            console.log(state.ipc);
        },
        [types.TOGGLE_PROXY] (state) {
            state.proxy_is_open = !state.proxy_is_open;
        },
        [types.UPDATE_RECORDER] (state, newrecorder) {
            //渲染列表不存储所有值，提高渲染速度
            let filterRecorder = newrecorder.slice(
                state.recorder_len,
                newrecorder.length
            ).map((item) => {
                return _.pick(item, ['id', 'method', 'statusCode', 'host', 'path', 'mine', 'startTime'])
            })
            state.recorder = state.recorder.concat(filterRecorder);
            // state.recorder_detail = newrecorder.slice(
            //     newrecorder.length - state.recorder.length,
            //     newrecorder.length
            // );
            console.log('len:' + state.recorder_len);
            console.log('newlen:' + newrecorder.length);
            state.recorder_len += (newrecorder.length - state.recorder_len);
        },
        [types.CLEAR_RECORDER] (state) {
            console.log('clear')
            state.recorder = [];
        },
        [types.CHANGE_RECORDER_FILTER] (state, filter) {
            state.recorder_filter = filter;
        },
        [types.CLEAR_RECORDER_FILTER] (state) {
            state.recorder_filter = '';
        },
        [types.SET_PROXY_IP] (state, ip) {
            state.proxy_ip = ip;
        },
        [types.SET_PROXY_PORT] (state, port) {
            state.proxy_port = port;
        },
        [types.INIT_PROXY_RULE] (state, rules) {
            state.proxy_rules = rules;
        },
        [types.STORE_PROXY_RULE] (state, rule) {
            console.log('store')
            state.proxy_rules.push(rule);
        },
        [types.MODIFY_PROXY_RULE] (state, payload) {
            console.log('modify')
            state.proxy_rules.splice(payload.index, 1);
            state.proxy_rules.push(payload.rule);
        },
        [types.DELETE_RULE] (state, id) {
            state.proxy_rules = state.proxy_rules.filter((item) => {
                return item.id !== id;
            });
        },
        [types.TOGGLE_CURRENT_RULE] (state, rule) {
            state.current_rule = rule;
        },
        [types.SET_SELECTED_MOCKPATH] (state, paths) {
            state.mock_paths = paths;
        }
    },
    actions: {
        [types.FETCH_BODY] (context) {
        }
    },
    getters: {
        filterTableDate: state => {
            console.log('filter')
            if (state.recorder_filter) {
                return state.recorder.filter((item) => {
                    return (item.host + item.path).match(state.recorder_filter);
                });
            } else {
                return state.recorder;
            }
        }
    },
    modules: {},
    strict: debug
})