<template>
  <v-layout app class="dark h100">
    <v-container class="no-padding h100" fluid>
      <v-row no-gutters align-center justify-center class="h100">
        <v-col cols="12">
          <v-sheet elevation-10 class="rounded-lg pa-3 pannel h100">
            <div class="text-md-h6 d-inline-block mr-3">
              房间指令设置【该页面支持直播间弹幕指令如签到，点歌等功能，如需使用请联系开发者-wx：zhaohan6570】
            </div>
            <v-btn v-if="false" color="#70CCA2" dark elevation="2" @click="addcommand"
              >新增</v-btn
            >
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
              </v-data-table>
            </v-col>
          </v-sheet>

          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">编辑修改</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="编号*"
                        v-model="commanddata.id"
                        v-if="!commandupdate"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="指令*"
                        v-model="commanddata.command"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="说明*"
                        v-model="commanddata.des"
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
                <v-btn color="green darken-1" text @click="addorupdate">
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
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Command extends Vue {
  constructor() {
    super();
  }
  dialog = false;
  commandupdate = false;
  commanddata = {
    id: "",
    command: "",
    des: ""
  };
  headers = [
    { text: "命令编号", align: "start", value: "id" },
    { text: "指令", value: "command" },
    { text: "指令说明", value: "des" },
  ];
  desserts = [];

  addcommand() {
    this.dialog = true;
    this.commandupdate = false
    this.commanddata = {
       id: "",
    command: "",
    des: ""
    };
  }

  async addcommanddata() {
    const command = await this.$http.post('/command',this.commanddata)
    this.dialog = false;
    this.getcommanddata()
  }

async filldata(data){
    const id = data.id
    const command = await this.$http.get(`/command/${id}`)
    this.commanddata = command.data
    this.dialog = true;
    this.commandupdate = true
  }
  async deletecommand(){
    const command = await this.$http.delete(`/command/${this.commanddata.id}`)
    this.dialog = false;
    this.getcommanddata()
  }

  async updatecommand(){
    const res = await this.$http.put('/command',this.commanddata)
    this.dialog = false;
    this.getcommanddata()
  }

  async getcommanddata() {
    const command = await this.$http.get('/command')
    this.desserts = command.data
  }

  addorupdate(){
    if(this.commandupdate){
      this.updatecommand()
    }else{
      this.addcommanddata()
    }
  }

  created(){
    this.getcommanddata()
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
