'use strict';
/**
 * proxy 的接口封装，用于主进程与渲染进程之间数据通信
 */
const util = require('./lib/util');
const ip = require('ip');
const packageInfo = require('./package.json');
const ProxyServer = require('./proxy.js').ProxyServer;
const path = require('path');
const fs = require('fs');
const mockjs = require('mockjs');
let ruleModule;
let mainProxy;

const ruleFile = __dirname + '/rules.json';
const ruleCustomPath = __dirname + '/rule_custom';
const ruleSamplePath = __dirname + '/rule_sample';

const mockProjectsFile = __dirname + '/mock-project.json';
const mockCustomPath = __dirname + '/mock_custom';

const certMgr = require('./proxy.js').utils.certMgr;
const exec = require('child_process').exec;

const MSG_HAD_OPEN_PROXY = 'MSG_HAD_OPEN_PROXY';
const MSG_OPEN_PROXY_SUCCESS = 'MSG_OPEN_PROXY_SUCCESS';
const MSG_OPEN_PROXY_ERROR = 'MSG_OPEN_PROXY_ERROR';
const MSG_HASNOT_OPEN_PROXY = 'MSG_HASNOT_OPEN_PROXY';
const MSG_CLOSE_PROXY_SUCCESS = 'MSG_CLOSE_PROXY_SUCCESS';

//获取rule文件
function getRuleModule(id) {
    if (!id) return null;
    const pathname = './rule_custom';
    const filename = 'custom_' + id + '.js';
    const filepath = path.resolve(pathname, filename);
    if (fs.existsSync(filepath)) {
        return require(filepath);
    } else {
        return null;
    }
}

//合并rule和mock(mock也是一种rule)
function combineRuleAndMock(ruleid, mocks) {
    let rules = getRuleModule(ruleid) || {};
    if (!mocks) return rules;
    //覆盖rules的beforeRequest
    return Object.assign(rules, {
        *beforeSendRequest(requestDetail) {
            //先调用rules的beforeRequest
            if (rules.beforeSendRequest) {
                rules.beforeSendRequest(requestDetail);
            }
            //再调用mock
            const reqOptions = requestDetail.requestOptions;
            let localResponse = null;
            mocks.forEach((item) => {
                let req = item.request;
                let res = item.response;
                let resHeader = res.headers.split(/[:;]/g);
                resHeader.pop();
                if (requestDetail.url.indexOf(req.url) === 0 &&
                    reqOptions.method.toLowerCase() === req.method.toLowerCase()) {
                    localResponse = {
                        statusCode: res.status,
                        header: util.getHeaderFromRawHeaders(resHeader),
                        body: JSON.stringify(mockjs.mock(JSON.parse(res.body)))
                    }
                }
            });
            if (localResponse) {
                return {
                    response: localResponse
                };
            }
        }
    });
    
}

//proxy工厂
function createProxy(options) {
    return mainProxy || new ProxyServer(Object.assign({
        rule: combineRuleAndMock(options.ruleid, options.mock),
        webInterface: {
            enable: false,
        },
        port: 8001,
        forceProxyHttps: true
    }, options));
}

//proxy回调
function proxyCbManager(action, options) {
    if (action === 'start') {
        return function(resolve, reject) {
            if (mainProxy) {
                resolve({
                    msg: MSG_HAD_OPEN_PROXY,
                    open: true,
                    ip: options.ip || ip.address(),
                    port: options.port
                });
            } else {
                console.log('create proxy')
                mainProxy = createProxy(options);

                mainProxy.on('ready', () => {
                    resolve({
                        msg: MSG_OPEN_PROXY_SUCCESS,
                        open: true,
                        ip: options.ip || ip.address(),
                        port: options.port
                    });
                });

                mainProxy.on('error', () => {
                    mainProxy = null;
                    reject({
                        msg: MSG_OPEN_PROXY_ERROR
                    })
                });

                mainProxy.start();
            }
        }
    } else if (action === 'stop') {
        return function(resolve, reject) {
            if (!mainProxy) {
                reject({
                    msg: MSG_HASNOT_OPEN_PROXY
                });
            } else {
                mainProxy.close();
                mainProxy = null;
                resolve({
                    msg: MSG_CLOSE_PROXY_SUCCESS
                });
            }
        }
    }
}

