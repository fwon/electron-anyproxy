<template>
    <div id="filter">
        <el-input
            v-model="filterPattern"
            placeholder="Filter"
            icon="circle-close"
            :on-icon-click="clearFilterContent">
        </el-input>
    </div>
</template>
<script>
import _ from 'lodash'
import * as types from '../store/mutation-types'

export default {
  data() {
    return {
      filterPattern: ''
    }
  },
  watch: {
    //watch 不能使用箭头函数 https://cn.vuejs.org/v2/api/#watch
    filterPattern: function() {
        this.changeFilterRecorder();
    }
  },
  methods: {
      changeFilterRecorder: _.debounce(function() {
          this.$store.commit(types.CHANGE_RECORDER_FILTER, this.filterPattern);
      }, 100),
      clearFilterContent(ev) {
          this.filterPattern = '';
          this.$store.commit(types.CLEAR_RECORDER_FILTER);
      }
  }
}
</script>
<style lang="less">
#filter {
    display:inline-block;
    margin-left: 10px;
}
.el-input {
    width: 200px;
}
</style>