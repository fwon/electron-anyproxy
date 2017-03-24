<template>
  <div id="app">
    <proxy-menu></proxy-menu>
    <proxy-network></proxy-network>
    <proxy-rule></proxy-rule>
  </div>
</template>

<script>
import proxyMenu from './components/menu.vue'
import proxyNetwork from './components/network.vue'
import proxyRule from './components/rule.vue'

export default {
    data () {
        return {
            msg: 'Use Vue 2.0 Today!'
        }
    },
    components: {
        proxyMenu,
        proxyNetwork,
        proxyRule
    }
}
</script>

<style>
html, body {
    overflow: hidden;
}
body {
  font-family: Helvetica, sans-serif;
  -webkit-user-select: none;
  user-select: none;
}
pre {
    margin: 0;
    padding: 10px;
    overflow-x: scroll;
}

</style>