module.exports = {
    /**
     * recorder 相关接口
     */
    getSingleLog(id) {
        return new Promise((resolve, reject) => {
            if (global.recorder) {
                global.recorder.getSingleRecord(id, (err, data) => {
                    if (err) {
                        reject(err.toString());
                    } else {
                        resolve(data[0]);
                    }
                })
            } else {
                reject();
            }
        });
    },
    getlatestLog() {
        let self = this;
        return new Promise((resolve, reject) => {
            if (global.recorder) {
                global.recorder.getRecords(null, 10000, (err, docs) => {
                    if (err) {
                        reject(err.toString());
                    } else {
                        resolve(docs);
                    }
                });
            } else {
                reject();
            }
        });
        
    },
    fetchBody(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            global.recorder.getDecodedBody(id, (err, result) => {
                if (err || !result || !result.content) {
                    reject();
                } else if (result.type && result.type === 'image' && result.mime) {
                    resolve({
                        raw: true,
                        type: result.mime,
                        content: result.content
                    })
                } else {
                    resolve({
                        id: id,
                        type: result.type,
                        content: result.content
                    })
                }
            })
        });
    },
    clearRecorder() {
        // global.recorder && global.recorder.clear();
        //there is bug in anyproxy clear
    },
    offUpdate() {
        // global.recorder.off('update');
    },
    onUpdate(callback) {
        console.log('onUpdate');
        global.recorder.on('update', (data) => {
            callback(data);
        });
    },
    /**
     * 证书相关接口
     */
    generateRootCA(successCb, errorCb) {
        const isWin = /^win/.test(process.platform);
        if (!certMgr.ifRootCAFileExists()) {
            certMgr.generateRootCA((error, keyPath) => {
                if (!error) {
                    const certDir = path.dirname(keyPath);
                    console.log('The cert is generated at ', certDir);
                    if (isWin) {
                        exec('start .', {cwd: certDir});
                    } else {
                        exec('open .', {cwd: certDir});
                    }
                    successCb && successCb('success');
                } else {
                    errorCb && errorCb('error');
                    console.error('error when generating rootCA', error);
                }
            });
        } else {
            console.log('c');
            successCb && successCb('exist');
            const rootPath = util.getAnyProxyPath('certificates');
            if (!rootPath) return;
            if (isWin) {
                exec('start .', {cwd: rootPath});
            } else {
                exec('open .', {cwd: rootPath});
            }
        }
    },
    /**
     * 代理相关API
     */
    startProxy(options) {
        const startcb = proxyCbManager('start', options);
        return new Promise(startcb);
    },
    stopProxy(options) {
        const stopcb = proxyCbManager('stop');
        return new Promise(stopcb);
    },
    /**
     * 规则相关API
     */
    readRulesFromFile() {
        if (fs.existsSync(ruleFile)) {
            return fs.readFileSync(ruleFile, 'utf8');
        } else {
            return '[]';
        }
    },
    saveRulesIntoFile(rules) {
        return new Promise((resolve, reject) => {
            fs.writeFile(ruleFile, JSON.stringify(rules), 'utf8', (err) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    },
    deleteCustomRuleFile(id) {
        const filename = 'custom_' + id + '.js';
        const rulepath = path.resolve(ruleCustomPath, filename);
        if (fs.existsSync(rulepath)) {
            fs.unlink(rulepath, (err) => {
                if (err) throw err;
            });
        }
    },
    saveCustomRuleToFile(id, rule) {
        const filename = 'custom_' + id + '.js';
        if (!fs.existsSync(ruleCustomPath)) {
            fs.mkdir(ruleCustomPath);
        }
        
        const rulepath = path.resolve(ruleCustomPath, filename);

        fs.writeFile(rulepath, rule, 'utf8', (err) => {
            if (err) throw err;
        });
    },
    fetchCustomRule(id) {
        const filename = 'custom_' + id + '.js';
        const rulepath = path.resolve(ruleCustomPath, filename);
        return new Promise((resolve, reject) => {
            if (fs.existsSync(rulepath)) {
                fs.readFile(rulepath, (err, data) => {
                    if (err) {
                        reject('');
                    } else {
                        resolve(data.toString());
                    }
                });
            } else {
                reject('');
            }
        });
    },
    fetchSampleRule(rulename) {
        const filename = 'sample_' + rulename + '.js';
        const rulePath = path.resolve(ruleSamplePath, filename);
        return new Promise((resolve, reject) => {
            if (fs.existsSync(rulePath)) {
                fs.readFile(rulePath, 'utf8', (err, data) => {
                    if (err) {
                        reject('');
                    } else {
                        resolve(data.toString());
                    }
                });
            } else {
                reject('');
            }
        });
    },
    /**
     * Mock相关接口
     */
    getMockProjects() {
        if (fs.existsSync(mockProjectsFile)) {
            return fs.readFileSync(mockProjectsFile, 'utf8');
        } else {
            return '[]';
        }
    },
    saveMockProject(projects) {
        return new Promise((resolve, reject) => {
            fs.writeFile(mockProjectsFile, JSON.stringify(projects), 'utf8', (err) => {
                if (err) {
                    reject()
                } else {
                    resolve();
                }
            });
        });
    },
    getProjectPaths(id) {
        const filename = 'mock_' + id + '.js';
        const mockpath = path.resolve(mockCustomPath, filename);
        return new Promise((resolve, reject) => {
            if (fs.existsSync(mockpath)) {
                fs.readFile(mockpath, (err, data) => {
                    if (err) {
                        reject('');
                    } else {
                        resolve(data.toString());
                    }
                });
            } else {
                reject('');
            }
        });
    },
    saveProjectPaths(id, paths) {
        const filename = 'mock_' + id + '.js';
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(mockCustomPath)) {
                fs.mkdir(mockCustomPath);
            }
            
            const mockpath = path.resolve(mockCustomPath, filename);

            fs.writeFile(mockpath, JSON.stringify(paths), 'utf8', (err) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    },
}

