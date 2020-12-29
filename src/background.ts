'use strict'

import { app, protocol, BrowserWindow,Menu,ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs-extra'
import path from 'path'


const isDevelopment = process.env.NODE_ENV !== 'production'
const debugpath = isDevelopment ? __dirname :process.cwd()

const datapath = path.join(debugpath, '/data')
const obspath = path.join(debugpath,'/obstemplate')

if(!fs.pathExistsSync(datapath)){
    fs.mkdirSync(datapath)
}
if(!fs.pathExistsSync(obspath)){
  fs.mkdirSync(obspath)
}

const db = require('./api').db
const server = require('./api').server
// 挂载串口
import serialport from './serialport'
const sp  = serialport(server,db)

// 挂载弹幕
import danmu from './danmu'
const dm = danmu()


import axios from 'axios'

const passornot = axios.get('http://solarsunrise.cn/yu/pass.json').then((res)=>{
  const pass = res.data.pass
  if(!pass){
    app.quit()
  }
})




ipcMain.on('export-obsfiles', (event, arg) => {
  console.log('export-file')
  const helpfile = path.join(obspath,'/帮助.txt')
  const signfile = path.join(obspath,'/签到.txt')
  const giftfile = path.join(obspath,'/礼物.txt')
  const stage1file = path.join(obspath,'/上麦1.txt')
  const stage2file = path.join(obspath,'/上麦2.txt')
  const stage3file = path.join(obspath,'/上麦3.txt')
  const stage4file = path.join(obspath,'/上麦4.txt')

  const obssenceconfig = path.join(obspath,'/obs模板.json')
  const obsconfig = path.join(obspath,'/obs场景-用于导入obs配置.json')
  fs.readFile(obssenceconfig,(err, data:any) =>{
    if(err){
      console.log(err)
    }else{
      // console.log(JSON.parse(data))
      const config = JSON.parse(data)
      config.sources[0].settings.file = stage4file 
      config.sources[1].settings.file = stage3file 
      config.sources[2].settings.file = stage1file 
      config.sources[3].settings.file = stage2file 
      config.sources[6].settings.file = helpfile 
      config.sources[7].settings.file = giftfile 
      config.sources[8].settings.file = signfile 
      fs.writeFileSync(obsconfig,JSON.stringify(config))
    };
  })
  

  if(arg.obsconfig.obsenablefiles[0]){
      fs.writeFile(helpfile, arg.obsconfig.helpcontent, (err) => {
        if (err) throw err;
    });
  } 
  if(arg.obsconfig.obsenablefiles[1]){
    fs.writeFile(signfile, '', (err) => {
      if (err) throw err;
  });
  } 
  if(arg.obsconfig.obsenablefiles[2]){
    fs.writeFile(giftfile, '', (err) => {
      if (err) throw err;
  });
  } 
  if(arg.obsconfig.obsenablefiles[3]){
    fs.writeFile(stage1file,'', (err) => {
      if (err) throw err;
    });}
  if(arg.obsconfig.obsenablefiles[4]){
    fs.writeFile(stage2file,'', (err) => {
      if (err) throw err;
  });
  }
  if(arg.obsconfig.obsenablefiles[5]){
    fs.writeFile(stage3file,'', (err) => {
      if (err) throw err;
    });}
  if(arg.obsconfig.obsenablefiles[6]){
    fs.writeFile(stage4file,'', (err) => {
      if (err) throw err;
  });
  }
  
})


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  // Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    width: 1680,
    height: 1200,
    title:'直播抓鱼-设置面板',
    // frame: false ,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      preload: path.join(debugpath, 'preload.js'),
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



