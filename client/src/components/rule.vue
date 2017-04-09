<template>
    <div id="rules_panel">
        <el-dialog title="规则编辑" v-model="eidtRuleStatus">
            <div class="rules-editor">
                <div class="rules-editor__sample">
                    <span>规则样例</span>
                    <el-select v-model="ruleName" placeholder="请选择" @change="ruleSelectChange">
                        <el-option
                        v-for="item in ruleOptions"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="rules-editor__name">
                    <span>名称(自定义)</span>
                    <el-input type="input" v-model="ruleKey.name"></el-input>
                </div>
                <div class="rules-editor__cont">
                    <p>规则内容</p>
                    <codemirror v-model="ruleValue" :options="editorOption"></codemirror>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelRule">取 消</el-button>
                <el-button type="primary"  @click="saveRule">保 存</el-button>
            </div>
        </el-dialog>
        <div class="rules-list">
            <el-button type="primary" :plain="true" icon="plus" @click="eidtRuleStatus = true">添加规则</el-button>
            <el-table
                :data="rulesData"
                border
                :row-class-name="tableRowClassName">
                <el-table-column
                type="index"
                label="状态"
                width="65">
                <template scope="scope">
                    <i class="el-icon-check"></i>
                </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="规则">
                </el-table-column>
                <el-table-column label="操作">
                <template scope="scope">
                    <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">
                    编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">
                    删除</el-button>
                    <el-button
                    size="small"
                    type="warning"
                    @click="handleCurrentChange(scope.$index, scope.row)"
                    v-if="currentSelectIndex === scope.$index">
                    取消</el-button>
                    <el-button
                    size="small"
                    type="success"
                    @click="handleCurrentChange(scope.$index, scope.row)"
                    v-else>
                    应用</el-button>
                    <el-tooltip class="item" effect="light" content="注意：应用规则后要重新启动代理" placement="right">
                    <i class="el-icon-information"></i>
                    </el-tooltip>
                </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import * as types from '../store/mutation-types';
import {mapState} from 'vuex';
import {codemirror} from 'vue-codemirror';
import util from '../lib/util';
import _ from 'lodash';

export default {
    data() {
        return {
            ruleKey: {      //样例的id和name列表
                id: '',
                name: ''
            },
            ruleName: '',   //样例规则的名称
            ruleValue: '',  //样例的代码字符串
            editorOption: {
                mode: 'text/javascript',
                lineNumbers: true,
                theme: 'monokai',
            },
            eidtRuleStatus: false,    //编辑规则弹窗
            currentSelectIndex: null, //目前选中的规则
            ruleOptions: [{
                value: 'modify_request_data',
                label: '修改请求数据'
            },{
                value: 'modify_request_header',
                label: '修改请求头'
            },{
                value: 'modify_request_path',
                label: '修改请求的目标地址'
            },{
                value: 'modify_request_protocol',
                label: '修改请求协议'
            },{
                value: 'modify_response_data',
                label: '修改返回内容并延迟'
            },{
                value: 'modify_response_header',
                label: '修改返回头'
            },{
                value: 'modify_response_statuscode',
                label: '修改返回状态码'
            },{
                value: 'use_local_response',
                label: '使用本地数据'
            }]
        }
    },
    components: {
        codemirror
    },
    computed: mapState({
        rulesData: state => state.proxy_rules
    }),
    mounted() {
        console.log('mouted')
        let rules = this.$remoteApi.readRulesFromFile();
        console.log(rules);
        try {
            this.$store.commit(types.INIT_PROXY_RULE, JSON.parse(rules));
        } catch(err) {
            console.log('PARSER ERROR');
        }
    },
    methods: {
        tableRowClassName(row, index) {
            if (index === this.currentSelectIndex) {
                return 'current-row';
            }
        },
        ruleSelectChange(val,label) {
            const self = this;
            console.log(val);
            console.log(label);
            this.$remoteApi.fetchSampleRule(val).then((data) => {
                self.ruleKey = {
                    id: util.generateUUIDv4(),
                    name: self.ruleOptions[_.findIndex(self.ruleOptions, ['value', val])]['label'],
                };
                self.ruleValue = data;
            }, (err) => {
                self.$notify({
                    message: '获取样例失败',
                    duration: 2000
                })
            });
        },
        cancelRule() {
            this.eidtRuleStatus = false;
            this.ruleKey = {id:'',name:''};
            this.ruleValue = '';
            // this.ruleName = '';
        },
        saveRule() {
            console.log('add')
            const self = this;
            const rule = {
                id: self.ruleKey.id || util.generateUUIDv4(),
                name: self.ruleKey.name,
            };
            if (!rule.name || !this.ruleValue) {
                this.$alert('无效规则，请重新填写');
                return;
            }
            const nameIndex = _.findIndex(this.rulesData, {name: rule.name});
            const idIndex = _.findIndex(this.rulesData, {id: rule.id});
            if (idIndex !== -1) {
                console.log('aaaa')
                this.$store.commit(types.MODIFY_PROXY_RULE, {
                    index: idIndex,
                    rule: rule
                });
                this.saveToFile(rule.id);
            } else {
                if (nameIndex !== -1) {
                    this.$alert('规则名不能重复');
                    return;
                } else {
                    this.$store.commit(types.STORE_PROXY_RULE, rule);
                    this.saveToFile(rule.id);
                }
            }
            this.eidtRuleStatus = false;
        },
        handleEdit(index, row) {
            console.log(row);
            this.eidtRuleStatus = true;
            this.ruleKey = Object.assign({}, row);
            //从本地获取规则文件内容
            this.$remoteApi.fetchCustomRule(row.id).then((data) => {
                this.ruleValue = data;
            });
        },
        handleDelete(index, row) {
            const id = row.id;
            console.log(id);
            this.$store.commit(types.DELETE_RULE, id);
            //删除本地规则文件
            this.$remoteApi.deleteCustomRuleFile(id);
        },
        handleCurrentChange(index, row) {
            if (this.currentSelectIndex === index) {
                this.currentSelectIndex = null;
                this.$store.commit(types.TOGGLE_CURRENT_RULE, {});
            } else {
                this.currentSelectIndex = index;
                this.$store.commit(types.TOGGLE_CURRENT_RULE, row);
            }
        },
        saveToFile(id) {
            //写入文件
            this.$remoteApi.saveRulesIntoFile(this.rulesData);
            this.$remoteApi.saveCustomRuleToFile(id, this.ruleValue);
        }
    }
}
</script>
<style lang="less" scope>
#rules_panel {
    display: -webkit-box;
    -webkit-box-flex: 1;
    padding: 10px;
    background: #fff;
    box-sizing: border-box;
    margin-top: 60px;
    .CodeMirror {
        min-height: 320px;
        font-size: 13px;
    }
}
.rules-editor {
    overflow:hidden;
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    -webkit-box-flex: 1;
}
.rules-editor__sample {
    margin-bottom: 20px;
    .el-select {
        margin-left: 46px;
    }
}
.rules-editor__name .el-input {
    width:60%;
    margin-left: 20px;
}
.el-textarea__inner {
    height: 165px;
}

.rules-list {
    width: 100%;
    overflow: hidden;
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
}
.rules-list .el-table {
    margin-top: 20px;
    .el-icon-check {
        color: #13CE66;
        margin-left: 5px;
        display:none;
    }
    .current-row > td {
        background-color: blanchedalmond;
        .el-icon-check {
            display: initial;
        }
    }
    .el-icon-information {
        color: #ccc;
        margin-left: 5px;
    }
}
.el-button+.el-button {
    margin-left: 0;
}
</style>