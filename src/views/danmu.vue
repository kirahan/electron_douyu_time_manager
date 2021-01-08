<template>
  <v-layout app class="dark h100">
    <v-container class="no-padding h100" fluid>
      <v-row no-gutters align-center justify-center class="h100">
        <v-col cols="12">
          <v-sheet elevation-10 class="rounded-lg pa-3 pannel h100">
            <v-col cols="4">
              <div>
                 <v-text-field
                  dark
                  v-model="roomid"
                  label="斗鱼房间号"
                  class="roominput"
                ></v-text-field>
                <v-btn :color="formconfig.danmu.cnncolor" dark elevation="2" @click="cnndanmu"
                  >{{formconfig.danmu.btncnntitle}}</v-btn
                >
                <v-btn :color="formconfig.danmu.closecolor" dark elevation="2" @click="closedanmu"
                  >{{formconfig.danmu.btnclosetitle}}</v-btn
                >
              </div>

              <div class="obscheckboxpannel">
                  <v-select
                              :items="serialportlist"
                              v-model="serialport"
                              dense
                              solo
                  ></v-select>
                <v-btn :color="formconfig.serialport.cnncolor" dark elevation="2" @click="cnnserial"
                  >{{formconfig.serialport.btncnntitle}}</v-btn
                >
                <v-btn :color="formconfig.serialport.closecolor" dark elevation="2" @click="closeserial"
                  >{{formconfig.serialport.btnclosetitle}}</v-btn
                >
              </div>
             
            </v-col>
            <v-col cols="8" class="danmu rounded-lg">
                <div v-for="msg in danmumsgs" :key="msg.now">
                  <span class="pr-3" style="color:green">[Lv{{msg.level}}]</span>
                  <span color="blue" class="pr-3" style="color:#4FC1E9">{{msg.nn}}</span>
                  <span color="white" class="">{{msg.txt}}</span>
                </div>
                <div v-for="gf in danmugfs" :key="gf.now">
                  <span class="pr-3" style="color:red">[礼物]</span>
                  <span color="blue" class="pr-3" style="color:#4FC1E9">{{gf.nn}}</span>
                  <span color="white" class="">id:{{gf.gfid}}</span>
                </div>
            </v-col>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import douyu from "douyudm";
@Component({
  components: {},
})
export default class DanMu extends Vue {
  constructor() {
    super();
  }
  roomcnn = null

  roomid = null;
  danmumsgs = []
  danmugfs = []
  danmucommands = []
  serialportconfig:any = {}
  serialportlist = []
  serialport = ''

  formconfig = {
    danmu : {
      cnncolor :'#007ACC',
      closecolor : '',
      btncnntitle : '连接',
      btnclosetitle : '关闭',
    },
    serialport : {
      cnncolor :'#007ACC',
      closecolor : '',
      btncnntitle : '连接',
      btnclosetitle : '关闭',
    },
  }

  spcnn = null
  dmcnn = null
  spiscnn = null
  dmiscnn = false
  


  async getdanmucommands(){
    const  res = await this.$http.get('/command')
    for(let index in res.data){
      this.danmucommands.push(res.data[index].command)
    }
    console.log(this.danmucommands)
  }





  async getdanmuinfo(){
    window.ipcRenderer.send("danmu-command-dmiscnn");
    return true
  }

  async cnndanmu() {
    window.ipcRenderer.send("danmu-client-init", 'ping');
    this.getdanmuinfo()
    // 已经连接
    if(!this.roomid){
      return false
    }else if(!this.dmiscnn){
          window.ipcRenderer.send("danmu-command-cnn",this.roomid);
    }
    // 刷新状态
  this.getdanmuinfo()
  
  }

  async closedanmu(){
    this.getdanmuinfo()
    // 已经连接
    if(!this.dmiscnn){
      return false
    }else{
        this.dmiscnn = false
       window.ipcRenderer.send("danmu-command-close");
    }
    // 刷新状态
    this.getdanmuinfo()
  }

  async getserialports() {
    const splist = await await this.$http.get("/serialport");
    const portconfig = await await this.$http.get("/serialport/configport");
    const ports = [];
    if (splist.data.data) {
      for (let port of splist.data.data) {
        ports.push(port.path);
      }
    }
    // this.serialport = portconfig.data.hwserialport;
    this.serialportlist = ports;
    this.serialportconfig = portconfig.data
  }

