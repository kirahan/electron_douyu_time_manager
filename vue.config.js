module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    devtool: 'source-map',
  },
  pluginOptions: {
    electronBuilder: {
      preload: './src/plugins/preload.ts',
      nodeIntegration: true,
      builderOptions: {
        "appId": "com.kira.app",
        "productName":"yu",//项目名，也是生成的安装文件名，即aDemo.exe
        "copyright":"Copyright © 2020",//版权信息
        // "directories":{
        //     "output":"./distnew"//输出文件路径
        // },
        "win":{//win相关配置
            "target": [
                {
                    "target": "nsis",//利用nsis制作安装程序
                    "arch": [
                        "x64"//64位
                    ]
                }
            ]
        },
        "nsis": {
            "oneClick": false, // 是否一键安装
            "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            "allowToChangeInstallationDirectory": true, // 允许修改安装目录
            "createDesktopShortcut": true, // 创建桌面图标
            "createStartMenuShortcut": true,// 创建开始菜单图标
            "shortcutName": "demo", // 图标名称
        },
  
      },
      externals: ['serialport'],
      mainProcessWatch: ['src/api.ts','src/serialport.ts','src/danmu.ts'],
      // chainWebpackMainProcess:(config) => {
      //   config.node.set("__dirname",false)
      // }
    }
  }
}