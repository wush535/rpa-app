<template>
  <div class="app-container">
    <el-form :model="queryPlanParams" ref="queryPlanRef" size="small" :inline="true" v-show="showPlanSearch" label-width="88px">
      <el-form-item label="项目id" prop="prjId">
        <el-input
          v-model="queryPlanParams.prjId"
          placeholder="请输入项目id"
          clearable
          @keyup.enter.native="handleQueryPlan"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="prjName">
        <el-input
          v-model="queryPlanParams.prjName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQueryPlan"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker clearable
          v-model="queryPlanParams.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker clearable
          v-model="queryPlanParams.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryPlan">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQueryPlan">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"  size="large" @click="handleAddPlan" >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button  type="primary"   size="large" :disabled="single" @click="handleOpen">生成计划明细</el-button>
      </el-col>
	  
	  <el-col :span="1.5">
	    <el-button type="warning" size="large" @click="openMyMirror()" >开启监控</el-button>
	  </el-col>
	  
	  <el-col :span="1.5">
		  <el-button size="large" type="success" icon="el-icon-delete"  @click="addSubMenu('日志列表',{name : 'log' })">
			   查看日志
		  </el-button>
	  </el-col>
	  
     
    </el-row>

    <el-table v-loading="loadingPlan" :data="planList" @selection-change="handleSelectionPlanChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" width="88px"/>
      <el-table-column label="项目名称" align="center" prop="prjName" width="180" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
	  
	  <el-table-column label="任务名" align="center" prop="taskNames" ></el-table-column>
	  <el-table-column label="插件名称" align="center" prop="pluginNames" ></el-table-column>
	  
	  <el-table-column label="运行状态" align="center" prop="runStatus" :formatter="statusFormatter" width="88px"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="168px">
        <template slot-scope="scope" >
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdatePlan(scope.row)" >修改</el-button>
          <el-button size="mini" ype="text" icon="el-icon-delete" @click="handleDeletePlan(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="queryPlanParams.total>0"
      :total="queryPlanParams.total"
      :page.sync="queryPlanParams.pageNum"
      :limit.sync="queryPlanParams.pageSize"
      @pagination="getPlanList"
    />
	
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
					<el-select v-model="openForm.pluginPaths" multiple placeholder="请选择" style="width: 100%;" >
						<el-option v-for="item in myPluginList" :key="item.pluginPath" :value="item.pluginPath" :label="item.pluginName" >
							{{item.pluginName}}
						</el-option >
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
    <!-- 添加或修改项目执行计划对话框 -->
    <el-drawer :title="titlePlan" :visible.sync="openPlan" size="38%"  append-to-body>
      <el-card>
		  <el-form ref="planRef" :model="planForm" :rules="planRules" label-width="98px">
			<el-form-item label="项目id" prop="prjId">
			  <el-input v-model="planForm.prjId" placeholder="请输入项目id" disabled />
			</el-form-item>
			<el-form-item label="项目名称" prop="prjName">
			  <el-input v-model="planForm.prjName" placeholder="请输入项目名称" disabled />
			</el-form-item>
			
			
			<el-form-item label="分组" prop="groupId">
				<dict dictType="rpa_group_id" :dictValue="planForm.groupId" @dictChange="dictMyChange" ></dict>
			</el-form-item>
			
			<el-form-item label="执行日期" prop="startDate">
			   <el-date-picker v-model="startEndDate" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" 
					type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
			   </el-date-picker>
			</el-form-item>
		 
			<el-form-item label="任务">
				<el-checkbox-group v-model="tasks">
					<el-checkbox v-for="item in myTaskList" :label="item.id" > {{item.taskName}} </el-checkbox>
				</el-checkbox-group>
			</el-form-item>
	 
			
			<el-form-item label="浏览器插件">
				<el-checkbox-group v-model="plugins">
					<el-checkbox v-for="plugin in myPluginList" :label="plugin.id">{{plugin.pluginName}}</el-checkbox>
				</el-checkbox-group>
				
			</el-form-item>
		  </el-form>
		  <div style="text-align: center">
			<el-button type="primary" @click="submitPlanForm">确 定</el-button>
			<el-button @click="cancelPlan">取 消</el-button>
		  </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { listPlan, getPlan, delPlan, addPlan, updatePlan , openById } from "@/api/run/plan";
