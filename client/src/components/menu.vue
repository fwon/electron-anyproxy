<template>
    <div id="menu">
        <el-row :gutter="20">
        <!--
            <el-col :span="2">
                <div class="grid-content bg-purple">
                    <b>AnyProxy</b>
                </div>
            </el-col>
            -->
            <el-col :span="16">
                <div class="grid-content bg-extra-light-gray">
                    <el-tooltip class="item" effect="light" content="启动代理服务器" placement="bottom-end" v-if="!open">
                        <el-button type="success" icon="caret-right" @click="toggleProxy" v-if="!open"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="关闭代理服务器" placement="bottom-end" v-if="open">
                        <el-button type="danger" icon="close" @click="toggleProxy" v-if="open"></el-button>
                    </el-tooltip>                        
                    <el-tooltip class="item" effect="light" content="清除列表" placement="bottom-end">
                        <el-button type="warning" icon="delete" @click="clearRecorder"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="代理配置" placement="bottom-end">
                        <el-button type="primary" icon="menu" @click="setRule"></el-button>
                    </el-tooltip>
                    <proxy-filter></proxy-filter>
                    <!--
                    <span class="memu-https-status">
                        <label>HTTPS:</label>
                        <el-switch on-text="" off-text="" v-model="openHttps"></el-switch>
                    </span>
                    -->
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-extra-light-gray grid-content-right">
                    <el-popover
                    ref="setting"
                    placement="bottom"
                    width="230"
                    v-model="visibleSetting">
                        <el-form ref="form" :model="setting" label-width="80px">
                            <el-form-item label="端口">
                                <el-input v-model="setting.port"></el-input>
                            </el-form-item>
                            <el-form-item label="全局代理">
                                <el-switch on-text="" off-text="" v-model="setting.global"></el-switch>
                            </el-form-item>
                            <el-form-item label="https">
                                <el-switch on-text="" off-text="" v-model="setting.forceProxyHttps"></el-switch>
                            </el-form-item>
                            <el-form-item label="限速(kb/s)">
                                <el-select
                                    v-model="setting.throttle"
                                    allow-create
                                    placeholder="No throttling">
                                    <el-option
                                        v-for="item in throttleOptions"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="menu-setting__btn">
                                <el-button @click="visibleSetting = false">保存</el-button>
                                <el-button type="success" @click="restartProxy">重启</el-button>
                            </el-form-item>
                        </el-form>
                    </el-popover>
                    <el-button type="primary" icon="setting" :plain="true" v-popover:setting></el-button>
                    <el-popover
                    ref="popovertips"
                    placement="bottom"
                    width="160"
                    v-model="visibleTips">
                        <div style="text-align: right; margin: 0">
                            <i class="el-icon-close" @click="visibleTips = false"></i>
                        </div>
                        <p v-if="proxyIp">代理地址：<br/><b>IP:</b> {{proxyIp}} <br/> <b>PORT:</b> {{proxyPort}}</p>
                        <p v-else>未开启代理</p>
                    </el-popover>
                    <el-button type="primary" icon="information" :plain="true" v-popover:popovertips></el-button>
                    <el-tooltip class="item" content="点击下载https证书" placement="bottom-end">
                        <el-button type="primary" :plain="true" @click="downloadRootCA">证书</el-button>
                    </el-tooltip>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import proxyFilter from './filter.vue';
import {mapState} from 'vuex';
import _ from 'lodash';
import * as types from '../store/mutation-types';

