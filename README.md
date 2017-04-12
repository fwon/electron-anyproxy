中文|[English](https://github.com/fwon/electron-anyproxy/blob/master/README_EN.md)

<p><img width="180" src="https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-icon.png"></p>

📢  一个网络代理客户端, 依赖于 Anyproxy. 构建在 Electron 和 Vue 之上. 

[![Build Status](https://travis-ci.org/fwon/electron-anyproxy.svg?branch=master)](https://travis-ci.org/fwon/electron-anyproxy)

## 功能
1. 网络抓包：提供类似Chrome的预览功能，支持http/https。
2. 数据拦截：支持修改请求头，请求数据，返回头，返回数据等。
3. 网速限制：模拟各种网段的网速。
4. 接口Mock: 根据具体项目管理模拟mock接口

## 网络抓取
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-1.png)

## 规则配置
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-2.png)

## 网络模拟
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-3.png)

## 数据Mock
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-4.png)

## Q&A
中文使用文档：[地址](https://fwon.github.io/e-anyproxy/help.html)

多语言支持：菜单 View->language

## 本地运行
```javascript
npm install //or yarn
npm run start
```
## 打包软件
```javascript
npm install //or yarn, 若已安装则无需次命令
npm run pack
```
软件将会打包到`pack`目录下，双击运行

## 注意
打包时建议用yarn安装npm包，因为npm install会在node_modules中安装隐藏目录，导致electron-packager打包的时候无法将electron等大文件删除，打包出来的软件包会很大。

## LISCENCE
MIT
