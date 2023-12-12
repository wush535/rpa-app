<template>
  <div class="app-container">
	  
	<el-tabs v-model="activeName" type="border-card"  @tab-click="myTabClick">
	    <el-tab-pane label="1级日志" name="first">
			<el-button type="warning" size="large" @click='genTableList("1","1")'>全部</el-button>
			<el-button type="info" size="large" @click='genTableList("1","2")'>错误</el-button>
			<el-button type="success" size="large" @click="clearLog()" >清除日志</el-button>
			<el-button type="warning" size="large" @click="openMyMirror()" >开启监控</el-button>
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
			<el-button type="success" size="large" @click="clearLog()" >清除日志</el-button>
			<el-button type="warning" size="large" @click="openMyMirror()" >开启监控</el-button>
			<el-table :data="tableData2" highlight-current-row style="width: 100%">
			    <el-table-column property="bitNo" label="窗口" width="50"> </el-table-column>
			    <el-table-column property="userName" label="账号名称" width="120"> </el-table-column>
			    <el-table-column property="taskName" label="任务名称" width="120"> </el-table-column>
			    <el-table-column property="log" label="日志"> </el-table-column>
			</el-table>
		</el-tab-pane>
		
		<el-tab-pane label="数据库查询" name="third">
			<el-form :model="queryLogParams" ref="queryLogRef" size="small" :inline="true" v-show="showLogSearch" label-width="88px">
			  <el-form-item label="窗口" prop="bitNo">
			    <el-input
			      v-model="queryLogParams.bitNo"
			      placeholder="请输入窗口"
			      clearable
			      @keyup.enter.native="handleQueryLog"
			    />
			  </el-form-item>     
			  <el-form-item label="sessionId" prop="sessionId">
			    <el-input
			      v-model="queryLogParams.sessionId"
			      placeholder="请输入sessionId"
			      clearable
			      @keyup.enter.native="handleQueryLog"
			    />
			  </el-form-item>
			  <el-form-item label="计划明细id" prop="detailId">
			    <el-input
			      v-model="queryLogParams.detailId"
			      placeholder="请输入计划明细id"
			      clearable
			      @keyup.enter.native="handleQueryLog"
			    />
			  </el-form-item>
			  <el-form-item label="计划id" prop="planId">
			    <el-input
			      v-model="queryLogParams.planId"
			      placeholder="请输入计划id"
			      clearable
			      @keyup.enter.native="handleQueryLog"
			    />
			  </el-form-item>
			  <el-form-item label="日志级别" prop="level">
			    <el-select v-model="queryLogParams.level">
					<el-option :key="1" :value="1" label="级别1">级别1</el-option>
					<el-option :key="2" :value="2" label="级别2">级别2</el-option>
				</el-select>
			  </el-form-item>
			  <el-form-item label="任务名称" prop="taskName" >
			    <el-input
			      v-model="queryLogParams.taskName"
			      placeholder="请输入任务名称"
			      clearable
			      @keyup.enter.native="handleQueryLog"
			    />
			  </el-form-item>
			  <el-form-item label="开始时间" prop="startDate">
			    <el-date-picker clearable
			      v-model="queryLogParams.startDate"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="请选择开始时间">
			    </el-date-picker>
			  </el-form-item>
			  <el-form-item label="结束时间" prop="endDate">
			    <el-date-picker clearable
			      v-model="queryLogParams.endDate"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="请选择结束时间">
			    </el-date-picker>
				
				<el-form-item label="状态" prop="logStatus">
				  <el-select v-model="queryLogParams.logStatus">
							<el-option :key="1" :value="1" label="成功">成功</el-option>
							<el-option :key="0" :value="0" label="失败">失败</el-option>
						</el-select>
				</el-form-item>
			  </el-form-item>
			 
			  <el-form-item>
			    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryLog">搜索</el-button>
			    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryLog">重置</el-button>
			  </el-form-item>
			</el-form>
			
			<el-row :gutter="10" >
			  <el-col :span="1.5">
				<el-button type="danger" size="large" @click="exportLog()" >导出日志</el-button>
				<el-button type="danger" size="large" @click="exportErrorLog()" >导出错误日志</el-button>
				<el-button type="warning" size="large" @click="openMyMirror()" >开启监控</el-button>
			  </el-col>
			</el-row>
			
			<el-table v-loading="loadingLog" :data="logList" @selection-change="handleSelectionLogChange">
			  <el-table-column type="selection" width="55" align="center" />
			  <el-table-column label="窗口" align="center" prop="bitNo" width="88"/>
			  <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
			   <el-table-column label="日志级别" align="center" prop="level" width="88" />
			  <el-table-column label="sessionId" align="center" prop="sessionId"  width="168"  />
			 
			  <el-table-column label="任务名称" align="center" prop="taskName"  width="168" />
			  <el-table-column label="日志状态" align="center" prop="logStatus" :formatter="logFormat" width="98"/>
			  <el-table-column label="日志信息" align="center" prop="log"  />
			  <el-table-column label="开始时间" align="center" prop="startDate" width="180">
			    <template slot-scope="scope">
			      <span>{{ scope.row.startDate }}</span>
			    </template>
			  </el-table-column>
			  <el-table-column label="结束时间" align="center" prop="endDate" width="180">
			    <template slot-scope="scope">
			      <span>{{ scope.row.endDate  }}</span>
			    </template>
			  </el-table-column>
			</el-table>
			
			<pagination
			  v-show="queryLogParams.total>0"
			  :total="queryLogParams.total"
			  :page.sync="queryLogParams.pageNum"
			  :limit.sync="queryLogParams.pageSize"
			  @pagination="getLogList"
			/>
		</el-tab-pane>
		
		<el-tab-pane label="task列表" name="five">
			<el-form :model="queryDetailParams" ref="queryDetailRef" size="small" :inline="true" v-show="showDetailSearch" label-width="88px">
			  <el-form-item label="计划id" prop="planId">
			    <el-input
			      v-model="queryDetailParams.planId"
			      placeholder="请输入计划id"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="项目id" prop="prjId">
			    <el-input
			      v-model="queryDetailParams.prjId"
			      placeholder="请输入项目id"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="项目名称" prop="prjName">
			    <el-input
			      v-model="queryDetailParams.prjName"
			      placeholder="请输入项目名称"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="账号id" prop="accId">
			    <el-input
			      v-model="queryDetailParams.accId"
			      placeholder="请输入账号id"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="窗口" prop="bitNo">
			    <el-input
			      v-model="queryDetailParams.bitNo"
			      placeholder="请输入窗口"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="用户id" prop="userId">
			    <el-input
			      v-model="queryDetailParams.userId"
			      placeholder="请输入用户id"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="分组" prop="groupId">
			    <el-input
			      v-model="queryDetailParams.groupId"
			      placeholder="请输入分组"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="任务id" prop="taskId">
			    <el-input
			      v-model="queryDetailParams.taskId"
			      placeholder="请输入任务id"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="任务名称" prop="taskName">
			    <el-input
			      v-model="queryDetailParams.taskName"
			      placeholder="请输入任务名称"
			      clearable
			      @keyup.enter.native="handleQueryDetail"
			    />
			  </el-form-item>
			  <el-form-item label="执行时间" prop="planDate">
			    <el-date-picker clearable
			      v-model="queryDetailParams.planDate"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="请选择执行时间">
			    </el-date-picker>
			  </el-form-item>
			  <el-form-item label="开始时间" prop="startDate">
			    <el-date-picker clearable
			      v-model="queryDetailParams.startDate"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="请选择开始时间">
			    </el-date-picker>
			  </el-form-item>
			  <el-form-item label="结束时间" prop="endDate">
			    <el-date-picker clearable
			      v-model="queryDetailParams.endDate"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="请选择结束时间">
			    </el-date-picker>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryDetail">搜索</el-button>
			    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryDetail">重置</el-button>
			  </el-form-item>
			</el-form>
			
			<!-- <el-row :gutter="10" class="mb8">
			  <el-col :span="1.5">
			    <el-button type="primary" plain icon="el-icon-plus" size="mini" >新增</el-button>
			  </el-col>
			</el-row> -->
			
			<el-table v-loading="loadingDetail" :data="detailList" @selection-change="handleSelectionDetailChange">
			  <el-table-column type="selection" width="55" align="center" />
			  <!-- <el-table-column label="计划id" align="center" prop="planId"  /> -->
			  <el-table-column label="项目名称" align="center" prop="prjName"  width="88"  />
			  <el-table-column label="窗口" align="center" prop="bitNo" width="88" />
			  <!-- <el-table-column label="用户id" align="center" prop="userId"  width="278"  /> -->
			  <el-table-column label="分组" align="center" prop="groupId" width="88" />
			  <el-table-column label="任务名称" align="center" prop="taskName" width="118"  />
			  <el-table-column label="执行时间" align="center" prop="planDate">
			    <template slot-scope="scope">
			      <span>{{  scope.row.planDate  }}</span>
			    </template>
			  </el-table-column>
			  <el-table-column label="开始时间" align="center" prop="startDate" >
			    <template slot-scope="scope">
			      <span>{{ scope.row.startDate }}</span>
			    </template>
			  </el-table-column>
			  <el-table-column label="结束时间" align="center" prop="endDate" >
			    <template slot-scope="scope">
			      <span>{{ scope.row.endDate }}</span>
			    </template>
			  </el-table-column>
			  <el-table-column label="状态" align="center" prop="runStatus" :formatter="runFormat" width="98" />
			  <el-table-column label="失败原因" align="center" prop="failReason" />
			  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
			    <template slot-scope="scope">
			      <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateDetail(scope.row)" >修改</el-button> -->
			      <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRunDetail(scope.row)" >运行</el-button>
			    </template>
			  </el-table-column>
			</el-table>
			
			<pagination
			  v-show="queryDetailParams.total>0"
			  :total="queryDetailParams.total"
			  :page.sync="queryDetailParams.pageNum"
			  :limit.sync="queryDetailParams.pageSize"
			  @pagination="getDetailList"
			/>
			
			<!-- 添加或修改项目执行计划明细对话框 -->
			<el-drawer :title="titleDetail" :visible.sync="openDetail" size="38%"  append-to-body>
			  <el-card>
			  <el-form ref="detailRef" :model="detailForm" label-width="98px">	
			    <el-form-item label="项目名称" prop="prjName">
			      <el-input v-model="detailForm.prjName" placeholder="请输入项目名称" />
			    </el-form-item>
			    <el-form-item label="账号id" prop="accId">
			      <el-input v-model="detailForm.accId" placeholder="请输入账号id" />
			    </el-form-item>
			    <el-form-item label="窗口" prop="bitNo">
			      <el-input v-model="detailForm.bitNo" placeholder="请输入窗口" />
			    </el-form-item>
			    <el-form-item label="分组" prop="groupId">
			      <el-input v-model="detailForm.groupId" placeholder="请输入分组" />
			    </el-form-item>
				
			    <el-form-item label="任务名称" prop="taskName">
			      <el-input v-model="detailForm.taskName" placeholder="请输入任务名称" />
			    </el-form-item>
			    <el-form-item label="执行时间" prop="planDate">
			      <el-date-picker clearable
			        v-model="detailForm.planDate"
			        type="date"
			        value-format="yyyy-MM-dd"
			        placeholder="请选择执行时间">
			      </el-date-picker>
			    </el-form-item>
			    <el-form-item label="开始时间" prop="startDate">
			      <el-date-picker clearable
			        v-model="detailForm.startDate"
			        type="date"
			        value-format="yyyy-MM-dd"
			        placeholder="请选择开始时间">
			      </el-date-picker>
			    </el-form-item>
			    <el-form-item label="结束时间" prop="endDate">
			      <el-date-picker clearable
			        v-model="detailForm.endDate"
			        type="date"
			        value-format="yyyy-MM-dd"
			        placeholder="请选择结束时间">
			      </el-date-picker>
			    </el-form-item>
			    <el-form-item label="失败原因" prop="failReason">
			      <el-input v-model="detailForm.failReason" type="textarea" placeholder="请输入内容" />
			    </el-form-item>
			  </el-form>
			  <div style="text-align: center">
			    <el-button type="primary" @click="submitDetailForm">确 定</el-button>
			    <el-button @click="openDetail = false">取 消</el-button>
			  </div>
			  </el-card>
			</el-drawer>
		</el-tab-pane>
	  </el-tabs>
	  
	  <el-dialog  :visible.sync="openSync" width="35%">
	  	<el-card>
	  		<el-form ref="openFormRef" :model="openForm" label-width="108px" >
				
				<el-form-item label="分组" prop="groupId">
					<dict dictType="rpa_group_id" :dictValue="openForm.groupId" @dictChange="dictMyChange" ></dict>
				</el-form-item>
				
	  			<el-form-item label="安装路径">
	  				<el-input v-model="openForm.installPath"></el-input>
	  			</el-form-item>
	  			
	  			<el-form-item label="缓存位置">
	  				<el-input v-model="openForm.cachePath"></el-input>
	  			</el-form-item>
	  			
	  			<el-form-item label="插件">
	  				<el-select v-model="openForm.pluginPaths" multiple placeholder="请选择" style="width: 100%;">
	  					<el-option v-for="item in pluginList" :key="item.pluginPath" :value="item.pluginPath" :label="item.pluginName">
	  						{{item.pluginName}}
	  					</el-option>
	  				</el-select>
	  			</el-form-item>
	  			
	  			<el-form-item label="类型">
	  				<el-radio-group v-model="openForm.runType">
	  				     <el-radio :label="0">新建开跑</el-radio>
	  				     <el-radio :label="2">失败重跑</el-radio>
	  				</el-radio-group>
	  			</el-form-item>
				
	  			<div style="text-align: center">
	  			  <el-button type="primary" @click="submitOpenForm">打 开</el-button>
	  			  <el-button @click="openSync=false">取 消</el-button>
	  			</div>
	  		</el-form>
	  	</el-card>
	  </el-dialog>
	  
	  
	  <el-dialog  :visible.sync="runSync" width="35%">
	  	<el-card>
	  		<el-form ref="runFormRef" :model="openForm" label-width="108px" >
	  				
	  				<el-form-item label="分组" prop="groupId">
	  					<dict dictType="rpa_group_id" :dictValue="openForm.groupId" @dictChange="dictMyChange" ></dict>
	  				</el-form-item>
	  				
	  			<el-form-item label="安装路径">
	  				<el-input v-model="openForm.installPath"></el-input>
	  			</el-form-item>
	  			
	  			<el-form-item label="缓存位置">
	  				<el-input v-model="openForm.cachePath"></el-input>
	  			</el-form-item>
	  			
	  			<el-form-item label="插件">
	  				<el-select v-model="openForm.pluginPaths" multiple placeholder="请选择" style="width: 100%;">
	  					<el-option v-for="item in pluginList" :key="item.pluginPath" :value="item.pluginPath" :label="item.pluginName">
	  						{{item.pluginName}}
	  					</el-option>
	  				</el-select>
	  			</el-form-item>
	  			

	  			<div style="text-align: center">
	  			  <el-button type="primary" @click="submitRunForm">运 行</el-button>
	  			  <el-button @click="runSync=false">取 消</el-button>
	  			</div>
	  		</el-form>
	  	</el-card>
	  </el-dialog>
  </div>
