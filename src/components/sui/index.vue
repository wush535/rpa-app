<template>
  <div id="myApp">
	<el-form ref="rpaFormRef" :model="rpaForm" label-width="88px">
		<el-form-item label="线程个数">
			<el-input v-model="rpaForm.threadNum"></el-input>
		</el-form-item>
		<el-form-item label="代理">
			<el-input v-model="rpaForm.proxy" placeholder="ip:prot:账号:密码"></el-input>
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
			<el-button type="warning" size="large" @click="openJar" v-show="!isOpen">开启服务</el-button>
			<el-button type="warning" size="large" @click="$message.warning('服务已开启')" v-show="isOpen" disabled>服务已开启</el-button>
			<el-button type="info" size="large" @click="stopJar">关闭服务</el-button>
			<el-button type="primary" size="large" @click="submitForm">开启任务</el-button>
		</el-form-item>
	</el-form>
	  
    <br />
	<br />
	
	<el-table :data="tableData" highlight-current-row style="width: 100%">
	    <el-table-column property="id" label="序号" width="50"> </el-table-column>
	    <el-table-column property="userName" label="账号名称" width="120"> </el-table-column>
	    <el-table-column property="taskName" label="任务名称" width="120"> </el-table-column>
	    <el-table-column property="log" label="日志"> </el-table-column>
	</el-table>
  </div>
</template>
<script>
import { openRpa, getLogWebsocketUrl } from "@/api/sui/sui"
export default {
  name: "sui",
  data() {
    return {
      rpaForm: {
        filePath: undefined,
		threadNum: 1,
		proxy: "106.75.145.80:6514:user-cc198c95-country-th-type-dc:e260d25d"
      },
	  isOpen: false,
	  sid: undefined,
	  timer: undefined,
	  fileList: undefined,
	  tableData: [],
	  currentRow: undefined,
	  isDisconnect: true
    }
  },
  computed: {},
  watch: {},
  created() {
	this.openJar();
	let sessionId = localStorage.getItem("sessionId");
	if(!sessionId){
			  let r = Math.ceil(Math.random()*10); 
			  let time = new Date().getTime();
			  sessionId = "rpa"+time+""+r;
			  localStorage.setItem("sessionId",sessionId)
	}
	 console.log("sessionId====="+sessionId);
	this.sid = sessionId;
	
  },
  mounted() {},
  methods: {
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
	},
	getMessage(e){ //数据接收
		let res ;
		if(e.data){
			res = JSON.parse(e.data);
		}
		if( this.tableData && this.tableData.length > 88){
			this.tableData.pop();
		}
		this.tableData.unshift(res);
		
	},
	websocketonopen(){ //连接建立之后执行send方法发送数据
		this.isDisconnect = false;
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
		//console.log("url======================="+URL.createObjectURL(file.raw));
		//this.rpaForm.filePath = document.getElementsByClassName("el-upload__input")[0].value;
	},
    submitForm() {
	  let that = this;
      that.$refs['rpaFormRef'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
		if(!that.checkFile(that.rpaForm.filePath)){
			return;
		};
		
		if(!this.isOpen){
			that.$message.error("请先开启服务！！！！");
			return;
		}
		
		
		console.log("555555===11111");
		const data = {"sessionId": that.sid,"filePath": that.rpaForm.filePath,"threadNum": that.rpaForm.threadNum, "proxy":  that.rpaForm.proxy};
		openRpa(data).then(function(res){
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
		const myApp = document.querySelector("#myApp")
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
				if(that.sid && that.isDisconnect ){
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
		const myApp = document.querySelector("#myApp")
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
