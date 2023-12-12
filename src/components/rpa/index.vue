<template>
  <div id="myApp">
	<el-form ref="rpaFormRef" :model="rpaForm" label-width="108px" :rules="rules" >
		
		<el-form-item label="安装路径">
			<el-input v-model="rpaForm.installPath"></el-input>
		</el-form-item>
		
		<el-form-item label="缓存位置">
			<el-input v-model="rpaForm.cachePath"></el-input>
		</el-form-item>
		
		<el-form-item label="线程">
			<el-input type="number" v-model="rpaForm.threadNum"></el-input>
		</el-form-item>
		
		<el-form-item label="代理使用次数">
			<el-input type="number" v-model="rpaForm.proxyNum"></el-input>
		</el-form-item>
		
		<el-form-item label="插件">
			<el-select v-model="rpaForm.pluginPaths" multiple placeholder="请选择" style="width: 100%;">
				<el-option v-for="item in pluginList" :key="item.pluginPath" :value="item.pluginPath" :label="item.pluginName">
					{{item.pluginName}}
				</el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="任务">
			<el-row>
				<el-col :span="21">
					<el-select v-model="rpaForm.tasks" multiple placeholder="请选择" style="width: 100%;">
						<el-option v-for="item in taskList" :key="item.id" :value="item.id" :label="item.taskName">
							{{item.id}}-{{item.taskName}}
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="3">
					<el-button size="large" type="primary" @click="myListTask()">刷新任务</el-button>
				</el-col>
			</el-row>
		</el-form-item>
		<el-form-item label="账号清单">
			<el-row>
				<el-col :span="21">
					<el-input v-model="rpaForm.accIds" v-show="false"></el-input>
					<el-input v-model="rpaForm.bitNos" disabled></el-input>
				</el-col>
				<el-col :span="3">
					<el-button size="large" type="primary" @click="openAccWindow">选择账户</el-button>
				</el-col>
			</el-row>
		</el-form-item>
		
		<el-form-item label="错误清单">
			<el-input v-model="rpaForm.errorAccIds" v-show="false"></el-input>
			<el-input v-model="rpaForm.errorBitNos" ></el-input>
		</el-form-item>
		
		<el-form-item>
			<el-button type="danger" size="large" @click="exportLog()" >导出日志</el-button>
			<el-button type="danger" size="large" @click="exportErrorLog()" >导出错误日志</el-button>
			<el-button type="danger" size="large" @click="submitFormForError('rpaFormRef')" >错误重跑</el-button>
			<el-button type="primary" size="large" @click="submitForm1('rpaFormRef')">开启错误任务</el-button>
			<el-button type="success" size="large" @click="clearLog()" >清除日志</el-button>
			<el-button type="warning" size="large" @click="openJar" v-show="!$store.state.isOpen">开启服务</el-button>
			<el-button type="warning" size="large" @click="$message.warning('服务已开启')" v-show="$store.state.isOpen" disabled>服务已开启</el-button>
			<el-button type="info" size="large" @click="stopJar">关闭服务</el-button>
			<el-button type="primary" size="large" @click="submitForm('rpaFormRef')">开启任务</el-button>
		</el-form-item>
	</el-form>
	  
	  
    <br />
	<br />
	<el-tabs v-model="activeName" type="border-card" >
	    <el-tab-pane label="1级日志" name="first">
			<el-button type="warning" size="large" @click='genTableList("1","1")'>全部</el-button>
			<el-button type="info" size="large" @click='genTableList("1","2")'>错误</el-button>
			<el-table :data="tableData1" highlight-current-row style="width: 100%">
			    <el-table-column property="bitNo" label="窗口" width="50"> </el-table-column>
			    <el-table-column property="userName" label="账号名称" width="120"> </el-table-column>
			    <el-table-column property="taskName" label="任务名称" width="120"> </el-table-column>
			    <el-table-column property="log" label="日志"> </el-table-column>
			</el-table>
		</el-tab-pane>
	    <el-tab-pane label="2级日志" name="second">
			<el-button type="warning" size="large" @click='genTableList("2","1")'>全部</el-button>
			<el-button type="info" size="large" @click='genTableList("2","2")'>错误</el-button>
			<el-table :data="tableData2" highlight-current-row style="width: 100%">
			    <el-table-column property="bitNo" label="窗口" width="50"> </el-table-column>
			    <el-table-column property="userName" label="账号名称" width="120"> </el-table-column>
			    <el-table-column property="taskName" label="任务名称" width="120"> </el-table-column>
			    <el-table-column property="log" label="日志"> </el-table-column>
			</el-table>
		</el-tab-pane>
	  </el-tabs>
	  
	  <el-dialog  :visible.sync="accsync" width="65%" >
		  <acc ref="accDialog" :accIds="rpaForm.accIds" @getAccIds="getAccIds" @getBitNos="getBitNos"></acc>
	  </el-dialog>
  </div>
