<template>
    <div id="rules_panel">
        <el-dialog v-model="eidtRuleStatus">
            <div slot="title">{{ $t("ap.rulepop.title") }}</div>
            <div class="rules-editor">
                <div class="rules-editor__sample">
                    <span>{{ $t("ap.rulepop.sample") }}</span>
                    <el-select v-model="ruleName" placeholder="" @change="ruleSelectChange">
                        <el-option
                        v-for="item in ruleOptions"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="rules-editor__name">
                    <span>{{ $t("ap.rulepop.name") }}</span>
                    <el-input type="input" v-model="ruleKey.name"></el-input>
                </div>
                <div class="rules-editor__cont">
                    <p>{{ $t("ap.rulepop.content") }}</p>
                    <codemirror v-model="ruleValue" :options="editorOption"></codemirror>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelRule">{{ $t("ap.rulepop.cancelbtn") }}</el-button>
                <el-button type="primary"  @click="saveRule">{{ $t("ap.rulepop.savebtn") }}</el-button>
            </div>
        </el-dialog>
        <div class="rules-list">
            <el-button type="primary" :plain="true" icon="plus" @click="eidtRuleStatus = true">{{ $t("ap.rulelist.addbtn") }}</el-button>
            <el-table
                :data="rulesData"
                border
                :row-class-name="tableRowClassName">
                <el-table-column
                type="index"
                label="Status"
                width="80">
                <template scope="scope">
                    <i class="el-icon-check"></i>
                </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="Name">
                </el-table-column>
                <el-table-column label="Operating">
                <template scope="scope">
                    <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">
                    {{ $t("ap.rulelist.editbtn") }}</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">
                    {{ $t("ap.rulelist.delbtn") }}</el-button>
                    <el-button
                    size="small"
                    type="warning"
                    @click="handleCurrentChange(scope.$index, scope.row)"
                    v-if="currentSelectIndex === scope.$index">
                    {{ $t("ap.rulelist.cancelbtn") }}</el-button>
                    <el-button
                    size="small"
                    type="success"
                    @click="handleCurrentChange(scope.$index, scope.row)"
                    v-else>
                    {{ $t("ap.rulelist.usebtn") }}</el-button>
                    <el-tooltip class="item" effect="light" placement="right">
                        <div slot="content">{{ $t("ap.rulelist.tip") }}</div>
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
        const self = this;
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
                label: self.$t('ap.rulepop.sample1')
            },{
                value: 'modify_request_header',
                label: self.$t('ap.rulepop.sample2')
            },{
                value: 'modify_request_path',
                label: self.$t('ap.rulepop.sample3')
            },{
                value: 'modify_request_protocol',
                label: self.$t('ap.rulepop.sample4')
            },{
                value: 'modify_response_data',
                label: self.$t('ap.rulepop.sample5')
            },{
                value: 'modify_response_header',
                label: self.$t('ap.rulepop.sample6')
            },{
                value: 'modify_response_statuscode',
                label: self.$t('ap.rulepop.sample7')
            },{
                value: 'use_local_response',
                label: self.$t('ap.rulepop.sample8')
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
                    message: self.$t("ap.message.MSG_RULE_GET_FAIL"),
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
            const self = this;
            const rule = {
                id: self.ruleKey.id || util.generateUUIDv4(),
                name: self.ruleKey.name,
            };
            if (!rule.name || !this.ruleValue) {
                this.$alert(self.$t("ap.message.MSG_RULE_FORMAT_FAIL"));
                return;
            }
            const nameIndex = _.findIndex(this.rulesData, {name: rule.name});
            const idIndex = _.findIndex(this.rulesData, {id: rule.id});
            if (idIndex !== -1) {
                this.$store.commit(types.MODIFY_PROXY_RULE, {
                    index: idIndex,
                    rule: rule
                });
                this.saveToFile(rule.id);
            } else {
                if (nameIndex !== -1) {
                    this.$alert(self.$t("ap.message.MSG_RULE_NAME_REPEAT"));
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
<style lang="less">
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