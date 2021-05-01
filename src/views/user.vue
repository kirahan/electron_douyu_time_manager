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
              >

                <template v-slot:item.lastsign="{ item }">
                  {{ item.lastsign ? item.lastsign : "-" }}
                </template>

                <template v-if="debugmode" v-slot:item.debug="{ item }">
                    <v-btn text color="green" @click.stop="debugfunctionlist.follow(item)">关注+1</v-btn>
                    <v-btn text color="purple" @click.stop="debugfunctionlist.catchgift1(item)">礼物1</v-btn>
                    <v-btn text color="orange" @click.stop="debugfunctionlist.catchgift2(item)">礼物2</v-btn>
                    <v-btn text color="red" @click.stop="debugfunctionlist.deleteuser(item)">删除</v-btn>
                </template>

              </v-data-table>
            </v-col>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
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
    lastsign: "",
    fishnumber: ""
  };
  headers = [
    { text: "用户id", align: "start", value: "id" },
    { text: "用户昵称", value: "username" },
    { text: "上次关注", value: "lastsign", align: "center" },
    { text: "debug", value: "debug", align: "center"},
  ];
  desserts = [];



  async deleteuser(){
    const user = await this.$http.delete(`/user/${this.userdata.id}`)
    this.dialog = false;
    this.getuserdata()
  }

  async updateuser(){
    const res = await this.$http.put(`/user`,this.userdata)
    console.log(this.userdata)
    this.dialog = false;
    this.getuserdata()
  }

  async getuserdata() {
    const user = await this.$http.get('/user')
    this.desserts = user.data
  }

  debugfunctionlist = {
    follow: async (data)=>{
      const follownumber = 1
      const sign = await this.$http.post('/followsup',{follownumber})
      this.getuserdata()
    },
    catchgift1: async (data)=>{
      const gfid = '193'
      const sign = await this.$http.post('/catchgift',{gfid})
      this.getuserdata()
    },
    catchgift2: async (data)=>{
      const gfid = '57'
      const sign = await this.$http.post('/catchgift',{gfid})
      this.getuserdata()
    },
    deleteuser:async(data) => {
      const {id} = data
      const user = await this.$http.delete(`/user/${id}`)
      this.getuserdata()
    }
  }
  created(){
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