</template>
<script>
import { listSubTask } from "@/api/home";
import { getLogWebsocketUrl, delAll } from "@/api/scroll/scroll"
import { runAccTask ,listPlugin,runAccTaskForError,getErrorAccInfo } from "@/api/rpa/rpa"
import dict from "../comm/dict.vue"
import acc from "../comm/acc.vue"
import { ipcRenderer } from 'electron' ;

export default {
  name: "rpa",
  components: { dict, acc },
  data() {
    return {
	  accsync: false,
      rpaForm: {
		/* loginName:"coralHero",
		cachePath:"C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\BrowserCache\\",
		driverPath:"D:\\soft\\bitbrower\\bitbrowser\\resources\\chromedriver\\104\\chromedriver.exe",
		bitPath:"C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\Chrome-bin\\104\\3.0.3\\BitBrowser.exe",
		pluginPath:"C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\BrowserCache\\BitExtensions\\4f5d727e-03de-499c-8ca9-723136327526",
		 */
		userPath: "",
		fingerprintPath: "",
		openBrowser: '1',
		threadNum: 1,
		proxyNum: 3,
		installPath: "",
		cachePath: "",
		pluginPath: "",
		pluginPaths: [],
		accIds: "",
		bitNos: "",
		proxy: "",
		tasks: ""
      },
	  sid: "",
	  timer: "",
	  fileList: undefined,
	  pluginList:[],
	  tableData1: [],
	  tableData2: [],
	  tableData11: [],
	  tableData22: [],
	  currentRow: "",
	  isDisconnect: true,
	  isNoRun: true,
	  activeName: "first",
	  id: undefined,
	  rules: {
		  driverPath: [
			{ required: true, message: "参数名称不能为空" }
		  ],
		  bitPath: [
			{ required: true, message: "比特浏览器不能为空"}
		  ],
		  filePath: [
			{ required: true, message: "文件不能为空"}
		  ],
		  threadNum: [
		  	{ required: true, message: "线程数量不能为空" }
		  ],
		  tasks: [
		  	{ required: true, message: "任务不能为空！" }
		  ]
	  },
	  headList:[{
	      value: '0',
	      label: '0-不打开'
	    }, {
	      value: '1',
	      label: '1-打开'
	   }],
	  taskList:[],
    }
  },
  computed: {},
  watch: {},
  created() {
	
	if(this.$route.query.id){
		this.id = this.$route.query.id.substring(1,this.$route.query.id.length);
	}
	//console.log("id11==="+this.$route.query.id+"===="+this.id);
	
	let sessionId = localStorage.getItem("sessionId");
	let installPath = localStorage.getItem("installPath");
	let pluginPaths = localStorage.getItem("pluginPaths"); 
	let cachePath = localStorage.getItem("cachePath"); 
	let proxy = localStorage.getItem("proxy"); 
	if(installPath && typeof(installPath) !="undefined" && installPath !="undefined" ){
		this.rpaForm.installPath = installPath;
	}
	
	if(pluginPaths && typeof(pluginPaths) !="undefined" && pluginPaths !="undefined" ){
		this.rpaForm.pluginPaths = JSON.parse(pluginPaths);
	}
	
	if(cachePath && typeof(cachePath) !="undefined" && cachePath !="undefined"){
		this.rpaForm.cachePath = cachePath;
	}

	if(proxy && typeof(proxy) !="undefined" && proxy !="undefined" ){
		this.rpaForm.proxy = proxy;
	}
	
	if(!sessionId){
		let r = Math.ceil(Math.random() * 10); 
		let time = new Date().getTime();
		sessionId = "rpa"+time+""+r;
		localStorage.setItem("sessionId",sessionId)
	}
	 //console.log("sessionId====="+sessionId);
	this.sid = sessionId;
	
	let that = this;
	//接收主进程版本更新消息
	if(that.$store.state.isMyExe){
		ipcRenderer.on("myMsg", (event, arg) => {
			console.log("arg=======" + JSON.stringify(arg));
			if ( arg.cmd === "startBat") {
				console.log("arg11111=======startBat========" + arg.cmd);
				that.$store.state.myLoading = false; 
				if(arg.code === 200 || arg.code === 201){ //启动成功
					console.log("arg=======startBat！！" );
					that.$modal.msgSuccess(arg.msg);
					that.$store.commit("openFlag");
					that.myListPlugin();
					that.myListTask();
					that.initWebSocket();
				}else{
					that.$modal.msgSuccess(arg.msg);
				}
			} else if (arg.cmd === "stopBat") {
				console.log("arg22222=======stopBat========" + arg.cmd);
				if(arg.code === 200 || arg.code === 201){ //关闭成功
					that.$store.state.isOpen = false;
				}
				that.$modal.msgSuccess(arg.msg);		
			}else{
				console.log("arg3333=======stopBat========" + arg.cmd);
			}
		});
	}
	this.openJar();
	if( that.$store.state.isOpen ){
		that.myListPlugin();
		that.myListTask();
		that.initWebSocket();
	};
  },
  mounted() {},
  methods: {
	getAccIds(val){
		this.rpaForm.accIds = val;
	},
	getBitNos(val){
		this.rpaForm.bitNos = val;
		this.accsync = false;
	},
	openAccWindow(){
		this.accsync = true;
		if(this.rpaForm.accIds){
			this.$refs.accDialog.select(this.rpaForm.accIds);
		}
	},
	myListPlugin(){
		let that = this;
		listPlugin({"state":"1","pageSize": 535}).then(res=>{
			if(res.code == 200){
				that.pluginList = res.data;
			}else{
				that.$message.error(res.msg);
			}
		}).catch(err=>{
			that.$message.error(err);
		})
	},
	myListTask(){
		let that = this;
		that.myListPlugin();
		let rpjTask = {prjId: this.id, pageSize: 535};
		listSubTask(rpjTask).then(res=>{
			if(res.code == 200){
				that.taskList = res.data;
				//console.log("that.taskList===="+JSON.stringify(that.taskList))
			}else{
				that.$message.error(res.msg);
			}
		}).catch(err=>{
			that.$message.error(err);
		})
	},
	
	exportLog(){
		this.download('/log/export', {"sessionId":this.sid}, `log_${new Date().getTime()}.xlsx`)
	},
	exportErrorLog(){
		let that = this;
		console.log("this.rpaForm.tasks============"+this.rpaForm.tasks);
		
		if( !that.rpaForm.tasks || that.rpaForm.tasks == "" || that.rpaForm.tasks == null  || that.rpaForm.tasks == undefined ){
			that.$message.error("任务不能为空！")
			return;
		};
	 
		let task = that.rpaForm.tasks.join(",");
		this.download('/log/exportError', {"accIds": this.rpaForm.accIds , "sessionId": this.sid, "prjId": this.id , "taskIds": task }, `log_${new Date().getTime()}.xlsx`)
	},
	clearLog(){
		const that = this ;
		that.tableData1 = [];
		that.tableData2 = [];
		that.tableData11 = [];
		that.tableData22 = [];
		that.$message.success("日志清除成功！！");
		/* delAll(this.sid).then(res=>{
			that.tableData1 = [];
			that.tableData2 = [];
			that.tableData11 = [];
			that.tableData22 = [];
			if(res.code == 200){
				that.$message.success("日志清除成功！！")
			}
		}).catch(r=>{
			that.$message.success("日志清除出错！！")
		}); */
	},
	handleSuccess(res,file,fileList){
		if(res.code == 200){
		   this.rpaForm.filePath = res.data;
		}
		this.$message.success("上传成功")
		this.$refs.upload.clearFiles();
	},
	beforeUpload(file){
		if(!this.$store.state.isOpen){
		    this.$message.error('请先开启服务！');
			return false;
		}
		const isLt2M = file.size / 1024 / 1024 < 5;
		if (!isLt2M) {
		  this.$message.error('上传头像图片大小不能超过 5MB!');
		}
		return isLt2M;
	},
	initWebSocket(){ //初始化weosocket
		if(this.isDisconnect && this.isNoRun){
			this.isNoRun = false;
			let that = this;
			//console.log("初始化weosocket！！！！")
			const wsuri = getLogWebsocketUrl() + that.sid;
			that.websock = new WebSocket(wsuri);
			that.websock.onmessage = that.getMessage;
			that.websock.onopen = that.websocketonopen;
			that.websock.onerror = that.websocketonerror;
			that.websock.onclose = that.websocketclose;
			if(that.timer){
				clearInterval(that.timer);
			}
		}
	},
	websocketonopen(){ //连接建立之后执行send方法发送数据
		this.isDisconnect = false;
		this.isNoRun = true;
		let actions = {"test":"12345"};
		this.websocketsend(JSON.stringify(actions));
	},
	websocketonerror(){//连接建立失败重连
		this.timer = setInterval(this.initWebSocket, 5000);
	},
	websocketsend(Data){//数据发送
		this.websock.send(Data);
	},
	websocketclose(e){  //关闭
		//console.log('断开连接',e);
		this.isDisconnect = true;
		this.isNoRun = true;
		this.timer = setInterval(this.initWebSocket, 5000);
	},
	getMessage(e){ //数据接收
		let res ;
		if(e.data){
			console.log("e.data====="+e.data)
			res = JSON.parse(e.data);
		}
		if(res.level == "1"){
			if( this.tableData11 && this.tableData11.length > 188){
				this.tableData11.pop();
			}
			this.tableData11.unshift(res);
			this.tableData1 = this.tableData11;
		}else{
			if( this.tableData22 && this.tableData22.length > 188){
				this.tableData22.pop();
			}
			this.tableData22.unshift(res);
			this.tableData2 = this.tableData22;
		}
	},
	genTableList(level,type){
		if(level == "1"){
			if(type == 2){
				this.tableData1 = [];
				for(let i = 0 ; i < this.tableData11.length;i++){
					//console.log("this.tableData11[i].logStatus========"+JSON.stringify(this.tableData22[i]));
					if(this.tableData11[i].logStatus == "0"){
						this.tableData1.unshift(this.tableData11[i]);
					}
				}
			}else{
				this.tableData1 = this.tableData11;
			}
			
		}else{
			if(type == 2){
				this.tableData2 = [];
				for(let i = 0 ; i < this.tableData22.length;i++){
					console.log("this.tableData22[i].logStatus========"+JSON.stringify(this.tableData22[i]));
					if(this.tableData22[i].logStatus == "0"){
						this.tableData2.unshift(this.tableData22[i]);
					}
				}
			}else{
				this.tableData2 = this.tableData22;
			}
		}
	},
	checkFile(fileName){
		if(!fileName){
			return false;
		}
		var index = fileName.lastIndexOf(".");
		
		if(index == -1){
			return false;
		}
		
		var length = fileName.length;
		var suffix = fileName.substr(index+1,length-index-1);
		const isXLS2 = suffix==='xls';
		const isXLSX2 = suffix ==='xlsx';
		let isSuc = true;
		if (!isXLS2 && !isXLSX2) {
			isSuc = false;
			this.$message.error({ message: '上传文件只能是xls或者xlsx格式!', duration: 3000});
		}
		return isSuc;
	},
	handleChange(file, fileLists) {
		console.log("file==="+JSON.stringify(file));
		this.checkFile(file.name);
		const isLt5M = file.size / 1024 / 1024 < 5;
		if (!isLt5M) {
			this.$message.error({ message: '上传文件大小不能超过 5MB!', duration: 3000});
		}
		console.log("url======================="+URL.createObjectURL(file.raw));
		//this.rpaForm.filePath = document.getElementsByClassName("el-upload__input")[0].value;
	},
	submitForm1(formName) {
	  let that = this;
	  console.log("formName===="+formName)
	  that.$refs.rpaFormRef.validate((valid) => {
		  
	    if (!valid) return;
		
		if(!that.rpaForm.tasks || that.rpaForm.tasks == "" || that.rpaForm.tasks == null 
		|| that.rpaForm.tasks == undefined){
			that.$message.error("任务不能为空！")
			return;
		};
		
		console.log("that.rpaForm.errorAccIds===="+that.rpaForm.errorAccIds)
		if(!that.rpaForm.errorAccIds){
			that.$message.error("请选择用户！！！")
			return;
		};
		
		if(!that.$store.state.isOpen){
			that.$message.error("请先开启服务！！！！");
			return;
		}
		console.log("555555===11111");
		let task = that.rpaForm.tasks.join(",");
	
		localStorage.setItem("installPath", that.rpaForm.installPath); 
		localStorage.setItem("pluginPaths", JSON.stringify(that.rpaForm.pluginPaths));
		localStorage.setItem("cachePath", that.rpaForm.cachePath);
		localStorage.setItem("proxy", that.rpaForm.proxy);
		
		
		const pluginPath = that.rpaForm.cachePath + "\\" + that.rpaForm.pluginPaths.join(","+that.rpaForm.cachePath+"\\");
		const installPath = that.$store.state.isMyExe?that.rpaForm.installPath+"\\resources":that.rpaForm.installPath;
		const data = {"id": that.id ,
			"accIds": that.rpaForm.errorAccIds,
			"sessionId": that.sid,
			"installPath": installPath ,  
			"pluginPath": pluginPath ,
			"cachePath": that.rpaForm.cachePath ,
			"proxy": that.rpaForm.proxy ,
			"threadNum": that.rpaForm.threadNum,
			"proxyNum": that.rpaForm.proxyNum,
			"tasks": task
		}; 
		/* const data = {"id": that.id ,"sessionId": that.sid,"driverPath":  that.rpaForm.driverPath,
		"bitPath": bitPath,
		"pluginPath": pluginPath,
		"userPath": that.rpaForm.cachePath,
		"fingerprintPath": fingerprintPath,
		"openBrowser": that.rpaForm.openBrowser ,
		"filePath": that.rpaForm.filePath,"threadNum": that.rpaForm.threadNum,
		 "proxy":  that.rpaForm.proxy, "tasks": task}; */
		//alert("data===="+JSON.stringify(data));
		//that.$store.state.myLoading = true;
		runAccTask(data).then(function(res){
			//console.log("66666666==="+JSON.stringify(res));
			 if(res.code == 200){
				that.$modal.msgSuccess("开启成功！");
			 }else{
				that.$message.error(res.msg);
			   //console.log("7777777==="+JSON.stringify(res));
			 }
			 //that.$store.state.myLoading = false;
		  }).catch(function(error){
			//console.log("999999==="+JSON.stringify(error));
			//that.$store.state.myLoading = false;
		  });
	  })
	},
    submitForm(formName) {
	  let that = this;
	  console.log("formName===="+formName)
      that.$refs.rpaFormRef.validate((valid) => {
		  
        if (!valid) return;
		
		if(!that.rpaForm.tasks || that.rpaForm.tasks == "" || that.rpaForm.tasks == null 
		|| that.rpaForm.tasks == undefined){
			that.$message.error("任务不能为空！")
			return;
		};
		
		console.log("that.rpaForm.accIds===="+that.rpaForm.accIds)
		if(!that.rpaForm.accIds){
			that.$message.error("请选择用户！！！")
			return;
		};
		
		if(!that.$store.state.isOpen){
			that.$message.error("请先开启服务！！！！");
			return;
		}
		console.log("555555===11111");
		let task = that.rpaForm.tasks.join(",");
	
		localStorage.setItem("installPath", that.rpaForm.installPath); 
		localStorage.setItem("pluginPaths", JSON.stringify(that.rpaForm.pluginPaths));
		localStorage.setItem("cachePath", that.rpaForm.cachePath);
		localStorage.setItem("proxy", that.rpaForm.proxy);
		
		
		const pluginPath = that.rpaForm.cachePath + "\\" + that.rpaForm.pluginPaths.join(","+that.rpaForm.cachePath+"\\");
		const installPath = that.$store.state.isMyExe?that.rpaForm.installPath+"\\resources":that.rpaForm.installPath;
		const data = {"id": that.id ,
			"accIds": that.rpaForm.accIds,
			"sessionId": that.sid,
			"installPath": installPath ,  
			"pluginPath": pluginPath ,
			"cachePath": that.rpaForm.cachePath ,
			"proxy": that.rpaForm.proxy ,
			"threadNum": that.rpaForm.threadNum,
			"proxyNum": that.rpaForm.proxyNum,
			"tasks": task
		}; 
		/* const data = {"id": that.id ,"sessionId": that.sid,"driverPath":  that.rpaForm.driverPath,
		"bitPath": bitPath,
		"pluginPath": pluginPath,
		"userPath": that.rpaForm.cachePath,
		"fingerprintPath": fingerprintPath,
		"openBrowser": that.rpaForm.openBrowser ,
		"filePath": that.rpaForm.filePath,"threadNum": that.rpaForm.threadNum,
		 "proxy":  that.rpaForm.proxy, "tasks": task}; */
		//alert("data===="+JSON.stringify(data));
		//that.$store.state.myLoading = true;
		runAccTask(data).then(function(res){
			//console.log("66666666==="+JSON.stringify(res));
			 if(res.code == 200){
				that.$modal.msgSuccess("开启成功！");
			 }else{
				that.$message.error(res.msg);
			   //console.log("7777777==="+JSON.stringify(res));
			 }
			 //that.$store.state.myLoading = false;
		  }).catch(function(error){
			//console.log("999999==="+JSON.stringify(error));
			//that.$store.state.myLoading = false;
		  });
      })
    },
	submitFormForError(formName) {
	  let that = this;
	  console.log("formName===="+formName)
	  that.$refs.rpaFormRef.validate((valid) => {
		  
	    if (!valid) return;
		
		if(!that.$store.state.isOpen){
			that.$message.error("请先开启服务！！！！");
			return;
		}
 
		console.log("that.rpaForm.accIds===="+that.rpaForm.accIds)
		if(!that.rpaForm.accIds){
			that.$message.error("请选择用户！！！")
			return;
		};
		 
		
		if(!that.rpaForm.tasks || that.rpaForm.tasks == "" || that.rpaForm.tasks == null || that.rpaForm.tasks == undefined){
			that.$message.error("任务不能为空！")
			return;
		};
		
	
		console.log("555555===11111");
		let task = that.rpaForm.tasks.join(",");
	
		localStorage.setItem("installPath", that.rpaForm.installPath); 
		localStorage.setItem("pluginPaths", JSON.stringify(that.rpaForm.pluginPaths));
		localStorage.setItem("cachePath", that.rpaForm.cachePath);
		localStorage.setItem("proxy", that.rpaForm.proxy);
		
		
		const pluginPath = that.rpaForm.cachePath + "\\" + that.rpaForm.pluginPaths.join(","+that.rpaForm.cachePath+"\\");
		const installPath = that.$store.state.isMyExe?that.rpaForm.installPath+"\\resources":that.rpaForm.installPath;
		const data = {"id": that.id ,
			"accIds": that.rpaForm.accIds,
			"sessionId": that.sid,
			"installPath": installPath ,  
			"pluginPath": pluginPath ,
			"cachePath": that.rpaForm.cachePath ,
			"proxy": that.rpaForm.proxy ,
			"threadNum": that.rpaForm.threadNum,
			"proxyNum": that.rpaForm.proxyNum,
			"tasks": task
		};
		
		const mydata = {
			"id": that.id ,
			"accIds": that.rpaForm.accIds,
			"tasks": task
		};
 
		getErrorAccInfo(mydata).then(res =>{
			if(res.code == 200){
				that.rpaForm.errorAccIds = res.data.myAccIds;
				that.rpaForm.errorBitNos = res.data.myBitNos;
				runAccTaskForError(data).then(function(res1){
					 if(res1.code == 200){
						that.$modal.msgSuccess("开启成功！");
					 }else{
						that.$message.error(res1.msg);
					 }
				}).catch(function(error1){
				});
			}else{
				that.$message.error(res.msg);
			}
		}).catch(error =>{
		})
	  })
	},
	openJar(){
		let that = this;
		if(that.$store.state.isMyExe && !that.$store.state.isOpen ){
			that.$store.state.myLoading = true;
			ipcRenderer.send("startBat")
		}else{
			that.$store.state.isOpen = true;
			that.$store.commit("openFlag");
		}
	},
	stopJar(){
		let that = this;
		if(that.$store.state.isMyExe && that.$store.state.isOpen ){
			ipcRenderer.send("stopBat");
		}
	},
    resetForm() {
      this.$refs['rpaFormRef'].resetFields()
    },
	handleQuery(){
		
	},
    
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}

</style>
