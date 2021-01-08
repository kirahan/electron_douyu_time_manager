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

                          <v-col cols="3" offset="4">
                            <v-select
                              :items="serialportlist"
                              v-model="data.value"
                              dense
                              solo
                            ></v-select>
                          </v-col>
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
                          <v-list-item-subtitle>{{
                            data.subtitle1
                          }}</v-list-item-subtitle>
                          <v-text-field
                            v-if="!data.inputhide"
                            class="width-max"
                            dense
                            v-model="data.value"
                          ></v-text-field>
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
                <v-col cols="6">
                  <v-card class="config-pannel">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="headline">
                          {{ obsconfig.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          :label="obsconfig.enable ? ' 启用' : ' 禁用'"
                          v-model="obsconfig.enable"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list class="transparent">
                      <v-list-item
                        v-for="data in obsconfig.data"
                        :key="data.text"
                      >
                        <div
                          v-if="data.type == 'checkbox'"
                          class="obscheckboxpannel"
                        >
                          <v-list-item-title style="flex: 1 1 auto!important">{{
                            data.title
                          }}</v-list-item-title>
                          <v-checkbox
                            v-for="_ch in data.checkboxlist"
                            :key="_ch.name"
                            v-model="_ch.enable"
                            :label="_ch.name"
                          ></v-checkbox>
                        </div>
                        <div
                          v-if="data.type == 'textarea'"
                          class="obscheckboxpannel"
                        >
                          <v-list-item-title style="flex: 1 1 auto!important">{{
                            data.title
                          }}</v-list-item-title>
                          <v-textarea
                            label="提示语"
                            auto-grow
                            outlined
                            rows="3"
                            row-height="25"
                            v-model="data.value"
                          ></v-textarea>
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
                          @click="resetconfig(obsconfig.name)"
                          >重置</v-btn
                        >
                        <v-btn
                          text
                          color="green"
                          class="text-right"
                          @click="exportfiles"
                          >导出OBS配置文件</v-btn
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

  serialportlist = [];

  defaultconfig;

  configlist = {
    signconfig: {
      enable: true,
      name: "签到",
      data: [
        {
          title: "签到时间间隔",
          value: "30",
          subtitle1: "",
          subtitle2: "分钟",
        },
        {
          title: "签到奖励积分",
          value: "100",
          subtitle1: "",
          subtitle2: "分",
        },
        {
          title: "默认直播间",
          value: null,
          subtitle1: "",
          subtitle2: "",
        },
        {
          title: "直播间自动重连",
          value: 1,
          flag: false,
          subtitle1: "",
          subtitle2: "分",
          type: "switch"
        },
      ],
    },
    stageconfig: {
      enable: true,
      name: "上台规则",
      data: [
        {
          title: "上麦积分限制",
          value: "3000",
          subtitle1: "",
          subtitle2: "分",
        },
        {
          title: "每次上麦扣除积分",
          value: "1000",
          subtitle1: "",
          subtitle2: "分",
        },
        {
          title: "操作时长上限",
          value: "20",
          subtitle1: "",
          subtitle2: "秒",
        },
        {
          title: "投食扣除积分",
          value: "100",
          subtitle1: "",
          subtitle2: "分",
        },
      ],
    },
    hwconfig: {
      enable: true,
      name: "硬件",
      data: [
        {
          title: "串口端口",
          value: "COM1",
          subtitle1: "",
          subtitle2: "",
          type: "select",
        },
        {
          title: "波特率",
          value: "9600",
          subtitle1: "",
          subtitle2: "",
        },
        {
          title: "固定结束符(16进制)",
          value: "0d0a",
          subtitle1: "",
          subtitle2: "",
        },
        {
          title: "硬件tcp端口",
          value: "8868",
          subtitle1: "",
          subtitle2: "",
          type: "text",
        },
        {
          title: "上麦1/2/3/4请求地址",
          value: "onstage",
          subtitle1: "",
          subtitle2: "/1/2/3/4",
          type: "text",
        },
        {
          title: "抓请求地址",
          value: "catch",
          subtitle1: "",
          subtitle2: "/1/2/3/4",
          type: "text",
        },
        {
          title: "释放1/2/3/4地址",
          value: "",
          subtitle1: "http://localhost:8080/stage/",
          subtitle2: "/1/2/3/4",
          type: "text",
        },
        {
          title: "下麦请求地址",
          value: "offstage",
          subtitle1: "",
          subtitle2: "/1/2/3/4",
          type: "text",
        },
        {
          title: "喂鱼请求地址",
          value: "feedfish",
          subtitle1: "",
          subtitle2: "",
          type: "text",
        },
      ],
    },
  };

  // oldhwconfig: {
  //   enable: true;
  //   name: "硬件";
  //   data: [
  //     {
  //       title: "硬件tcp端口";
  //       value: "8868";
  //       subtitle1: "";
  //       subtitle2: "";
  //     },
  //     {
  //       title: "上麦1/2/3/4请求地址";
  //       value: "onstage";
  //       subtitle1: "";
  //       subtitle2: "/1/2/3/4";
  //     },
  //     {
  //       title: "抓请求地址";
  //       value: "catch";
  //       subtitle1: "";
  //       subtitle2: "/1/2/3/4";
  //     },
  //     {
  //       title: "释放1/2/3/4地址【硬件发送到软件】";
  //       value: "";
  //       inputhide: true;
  //       subtitle2hide: true;
  //       subtitle1: "http://localhost:8080/stage/release/1或/2或/3或/4";
  //       subtitle2: "";
  //     },
  //     {
  //       title: "下麦请求地址";
  //       value: "offstage";
  //       subtitle1: "";
  //       subtitle2: "/1/2/3/4";
  //     },
  //     {
  //       title: "喂鱼请求地址";
  //       value: "feedfish";
  //       subtitle1: "";
  //       subtitle2: "";
  //     }
  //   ];
  // };

  obsconfig = {
    enable: true,
    name: "OBS配置",
    data: [
      {
        title: "txt文件",
        type: "checkbox",
        checkboxlist: [
          { name: "[帮助.txt]", enable: true },
          { name: "[签到.txt]", enable: true },
          { name: "[礼物.txt]", enable: true },
          { name: "[上麦1.txt]", enable: true },
          { name: "[上麦2.txt]", enable: true },
          { name: "[上麦3.txt]", enable: true },
          { name: "[上麦4.txt]", enable: true },
        ],
      },
      {
        title: "【帮助.txt】提示语",
        type: "textarea",
        value: "",
      },
    ],

  };

  async getconfig() {
    const config = await this.$http.get("/config");

    // set signconfig
    this.configlist.signconfig.enable = config.data.signconfig.enable;
    this.configlist.signconfig.data[0].value = config.data.signconfig.signstep;
    this.configlist.signconfig.data[1].value = config.data.signconfig.signscore;
    this.configlist.signconfig.data[2].value = config.data.signconfig.defaultroomid;
    this.configlist.signconfig.data[3].value = config.data.signconfig.cnnstep;
    this.configlist.signconfig.data[3].flag = config.data.signconfig.dmautorecnn;

    // set stageconfig
    this.configlist.stageconfig.enable = config.data.stageconfig.enable;
    this.configlist.stageconfig.data[0].value =
      config.data.stageconfig.stageminscore;
    this.configlist.stageconfig.data[1].value =
      config.data.stageconfig.stagespendscore;
    this.configlist.stageconfig.data[2].value =
      config.data.stageconfig.stageperiod;
    this.configlist.stageconfig.data[3].value =
      config.data.stageconfig.feedscore;

    // set hwconfig
    this.configlist.hwconfig.enable = config.data.hwconfig.enable;
    this.configlist.hwconfig.data[3].value = config.data.hwconfig.hwport;
    this.configlist.hwconfig.data[4].value = config.data.hwconfig.hwonstage;
    this.configlist.hwconfig.data[5].value = config.data.hwconfig.hwcatch;
    this.configlist.hwconfig.data[6].value = config.data.hwconfig.hwrelease;
    this.configlist.hwconfig.data[7].value = config.data.hwconfig.hwoffstage;
    this.configlist.hwconfig.data[8].value = config.data.hwconfig.hwfeedfish;
    this.configlist.hwconfig.data[0].value = config.data.hwconfig.hwserialport;
    this.configlist.hwconfig.data[1].value = config.data.hwconfig.hwbaudrate;
    this.configlist.hwconfig.data[2].value = config.data.hwconfig.hwendflag;

    // set obsconfig
    this.obsconfig.enable = config.data.obsconfig.enable;
    for (let index in config.data.obsconfig.obsenablefiles) {
      this.obsconfig.data[0].checkboxlist[index].enable =
        config.data.obsconfig.obsenablefiles[index];
    }
    this.obsconfig.data[1].value = config.data.obsconfig.helpcontent;
  }

  async getserialports() {
    const splist = await await this.$http.get("/serialport");
    const ports = [];
    if (splist.data.data) {
      for (let port of splist.data.data) {
        ports.push(port.path);
      }
    }
    this.serialportlist = ports;
  }

  // async cnnsp() {
  //   const port = this.configlist.hwconfig.data[0].value;
  //   const baudrate = this.configlist.hwconfig.data[1].value;
  //   const endflag = this.configlist.hwconfig.data[2].value;
  //   console.log(port, baudrate, endflag);
  //   const cnn = await this.$http.post("/serialport/cnn", {
  //     port,
  //     baudrate,
  //     endflag,
  //   });
  //   console.log(cnn.data);
  // }

  async getdefaultconfig() {
    const config = await this.$http.get("/defaultconfig");
    this.defaultconfig = config.data;
  }

  async setconfig() {
    const signconfig = {
      enable: this.configlist.signconfig.enable,
      signstep: this.configlist.signconfig.data[0].value,
      signscore: this.configlist.signconfig.data[1].value,
      defaultroomid: this.configlist.signconfig.data[2].value,
      dmautorecnn: this.configlist.signconfig.data[3].flag,
      cnnstep: this.configlist.signconfig.data[3].value,
    };
    const stageconfig = {
      enable: this.configlist.stageconfig.enable,
      stageminscore: this.configlist.stageconfig.data[0].value,
      stagespendscore: this.configlist.stageconfig.data[1].value,
      stageperiod: this.configlist.stageconfig.data[2].value,
      feedscore: this.configlist.stageconfig.data[3].value,
    };
    const hwconfig = {
      enable: this.configlist.hwconfig.enable,
      hwport: this.configlist.hwconfig.data[3].value,
      hwonstage: this.configlist.hwconfig.data[4].value,
      hwcatch: this.configlist.hwconfig.data[5].value,
      hwrelease: this.configlist.hwconfig.data[6].value,
      hwoffstage: this.configlist.hwconfig.data[7].value,
      hwfeedfish: this.configlist.hwconfig.data[8].value,
      hwserialport: this.configlist.hwconfig.data[0].value,
      hwbaudrate: this.configlist.hwconfig.data[1].value,
      hwendflag: this.configlist.hwconfig.data[2].value,
    };
    const obsfiles = [];
    for (let index in this.obsconfig.data[0].checkboxlist) {
      const flag = this.obsconfig.data[0].checkboxlist[index].enable;
      obsfiles.push(flag);
    }
    const obsconfig = {
      enable: this.obsconfig.enable,
      obsenablefiles: obsfiles,
      helpcontent: this.obsconfig.data[1].value,
    };
    const config = {
      signconfig,
      stageconfig,
      hwconfig,
      obsconfig,
    };
    const res = await this.$http.post("/config", config);
    console.log(res);

    this.getconfig();
  }

  resetconfig(type) {
    const config = this.defaultconfig;
    if (type == "签到") {
      // set signconfig
      this.configlist.signconfig.enable = config.signconfig.enable;
      this.configlist.signconfig.data[0].value = config.signconfig.signstep;
      this.configlist.signconfig.data[1].value = config.signconfig.signscore;
    } else if (type == "上台规则") {
      // set stageconfig
      this.configlist.stageconfig.enable = config.stageconfig.enable;
      this.configlist.stageconfig.data[0].value =
        config.stageconfig.stageminscore;
      this.configlist.stageconfig.data[1].value =
        config.stageconfig.stagespendscore;
      this.configlist.stageconfig.data[2].value =
        config.stageconfig.stageperiod;
      this.configlist.stageconfig.data[3].value = config.stageconfig.feedscore;
    } else if (type == "硬件") {
      // set hwconfig
      this.configlist.hwconfig.enable = config.data.hwconfig.enable;
      this.configlist.hwconfig.data[0].value = config.data.hwconfig.hwport;
      this.configlist.hwconfig.data[1].value = config.data.hwconfig.hwonstage;
      this.configlist.hwconfig.data[2].value = config.data.hwconfig.hwcatch;
      this.configlist.hwconfig.data[3].value = config.data.hwconfig.hwrelease;
      this.configlist.hwconfig.data[4].value = config.data.hwconfig.hwoffstage;
      this.configlist.hwconfig.data[5].value = config.data.hwconfig.hwfeedfish;
      this.configlist.hwconfig.data[6].value =
        config.data.hwconfig.hwserialport;
      this.configlist.hwconfig.data[7].value = config.data.hwconfig.hwbaudrate;
      this.configlist.hwconfig.data[8].value = config.data.hwconfig.hwendflag;
    } else if (type == "OBS配置") {
      // set obsconfig
      this.obsconfig.enable = config.obsconfig.enable;
      for (let index in config.obsconfig.obsenablefiles) {
        this.obsconfig.data[0].checkboxlist[index].enable =
          config.obsconfig.obsenablefiles[index];
      }
      this.obsconfig.data[1].value = config.obsconfig.helpcontent;
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
    this.getserialports();
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
