<p><img width="180" src="https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-icon.png"></p>

📢  A Proxy client, base on Anyproxy. Building with Electron and Vue. 

[![Build Status](https://travis-ci.org/fwon/electron-anyproxy.svg?branch=master)](https://travis-ci.org/fwon/electron-anyproxy)

## 功能
1. 网络抓包：提供类似Chrome的预览功能，支持http/https。
2. 数据拦截：支持修改请求头，请求数据，返回头，返回数据等。所以也支持接口mock。
3. 网速限制：模拟各种网段的网速。

## 网络抓取
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-shot-1.png)

## 规则配置
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-shot-2.png)

## 自定义规则
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-shot-3.png)

## 网络模拟
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-shot-4.png)

## 数据Mock

## 本地运行
```
npm install or yarn
npm run start
```
## 打包软件
```
npm install or yarn//第一次运行
npm run pack
```
软件将会打包到`pack`目录下，双击运行
>打包时建议用yarn安装npm包，因为npm install会在node_modules中安装隐藏目录，导致electron-packager打包的时候无法将electron等大文件删除，打包出来的软件包会很大。

## LISCENCE
MIT
