<template>
  <div id="myApp">
	<el-form ref="rpaFormRef" :model="rpaForm" label-width="108px" :rules="rules" >
		<el-form-item label="chrome浏览器">
			<el-input v-model="rpaForm.driverPath"></el-input>
		</el-form-item>
		
		<el-form-item label="比特浏览器">
			<el-input v-model="rpaForm.bitPath"></el-input>
		</el-form-item>
		
		<el-form-item label="扩展插件">
			<el-input v-model="rpaForm.pluginPath"></el-input>
		</el-form-item>
		
		<el-form-item label="用户path">
			<el-input v-model="rpaForm.userPath"></el-input>
		</el-form-item>
		
		<el-form-item label="指纹path">
			<el-input v-model="rpaForm.fingerprintPath"></el-input>
		</el-form-item>
		
		<el-form-item label="打开浏览器">
			<el-select v-model="rpaForm.openBrowser" placeholder="请选择" style="width: 100%;">
			    <el-option v-for="item in headList" :key="item.value" :label="item.label" :value="item.value">
			    </el-option>
			</el-select>
		</el-form-item>
		
		<el-form-item label="线程个数">
			<el-input v-model="rpaForm.threadNum"></el-input>
		</el-form-item>
		<el-form-item label="代理">
			<el-input v-model="rpaForm.proxy" placeholder="ip:prot:账号:密码"></el-input>
		</el-form-item>

		<el-form-item label="任务">
			<el-select v-model="rpaForm.tasks" multiple placeholder="请选择" style="width: 100%;">
			    <el-option v-for="item in taskList" :key="item.value" :label="item.label" :value="item.value">
			    </el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="账号清单">
			<el-row>
				<el-col :span="21">
					<el-input v-model="rpaForm.filePath" disabled></el-input>
				</el-col>
				<el-col :span="3">
					<el-upload ref="upload" multiple  action="http://127.0.0.1:6858/rpa/upload" :limit="1" 
					:auto-upload="true" :file-list="fileList" :show-file-list="false"
					:on-success="handleSuccess" :before-upload="beforeUpload"> 
						<el-button size="large" type="primary" >点击上传</el-button>
					</el-upload>
				</el-col>
			</el-row>
		</el-form-item>
		
		<el-form-item>
			<el-button type="danger" size="large" @click="exportLog()" >导出日志</el-button>
			<el-button type="success" size="large" @click="clearLog()" >清除日志</el-button>
			
			<el-button type="warning" size="large" @click="openJar" v-show="!isOpen">开启服务</el-button>
			<el-button type="warning" size="large" @click="$message.warning('服务已开启')" v-show="isOpen" disabled>服务已开启</el-button>
			<el-button type="info" size="large" @click="stopJar">关闭服务</el-button>
			<el-button type="primary" size="large" @click="submitForm('rpaFormRef')">开启任务</el-button>
		</el-form-item>
	</el-form>
	  
	  
    <br />
	<br />
	<el-tabs v-model="activeName" type="border-card" >
	    <el-tab-pane label="1级日志" name="first">
			<el-table :data="tableData1" highlight-current-row style="width: 100%">
			    <el-table-column property="bitNo" label="序号" width="50"> </el-table-column>
			    <el-table-column property="userName" label="账号名称" width="120"> </el-table-column>
			    <el-table-column property="taskName" label="任务名称" width="120"> </el-table-column>
			    <el-table-column property="log" label="日志"> </el-table-column>
			</el-table>
		</el-tab-pane>
	    <el-tab-pane label="2级日志" name="second">
			<el-table :data="tableData2" highlight-current-row style="width: 100%">
			    <el-table-column property="bitNo" label="序号" width="50"> </el-table-column>
			    <el-table-column property="userName" label="账号名称" width="120"> </el-table-column>
			    <el-table-column property="taskName" label="任务名称" width="120"> </el-table-column>
			    <el-table-column property="log" label="日志"> </el-table-column>
			</el-table>
		</el-tab-pane>
	  </el-tabs>
  </div>
