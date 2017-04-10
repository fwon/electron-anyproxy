<template>
    <!--注意：这里用v-show 和 key 保证切换流畅度，不加key Vue会进行一些运算导致卡顿-->
    <div id="network_detail">
        <el-collapse v-model="activeNames" v-show="panelType === 'headers'" key="1">
            <el-collapse-item title="General" name="general">
                <div><b>Request URL: </b>{{headers.url}}</div>
                <div><b>Request Method: </b>{{headers.method}}</div>
                <div><b>Status Code: </b>{{headers.statusCode}}</div>
                <div><b>Protocol: </b>{{headers.protocol}}</div>
            </el-collapse-item>
            <el-collapse-item title="Response Header" name="resheaders">
                <div v-for="(value, key) in headers.resHeader">
                    <b>{{key}}: </b>{{value}}
                </div>
            </el-collapse-item>
            <el-collapse-item title="Request Headers" name="reqheaders">
                <div v-for="(value, key) in headers.reqHeader" v-if="key !== 'Cookie'">
                    <b>{{key}}: </b>{{value}}
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-collapse v-show="panelType === 'preview'" key="2">
            <div v-html="preview"></div>
            <tree-view :data="jsonPreview" max-depth="5" v-show="jsonPreview"></tree-view>
        </el-collapse>
        <el-collapse v-show="panelType === 'response'" key="3">
            {{detailContent.content}}
        </el-collapse>
        <el-collapse v-show="panelType === 'cookies'" key="4">
             <el-table
                :data="cookies"
                border
                style="width: 100%">
                <el-table-column
                prop="name"
                label="Name"
                width="200">
                </el-table-column>
                <el-table-column
                prop="value"
                label="Value">
                </el-table-column>
            </el-table>
        </el-collapse>
    </div>
</template>
<script>
import hljs from 'highlight.js';
import treeView from './TreeView.vue';
import 'highlight.js/styles/github.css';

//highlight code 缓存，避免二次渲染
const highlightCache = {}

export default {
    data() {
        return {
            activeNames: ['general','resheaders', 'reqheaders']
        };
    },
    components: {
        treeView
    },
    props: {
        detailContent: Object,
        headers: {
            type: Object,
            default: function() {
                return {
                    url: '',
                    method: '',
                    statusCode: '',
                    protocal: '',
                    reqHeader: {},
                    resHeader: {}
                }
            }
        },
        panelType: String
    },
    computed: {
        cookies() {
            let cookies = this.headers.reqHeader.cookie || this.headers.reqHeader.Cookie;
            if (cookies) {
                return cookies.split(';').map((item) => {
                    return {
                        name: item.split('=')[0],
                        value: item.split('=')[1]
                    };
                });
            }
            return [];
        },
        jsonPreview() {
            let detail = this.detailContent;
            if (this.panelType === 'preview') {
                let type = detail.type || '';

                if (type.match('json')) {
                    try {
                        return JSON.parse(detail.content);
                    } catch(err) {
                        return detail.content;
                    }
                } else {
                    return '';
                }
            }
        },
        preview() {
            let detail = this.detailContent;
            if (this.panelType === 'preview') {
                let type = detail.type || '';

                if (type.match('json')) {
                    return '';
                } else if (type.match(/css|javascript|html/)) {
                    return highlightCache[detail.id] || 
                        (highlightCache[detail.id] = 
                        '<pre><code>' + hljs.highlightAuto(detail.content).value + '</code></pre>'
                        );
                } else if (type.match('image')) {
                    return '<img src="'+ this.headers.url +'">';
                } else {
                    return detail.content;
                }
                
            }
        }
    }
}
</script>
<style lang="less">
.el-collapse-item__header {
    font-weight: 900;
    height: 25px;
    line-height: 25px;
    background-color: #eee;
}
.el-collapse-item__content {
    font-size: 12px;
}
.el-collapse .el-table .cell {
    white-space: normal !important;
}
.el-collapse {
    word-break: break-word;
    font-size:12px;
    border: none;
}
</style>