declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}


// ts的自动补全支持
import { AxiosInstance } from "axios";

declare module "vue/types/vue" {
  interface Vue {
    $http: AxiosInstance;
  }
}