</template>
<script>
import { openScrollTask, getLogWebsocketUrl, exportLog, delAll } from "@/api/scroll/scroll"
export default {
  name: "scroll",
  data() {
    return {
      rpaForm: {
		install: "D:\\workSpace\\rpa-app",
		driverPath:"D:\\soft\\chromedriver\\104\\chromedriver.exe",
		bitPath:"C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\Chrome-bin\\104\\3.0.2\\BitBrowser.exe",
		pluginPath:"C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\BrowserCache\\BitExtensions\\nkbihfbeogaeaoehlefnkodbefgpgknn\\10.25.0_0",
		userPath: "C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\BrowserCache\\",
		fingerprintPath: "C:\\Users\\coralHero\\AppData\\Roaming\\bitbrowser\\LocalCache\\",
		threadNum: 1,
		proxy: "106.75.145.80:6520:user-cc198c95-country-th-type-dc:e260d25d",
		tasks: undefined,
		accIds: undefined,
      },
	  isOpen: true,
	  sid: undefined,
	  timer: undefined,
	  fileList: undefined,
	  tableData1: [],
	  tableData2: [],
	  currentRow: undefined,
	  isDisconnect: true,
	  isNoRun: true,
	  activeName: "first",
	  rules: {},
	  headList:[{
	      value: '0',
	      label: '0-不打开'
	    }, {
	      value: '1',
	      label: '1-打开'
	   }],
	  taskList:[{
          value: '1',
          label: '1-导入钱包'
        }, {
          value: '2',
          label: '2-l1层转l2层'
        }, {
          value: '3',
          label: '3-swap Eth'
        }, {
          value: '4',
          label: '4-claim usdc'
        }, {
          value: '5',
          label: '5-加流动性'
        },{
          value: '6',
          label: '6-去除流动性'
        }, {
          value: '7',
          label: '7-l2层转l1层'
        }],
    }
  },
  computed: {},
  watch: {},
  created() {
	let sessionId = localStorage.getItem("sessionId");
	let driverPath = localStorage.getItem("driverPath");
	let bitPath = localStorage.getItem("bitPath");
	let pluginPath = localStorage.getItem("pluginPath"); 
	
	let userPath = localStorage.getItem("userPath");
	let fingerprintPath = localStorage.getItem("fingerprintPath"); 

	
	if(driverPath){
		this.rpaForm.driverPath = driverPath;
	}
	
	if(bitPath){
		this.rpaForm.bitPath = bitPath;
	}
	
	if(pluginPath){
		this.rpaForm.pluginPath = pluginPath;
	}
	
	if(userPath){
		this.rpaForm.userPath = userPath;
	}
	
	if(fingerprintPath){
		this.rpaForm.fingerprintPath = fingerprintPath;
	}
	
	if(!sessionId){
		let r = Math.ceil(Math.random()*10); 
		let time = new Date().getTime();
		sessionId = "rpa"+time+""+r;
		localStorage.setItem("sessionId",sessionId)
	}
	 console.log("sessionId====="+sessionId);
	this.sid = sessionId;
	//this.openJar();
	this.initWebSocket();
  },
  mounted() {},
  methods: {
	exportLog(){
		this.download('/log/export', {"sessionId":this.sid}, `log_${new Date().getTime()}.xlsx`)
	},
	clearLog(){
		const that = this ;
		delAll().then(res=>{
			that.tableData1 = [];
			that.tableData2 = [];
			if(res.code == 200){
				that.$message.success("日志清除成功！！")
			}
		}).catch(r=>{
			that.$message.success("日志清除出错！！")
		});
	},
	handleSuccess(res,file,fileList){
		if(res.code == 200){
		   this.rpaForm.filePath = res.data;
		}
		this.$message.success("上传成功")
		this.$refs.upload.clearFiles();
	},
	beforeUpload(file){
		if(!this.isOpen){
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
			console.log("初始化weosocket！！！！")
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
	getMessage(e){ //数据接收
		let res ;
		if(e.data){
			res = JSON.parse(e.data);
		}
		if(res.level == "1"){
			if( this.tableData1 && this.tableData1.length > 88){
				this.tableData1.pop();
			}
			this.tableData1.unshift(res);
		}else{
			if( this.tableData2 && this.tableData2.length > 88){
				this.tableData2.pop();
			}
			this.tableData2.unshift(res);
		}
	},
	websocketonopen(){ //连接建立之后执行send方法发送数据
		this.isDisconnect = false;
		this.isNoRun = true;
		let actions = {"test":"12345"};
		this.websocketsend(JSON.stringify(actions));
	},
	websocketonerror(){//连接建立失败重连
		//this.timer = setInterval(this.initWebSocket, 5000);
	},
	websocketsend(Data){//数据发送
		this.websock.send(Data);
	},
	websocketclose(e){  //关闭
		console.log('断开连接',e);
		this.isDisconnect = true;
		this.isNoRun = true;
		this.timer = setInterval(this.initWebSocket, 5000);
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
    submitForm(formName) {
	  let that = this;
	  console.log("formName===="+formName)
      that.$refs.rpaFormRef.validate((valid) => {
		  
        if (!valid) return;
		
        // TODO 提交表单
		if(!that.rpaForm.tasks || that.rpaForm.tasks == "" || that.rpaForm.tasks == null || that.rpaForm.tasks == undefined){
			that.$message.error("任务不能为空！")
			return;
		};
		
		if(!that.checkFile(that.rpaForm.filePath)){
			that.$message.error("文件类型支持excel格式！")
			return;
		};
		
		if(!this.isOpen){
			that.$message.error("请先开启服务！！！！");
			return;
		}
		console.log("555555===11111");
		let task = that.rpaForm.tasks.join(",");
		localStorage.setItem("driverPath", that.rpaForm.driverPath);
		localStorage.setItem("bitPath", that.rpaForm.bitPath);
		localStorage.setItem("pluginPath", that.rpaForm.pluginPath);
		
		if(that.rpaForm.userPath){
			localStorage.setItem("userPath", that.rpaForm.userPath);
		}
		
		if(that.rpaForm.fingerprintPath){
			localStorage.setItem("fingerprintPath", that.rpaForm.fingerprintPath);
		}
		
		const data = {"sessionId": that.sid,"driverPath":  that.rpaForm.driverPath,"bitPath": that.rpaForm.bitPath,
		"pluginPath": that.rpaForm.pluginPath,
		"userPath": that.rpaForm.userPath,
		"fingerprintPath": that.rpaForm.fingerprintPath,
		"openBrowser": that.rpaForm.openBrowser ,
		"filePath": that.rpaForm.filePath,"threadNum": that.rpaForm.threadNum,
		 "proxy":  that.rpaForm.proxy, "tasks": task};
		//alert("data===="+JSON.stringify(data));
		openScrollTask(data).then(function(res){
			console.log("66666666==="+JSON.stringify(res));
			 if(res.code == 200){
				that.$modal.msgSuccess("开启成功！");
			 }else{
			   console.log("7777777==="+JSON.stringify(res));
			 }
		  }).catch(function(error){
			console.log("999999==="+JSON.stringify(error));
		  });
      })
    },
	openJar(){
		let that = this;
		const myApp = document.querySelector("#app")
		let myloading = that.$loading({
			target: myApp,
			lock: true,
			text: 'Loading',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.35)'
		});
		startBat().then(function(mybat){
			if(mybat.code == 200 || mybat.code == 201){ //启动成功
				that.isOpen = true;
				that.$message.success(mybat.msg)
				
				console.log("=======3333========");
				if(that.sid && that.isDisconnect && that.isNoRun ){
					console.log("33333333333333333333===1111111111111111111");
					that.initWebSocket();
				}
			}else{
				that.$message.success(mybat.msg)
			}
			myloading.close();
		}).catch(function(error){
			that.$message.error("java启动失败："+JSON.stringify(error))
			myloading.close();
		})
	},
	stopJar(){
		let that = this;
		const myApp = document.querySelector("#app")
		let myloading = that.$loading({
			target: myApp,
			lock: true,
			text: 'Loading',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.35)'
		});
		stopBat().then(function(mybat){
			if(mybat.code == 200 || mybat.code == 201){ //关闭成功
				that.isOpen = false;
				that.$message.success(mybat.msg)
			}else{
				that.$message.success(mybat.msg)
			}
			myloading.close();
		}).catch(function(error){
			that.$message.error("java关闭失败："+JSON.stringify(error))
			myloading.close();
		})
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
