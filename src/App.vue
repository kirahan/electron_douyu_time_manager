<template>
  <v-app dark class="main">
    
   
    <v-main>
      <keep-alive>
              <router-view :key="this.$route.path"></router-view>
      </keep-alive>
    </v-main>

    <v-card>
       <v-tabs fixed-tabs background-color="#304457"  color="#8F80FB"  dark v-model="tab">
        <v-tab v-for="t in tablist" :key="t.text" @click="gotopage(t.link)" class="headline">{{t.text}}</v-tab>
        </v-tabs>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Ref, Emit } from "vue-property-decorator";

@Component({
  components: { },
})
export default class App extends Vue {
  constructor() {
    super();
  }
  tab=0;
  tablist = [
    // {
    //   name: "",
    //   text: "简介",
    //   link: "/"
    // },
    {
      name: "",
      text: "弹幕",
      link: "/danmu"
    },{
      name: "",
      text: "礼物",
      link: "/gift"
    },{
      name: "",
      text: "命令",
      link: "/command"
    },{
      name: "",
      text: "用户",
      link: "/user"
    },
    // {
    //   name: "",
    //   text: "硬件",
    //   link: "/hw"
    // },
    {
      name: "",
      text: "设置",
      link: "/setting"
    },
    // {
    //   name: "",
    //   text: "OBS",
    //   link: "/obs"
    // }
  ]


  gotopage(url){
    if(this.$route.path!=url){
    this.$router.push(`${url}`)
    }
  }

}
</script>

<style>
.main {
  background-color: #1D2935 !important;
  overflow: hidden;
}
.electron-dragable {
  -webkit-app-region: drag;
}
</style>
