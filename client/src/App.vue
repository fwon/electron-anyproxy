<template>
  <div id="app">
    <div id="sidenav" class="sidenav">
        <div class="sidenav-logo"></div>
        <div class="sidenav-item sidenav-net"
            :class="{active: currentTab === 'net'}"
            @click="currentTab = 'net'">
            <router-link to="/network">抓包列表</router-link>
        </div>
        <div class="sidenav-item sidenav-rule"
            :class="{active: currentTab === 'rule'}"
            @click="currentTab = 'rule'">
            <router-link to="/rule">拦截修改</router-link>
        </div>
        <div class="sidenav-item sidenav-mock"
            :class="{active: currentTab === 'mock'}"
            @click="currentTab = 'mock'">
            <router-link to="/mock">数据Mock</router-link>
        </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
    data () {
        return {
            currentTab: 'net'
        }
    },
    created() {
        this.currentTab = location.hash.slice(2)
    }
}
</script>

<style>
html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
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
h1,h2,h3,h4 {
    margin: 0;
    padding: 0;
}
#app {
    display: -webkit-box;
    height:100%;
}
.sidenav {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    width: 140px;
    background-color: #3b4453;
    overflow-x: hidden;
    transition: 0.5s;
    z-index: 1000;
}
.sidenav-logo {
    width: 100%;
    height: 120px;
    background: url('./assets/icon.png') center center no-repeat;
    background-size: 80px 80px;
}
.sidenav-item {
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: center;
    cursor: pointer;
    &:hover {
        box-shadow: inset 4px 0px 13px #222;
    }
    &.active {
        box-shadow: inset 4px 0px 13px #222;
    }
    a {
        display: inline-block;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 14px;
        text-decoration: none;
        box-sizing: border-box;
        padding-left: 15px; 
    }
}
.sidenav-net {
    background: url('./assets/sidenav-net.png') 10px center no-repeat;
    background-size: 25px 25px;
}
.sidenav-rule {
    background: url('./assets/sidenav-rule.png') 10px center no-repeat;
    background-size: 25px 25px;
}
.sidenav-mock {
    background: url('./assets/sidenav-mock.png') 10px center no-repeat;
    background-size: 25px 25px;
}
</style>