console.log('[douyuroom.ts load successfully]')
// const { ipcRenderer } = require('electron')

// let roomFollowLoop = null



// // 响应render页面的开始轮训指令
// ipcRenderer.on('start-douyu-follow', () => {
//   setTimeout(()=>{
//     getdouyuroomfonturl()
//   },5000)

//   roomFollowLoop = setInterval(()=>{
//         getdouyuroomfollows()
//     },8000)
//   })

//    // 响应 ping
// ipcRenderer.on('ping', () => {
//     console.log('[get ping form render page]')
//     ipcRenderer.sendToHost('pong')
//   })

//   // 响应render页面的停止轮训指令
// ipcRenderer.on('stop-douyu-follow', () => {
//     clearInterval(roomFollowLoop)
//     ipcRenderer.sendToHost('stop-douyuroom-follownum')
//   })


// function getdouyuroomfonturl(){
//   const douyufont = document.querySelector('.Title-followNum').style.fontFamily
//   const fakefonturl = `https://shark.douyucdn.cn/app/douyu/res/font/${douyufont.split('douyu')[1]}.woff` 
//   ipcRenderer.sendToHost('get-douyuroom-font',fakefonturl)
// }


// //   通过页面html获取粉丝数据
// function getdouyuroomfollows(){
//     const follownum = document.querySelector('.Title-followNum').innerText
//     ipcRenderer.sendToHost('update-douyuroom-follownum',follownum)
// }