  async getspcnninfo(){
    this.spiscnn = (await this.$http.get('/serialport/iscnn')).data
    if(this.spiscnn.isOpen){
      this.formconfig.serialport.cnncolor = '#33D76C'
      this.formconfig.serialport.closecolor = '#CE3843'
      this.formconfig.serialport.btncnntitle = '已连接'
      this.formconfig.serialport.btnclosetitle = '关闭'
      this.serialport = this.spiscnn.path;
    }else{
      this.formconfig.serialport.cnncolor = '#007ACC'
      this.formconfig.serialport.closecolor = ''
      this.formconfig.serialport.btncnntitle = '连接'
      this.formconfig.serialport.btnclosetitle = '-'
    }
    return true
  }

  async cnnserial(){
    this.getspcnninfo()
    // 已经连接
    if(this.spiscnn.isOpen){
      return false
    }else{
      const config = {
        port:this.serialport,
        baudrate:this.serialportconfig.hwbaudrate,
        endflag:this.serialportconfig.endflag
      }
      this.spcnn = await this.$http.post('/serialport/cnn',config)
    }
    // 刷新状态
    this.getspcnninfo()
  }

  async closeserial(){
    this.getspcnninfo()
    // 已经连接
    if(!this.spiscnn.isOpen){
      return false
    }else{
      this.spcnn = await this.$http.get('/serialport/close')
    }
    // 刷新状态
    this.getspcnninfo()
  }
  async  init(){
    window.ipcRenderer.removeAllListeners("danmu-gift")
    window.ipcRenderer.removeAllListeners("danmu-msg")
    // console.log('try to  remove gift')
    // window.ipcRenderer.removeListener("danmu-gift",() =>{
    //   console.log('remove gift')
    // })
    window.ipcRenderer.send("danmu-client-init", 'ping');

    window.ipcRenderer.on("server-tell-client-dmiscnn",(event, {dmiscnn,roomid}) => {
      console.log('[dmiscnn]',dmiscnn)
      this.dmiscnn = dmiscnn;
      if(dmiscnn){
        this.roomid = roomid
      }
      
      if(dmiscnn){
      this.formconfig.danmu.cnncolor = '#33D76C'
      this.formconfig.danmu.closecolor = '#CE3843'  
      this.formconfig.danmu.btncnntitle = '已连接'
      this.formconfig.danmu.btnclosetitle = '关闭'
    }else{
      this.formconfig.danmu.cnncolor = '#007ACC'
      this.formconfig.danmu.closecolor = ''
      this.formconfig.danmu.btncnntitle = '连接'
      this.formconfig.danmu.btnclosetitle = '-'
    }
    })

    window.ipcRenderer.on("room-event",(event, arg) => {
      if(arg=='connect'){
          console.log('connect')
      }else if(arg=='err'){
          console.log('err')
      }else if(arg=='disconnect'){
          console.log('disconnect')
      }
    })

    window.ipcRenderer.on("danmu-msg",async(event, arg) => {
      if(this.danmumsgs.length>20){
                  this.danmumsgs.splice(0,1)
                  this.danmumsgs.push(arg)
      }else{
          this.danmumsgs.push(arg)
      }
      const getcommand = this.danmucommands.indexOf(arg.txt)
      if(getcommand!=-1){
        // getcommand=0 查询
        // getcommand=1 签到
        // getcommand=2 上1
        // getcommand=3 上2
        // getcommand=4 上3
        // getcommand=5 上4
        // getcommand=6 抓鱼
        // getcommand=7 下麦
        // getcommand=8 喂鱼
        await this.checksubmitorregistration(arg)
        if(getcommand == 0){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
                        const check = await this.$http.post('/check',{id:user.data.id})
          }
          
        }else if(getcommand == 1){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const sign = await this.$http.post('/sign',{
              id: user.data.id,
              now: Date.now()
            })
          }
        }else if(getcommand == 2){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const stagename = 'stage1'
            const onstage = await this.$http.post(`/stage/onstage/`,{id,stagename}) 

          }
        }else if(getcommand == 3){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const stagename = 'stage2'
            const onstage = await this.$http.post(`/stage/onstage/`,{id,stagename}) 
          }
        }else if(getcommand == 4){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const stagename = 'stage3'
            const onstage = await this.$http.post(`/stage/onstage/`,{id,stagename}) 
          }
        }else if(getcommand == 5){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const stagename = 'stage4'
            const onstage = await this.$http.post(`/stage/onstage/`,{id,stagename}) 
          }
        }else if(getcommand == 6){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const arg = await this.$http.post('/stage/catch',{id}) 
          }
        }else if(getcommand == 7){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const arg = await this.$http.post('/stage/offstage',{id}) 
          }
        }else if(getcommand == 8){
          const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(user.data){
            const id = user.data.id
            const res = await this.$http.post(`/feedfish/`,{id}) 
          }
        }else{

        }
      }
    })

    window.ipcRenderer.on("danmu-gift",async (event, res) => {
            await this.checksubmitorregistration(res)
            const username = res.nn
            const gfid = res.gfid
            const gfcnt = res.gfcnt
            const hits = res.hits
            console.log(username,gfid,gfcnt,hits);
            console.log(res)
            this.danmugfs.push(res)
            const user = await this.$http.get(`/userbyusername/${res.nn}`)
            if(user.data){
              const id = user.data.id
              const arg = await this.$http.post('/catchgift',{id,gfid}) 
            }
    })

    

  }


