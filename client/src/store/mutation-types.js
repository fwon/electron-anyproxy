/**
 * Mutations
 */
export const INCREMENT = 'INCREMENT';//default
export const TOGGLE_PROXY = 'TOGGLE_PROXY';//开关代理

export const UPDATE_RECORDER = 'UPDATE_RECORDER';//更新列表数据
export const CLEAR_RECORDER = 'CLEAR_RECORDER';//清除请求列表

export const CHANGE_RECORDER_FILTER = 'CHANGE_RECORDER_FILTER';//过滤器修改
export const CLEAR_RECORDER_FILTER = 'CLEAR_RECORDER_FILTER';//清除过滤器

export const SET_PROXY_IP = 'SET_PROXY_IP';//存储代理IP
export const SET_PROXY_PORT = 'SET_PROXY_PORT';//存储代理端口

export const INIT_PROXY_RULE = 'INIT_PROXY_RULE';//从本地初始化规则
export const STORE_PROXY_RULE = 'STORE_PROXY_RULE';//添加代理规则
export const MODIFY_PROXY_RULE = 'MODIFY_PROXY_RULE';//添加代理规则
export const DELETE_RULE = 'DELETE_RULE'//删除规则
export const TOGGLE_CURRENT_RULE = 'TOGGLE_CURRENT_RULE'; //切换当前运用规则

export const SET_SELECTED_MOCKPATH = 'SET_SELECTED_MOCKPATH';//设置mock接口

/**
 * Actions
 */
export const FETCH_BODY = 'FETCH_BODY'//获取请求内容