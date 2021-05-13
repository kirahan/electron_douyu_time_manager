<template>
  <v-layout app class="dark h100">
    <v-container class="pa-2 h100" fluid>
      <v-row no-gutters align-center justify-center class="h100">
        <v-col cols="12" class="no-padding">
          <v-sheet elevation-10 class="rounded-lg pa-3 pannel h100">
            <v-col cols="12" class="no-padding">
              <v-row>
                <v-col
                  cols="6"
                  v-for="config in configlist"
                  :key="config.data.type"
                >
                  <v-card class="config-pannel">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="headline">
                          {{ config.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          :label="config.enable ? ' 启用' : ' 禁用'"
                          v-model="config.enable"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list class="transparent">
                      <v-list-item v-for="data in config.data" :key="data.text">
                        <div
                          v-if="
                            data.hasOwnProperty('type') && data.type == 'select'
                          "
                          class="obscheckboxpannel"
                        >
                          <v-list-item-title style="max-width: fit-content;">{{
                            data.title
                          }}</v-list-item-title>

                        
                        </div>
                        <div
                          v-else-if="
                            data.hasOwnProperty('type') && data.type == 'text'
                          "
                          class="obscheckboxpannel"
                        >
                          <v-list-item-title>{{
                            data.title
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.subtitle1
                          }}</v-list-item-subtitle>
                          <v-list-item-subtitle>{{
                            data.value
                          }}</v-list-item-subtitle>
                          <v-list-item-subtitle v-if="!data.subtitle2hide">{{
                            data.subtitle2
                          }}</v-list-item-subtitle>
                        </div>

                        <div
                          v-else-if="
                            data.hasOwnProperty('type') && data.type == 'switch'
                          "
                          class="obscheckboxpannel"
                        >
                    
                          <v-list-item-title>{{
                            data.title
                          }}</v-list-item-title>
                          <v-list-item-subtitle >
                                <v-switch
                              v-model="data.flag"
                            ></v-switch>
                          </v-list-item-subtitle>
        
                        </div>

                        <div v-else class="obscheckboxpannel">
                          <v-list-item-title>{{
                            data.title
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.subtitle1
                          }}</v-list-item-subtitle>
                          <v-text-field
                            v-if="!data.inputhide"
                            class="width-max"
                            dense
                            v-model="data.value"
                          ></v-text-field>
                          <v-list-item-subtitle v-if="!data.subtitle2hide">{{
                            data.subtitle2
                          }}</v-list-item-subtitle>
                        </div>
                      </v-list-item>
                    </v-list>

                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="error"
                          class="text-right"
                          @click="resetconfig(config.name)"
                          >重置</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          class="text-right"
                          @click="setconfig"
                          >确定</v-btn
                        >
                      </v-list-item>
                    </v-card-actions>
                  </v-card>
                </v-col>
            
              </v-row>
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
export default class Setting extends Vue {
  constructor() {
    super();
  }



  defaultconfig;

  configlist = {
    roomconfig: {
      enable: true,
      name: "直播间设置",
      data: [
        {
          title: "默认直播间",
          value: null,
          subtitle1: "",
          subtitle2: "",
        },
        {
          title: "自动重连",
          flag: true,
          type: "switch"
        },
        {
          title: "重连最大时间",
          value: 1,
          subtitle1: "",
          subtitle2: "分",
        },
      ],
    },
    timerconfig: {
      enable: true,
      name: "时长规则",
      data: [
        {
          title: "初始时间",
          value: "10",
          subtitle1: "",
          subtitle2: "分",
        },
        {
          title: "关注奖励时长",
          value: "1",
          subtitle1: "",
          subtitle2: "分",
        }
      ],
    }
  };


  async getconfig() {
    const config = await this.$http.get("/config");

    // set roomconfig
    this.configlist.roomconfig.enable = config.data.roomconfig.enable;
    this.configlist.roomconfig.data[0].value = config.data.roomconfig.defaultroomid;
    this.configlist.roomconfig.data[1].flag = config.data.roomconfig.dmautorecnn;
    this.configlist.roomconfig.data[2].value = config.data.roomconfig.cnnstep;

    // set timerconfig
    this.configlist.timerconfig.enable = config.data.timerconfig.enable;
    this.configlist.timerconfig.data[0].value =
      config.data.timerconfig.starttime;
    this.configlist.timerconfig.data[1].value =
      config.data.timerconfig.followaddtime;
  }

  async getdefaultconfig() {
    const config = await this.$http.get("/defaultconfig");
    this.defaultconfig = config.data;
  }

  async setconfig() {
    const roomconfig = {
      enable: this.configlist.roomconfig.enable,
      defaultroomid: this.configlist.roomconfig.data[0].value,
      dmautorecnn: this.configlist.roomconfig.data[1].flag,
      cnnstep: this.configlist.roomconfig.data[2].value
    };
    const timerconfig = {
      enable: this.configlist.timerconfig.enable,
      starttime: this.configlist.timerconfig.data[0].value,
      followaddtime: this.configlist.timerconfig.data[1].value
    };
  
    const config = {
      roomconfig,
      timerconfig
    };
    const res = await this.$http.post("/config", config);
    console.log(res);
    this.getconfig();

    const resettimer = await this.$http.get("/timer/reset");
  }

  resetconfig(type) {
    const config = this.defaultconfig;
    if (type == "直播间设置") {
      // set roomconfig
      this.configlist.roomconfig.enable = config.roomconfig.enable;
      this.configlist.roomconfig.data[0].value = config.roomconfig.defaultroomid;
      this.configlist.roomconfig.data[1].flag = config.roomconfig.dmautorecnn;
      this.configlist.roomconfig.data[2].value = config.roomconfig.cnnstep;
    } else if (type == "时长规则") {
      // set timerconfig
      this.configlist.timerconfig.enable = config.timerconfig.enable;
      this.configlist.timerconfig.data[0].value =
        config.timerconfig.starttime;
      this.configlist.timerconfig.data[1].value =
        config.timerconfig.followaddtime;
    } 
    this.setconfig();
  }

  async exportfiles() {
    const config = await this.$http.get("/config");

    window.ipcRenderer.send("export-obsfiles", config.data);
    // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  }

  created() {
    this.getconfig();
    this.getdefaultconfig();
  }
}
</script>

<style scoped>
.no-padding {
  padding: 0%;
}
.h100 {
  height: 100%;
}
.h50 {
  height: 50%;
}
.h20 {
  height: 20%;
}
.h10 {
  height: 10%;
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
  flex-direction: column;
}
.config-pannel {
  height: 100%;
  display: grid !important;
}
.obscheckboxpannel {
  display: flex;
  width: 100%;
}
.switchpannel {
  display: flex;
  width: 60%;
}
.width-max {
  min-width: fit-content;
  text-align: center;
}
</style>
