const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
   configureWebpack: {
      resolve: {
        fallback: {
          path: false,
		  fs: false,
        },
      },
  },
  lintOnSave: false,
  transpileDependencies: true,
  //插件配置
    pluginOptions: {
      //electronBuilder配置
      electronBuilder: {
		nodeIntegration: true,
		customFileProtocol: "./",
		//preload:'src/preload.js',
        builderOptions: {
          'productName': 'rpaTask',//生成exe的名字
          "appId": "com.wush.rpa",//包名  
          "copyright": "wush",//版权信息
          "directories": { // 输出文件夹
            "output": "../build",
          },
		  "extraResources":  {
		      "from": "./app/",
		      "to": "app"
		  },
          "nsis": {
            "oneClick": false, // 是否一键安装
            "allowElevation": true, // 允许请求提升。若为false，则用户必须使用提升的权限重新启动安装程序。
            "allowToChangeInstallationDirectory": true, //是否允许修改安装目录
            //"installerIcon": "‪../dist_electron/bundled/favicon.ico",// 安装时图标
            //"uninstallerIcon": "../dist_electron/bundled/favicon.ico",//卸载时图标
            //"installerHeaderIcon": "../dist_electron/bundled/favicon.ico", // 安装时头部图标
            "createDesktopShortcut": true, // 是否创建桌面图标
            "createStartMenuShortcut": true,// 是否创建开始菜单图标
            "shortcutName": "rpaTask", // 快捷方式名称
            "runAfterFinish": false,//是否安装完成后运行
			//"include": "build/script/installer.nsh"
          },
          "win": {
			publish: [
				{
					provider: 'generic',
					url: 'http://124.70.167.105:8003/zw'
				}
			],
            "target": ["nsis"]
          }
        }
      }
    }
})