import {  openmirror } from "@/api/acc/log";
import { runTask, listPlugin } from "@/api/rpa/rpa";
import { list } from "@/api/home";
import dict from "../comm/dict.vue"

export default {
  name: "Plan",
  components: { dict },
  data() {
    return {
      // 遮罩层
      loadingPlan: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showPlanSearch: true,
      // 项目执行计划表格数据
      planList: [],
      // 弹出层标题
      titlePlan: "",
      // 是否显示弹出层
      openPlan: false,
      // 查询参数
      queryPlanParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        prjId: null,
        prjName: null,
        startDate: null,
        endDate: null,
        accIds: null,
        taskIds: null,
        taskNames: null,
        pluginPath: null,
        pluginNames: null,
        runStatus: null
      },
      // 表单参数
      tasks: [],
      plugins:[],
	  startEndDate: [],
	  myPluginList:[],
	  myTaskList:[],
	  planForm:{},
	  openForm:{runType: 0},
	  openSync: false,
	  pluginList:[],
      // 表单校验
      planRules: {
        prjId: [
          { required: true, message: "项目id不能为空", trigger: "blur" }
        ],
        prjName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        accIds: [
          { required: true, message: "账号id不能为空", trigger: "blur" }
        ],
        taskIds: [
          { required: true, message: "任务id不能为空", trigger: "blur" }
        ],
        taskNames: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        pluginIds: [
          { required: true, message: "插件id不能为空", trigger: "blur" }
        ],
        pluginNames: [
          { required: true, message: "插件名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
	if(this.$route.query.id){
		this.planForm.prjId = this.$route.query.id.substring(1,this.$route.query.id.length);
		this.planForm.prjName = this.$route.query.prjName;
		this.queryPlanParams.prjId	= this.planForm.prjId ;
		//this.openPlan = true;
	}  
	
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
	
    this.getPlanList();
	this.myListPlugin();
	this.myListTask();
  },
  methods: {
	openMyMirror(){
		this.openSync = true;
	},
	addSubMenu(name,url){
		this.$store.commit('addTab', {"name":name, "url":url} );
		this.$router.push(url);
	},
	dictMyChange(val){
		//console.log("535353535======"+JSON.stringify(val) )
		this.planForm.groupId = val;
	},
	
	handleOpen(row){
		const id = row.id || this.ids
		//console.log("id==="+id);
		let that = this;
		openById(id).then(res => {
			//console.log("==="+JSON.stringify(res))
			 that.getPlanList();
		}).catch(err =>{
			console.log("==="+JSON.stringify(err))
		})
	},
	submitOpenForm(){
		//console.log("openForm==="+JSON.stringify(this.openForm))
		
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
					   //console.log("res==="+JSON.stringify(res))
					   this.openSync = false;
				   }
				}).catch(err=>{
					console.log("err==="+JSON.stringify(err))
				})
			}
		});
	},
	myListPlugin(){
		let that = this;
		listPlugin({pageSize: 518}).then(res=>{
			if(res.code == 200){
				that.myPluginList = res.data;
			}else{
				that.$message.error(res.msg);
			}
		}).catch(err=>{
			that.$message.error(err);
		})
	},
	myListTask(){
		let that = this;
		let rpjTask = {prjId: this.planForm.prjId,pageSize: 518};
		list(rpjTask).then(res=>{
			if(res.code == 200){
				that.myTaskList = res.data;
				//console.log("that.taskList===="+JSON.stringify(that.taskList))
			}else{
				that.$message.error(res.msg);
			}
		}).catch(err=>{
			that.$message.error(err);
		})
	},
	/** 查询项目执行计划列表 */
    getPlanList() {
      this.loadingPlan = true;
      listPlan(this.queryPlanParams).then(response => {
        this.planList = response.data;
        this.queryPlanParams.total = response.total;
        this.loadingPlan = false;
      });
    },
    // 取消按钮
    cancelPlan() {
      this.openPlan = false;
      this.resetPlan();
    },
    // 表单重置
    resetPlan() {
      this.planForm = {
        id: null,
        prjId: null,
        prjName: null,
        startDate: null,
        endDate: null,
        accIds: null,
        taskIds: null,
        taskNames: null,
        pluginPath: null,
        pluginNames: null,
        runStatus: "0"
      };
      this.resetForm("planRef");
    },
    /** 搜索按钮操作 */
    handleQueryPlan() {
      this.queryPlanParams.pageNum = 1;
      this.getPlanList();
    },
    /** 重置按钮操作 */
    resetQueryPlan() {
      this.resetForm("queryPlanRef");
      this.handleQueryPlan();
    },
    // 多选框选中数据
    handleSelectionPlanChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddPlan() {
      this.openPlan = true;
      this.titlePlan = "添加项目执行计划";
      this.planForm.id = null;
    },
    /** 修改按钮操作 */
    handleUpdatePlan(row) {
      this.resetPlan();
      const id = row.id || this.ids
      getPlan(id).then(res => {
		let response = res.data;
        this.planForm = {id: response.id, prjId: response.prjId , 
			prjName: response.prjName, runStatus: response.runStatus, 
			startDate: response.startDate,
			endDate: response.endDate,
			groupId: response.groupId
		 };
		//console.log("response==="+JSON.stringify(response))
		this.startEndDate = [this.planForm.startDate,this.planForm.endDate];
		if(response.taskIds){
			let tasks = response.taskIds.split(",").map(Number);
			this.tasks = tasks;
			//console.log(" that.tasks===="+JSON.stringify( this.tasks))
		}
		
		if(response.pluginPath){
			let path = response.pluginPath.split(",").map(Number);
			//console.log(" path===="+JSON.stringify( path))
			this.plugins = path; 
		}
        this.openPlan = true;
        this.titlePlan = "修改项目执行计划";
      });
    },
    /** 提交按钮 */
    submitPlanForm() {
	  let that = this;
      this.$refs["planRef"].validate(valid => {
        if (valid) {
          if (this.planForm.id != null) {
				if(that.startEndDate){
					//console.log(" that.startEndDate===="+JSON.stringify( that.startEndDate))
					that.planForm.startDate = that.startEndDate[0] + " 00:00:00";
					that.planForm.endDate = that.startEndDate[1] + " 23:59:59";
					//console.log(" that.planForm.startDate===="+JSON.stringify( that.planForm.startDate))
					//console.log(" that.planForm.endDate===="+JSON.stringify( that.planForm.endDate))
					
				}
				
				if(that.tasks){
					//console.log(" that.tasks===="+JSON.stringify(that.tasks))
					that.planForm.taskIds = that.tasks.join(",");
					//console.log(" that.planForm.taskIds===="+JSON.stringify( that.planForm.taskIds));
				    that.planForm.taskNames = ""; 
					for(let i = 0; i < that.tasks.length; i++){
						that.myTaskList.forEach(item =>{
							if(item.id === that.tasks[i]){
								that.planForm.taskNames = that.planForm.taskNames + item.taskName + ","
							}
						})
					}
					that.planForm.taskNames = that.planForm.taskNames.substring(0, that.planForm.taskNames.length - 1)
					//console.log("that.planForm.taskNames===="+that.planForm.taskNames)
				}
				
				if(that.plugins){
					//console.log(" that.plugins===="+JSON.stringify( that.plugins))
					that.planForm.pluginPath = that.plugins.join(",");
					//console.log(" that.planForm.pluginPath===="+JSON.stringify( that.planForm.pluginPath));
					that.planForm.pluginNames = ""; 
					for(let i = 0; i < that.plugins.length; i++){
						that.myPluginList.forEach(item =>{
							if(item.id === that.plugins[i]){
								that.planForm.pluginNames = that.planForm.pluginNames + item.pluginName + ","
							}
						})
					}
					that.planForm.pluginNames = that.planForm.pluginNames.substring(0,that.planForm.pluginNames.length - 1);
					//console.log("that.planForm.pluginNames===="+that.planForm.pluginNames)
				}
				
				updatePlan(that.planForm).then(res => {
					if(res.code == 200){
						that.$message.success("修改成功");
						that.openPlan = false;
						that.getPlanList();
					}else{
						that.$message.error(res.msg);
					}
				}).catch(err =>{
					that.$message.error(JSON.stringify(err));
				});
          } else {
				if(that.startEndDate){
					//console.log(" that.planForm.startEndDate===="+JSON.stringify( that.startEndDate))
					that.planForm.startDate = that.startEndDate[0] + " 00:00:00";
					that.planForm.endDate = that.startEndDate[1] + " 23:59:59";
					//console.log(" that.planForm.startDate===="+JSON.stringify( that.planForm.startDate))
					//console.log(" that.planForm.endDate===="+JSON.stringify( that.planForm.endDate))
					
				}
				
				if(that.tasks){
					//console.log(" that.tasks===="+JSON.stringify( that.tasks))
					that.planForm.taskIds = that.tasks.join(",");
					//console.log(" that.planForm.taskIds===="+JSON.stringify( that.planForm.taskIds));
				    that.planForm.taskNames = ""; 
					for(let i = 0; i < that.tasks.length; i++){
						that.myTaskList.forEach(item =>{
							if(item.id === that.tasks[i]){
								that.planForm.taskNames = that.planForm.taskNames + item.taskName + ","
							}
						})
					}
					that.planForm.taskNames = that.planForm.taskNames.substring(0, that.planForm.taskNames.length - 1)
					//console.log("that.planForm.taskNames===="+that.planForm.taskNames)
				}
				
				if(that.plugins){
					//console.log(" that.plugins===="+JSON.stringify( that.plugins))
					that.planForm.pluginPath = that.plugins.join(",");
					//console.log(" that.planForm.pluginPath===="+JSON.stringify( that.planForm.pluginPath));
					that.planForm.pluginNames = ""; 
					for(let i = 0; i < that.plugins.length; i++){
						that.myPluginList.forEach(item =>{
							if(item.id === that.plugins[i]){
								that.planForm.pluginNames = that.planForm.pluginNames + item.pluginName + ","
							}
						})
					}
					that.planForm.pluginNames = that.planForm.pluginNames.substring(0,that.planForm.pluginNames.length - 1);
					//console.log("that.planForm.pluginNames===="+that.planForm.pluginNames)
				}
				addPlan(that.planForm).then(res => {
					if(res.code == 200){
						that.$message.success("新增成功");
						that.openPlan = false;
						that.getPlanList();
					}else{
						that.$message.error(res.msg);
					}
				}).catch(err =>{
					console.log(JSON.stringify(err) );
				});
			}
		}
      });
    },
    /** 删除按钮操作 */
    handleDeletePlan(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除项目执行计划编号为"' + ids + '"的数据项？').then(function() {
        return delPlan(ids);
      }).then(() => {
        this.getPlanList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExportPlan() {
      this.download('run/plan/export', {
        ...this.queryPlanParams
      }, `plan_${new Date().getTime()}.xlsx`)
    },
	statusFormatter(row, column) {
		if(row.runStatus == "0"){
			return "创建";
		}else if(row.runStatus == "1"){
			return "开启";
		}else if(row.runStatus == "2"){
			return "关闭";
		}else{
			return row.runStatus;
		}
	},
  }
};
</script>
