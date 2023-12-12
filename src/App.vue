<template>
	<!-- <div id="app" class="container" v-loading.fullscreen.lock="myLoadingState">
	  <router-view />
	</div> -->
	<el-container id="app"  style="padding-top: 18px;height: 1024px"  v-loading.fullscreen.lock="myLoadingState">
	    <el-aside width="16%" class="asideClass" style="background-color: rgb(238, 241, 246); height: 100%;">
			<el-menu :default-active="activeIndex" unique-opened router :default-openeds="openeds">
				<el-submenu index="1">
					<template slot="title"><i class="el-icon-s-custom"></i>我的任务</template>
					<el-menu-item class="mymenuitem" index="/" @click='addSubMenu("任务列表","/")'>任务列表</el-menu-item>
				</el-submenu>
				
				<el-submenu index="2">
				   <template slot="title"><i class="el-icon-s-opportunity"></i>计划管理</template>
				   <el-menu-item class="mymenuitem" index="/plan" @click='addSubMenu("计划列表","/plan")'>计划列表</el-menu-item>
				   <!-- <el-menu-item index="/detail" @click='addSubMenu("task列表","/detail")'>task列表</el-menu-item> -->
				   <el-menu-item class="mymenuitem" index="/log" @click='addSubMenu("日志列表","/log")'>log列表</el-menu-item>
				</el-submenu>
				
				<el-submenu index="3">
				   <template slot="title"><i class="el-icon-s-opportunity"></i>账户管理</template>
				   <el-menu-item class="mymenuitem" index="/acc" @click='addSubMenu("账户列表","/acc")'>账户列表</el-menu-item>
				   <el-menu-item class="mymenuitem" index="/plugin" @click='addSubMenu("插件列表","/plugin")'>插件列表</el-menu-item>
				   <el-menu-item class="mymenuitem" index="/proxy" @click='addSubMenu("代理列表","/proxy")'>代理列表</el-menu-item>
				   <el-menu-item class="mymenuitem" index="/group" @click='addSubMenu("分组列表","/group")'>分组列表</el-menu-item>
				</el-submenu>
				
				<el-submenu index="5">
				   <template slot="title"><i class="el-icon-s-opportunity"></i>统计管理</template>
				   <el-menu-item class="mymenuitem" index="/statics" @click='addSubMenu("统计","/statics")'>统计</el-menu-item>
				</el-submenu>
			</el-menu>
	    </el-aside>
	    <el-container style="height: 1024px">
			<el-header style="text-align: left; font-size: 12px" :lable="myTabsIndex">
				<el-radio-group v-model="tabIndex" @change='go'>
					<el-radio-button v-for="item in myTabsStore" :label="item.name" :key="item.name" >
						<el-row>
							<el-col :span="22">
								{{item.name}}
							</el-col>
							
							<el-col :span="2">
								<el-button @click="delSubMenu(item.name)" type="danger" icon="el-icon-close" circle style="position: relative;top: -3px;padding: 1px;"> </el-button>  
							</el-col>
						</el-row>
					</el-radio-button>
				</el-radio-group>
		    </el-header>
		    <el-main >
				 <keep-alive>
				   <router-view v-if="$route.meta.keepAlive"  :key="$store.state.tabIndex" />
				 </keep-alive>
				 <router-view v-if="!$route.meta.keepAlive"  :key="$store.state.tabIndex" />
			</el-main>
		</el-container>
		
		<el-dialog title="正在更新新版本,请稍候..."  :visible.sync="dialogVisible"
		      width="60%" :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape"
		      :show-close="showClose" center >
		      <div style="width:100%;height:15vh;line-height:15vh;text-align:center">
		        <el-progress status="success" :text-inside="true" :stroke-width="20"
		          :percentage="percentage" :width="strokeWidth" :show-text="true" ></el-progress>
		      </div>
		    </el-dialog>
	</el-container>
	
</template>

<script>

import { ipcRenderer } from 'electron' ;


export default {
  name: 'App',
  data() {
	return {
		activeIndex: "1",
		isCollapse: false,
		openeds: ["1","2","3","5"],
		tabIndex: "任务列表",
		dialogVisible: false,
		closeOnClickModal: false,
		closeOnPressEscape: false,
		showClose: false,
		percentage: 0,
		strokeWidth:200
	};
  },
  created() {	
	let _this = this;
	if(_this.$store.state.isMyExe){
		//接收主进程版本更新消息
		ipcRenderer.on("message", (event, arg) => {
		  console.log(arg);
		  if ("update-available" == arg.cmd) {
		    //显示升级对话框
		    _this.dialogVisible = true;
		  } else if ("download-progress" == arg.cmd) {
		    //更新升级进度
		    console.log(arg.message.percent);
		    let percent = Math.round(parseFloat(arg.message.percent));
		    _this.percentage = percent;
		  } else if ("error" == arg.cmd) {
		    _this.dialogVisible = false;
		    _this.$message("更新失败");
		  }
		});
		ipcRenderer.send("checkForUpdate");
	}
  },
  destroyed() {
	console.log("=========destroyed=====")
  },
  computed:{
    myLoadingState:function(){
		return this.$store.state.myLoading;
    },
	myTabsStore:function(){
		return this.$store.state.myTabs;
	},
	myTabsIndex:function(){
		this.tabIndex = this.$store.state.tabIndex;
		return this.$store.state.tabIndex;
	},
  },
  methods:{
	handleOpen(key, keyPath) {
	  //console.log(key, keyPath);
	},
	handleClose(key, keyPath) {
	  //console.log(key, keyPath);
	},
	addSubMenu(name,url){
		this.$store.commit('addTab', {"name":name, "url":url} );
	},
	delSubMenu(name){
		//console.log("delSubMenu==="+name)
		this.$store.commit('delTab', name);
	},
	go(){
		//console.log("this.tabIndex1111===="+this.tabIndex)
		this.$store.commit('updateTabIndex', this.tabIndex);
		let myTabs = this.$store.state.myTabs;
		//console.log("myTabs===="+JSON.stringify(myTabs))
		for (var j = 0; j < myTabs.length; j++) {
			if(myTabs[j].name == this.tabIndex){
				//console.log("tabIndex====="+this.tabIndex + ",url==="+JSON.stringify(myTabs[j]));
				this.$router.push(myTabs[j].url);
			}
		}
	}
  }
}

</script>

<style scoped>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
html, body {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
}

.mymenuitem{
	margin-left: 18px;
}

.container {
	text-align: center;
	background-color: #f8f9fa;
	height: 100%;
}

.el-header {
	background-color: #B3C0D1;
	color: #333;
	line-height: 60px;
}
  
.el-aside {
	color: #333;
}

</style>

 