export default {
    data () {
        return {
            visibleSetting: false,
            visibleTips: false,
            openHttps: false,
            setting: {
                port: '8001',
                forceProxyHttps: true,
                global: false,
                throttle: null
            },
            throttleOptions: [
                {
                    label: 'GPRS(50kb/s)',
                    value: 50
                },
                {
                    label: 'Regular 2G(250kb/s)',
                    value: 250
                },
                {
                    label: 'Good 2G(450kb/s)',
                    value: 450
                },
                {
                    label: 'Regular 3G(750kb/s)',
                    value: 750
                },
                {
                    label: 'Good 3G(1.5Mb/s)',
                    value: 1536
                },
                {
                    label: 'Regular 4G(4Mb/s)',
                    value: 4096
                },
                {
                    label: 'DSL(2Mb/s)',
                    value: 2048
                },
                {
                    label: 'WiFi(30Mb/s)',
                    value: 30720
                },
            ]

        }
    },
    mounted() {
        // this.onUpdateRecorder();
    },
    computed: mapState({
        open: state => !!state.proxy_is_open,
        proxyPort: state => state.proxy_port,
        proxyIp: state => state.proxy_ip,
        currentRule: state => state.current_rule
    }),
    methods: {
        toggleProxy() {
            if (this.open) {
                this.stopProxy();
            } else {
                this.startProxy();
            }
            this.$store.commit(types.TOGGLE_PROXY);
        },
        startProxy() {
            const self = this;
            if (this.currentRule.id) {
                this.setting.ruleid = this.currentRule.id;
            }
            this.$remoteApi.startProxy(this.setting).then((res) => {
                self.$notify({
                    title: '代理已开启',
                    message: 'IP:' + res.ip + '  ' + 'PORT:' + res.port,
                    type: 'success',
                    duration: 2000,
                });
                self.$store.commit(types.SET_PROXY_IP, res.ip);
                self.$store.commit(types.SET_PROXY_PORT, res.port);
                self.onUpdateRecorder();
            }, (res) => {
                self.$notify({
                    message: res.msg,
                    type: 'error',
                    duration: 2000,
                });
            });
        },
        stopProxy() {
            const self = this;
            this.$remoteApi.stopProxy().then((res) => {
                self.$notify({
                    message: res.msg,
                    type: 'success',
                    duration: 2000,
                });
                self.$remoteApi.offUpdate();
            }, () => {
                self.$notify({
                    message: res.msg,
                    type: 'error',
                    duration: 2000,
                });
            });
        },
        restartProxy() {
            const self = this;
            this.$remoteApi.stopProxy().then((res) => {
                self.startProxy();
            });
        },
        clearRecorder() {
            this.$store.commit(types.CLEAR_RECORDER);
            // this.$remoteApi.clearRecorder();
        },
        setRule() {
            this.$store.commit(types.TOGGLE_RULE_PANEL);
        },
        downloadRootCA() {
            const h = this.$createElement;
            this.$remoteApi.generateRootCA((msg) => {
                this.$notify({
                    title: '提示',
                    message: h('p', {style: 'color:green'}, msg),
                    duration: 2000
                });
            },(msg) => {
                this.$notify({
                    title: '提示',
                    message: h('p', {style: 'color:red'}, msg),
                    duration: 2000
                });
            });
        },
        onUpdateRecorder() {
            console.log('listening')
            const self = this;
            //websocket listener
            this.$remoteApi.onUpdate((data) => {
                self.fetchRecorder();
            });
        },
        fetchRecorder: _.debounce(function() {
            const self = this;
            console.log('fetch');
            this.$remoteApi.getlatestLog().then((data) => {
                self.$store.commit(types.UPDATE_RECORDER, data);
            });
        }, 200)
    },
    components: {
        proxyFilter
    }
}
</script>
<style>
#menu {
    margin-bottom: 20px;
}
.el-row {
margin-bottom: 20px;
&:last-child {
    margin-bottom: 0;
}
}
.el-col {
border-radius: 4px;
}
.bg-extra-light-gray {
background: #EFF2F7;
}
.grid-content {
border-radius: 4px;
height: 56px;
line-height: 56px;
}
.row-bg {
padding: 10px 0;
background-color: #f9fafc;
}

.grid-content > .el-button {
    margin: 0 10px;
}
.grid-content-right {
    text-align: right;
}

.memu-https-status {
    margin-left: 20px;
}

.el-switch__input:checked+.el-switch__core {
    border-color: #42d885;
    background-color: #42d885;
}
.el-form {
    margin-top: 10px;
}
.el-form-item {
    margin-bottom: 5px;
}
.menu-setting__btn > .el-form-item__content {
    text-align: center;
    margin-left: 0 !important;
}
.el-form-item__content .el-button {
    margin-top: 20px;
}
</style>