async checksubmitorregistration(arg){
   console.log('检查用户是否存在')
   const user = await this.$http.get(`/userbyusername/${arg.nn}`)
          if(!user.data){
            console.log('用户不存在,创建用户')
            const users = await this.$http.get('/user')
            const usernumber = users.data.length
            const id = String(usernumber+1)+String(Math.floor(Math.random()*1000))
            const user = await this.$http.post('user',{
                id,
                username: arg.nn, 
                score: 0,
                lastsign:'',
                fishnumber:0
            })        
          }
}

  created(){
    this.init()
    this.getdanmucommands();
    this.getserialports()
    this.getspcnninfo()
    this.getdanmuinfo()
    this.roomid =  9213704
  }
}
</script>

<style scoped>
.no-padding {
  padding: 1%;
}
.h100 {
  height: 100%;
}
.dark {
  /* background-color: #1D2935 !important; */
  color: #fff;
  height: 100%;
  width: 100%;
}
.pannel {
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  flex-direction: row;
}
.roominput {
  display: inline-block !important;
  margin-right: 10px;
}
.danmu {
  background-color: #1d2935;
  display: flex;
  flex-direction:column;
  justify-content:flex-end;
}
.obscheckboxpannel {
  display: flex;
  width: 100%;
}
</style>



// dgb: function (r) {
//         // 赠送礼物
//         // 用户在房间赠送礼物时,服务端发送此消息给客户端。完整的数据部分应包含的 字段如下:
//         // 字段说明
//         //     type   表示为“赠送礼物”消息,固定为 dgb
//         //     rid    房间 ID
//         //     gid    弹幕分组 ID
//         //     gfid   礼物 id
//         //     gs     礼物显示样式
//         //     uid    用户 id
//         //     nn     用户昵称
//         //     str    用户战斗力
//         //     level  用户等级
//         //     dw     主播体重
//         //     gfcnt  礼物个数:默认值 1(表示 1 个礼物)
//         //     hits   礼物连击次数:默认值 1(表示 1 连击)
//         //     dlv    酬勤头衔:默认值 0(表示没有酬勤)
//         //     dc     酬勤个数:默认值 0(表示没有酬勤数量)
//         //     bdl    全站最高酬勤等级:默认值 0(表示全站都没有酬勤)
//         //     rg     房间身份组:默认值 1(表示普通权限用户)
//         //     pg     平台身份组:默认值 1(表示普通权限用户)
//         //     rpid   红包 id:默认值 0(表示没有红包)
//         //     slt    红包开启剩余时间:默认值 0(表示没有红包)
//         //     elt    红包销毁剩余时间:默认值 0(表示没有红包)
//     },
// chatmsg: function (r) {
//         // 弹幕消息
//         // 用户在房间发送弹幕时,服务端发此消息给客户端,完整的数据部分应包含的字 段如下:
//         // 字段说明
//         //     type             表示为“弹幕”消息,固定为 chatmsg
//         //     gid              弹幕组 id
//         //     rid              房间 id
//         //     uid              发送者 uid
//         //     nn               发送者昵称
//         //     txt              弹幕文本内容
//         //     cid              弹幕唯一 ID
//         //     level            用户等级
//         //     gt               礼物头衔:默认值 0(表示没有头衔)
//         //     col              颜色:默认值 0(表示默认颜色弹幕)
//         //     ct               客户端类型:默认值 0(表示 web 用户)
//         //     rg               房间权限组:默认值 1(表示普通权限用户)
//         //     pg               平台权限组:默认值 1(表示普通权限用户)
//         //     dlv              酬勤等级:默认值 0(表示没有酬勤)
//         //     dc               酬勤数量:默认值 0(表示没有酬勤数量)
//         //     bdlv             最高酬勤等级:默认值 0(表示全站都没有酬勤)
//         console.log("<lv %s> [%s]  %s", r.level + (r.level < 10 ? ' ' : ''), r.nn, r.txt)
//     },