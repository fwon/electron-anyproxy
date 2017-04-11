<template>
    <div id="mock">
        <div class="mock-project">
            <el-dialog v-model="addProjectStatus">
                <div slot="title">{{ $t("ap.mocklist.addbtn") }}</div>
                <el-input type="input" v-model="newProjectName"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addProjectStatus = false">{{ $t("ap.mockpop.cancelbtn") }}</el-button>
                    <el-button type="primary" @click="addProject">{{ $t("ap.mockpop.savebtn") }}</el-button>
                </div>
            </el-dialog>
            <el-button type="primary" :plain="true" icon="plus" @click="addProjectStatus = true">{{ $t("ap.mocklist.addbtn") }}</el-button>
            <ul class="mock-project-list el-menu el-menu-vertical-demo">
                <li 
                    class="mock-project-item el-menu-item"
                    :class="{'is-active': item.id === currentProject.id}"
                    v-for="item in projects"
                    @click="switchProject(item)">
                    {{item.name}}
                    <i class="el-icon-circle-close" @click="deleteProject(item)"></i>
                </li>
            </ul>
        </div>
        <div class="mock-path" v-if="currentProject.id">
            <el-dialog size="large" v-model="addPathStatus">
                <div slot="title">{{ $t("ap.mocklist.addapibtn") }}</div>
                <div class="mock-path-editor">
                    <div class="mock-path-editor__left">
                        <h4>Request Url</h4>
                        <el-input type="input" v-model="pathRequest.url"></el-input>
                        <h4>Request Method</h4>
                        <el-input type="input" v-model="pathRequest.method"></el-input>
                    </div>
                    <div class="mock-path-editor__right">
                        <h4>Status Code</h4>
                        <el-input type="input" v-model="pathResponse.status"></el-input>
                        <h4>Response Headers</h4>
                        <el-input type="input" v-model="pathResponse.headers"></el-input>
                        <h4>Response Body</h4>
                        <codemirror v-model="pathResponse.body" :options="editorOption"></codemirror>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelPath">{{ $t("ap.mockpop.cancelbtn") }}</el-button>
                    <el-button type="primary"  @click="savePath">{{ $t("ap.mockpop.savebtn") }}</el-button>
                </div>
            </el-dialog>
            <h2>{{ $t("ap.mocklist.currentpro") }}{{currentProject.name}}
            <el-tooltip class="item" effect="light" placement="right">
                <div slot="content">{{ $t("ap.mocklist.currenttip") }}</div>
                <i class="el-icon-information"></i>
            </el-tooltip></h2>
            <el-button type="primary" :plain="true" icon="plus" @click="toAddPath">{{ $t("ap.mocklist.addapibtn") }}</el-button>
            <el-table
                class="mock-path__list"
                :data="projectPaths"
                border
                @selection-change="handlePathChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="request.url"
                label="Url"
                width="400">
                </el-table-column>
                <el-table-column
                prop="request.method"
                label="Method"
                width="100">
                </el-table-column>
                <el-table-column label="Operating">
                <template scope="scope">
                    <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">
                    {{ $t("ap.mocklist.editbtn") }}</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">
                    {{ $t("ap.mocklist.delbtn") }}</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {codemirror} from 'vue-codemirror';
import util from '../lib/util';
import _ from 'lodash';
import * as types from '../store/mutation-types';

