<template>
    <div id="mock">
        <div class="mock-project">
            <el-dialog title="添加项目" v-model="addProjectStatus">
                <el-input type="input" v-model="newProjectName"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addProjectStatus = false">取 消</el-button>
                    <el-button type="primary" @click="addProject">确 定</el-button>
                </div>
            </el-dialog>
            <el-button type="primary" :plain="true" icon="plus" @click="addProjectStatus = true">添加项目</el-button>
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
            <el-dialog size="large" title="路径配置" v-model="addPathStatus">
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
                        <h4>Response Format</h4>
                        <el-input type="input" v-model="pathResponse.format"></el-input>
                        <h4>Response Headers</h4>
                        <el-input type="input" v-model="pathResponse.headers"></el-input>
                        <h4>Response Body</h4>
                        <codemirror v-model="pathResponse.body" :options="editorOption"></codemirror>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addPathStatus = false">取 消</el-button>
                    <el-button type="primary"  @click="savePath">保 存</el-button>
                </div>
            </el-dialog>
            <h2>当前项目：{{currentProject.name}}</h2>
            <el-button type="primary" :plain="true" icon="plus" @click="addPathStatus = true">添加接口</el-button>
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
                prop="path"
                label="路径"
                width="400">
                </el-table-column>
                <el-table-column
                prop="method"
                label="Method"
                width="100">
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

export default {
    data() {
        return {
            addProjectStatus: false,//添加新项目弹窗
            currentProject: {},     //当前项目对象
            newProjectName: '',     //新项目名称
            projects: [],           //项目列表

            projectPaths: [],       //某项目下的规则列表
            addPathStatus: false,   //添加规则弹窗

            pathId: null,           //正在编辑的路径id
            pathRequest: {          //正在编辑的请求
                url: '/xxx/xxx',
                method: 'GET'
            },
            pathResponse: {         //正在编辑的返回数据
                status: '200',
                format: 'application/json;charset=UTF-8',
                headers: 'Access-Control-Allow-Origin:*;Connection:keep-alive;',
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
                this.$alert('名称不能为空');
                return;
            }
            const nameIndex  = _.findIndex(this.projects, {name: this.newProjectName});
            if (nameIndex !== -1) {
                this.$alert('该项目已存在！');
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
            this.$confirm('确定要删除该项目吗?', {
                type: 'warning'
            }).then(() => {
                const idIndex  = _.findIndex(this.projects, {id: item.id});
                this.projects.splice(idIndex, 1);
                this.$remoteApi.saveMockProject(this.projects);
                if (this.currentProject.id === item.id) {
                    this.currentProject = {};
                }
            });
        },
        switchProject(item) {
            console.log(item);
            const self = this;
            this.currentProject = item;
            this.$remoteApi.getProjectPaths.then((data) => {
                self.projectPaths = JSON.parse(data);
            });
        },
        savePath() {
            //TODO 保存规则到某个项目，区分新增和修改
            if (this.projectPaths) {}
        },
        handleEdit() {

        },
        handleDelete() {

        },
        handlePathChange() {

        }
    }
}
</script>
<style scope>
#mock {
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    padding: 30px;
}
.mock-project {
    width: 200px;
}
.mock-project-list {
    margin-top: 20px;
}
.mock-project-item {
   position: relative;
   text-align: center;
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
.mock-path {
    -webkit-box-flex: 1;
    margin-left: 40px;
    h2 {
        color: #669999;
        margin-bottom: 27px;
    }
    .CodeMirror {
        height: 100px;
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