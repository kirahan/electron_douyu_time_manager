console.log('[douyuroom.ts load successfully]')
const { ipcRenderer } = require('electron')

let roomFollowLoop = null

// 响应render页面的开始轮训指令
ipcRenderer.on('start-douyu-follow', () => {
    roomFollowLoop = setInterval(()=>{
        getdouyuroomfollows()
    },5000)
  })

   // 响应 ping
ipcRenderer.on('ping', () => {
    console.log('[get ping form render page]')
    ipcRenderer.sendToHost('pong')
  })

  // 响应render页面的停止轮训指令
ipcRenderer.on('stop-douyu-follow', () => {
    clearInterval(roomFollowLoop)
    ipcRenderer.sendToHost('stop-douyuroom-follownum')
  })


//   通过页面html获取粉丝数据
function getdouyuroomfollows(){
    const follownum = document.querySelector('.Title-followNum').innerText
    // console.log(follownum)
    ipcRenderer.sendToHost('update-douyuroom-follownum',follownum)
}