export default {
    data() {
        return {
            addProjectStatus: false,//添加新项目弹窗
            currentProject: {},     //当前项目对象
            newProjectName: '',     //新项目名称
            projects: [],           //项目列表

            projectPaths: [],       //某项目下的规则列表
            addPathStatus: false,   //添加规则弹窗

            preEditPath: null,      //编辑前的路径，用于恢复
            pathId: null,           //正在编辑的路径id
            pathRequest: {          //正在编辑的请求
                url: '/xxx/xxx',
                method: 'GET'
            },
            pathResponse: {         //正在编辑的返回数据
                status: '200',
                headers: 'Content-Type:application/json;Access-Control-Allow-Origin:*;',
                body: ''
            },

            editorOption: {         //返回的数据body
                mode: 'text/javascript',
                lineNumbers: true,
                theme: 'monokai',
            },
        }
    },
    computed: {
        // multipleSelection() {
        //     return this.$store.state.mock_paths;
        // }
    },
    components: {
        codemirror
    },
    mounted() {
        const projs = this.$remoteApi.getMockProjects();
        this.projects = JSON.parse(projs);
    },
    methods: {
        addProject() {
            if (!this.newProjectName) {
                this.$alert(this.$t("ap.message.MSG_MOCK_NAME_EMPTY"));
                return;
            }
            const nameIndex  = _.findIndex(this.projects, {name: this.newProjectName});
            if (nameIndex !== -1) {
                this.$alert(this.$t("ap.message.MSG_MOCK_PRO_EXIST"));
            } else {
                const project = {
                    id: util.generateUUIDv4(),
                    name: this.newProjectName
                }
                this.projects.push(project);
                this.$remoteApi.saveMockProject(this.projects);
                this.addProjectStatus = false;
                this.newProjectName = '';
            }
        },
        deleteProject(item) {
            this.$confirm(this.$t("ap.message.MSG_MOCK_CONFIRM_DEL"), {
                type: 'warning'
            }).then(() => {
                const idIndex  = _.findIndex(this.projects, {id: item.id});
                this.projects.splice(idIndex, 1);
                this.$remoteApi.saveMockProject(this.projects);
                if (this.currentProject.id === item.id) {
                    this.currentProject = {};
                }
            }, () => {});
        },
        switchProject(item) {
            const self = this;
            this.currentProject = item;     
            this.$remoteApi.getProjectPaths(item.id).then((data) => {
                self.projectPaths = JSON.parse(data);
                console.log(self.projectPaths);
            }, () => {
                console.log('no projcet data');
                self.projectPaths = [];
            });
        },
        toAddPath() {
            this.addPathStatus = true;
            this.preEditPath = null;
            this.pathId = null;    //恢复
            this.pathRequest = {   //正在编辑的请求
                url: '/xxx/xxx',
                method: 'GET'
            };
            this.pathResponse = {  //正在编辑的返回数据
                status: '200',
                headers: 'Content-Type:application/json;Access-Control-Allow-Origin:*;',
                body: ''
            };
        },
        savePath() {
            const self = this;
            //TODO 保存规则到某个项目，区分新增和修改
            if (this.projectPaths) {
                if (!this.pathId) { //新增
                    let item = {
                        id: util.generateUUIDv4(),
                        request: _.clone(this.pathRequest),
                        response: _.clone(this.pathResponse)
                    };
                    this.projectPaths.push(item);
                } else {
                    let idIndex = _.findIndex(this.projectPaths, {id: this.pathId}); 
                    let item = {
                        id: this.pathId,
                        request: _.clone(this.pathRequest),
                        response: _.clone(this.pathResponse)
                    };
                    this.$set(this.projectPaths, idIndex, item);
                }
                this.$remoteApi.saveProjectPaths(this.currentProject.id, this.projectPaths).then(() => {
                    self.$notify({
                        message: self.$t("ap.message.MSG_MOCK_SAVE_SUCCESS"),
                        duration: 1000
                    });
                    self.addPathStatus = false;
                });
            }
        },
        cancelPath() {
            //恢复状态
            if (this.preEditPath) {
                this.pathRequest = this.preEditPath.request;
                this.pathResponse = this.preEditPath.response;
            }
            this.addPathStatus = false
        },
        handleEdit(index, row) {
            this.preEditPath = row;
            
            this.pathId = row.id;
            this.pathRequest = _.clone(row.request);
            this.pathResponse = _.clone(row.response);
            
            this.addPathStatus = true;
        },
        handleDelete(index, row) {
            const self = this;
            this.$confirm(self.$t("ap.message.MSG_MOCK_CONFIRM_DEL"), {
                type: 'warning'
            }).then(() => {
                const idIndex  = _.findIndex(this.projectPaths, {id: row.id});
                this.projectPaths.splice(idIndex, 1);
                this.$remoteApi.saveProjectPaths(this.currentProject.id, this.projectPaths).then(() => {
                    self.$notify({
                        message: self.$t("ap.message.MSG_MOCK_DEL_SUCCESS"),
                        duration: 1000
                    });
                });
                
            });
        },
        handlePathChange(val) {
            //此处不能直接赋值val, 会变成引用element值，导致vuex报错
            this.$store.commit(types.SET_SELECTED_MOCKPATH, _.clone(val));
        }
    }
}
</script>
<style lang="less">
#mock {
    display: -webkit-box;
    -webkit-box-flex: 1;
    -webkit-box-orient: horizontal;
    padding: 30px;
    margin-top: 60px;
    .mock-project-list {
        margin-top: 20px;
    }
    .mock-project-item {
        position: relative;
        text-align: center;
        border-top: 1px solid rgba(151, 168, 190, 0.17);
        &:first-child {
                border: none;
        }
        &:hover {
            i {
                display: inline-block;
            }
        }
        i {
            display: none;
            position: absolute;
            right: 0;
            top: 40%;
        }
        &.is-active {
                color: #fff;
                background-color: #669999;
        }
    }
}
.mock-project {
    width: 200px;
}

.mock-path {
    -webkit-box-flex: 1;
    margin-left: 40px;
    h2 {
        color: #669999;
        margin-bottom: 27px;
        .el-icon-information {
            color: #ccc;
            font-size: 15px;
            vertical-align: 3px;
        }
    }
    .CodeMirror {
        height: 200px;
    }
}
.mock-path-editor {
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    h4 {
        padding: 10px 0;
    }
}
.mock-path-editor__left, .mock-path-editor__right {
    width: 50%;
    -webkit-box-flex: 1;
    padding: 0 20px;
}
.mock-path-editor__left {
    border-right: 1px solid #ccc;
}
.mock-path__list {
    margin-top: 20px;
}
</style>