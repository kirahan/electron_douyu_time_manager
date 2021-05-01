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
                <v-switch v-model="showdanmu" color="error" :label="showdanmu?'关闭弹幕':'显示弹幕'" ></v-switch>

                <v-btn small color="success" style="margin-right:20px" @click="starttimer">开始</v-btn>
                <!-- <v-btn color="warning" style="margin-right:20px" @click="pausetimer">暂停</v-btn> -->
                <v-btn small color="danger" style="margin-right:20px" @click="resettimer">重置</v-btn>
              </div>

              <v-col cols="12" class="eventlog rounded-lg">
                <div v-for="event in eventlist" :key="event.message+Math.random()">
                  <span class="pr-3" style="color:grey">{{event.timestamp}}</span>
                  <span class="pr-3" style="color:red">[{{event.type}}]</span>
                  <span color="blue" class="pr-3" style="color:#4FC1E9">{{event.name}}</span>
                  <span color="green" class="">:{{event.message}}</span>
                </div>
            </v-col>
            </v-col>
            <v-col cols="8" class="danmu rounded-lg">
                <div v-if="showdanmu">
                  <div v-for="msg in danmumsgs" :key="msg.now">
                  <span class="pr-3" style="color:green">[Lv{{msg.level}}]</span>
                  <span color="blue" class="pr-3" style="color:#4FC1E9">{{msg.nn}}</span>
                  <span color="white" class="">{{msg.txt}}</span>
                  </div>
                  
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
  // 系统事件记录
  eventlist = []
  // 弹幕消息
  danmumsgs = []
  // 礼物消息
  danmugfs = []
  danmucommands = []

  showdanmu = false
  formconfig = {
    danmu : {
      cnncolor :'#007ACC',
      closecolor : '',
      btncnntitle : '连接',
      btnclosetitle : '关闭',
      
    }
  }

  dmcnn = null
  dmiscnn = false
  
  roomconfig = {
    defaultroomid : '',
    cnnstep:1,
    dmautorecnn: false
  }

  discnnbtnpressed = false

  autorunlooptasks = null

  async getdanmucommands(){
    const  res = await this.$http.get('/command')
    for(let index in res.data){
      this.danmucommands.push(res.data[index].command)
    }
    console.log(this.danmucommands)
  }

  async getconfig(){
    const config = await this.$http.get("/config");
    // set signconfig
    this.roomconfig.defaultroomid = config.data.roomconfig.defaultroomid;
    this.roomconfig.cnnstep = config.data.roomconfig.cnnstep;
    this.roomconfig.dmautorecnn = config.data.roomconfig.dmautorecnn;
    this.roomid = this.roomconfig.defaultroomid || ''
    console.log(this.roomconfig)
  }

  async getdanmuinfo(){
    window.ipcRenderer.send("danmu-command-dmiscnn");
    return true
  }

  async cnndanmu() {
    window.ipcRenderer.send("danmu-client-init", 'ping');
    this.getdanmuinfo()
    // 没有输入房间号
    if(!this.roomid){
      console.log('没有输入房间号')
      return false
    }else if(!this.dmiscnn){
        this.discnnbtnpressed = false
        await  window.ipcRenderer.send("danmu-command-cnn",this.roomid);
    }
    // 刷新状态
  // await this.getdanmuinfo()
  
  }

  async closedanmu(){
    this.getdanmuinfo()
    // 已经连接
    if(!this.dmiscnn){
      return false
    }else{
      this.dmiscnn = false
      this.discnnbtnpressed = true
      window.ipcRenderer.send("danmu-command-close");
    }
    // 刷新状态
    this.getdanmuinfo()
  }


  async  init(){
    window.ipcRenderer.removeAllListeners("danmu-gift")
    window.ipcRenderer.removeAllListeners("danmu-msg")

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
           this.pushArrayByMaxLength(this.eventlist,{
                 timestamp:this.formatDate(Date.now()),
            type:'直播间',
            name:'连接',
            message:'连接成功 '
                })
          if(this.autorunlooptasks){
            clearInterval(this.autorunlooptasks)
          }
      }else if(arg=='err'){
          console.log('err')
          // 异常提醒
          // this.eventlist.push({
          //   timestamp:this.formatDate(Date.now()),
          //   type:'直播间',
          //   name:'连接',
          //   message:'直播间异常'
          // })
      }else if(arg=='disconnect'){
          console.log('disconnect')
          this.pushArrayByMaxLength(this.eventlist,{
                 timestamp:this.formatDate(Date.now()),
            type:'直播间',
            name:'连接',
            message:'断开连接'
                })
          // 当开启自动重连的时候  且是异常情况导致的掉线   且没有定时任务的时候开启定时重连
          if(this.roomconfig.dmautorecnn && !this.discnnbtnpressed && !this.autorunlooptasks){
             
             this.autorunlooptasks =  setInterval(()=>{
                this.cnndanmu()
                this.pushArrayByMaxLength(this.eventlist,{
                  type:'指令消息',
                  message:`${this.roomconfig.cnnstep}分钟后将进行重连`,
                })
                console.log('auto cnn')
              },this.roomconfig.cnnstep*10000)
          }
      }
    })

    window.ipcRenderer.on("danmu-msg",async(event, arg) => {
      if(this.showdanmu){
if(this.danmumsgs.length>20){
                  this.danmumsgs.splice(0,1)
                  this.danmumsgs.push(arg)
      }else{
          this.danmumsgs.push(arg)
      }
      const getcommand = this.danmucommands.indexOf(arg.txt)
      if(getcommand!=-1){
    
        // getcommand=1 注册
        // getcommand=2 
        // getcommand=3 
        // getcommand=4 
        // getcommand=5 
        // getcommand=6 
        // getcommand=7 
        // getcommand=8 
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
        }else{

        }
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
            // this.danmugfs.push(res)
            this.pushArrayByMaxLength(this.danmugfs,res)
            const user = await this.$http.get(`/userbyusername/${res.nn}`)
            if(user.data){
              const id = user.data.id
              const arg = await this.$http.post('/catchgift',{gfid}) 
            }
    })

    

  }

  async starttimer(){
    const timer = await this.$http.get("/timer/start");
  }

  async pausetimer(){
    const timer = await this.$http.get("/timer/pause");
  }

  async resettimer(){
    const timer = await this.$http.get("/timer/reset");
  }


formatDate(datetime) {
    var date = new Date(datetime);
    var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
    // 拼接
    var result = year + "-"+ month +"-"+ sdate +" "+ hour +":"+ minute +":" + second;
    // 返回
    return result;
}

pushArrayByMaxLength(array:{}[],data:{},maxlength?:number){
  maxlength = maxlength || 30
  if(array.length>maxlength){
                  array.splice(0,1)
                  array.push(data)
      }else{
        array.push(data)
  }
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

    // 在ipc中初始化弹幕事件
    this.init()
    // 获取配置参数
    this.getconfig()
    // 获取命令
    this.getdanmucommands();
    // 获取弹幕连接状态
    this.getdanmuinfo()
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
  margin-top: 20px;
  display: flex;
  flex-direction:column;
  justify-content:flex-end;
}
.eventlog{
  margin-top: 20px;
  font-size: 12px;
  background-color: #1d2935;
  display: flex;
  flex-direction:column;
  justify-content:flex-end;
  height: 80%;
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