</template>

<script>
import { listLog, getLog, delLog, addLog, updateLog, openmirror } from "@/api/acc/log";
import { getLogWebsocketUrl, delAll } from "@/api/scroll/scroll"
import dict from "../comm/dict.vue"
import { runTask, listPlugin } from "@/api/rpa/rpa";
import { listDetail, getDetail, delDetail, addDetail, updateDetail, runById } from "@/api/run/detail";

export default {
  name: "Log",
  components: { dict },
  data() {
    return {
	  runSync: false,
	  runForm: {},
      // 遮罩层
      loadingLog: true,
      // 选中数组
      ids: [],
	  titleDetail: "修改",
	  openDetail: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showLogSearch: true,
      // 账户日志表格数据
      logList: [],
      // 弹出层标题
      titleLog: "",
      // 是否显示弹出层
      openLog: false,
	  // 遮罩层
	  loadingDetail: true,
	  // 显示搜索条件
	  showDetailSearch: true,
	  // 项目执行计划明细表格数据
	  detailList: [],
	  // 查询参数
	  queryDetailParams: {
	    total: 0,
	    pageNum: 1,
	    pageSize: 10,
	    planId: null,
	    prjId: null,
	    prjName: null,
	    accId: null,
	    bitNo: null,
	    userId: null,
	    groupId: null,
	    taskId: null,
	    taskName: null,
	    planDate: null,
	    startDate: null,
	    endDate: null,
	    runStatus: null,
	    failReason: null
	  },
	  // 表单参数
	  detailForm: {},
	  tableData1: [],
	  tableData2: [],
	  tableData11: [],
	  tableData22: [],
	  activeName: "first",
	  isDisconnect: true,
	  isNoRun: true,
      // 查询参数
      queryLogParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        bitNo: null,
        userId: null,
        userName: null,
        passwd: null,
        userAgent: null,
        mnemonic: null,
        privateKey: null,
        proxy: null,
        sessionId: null,
        detailId: null,
        planId: null,
        level: null,
        taskName: null,
        log: null,
        logStatus: null,
        startDate: null,
        endDate: null,
        runTime: null
      },
      // 表单参数
      logForm: {},
	  openForm:{runType: 0},
	  openSync: false,
	  pluginList:[],
      // 表单校验
      logRules: {
        bitNo: [
          { required: true, message: "窗口不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
	this.sid = localStorage.getItem("sessionId");
	if(!this.sid){
		let r = Math.ceil(Math.random() * 10); 
		let time = new Date().getTime();
		this.sid = "rpa" + time + "" + r;
		localStorage.setItem("sessionId",this.sid)
	}
	this.queryLogParams.sessionId = this.sid;
	 console.log("sessionId=====" + this.sid );
	 
	let installPath = localStorage.getItem("installPath");
	let pluginPaths = localStorage.getItem("pluginPaths"); 
	let cachePath = localStorage.getItem("cachePath");
	let groupId = localStorage.getItem("groupId"); 
	let proxy = localStorage.getItem("proxy");
	 
	 if(installPath){
	 	this.openForm.installPath = installPath;
	 }
	 
	 if(pluginPaths){
	 	this.openForm.pluginPaths = JSON.parse(pluginPaths);
	 }
	 
	 if(cachePath){
	 	this.openForm.cachePath = cachePath;
	 }
	 
	 if(groupId){
	 	this.openForm.groupId = groupId;
	 }
	 
	 if(proxy){
	 	this.openForm.proxy = proxy;
	 }
	 
	 
	 this.initWebSocket();
	 this.myListPlugin();
  },
  methods: {
	handleRunDetail(row){
		 this.ids = row.id ;
		 this.runSync = true;
	},
	/** 修改按钮操作 */
	handleUpdateDetail(row) {
	  const id = row.id || this.ids
	  getDetail(id).then(response => {
	    this.detailForm = response.data;
	    this.openDetail = true;
	    this.titleDetail = "修改项目执行计划明细";
	  });
	},
	/** 提交按钮 */
	submitDetailForm() {
	  this.$refs["detailRef"].validate(valid => {
	    if (valid) {
	      if (this.detailForm.id != null) {
	        updateDetail(this.detailForm).then(response => {
	          this.$modal.msgSuccess("修改成功");
	          this.openDetail = false;
	          this.getDetailList();
	        });
	      } else {
	        addDetail(this.detailForm).then(response => {
	          this.$modal.msgSuccess("新增成功");
	          this.openDetail = false;
	          this.getDetailList();
	        });
	      }
	    }
	  });
	},
	/** 查询项目执行计划明细列表 */
	getDetailList() {
	  this.loadingDetail = true;
	  listDetail(this.queryDetailParams).then(res => {
		if(res.code == 200){
			this.detailList = res.data;
			this.queryDetailParams.total = res.total;
			this.loadingDetail = false;
		}else{
			this.$message.error(res.msg);
		}
	  });
	},
	/** 搜索按钮操作 */
	handleQueryDetail() {
	  this.queryDetailParams.pageNum = 1;
	  this.getDetailList();
	},
	/** 重置按钮操作 */
	resetQueryDetail() {
	  this.resetForm("queryDetailRef");
	  this.handleQueryDetail();
	},
	// 多选框选中数据
	handleSelectionDetailChange(selection) {
	  this.ids = selection.map(item => item.id)
	  this.single = selection.length!==1
	  this.multiple = !selection.length
	},
	myListPlugin(){
		let that = this;
		listPlugin({pageSize: 518}).then(res=>{
			if(res.code == 200){
				that.pluginList = res.data;
			}else{
				that.$message.error(res.msg);
			}
		}).catch(err=>{
			that.$message.error(err);
		})
	},
	submitOpenForm(){
		console.log("openForm==="+JSON.stringify(this.openForm))
		
		let that = this;
		localStorage.setItem("groupId", that.openForm.groupId); 
		localStorage.setItem("installPath", that.openForm.installPath); 
		localStorage.setItem("pluginPaths", JSON.stringify(that.openForm.pluginPaths));
		localStorage.setItem("cachePath", that.openForm.cachePath);
		localStorage.setItem("proxy", that.openForm.proxy);
		
		this.$refs["openFormRef"].validate(valid => {
			if (valid) {
				let pluginPath = that.openForm.cachePath + "\\" + that.openForm.pluginPaths.join(","+that.openForm.cachePath+"\\");
				let installPath = that.$store.state.isMyExe?that.openForm.installPath+"\\resources":that.openForm.installPath;
				let data = {"groupId": that.openForm.groupId, 
					"installPath": installPath ,  
					"pluginPath": pluginPath ,
					"cachePath": that.openForm.cachePath ,
					"proxy": that.openForm.proxy ,
					"runType": that.openForm.runType,
					"sessionId": that.sid
				};
				openmirror(data).then(res=>{
				   if(res.code == 200){
					   console.log("res==="+JSON.stringify(res))
					   this.openSync = false;
				   }
				}).catch(err=>{
					console.log("err==="+JSON.stringify(err))
				})
			}
		});
	},
	submitRunForm(){
		console.log("runForm==="+JSON.stringify(this.openForm))
		let that = this;
		localStorage.setItem("groupId", that.openForm.groupId); 
		localStorage.setItem("installPath", that.openForm.installPath); 
		localStorage.setItem("pluginPaths", JSON.stringify(that.openForm.pluginPaths));
		localStorage.setItem("cachePath", that.openForm.cachePath);
		localStorage.setItem("proxy", that.openForm.proxy);
		
		this.$refs["runFormRef"].validate(valid => {
			if (valid) {
				let pluginPath = that.openForm.cachePath + "\\" + that.openForm.pluginPaths.join(","+that.openForm.cachePath+"\\");
				let installPath = that.$store.state.isMyExe?that.openForm.installPath+"\\resources":that.openForm.installPath;
				let data = {"groupId": that.openForm.groupId, 
					"installPath": installPath ,  
					"pluginPath": pluginPath ,
					"cachePath": that.openForm.cachePath ,
					"proxy": that.openForm.proxy ,
					"runType": that.openForm.runType,
					"sessionId": that.sid,
					"detailId": that.ids
				};
				runById(data).then(res=>{
				   if(res.code == 200){
					   console.log("res==="+JSON.stringify(res))
					   this.runSync = false;
				   }
				}).catch(err=>{
					console.log("err==="+JSON.stringify(err))
				})
			}
		});
	},
	dictMyChange(val){
		//console.log("535353535======"+JSON.stringify(val) )
		this.openForm.groupId = val;
	},
	openMyMirror(){
		this.openSync = true;
	},
	initWebSocket(){ //初始化weosocket
		if(this.isDisconnect && this.isNoRun){
			this.isNoRun = false;
			let that = this;
			const wsuri = getLogWebsocketUrl() + that.sid;
			console.log("初始化weosocket！！！！====" + wsuri)
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
	getMessage(e){ //数据接收
		let res ;
		if(e.data){
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
					console.log("this.tableData11[i].logStatus========"+JSON.stringify(this.tableData22[i]));
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
	myTabClick(tab, event){
		if(this.activeName === "third"){
			this.getLogList();
		}else if(this.activeName === "five"){
			this.getDetailList();
		}
	},
	logFormat(row, column) {
		if(row.logStatus == "1"){
			return "成功";
		}else if(row.logStatus == "0"){
			return "失败";
		}else{
			return row.logStatus;
		}
	},
	runFormat(row, column) {
		//console.log("row.runStatus==="+row.runStatus)
		if(row.runStatus == "1"){
			return "成功";
		}else if(row.runStatus == "0"){
			return "未执行";
		}else if(row.runStatus == "2"){
			return "失败";
		}else{
			return row.runStatus;
		}
	},
	exportLog(){
		this.download('/log/export', {"sessionId":this.sid}, `log_${new Date().getTime()}.xlsx`)
	},
	exportErrorLog(){
		this.download('/log/exportError', {"sessionId": this.sid, "logStatus": "0" , "level": "1"}, `log_${new Date().getTime()}.xlsx`)
	},
	clearLog(){
		const that = this ;
		delAll(this.sid).then(res=>{
			that.tableData1 = [];
			that.tableData2 = [];
			that.tableData11 = [];
			that.tableData22 = [];
			if(res.code == 200){
				that.$message.success("日志清除成功！！")
			}
		}).catch(r=>{
			that.$message.success("日志清除出错！！")
		});
	},
    /** 查询账户日志列表 */
    getLogList() {
      this.loadingLog = true;
      listLog(this.queryLogParams).then(response => {
        this.logList = response.data;
        this.queryLogParams.total = response.total;
        this.loadingLog = false;
      });
    },
    // 取消按钮
    cancelLog() {
      this.openLog = false;
      this.resetLog();
    },
    // 表单重置
    resetLog() {
      this.logForm = {
        id: null,
        bitNo: null,
        userId: null,
        userName: null,
        passwd: null,
        userAgent: null,
        mnemonic: null,
        privateKey: null,
        proxy: null,
        sessionId: null,
        detailId: null,
        planId: null,
        level: null,
        taskName: null,
        log: null,
        logStatus: "0",
        startDate: null,
        endDate: null,
        runTime: null
      };
      this.resetForm("logRef");
    },
    /** 搜索按钮操作 */
    handleQueryLog() {
      this.queryLogParams.pageNum = 1;
      this.getLogList();
    },
    /** 重置按钮操作 */
    resetQueryLog() {
      this.resetForm("queryLogRef");
      this.handleQueryLog();
    },
    // 多选框选中数据
    handleSelectionLogChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddLog() {
      this.openLog = true;
      this.titleLog = "添加账户日志";
      this.logForm.id = null;
    },
    /** 修改按钮操作 */
    handleUpdateLog(row) {
      this.resetLog();
      const id = row.id || this.ids
      getLog(id).then(response => {
        this.logForm = response.data;
        this.openLog = true;
        this.titleLog = "修改账户日志";
      });
    },
    /** 提交按钮 */
    submitLogForm() {
      this.$refs["logRef"].validate(valid => {
        if (valid) {
          if (this.logForm.id != null) {
            updateLog(this.logForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openLog = false;
              this.getLogList();
            });
          } else {
            addLog(this.logForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openLog = false;
              this.getLogList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteLog(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除账户日志编号为"' + ids + '"的数据项？').then(function() {
        return delLog(ids);
      }).then(() => {
        this.getLogList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExportLog() {
      this.download('acc/log/export', {
        ...this.queryLogParams
      }, `log_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
