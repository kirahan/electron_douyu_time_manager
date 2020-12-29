<template>
  <v-layout app class="dark h100">
    <v-container class="no-padding h100" fluid>
      <v-row no-gutters align-center justify-center class="h100">
        <v-col cols="12">
          <v-sheet elevation-10 class="rounded-lg pa-3 pannel h100">
            <div class="text-md-h6 d-inline-block">
              <p>用户列表</p>
               <div>
                <v-switch dark color="green" :label="debugmode ? ' 开启调试工具栏' : '关闭调试'" v-model="debugmode"></v-switch>
              </div>
            </div>
           


            <v-divider class="mt-5"></v-divider>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="desserts"
                :items-per-page="10"
                class="elevation-5"
                height="100%"
                dense
                @click:row="filldata"
              >

                <template v-slot:item.lastsign="{ item }">
                  {{ item.lastsign ? item.lastsign : "-" }}
                </template>

                <template v-if="debugmode" v-slot:item.debug="{ item }">
                    <v-btn text color="blue" @click.stop="debugfunctionlist.get(item)">查询</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.sign(item)">签到</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.gift(item)">礼物</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.onstage1(item)">上麦1</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.onstage2(item)">上麦2</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.onstage3(item)">上麦3</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.onstage4(item)">上麦4</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.catch(item)">抓</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.catchend1(item)">释放1</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.catchend2(item)">释放2</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.catchend3(item)">释放3</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.catchend4(item)">释放4</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.offstage(item)">下麦</v-btn>
                    <v-btn text color="blue" @click.stop="debugfunctionlist.feedfish(item)">喂鱼</v-btn>
                </template>

              </v-data-table>
            </v-col>
          </v-sheet>

          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">修改</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="积分*"
                        v-model="userdata.score"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  关闭
                </v-btn>
                <v-btn color="red darken-1" text @click="deleteuser">
                  删除
                </v-btn>
                <v-btn color="green darken-1" text @click="updateuser">
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import { sign } from "crypto";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class user extends Vue {
  constructor() {
    super();
  }

  debugmode = true

  dialog = false;
  userdata = {
    id: "",
    username: "",
    score: "",
    lastsign: ""
  };
  headers = [
    { text: "用户id", align: "start", value: "id" },
    { text: "用户昵称", value: "username" },
    { text: "积分", value: "score" },
    { text: "上次签到", value: "lastsign", align: "center" },
    { text: "debug", value: "debug", align: "center"},
  ];
  desserts = [];


async filldata(data){
    const id = data.id
    const user = await this.$http.get(`/user/${id}`)
    this.userdata = user.data
    this.dialog = true;
  }
  async deleteuser(){
    const user = await this.$http.delete(`/user/${this.userdata.id}`)
    this.dialog = false;
    this.getuserdata()
  }

  async updateuser(){
    const res = await this.$http.put(`/user`,this.userdata)
    this.dialog = false;
    this.getuserdata()
  }

  async getuserdata() {
    const user = await this.$http.get('/user')
    this.desserts = user.data
  }

  debugfunctionlist = {
    get: async (data)=>{
      const {id,username,score,lastsing} = data
      const sign = await this.$http.post('/check',{id})
      this.getuserdata()
    },
    gift: async (data)=>{
      const {id,username,score,lastsing} = data
      const gfid = '195'
      const sign = await this.$http.post('/catchgift',{id,gfid})
      this.getuserdata()
    },
    sign: async (data)=>{
      const {id,username,score,lastsing} = data
      const now = Date.now()
      const sign = await this.$http.post('/sign',{id,now})
      this.getuserdata()
    },
    onstage1: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/onstage',{id,stagename:'stage1'}) 
      this.getuserdata()
    },
    onstage2: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/onstage',{id,stagename:'stage2'}) 
      this.getuserdata()
    },
    onstage3: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/onstage',{id,stagename:'stage3'}) 
      this.getuserdata()
    },
    onstage4: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/onstage',{id,stagename:'stage4'}) 
      this.getuserdata()
    },
    catch: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/catch',{id}) 
      this.getuserdata()
    },
    catchend1: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/release/1') 
      this.getuserdata()
    },
    catchend2: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/release/2') 
      this.getuserdata()
    },
     catchend3: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/release/3') 
      this.getuserdata()
    },
    catchend4: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/release/4') 
      this.getuserdata()
    },
    offstage: async (data)=>{
      const {id,username,score,lastsing} = data
      const onstage = await this.$http.post('/stage/offstage',{id}) 
      this.getuserdata()
    },
    feedfish: async(data) => {
      const {id} = data
      const feedfish = await this.$http.post('/feedfish',{id})
      this.getuserdata()
    }
  }

  async setstageidle(){
    const res = await this.$http.post('/stage/setidle',{})
  }

  created(){
    this.setstageidle()
    this.getuserdata()
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
}
</style>
