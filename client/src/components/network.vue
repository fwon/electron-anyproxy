<template>
    <div id="network_list">
        <el-table
            class="nt-record-list"
            :data="tableData"
            highlight-current-row
            stripe
            row-key="id"
            :height="650"
            @row-click="handleCurrentChange"
            :row-class-name="tableRowClassName"
            style="width: 100%;font-size:12px;">
            <el-table-column
            type="index"
            width="80">
            </el-table-column>
            <el-table-column
            property="method"
            label="Method"
            width="150">
            </el-table-column>
            <el-table-column
            property="statusCode"
            label="Code"
            width="100">
            </el-table-column>
            <el-table-column
            property="host"
            label="Host"
            width="300">
            </el-table-column>
            <el-table-column
            property="path"
            label="Path"
            width="250">
            </el-table-column>
            <el-table-column
            property="mime"
            label="Mime"
            width="120">
            </el-table-column>
            <el-table-column
            property="startTime"
            :formatter="dateFormatter"
            label="Start">
            </el-table-column>
        </el-table>
        <transition name="slide-fade">
            <el-tabs v-model="activeName" @tab-click="handleClick" v-if="detailPanelStatus">
                <el-tab-pane label="Headers" name="headers"></el-tab-pane>
                <el-tab-pane label="Preview" name="preview"></el-tab-pane>
                <el-tab-pane label="Response" name="response"></el-tab-pane>
                <el-tab-pane label="Cookies" name="cookies"></el-tab-pane>
                <network-detail 
                    :detail-content="detailContent" 
                    :headers="currentRow" 
                    :panel-type="activeName">
                </network-detail>
                <i id="close_panel" class="el-icon-close" @click="detailPanelStatus = false"></i>
                
            </el-tabs>
        </transition>
    </div>
</template>
<script>
import moment from 'moment';
import {mapState} from 'vuex';
import networkDetail from './network-detail.vue';
import * as types from '../store/mutation-types';

export default {
    data() {
        return {
            responseData: '',
            responseData: '',
            currentRow: {},
            activeName: 'headers',
            detailPanelStatus: false,
            detailContent: {}
        }
    },
    components: {
        networkDetail
    },
    computed: {
        tableData() {
            console.log('change')
            return this.$store.getters.filterTableDate;
        }
    },
    methods: {
        tableRowClassName(row, index) {
            if (row.method == 'CONNECT') {
                return 'gray-row';
            } else if (row.statusCode >= 400) {
                return 'error-row';
            } else if (row.statusCode == 200) {
                return 'success-row';
            }
            return '';
        },
        handleCurrentChange(val) {
            let self = this;
            if (this.currentRow === val) {
                this.detailPanelStatus = !this.detailPanelStatus;
            } else {
                this.detailPanelStatus = true;
                this.currentRow = val;
                this.$remoteApi.fetchBody(val.id).then((data) => {
                    self.detailContent = data;
                });
            }
        },
        dateFormatter(row, column) {
            return moment(row.start).format('hh:mm:ss');
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        }
    }
}
</script>
<style lang="less" scope>
#network_list {
    position: relative;
    -webkit-user-select: text;
    .el-table td {
        height: 30px;
    }
    
}
.el-table .gray-row {
    color: #999;
}
.el-table tr.current-row>td {
    background-color: #58B7FF;
}
.el-table .success-row td:nth-child(3) {
    color: #13CE66;
}
.el-table .error-row {
    color: #FF4949;
}
.el-table .odd-row {
    background: #FAFAFA;
}
.el-tabs {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate3d(0,0,0);
    background-color: #fff;
    width: 50%;
    box-shadow: -3px 2px 9px rgba(0, 0, 0, 0.4);
}
.el-icon-close {
    transition: transform .2s ease-in;
    &:hover {
        transform: rotate(180deg);
    }
}

.el-tabs__content {
    margin-bottom: 0;
}
.el-tabs__content {
    height: 550px;
    overflow-y: scroll;
    padding: 20px;
}

.nt-record-list .cell {
    white-space: nowrap;
}

#close_panel {
    position:absolute;
    right:10px;
    top:0px;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translate3d(200px,0,0);
  opacity: 0;
}

</style>