[中文](https://github.com/fwon/electron-anyproxy/blob/master/README.md)|English

<p><img width="180" src="https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-icon.png"></p>

📢  A Proxy client, base on Anyproxy. Building with Electron and Vue. 

[![Build Status](https://travis-ci.org/fwon/electron-anyproxy.svg?branch=master)](https://travis-ci.org/fwon/electron-anyproxy)

## Features
1. Records traffic: Records all traffic between your browser and the Internet.
2. Network intercept: Support modify Request Headers/Data, Response Headers/Data.
3. Network simulates: Simulates slower internet connections.
4. API Mock: Mock your own api for developing projects.


## Records traffic
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-1.png)

## Network intercept Setting
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-2.png)

## Network simulates
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-3.png)

## API Mock
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/electron-anyproxy-4.png)

## Q&A
1.How to set proxy and Install certificates?

[Click me](http://anyproxy.io/4.x/en.html#appendix)

2.How to mock api data?

[Click me](http://mockjs.com/examples.html)

3.How to set Locale language?

**Menu:** View --> language

## Dev Run
```javascript
npm install //or yarn
npm run start
```
## Package
```javascript
npm install //or yarn, only once
npm run pack
```
Application will be packaged into `pack` folder, double click to launch.

## Notice
I Suggest to use yarn instead of npm, cause `npm install` may create hidden folder in node_modules, and electron-package cannot detect those huge devDependencies packages like electron. So they will also be packaged into the Application, that will make the Application size huge!

## LISCENCE
MIT
