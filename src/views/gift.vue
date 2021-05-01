<template>
  <v-layout app class="dark h100">
    <v-container class="no-padding h100" fluid>
      <v-row no-gutters align-center justify-center class="h100">
        <v-col cols="12">
          <v-sheet elevation-10 class="rounded-lg pa-3 pannel h100">
            <div class="text-md-h6 d-inline-block mr-3">
              斗鱼礼物列表和时长规则
            </div>
            <v-btn color="#70CCA2" dark elevation="2" @click="addgift"
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
              <!-- 显示图片 -->
              <template v-slot:item.icon="{ item }">
                 <v-img :src="item.url" contain max-height="48" max-width="48"></v-img>
              </template>
              <!-- 状态按钮 -->
              <template v-slot:item.enable="{ item }">
                  <v-chip
                    class="ma-2"
                    :color="item.enable ? 'green' : 'grey'"
                    outlined
                    label
                  >
                    {{ item.enable ? "ON" : "OFF" }}
                  </v-chip>
                </template>
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
                    <v-autocomplete
                       v-if="!giftupdate"
                      v-model="giftvalue"
                      :items="douyugiftlist"
                      item-text="name"
                      item-value="id"
                      label="礼物列表[价值|名称|ID|图标]"
                      @change="updategiftformdata"
                    >
                      <template v-slot:item="{ item }" >
                        <v-list-item-avatar
                          color="indigo"
                          class="subtitle-2 font-weight-light white--text"
                        >
                          {{item.price/100}}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.name + ' | ' + item.id"></v-list-item-title>
                          
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-img :src="item.url" contain max-height="48" max-width="48"></v-img>
                        </v-list-item-action>
                      </template>
                    
                    </v-autocomplete>
                    <v-col cols="12">
                      <v-text-field
                        label="时长*[分钟,可以是负数]"
                        v-model="giftdata.timevalue"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="giftdata.enable"
                        flat
                        :label="giftdata.enable ? '礼物生效' : '礼物不生效'"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  关闭
                </v-btn>
                <v-btn
                  v-if="giftupdate"
                  color="red darken-1"
                  text
                  @click="deletegift"
                >
                  删除
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
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Gift extends Vue {
  constructor() {
    super();
  }
  giftvalue={}
  douyugiftlist=[];
  douyugiftobj = {};
  dialog = false;
  giftupdate = false;
  giftdata = {
    id: "",
    name: "",
    price:"",
    url: "",
    timevalue: "",
    enable: true,
  };
  headers = [
    { text: "礼物ID", align: "start", value: "id" },
    { text: "礼物名称", value: "name" },
    { text: "礼物价值[元]", value: "price" },
    { text: "时长增/减[分钟]", value: "timevalue" },
    { text: "图标", value: "icon" , align: "center"},
    { text: "启用", value: "enable", align: "center" },
  ];
  desserts = [];


// 无法获取到真个数组数据只能获得name字段，所以改为获取到id字段，然后再用watch实现
  @Watch('giftvalue')
  onGiftValueChange(newval,oldval){
    console.log('giftvalue change',newval,oldval);
    this.giftdata.id = this.douyugiftobj[newval].id
    this.giftdata.name = this.douyugiftobj[newval].name
    this.giftdata.price = (this.douyugiftobj[newval].price/100).toString()
    this.giftdata.url = this.douyugiftobj[newval].url

  }


  addgift() {
    this.dialog = true;
    this.giftupdate = false;
    this.giftdata = {
      id: "",
      name: "",
      price:"",
      url: "",
      timevalue: "",
      enable: true,
    };
  }

  updategiftformdata(data,newd){
    console.log(data,newd)
  }

  async getalldouyugiftlsit(){
    const giftlist = await this.$http.get("/douyugiftlist");
    this.douyugiftlist = giftlist.data;

    const giftobj = await this.$http.get("/douyugiftobj");
    this.douyugiftobj = giftobj.data
  }

  async addgiftdata() {
    const gift = await this.$http.post("/gift", this.giftdata);
    this.dialog = false;
    this.getgiftdata();
  }

  async filldata(data) {
    const id = data.id;
    const gift = await this.$http.get(`/gift/${id}`);
    this.giftdata = gift.data;
    this.giftvalue = gift.data.id
    this.dialog = true;
    this.giftupdate = true;
  }
  async deletegift() {
    const gift = await this.$http.delete(`/gift/${this.giftdata.id}`);
    this.dialog = false;
    this.getgiftdata();
  }

  async updategift() {
    console.log(this.giftdata)
    const res = await this.$http.put("/gift", this.giftdata);

    this.dialog = false;
    this.getgiftdata();
  }

  async getgiftdata() {
    const gift = await this.$http.get("/gift");
    this.desserts = gift.data;
  }

  addorupdate() {
    if (this.giftupdate) {
      this.updategift();
    } else {
      this.addgiftdata();
    }
  }

  created() {
    this.getgiftdata();
    this.getalldouyugiftlsit();
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
