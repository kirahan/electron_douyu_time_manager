import douyu from "douyudm"
import { ipcMain } from 'electron'

const danmu = ()=>{
   
    let roomcnn =  null
    let roomiscnn = false
    let roomid = null
    let danmuchannel = null


    // 握手
    ipcMain.on('danmu-client-init', (event, arg) => {
        console.log(arg) // prints "ping"
        danmuchannel = event
        event.reply('server-save-client-channel', 'pong')
      })

    // 是否已经连接
    ipcMain.on('danmu-command-dmiscnn', (event, arg) => {
        
        let dmiscnn = false
        if(roomiscnn){
            dmiscnn = true
        }
        console.log('[dmiscnn]',dmiscnn)
        event.reply('server-tell-client-dmiscnn',{dmiscnn,roomid})
        
    })


    // 连接房间
    ipcMain.on('danmu-command-cnn', (event, arg) => {
        roomid = arg
        const options = {
            debug: true,
          };
          roomcnn = new douyu(roomid, options);
          //系统事件
          roomcnn.on("connect", function() {
            console.log("[connect] roomId=%s", roomid);
            if(danmuchannel){   
                danmuchannel.reply('room-event', 'connect')
                roomiscnn = true
                danmuchannel.reply('server-tell-client-dmiscnn', {dmiscnn: roomiscnn, roomid})
            }else{
                console.log('danmuchannel未连接')
            }
          });
          roomcnn.on("disconnect", function() {
            console.log("[disconnect] roomId=%s", roomid);
            if(danmuchannel){   
                danmuchannel.reply('room-event', 'disconnect')
                roomiscnn = false
                danmuchannel.reply('server-tell-client-dmiscnn', {dmiscnn: roomiscnn, roomid})
                danmuchannel = null
                roomcnn =  null
                roomid = null
            }else{
                console.log('danmuchannel未连接')
            }
          });
          roomcnn.on("error", function(err) {
            console.log("[error] roomId=%s", roomid);
            if(danmuchannel){   
                danmuchannel.reply('room-event', 'err')
            }else{
                console.log('danmuchannel未连接')
            }
          });

          //消息事件
          roomcnn.on("chatmsg", async(res)=>{
            //console.log("[chatmsg]", `<lv ${res.level}> [${res.nn}] ${res.txt}`);
            if(danmuchannel){   
                danmuchannel.reply('danmu-msg', res)
            }else{
                console.log('danmuchannel未连接')
            }
          });

          roomcnn.on("dgb",async(res)=>{
            console.log("[gift]", `<lv ${res.level}> [${res.nn}]`);
            if(danmuchannel){   
                danmuchannel.reply('danmu-gift', res)
            }else{
                console.log('danmuchannel未连接')
            }
          })

          roomcnn.on("loginres", function(res) {
            console.log("[loginres]", "登录成功");
          });

          roomcnn.on("uenter", function(res) {
            console.log("[uenter]", res);
          });

          roomcnn.on("upgrade", function(res) {
            console.log("[upgrade]", "");
          });

          roomcnn.on("rss", function(res) {
            console.log("[rss]", "");
          });

          roomcnn.on("bc_buy_deserve", function(res) {
            console.log("[bc_buy_deserve]", "");
          });

          roomcnn.on("ssd", function(res) {
            console.log("[ssd]", res);
          });

          roomcnn.on("spbc", function(res) {
            console.log("[spbc]", res);
          });
          roomcnn.on("onlinegift", function(res) {
            console.log("[onlinegift]", res);
          });
          roomcnn.on("ggbb", function(res) {
            console.log("[ggbb]", res);
          });
          roomcnn.on("rri", function(res) {
            console.log("[rri]", res);
          });
          roomcnn.on("synexp", function(res) {
            console.log("[synexp]", res);
          });
          roomcnn.on("gbroadcast", function(res) {
            console.log("[]", res);
          });
          roomcnn.on("qausrespond", function(res) {
            console.log("[qausrespond]", res);
          });
          roomcnn.on("wiru", function(res) {
            console.log("[wiru]", res);
          });
          roomcnn.on("wirt", function(res) {
            console.log("[wirt]", res);
          });
          roomcnn.on("mcspeacsite", function(res) {
            console.log("[mcspeacsite]", res);
          });
          roomcnn.on("srres", function(res) {
            console.log("[srres]", res);
          });
          roomcnn.on("frank", function(res) {
            console.log("[frank]", res);
          });
          
          //开始监听
          roomcnn.run();
    })

    //断开房间
    ipcMain.on('danmu-command-close', (event, arg) => {
        console.log('[close command]')
        roomcnn.logout()
        roomcnn =  null
        roomiscnn = false
        roomid = null
    })


}

export default danmu 

