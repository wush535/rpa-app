<template>
   <el-container style="width: 100%;">
		<el-tabs type="border-card"  v-model="tabIndex" @tab-click="getTaskList" style="width: 100%;">
		  <el-tab-pane label="有效" name="1">
			  <div>
			  	<el-form :model="queryTaskParams" ref="queryTaskRef" size="small" :inline="true" v-show="showTaskSearch" label-width="88px">
			  	  <el-form-item label="项目名" prop="prjName">
			  		<el-input v-model="queryTaskParams.prjName"
			  		  placeholder="请输入项目名" clearable @keyup.enter.native="handleQueryTask" />
			  	  </el-form-item>
			  	  
			  	  <el-form-item label="任务名" prop="taskName">
			  		<el-input v-model="queryTaskParams.taskName"
			  		  placeholder="请输入任务名" clearable @keyup.enter.native="handleQueryTask" />
			  	  </el-form-item>
			  	
			  	  <el-form-item>
			  		<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryTask">搜索</el-button>
			  		<el-button icon="el-icon-refresh" size="mini" @click="resetQueryTask">重置</el-button>
			  	  </el-form-item>
			  	</el-form>
			  </div>
			  
			  <el-row :gutter="10" class="mb8">
			    <el-col :span="1.5">
					<el-button type="primary" plain icon="el-icon-plus" size="large" @click="handleAddPrj" >
						新增项目
					</el-button>
					<el-button type="warning" size="large" @click="openJar" v-show="!$store.state.isOpen">开启服务</el-button>
					<el-button type="warning" size="large" @click="$message.warning('服务已开启')" v-show="$store.state.isOpen" disabled>服务已开启</el-button>
					<el-button type="info" size="large" @click="stopJar">关闭服务</el-button>
			    </el-col>
			  </el-row>
			  
			  <el-table :data="taskList" @selection-change="handleSelectionTaskChange"
			        row-key="nid" :default-expand-all="isExpandAll" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			    <el-table-column type="selection" width="55" align="center" />
			    <!-- <el-table-column label="id" align="center" prop="nid" /> -->
			    <el-table-column label="项目名|任务名" align="left" prop="prjName">
			  		<template slot-scope="scope">
			  			<span v-if="scope.row.nid.charAt(0) == 'A'">项目名：{{scope.row.nid}}-{{scope.row.prjName}}</span>
			  			<span v-if="scope.row.nid.charAt(0) == 'B'" style="padding-left: 35px;">{{scope.row.nid}}-{{scope.row.taskName}}</span>
			  		</template>
			    </el-table-column>
			    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
			      <template slot-scope="scope">
			  	  <el-button size="mini" type="text" icon="el-icon-edit" @click="handleAddTask(scope.row)" v-if="scope.row.nid.charAt(0) == 'A'">
			  			新增任务
			  	  </el-button>
			        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateTask(scope.row)" >
			  		  修改
			  	  </el-button>
			  	  <el-button size="mini" type="text" icon="el-icon-delete"  v-if="scope.row.nid.charAt(0) == 'A'" @click="addSubMenu('执行('+scope.row.nid+'-'+scope.row.prjName+')',{name : 'rpa', query: { id: scope.row.nid }})">
			  			<!-- <router-link target="_blank" :to= "{name : 'rpa', query: { id: scope.row.nid }}"  > </router-link> -->
						执行任务
			  	  </el-button>
				  
				  <el-button size="mini" type="text" icon="el-icon-delete"  v-if="scope.row.nid.charAt(0) == 'A'" @click="addSubMenu('计划('+scope.row.nid+'-'+scope.row.prjName+')',{name : 'plan', query: { id: scope.row.nid , prjName: scope.row.prjName }})">生成计划</el-button>
			  	  				  
			  	  <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.nid.charAt(0) == 'B'" @click="addSubMenu('编辑('+scope.row.nid+'-'+scope.row.taskName+')',{name : 'flow', query: { id: scope.row.nid }})">
			  	  	  <!-- <router-link  target="_blank" :to= "{name : 'flow', query: { id: scope.row.nid }}" >编辑任务 </router-link> -->
					  编辑任务
			  	  </el-button>
				  
				   <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.nid.charAt(0) == 'A'" @click="handleDeletePrj(scope.row)">删除</el-button>
				   <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.nid.charAt(0) == 'B'" @click="handleDeleteTask(scope.row)">删除</el-button>
				  
				  
			      </template>
			    </el-table-column>
			  </el-table>
			  
			  <pagination v-show="queryTaskParams.total>0" :total="queryTaskParams.total" :page.sync="queryTaskParams.pageNum" 
			  	:limit.sync="queryTaskParams.pageSize" @pagination="getTaskList" />
			  
		  </el-tab-pane>
		  <el-tab-pane label="无效" name="0">
				<div style="padding-top: 18px;">
					<el-form :model="queryTaskParams" ref="queryTaskRef" size="small" :inline="true" v-show="showTaskSearch" label-width="88px">
					  <el-form-item label="项目名" prop="prjName">
						<el-input v-model="queryTaskParams.prjName"
						  placeholder="请输入项目名" clearable @keyup.enter.native="handleQueryTask" />
					  </el-form-item>
					  
					  <el-form-item label="任务名" prop="taskName">
						<el-input v-model="queryTaskParams.taskName"
						  placeholder="请输入任务名" clearable @keyup.enter.native="handleQueryTask" />
					  </el-form-item>
					
					  <el-form-item>
						<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryTask">搜索</el-button>
						<el-button icon="el-icon-refresh" size="mini" @click="resetQueryTask">重置</el-button>
					  </el-form-item>
					</el-form>
				</div>
				
				<el-row :gutter="10" class="mb8">
				  <el-col :span="1.5">
				    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddPrj" >
						新增项目
					</el-button>
				  </el-col>
				</el-row>
				
				<el-table  :data="taskList" @selection-change="handleSelectionTaskChange"
				      row-key="nid" :default-expand-all="isExpandAll" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				  <el-table-column type="selection" width="55" align="center" />
				  <el-table-column label="id" align="center" prop="nid" />
				  <el-table-column label="父id" align="center" prop="parentId" />
				  <el-table-column label="项目名|任务名" align="center" prop="prjName" >
						<template slot-scope="scope">
							<span v-if="scope.row.nid.charAt(0) == 'A'">{{scope.row.prjName}}</span>
							<span v-if="scope.row.nid.charAt(0) == 'B'">任务->{{scope.row.taskName}}</span>
						</template>
				  </el-table-column>
				  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				    <template slot-scope="scope">
					  <el-button size="mini" type="text" icon="el-icon-edit" @click="handleAddTask(scope.row)" v-if="scope.row.nid.charAt(0) == 'A'">
							新增任务
					  </el-button>
				      <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateTask(scope.row)" >
							修改
					  </el-button>
					  <el-button size="mini" type="text" icon="el-icon-delete"  v-if="scope.row.nid.charAt(0) == 'A'">
							<router-link target="_blank" :to= "{name : 'rpa', query: { id: scope.row.nid }}"  > 执行任务</router-link>
					  </el-button>
					  
					  <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.nid.charAt(0) == 'B'">
					  	  <router-link target="_blank" :to= "{name : 'flow', query: { id: scope.row.nid }}" > 编辑任务</router-link>
					  </el-button>
				    </template>
				  </el-table-column>
				</el-table>
				
				<pagination v-show="queryTaskParams.total>0" :total="queryTaskParams.total" :page.sync="queryTaskParams.pageNum" :limit.sync="queryTaskParams.pageSize" @pagination="getTaskList" />
			  
		  </el-tab-pane>
		</el-tabs>
		
		
		
		<!-- 添加或修改rpaTask对话框 -->
		<el-drawer :title="titlePrj" :visible.sync="openPrj" :rules="prjRules" size="50%"  append-to-body>
		  <el-card>
			  <el-form ref="prjRef" :model="prjForm"  label-width="98px">
				<el-form-item label="项目名" prop="prjName">
				  <el-input v-model="prjForm.prjName" placeholder="请输入项目名" />
				</el-form-item>
				
				<el-form-item label="状态">
					<el-select v-model="prjForm.status" placeholder="请选择" style="width: 100%;">
						<el-option v-for="item in prjStatus" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			  </el-form>
			  <div style="text-align: center">
				<el-button type="primary" @click="submitPrjForm">确 定</el-button>
				<el-button @click="cancelPrj">取 消</el-button>
			  </div>
		  </el-card>
		</el-drawer>
		
		<!-- 添加或修改rpaTask对话框 -->
		<el-drawer :title="titleTask" :visible.sync="openTask" size="50%"  append-to-body>
		  <el-card>
		  <el-form ref="taskRef" :model="taskForm" :rules="taskRules" label-width="98px">
		    <el-form-item label="项目id" prop="prjId" >
		      <el-input v-model="taskForm.prjId" placeholder="请输入项目id" disabled/>
		    </el-form-item>
		    <el-form-item label="项目名" prop="prjName">
		      <el-input v-model="taskForm.prjName" placeholder="请输入项目名" disabled/>
		    </el-form-item>
		    <el-form-item label="任务名" prop="taskName">
		      <el-input v-model="taskForm.taskName" placeholder="请输入任务名" />
		    </el-form-item>
			<el-form-item label="顺序" prop="orderNum">
			  <el-input v-model="taskForm.orderNum" type="number" />
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="taskForm.status" placeholder="请选择" style="width: 100%;">
					<el-option v-for="item in prjStatus" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
		  </el-form>
		  <div style="text-align: center">
		    <el-button type="primary" @click="submitTaskForm">确 定</el-button>
		    <el-button @click="cancelTask">取 消</el-button>
		  </div>
		  </el-card>
		</el-drawer>
   </el-container>
 
</template>

<script>
import { listTask, list, getTask, delTask, addTask, updateTask , openRpa, getLogWebsocketUrl, addPrj, updatePrj, getPrj ,delPrj} from "@/api/home";
import { handleTree } from "@/api/utils/tree";
import { ipcRenderer } from 'electron' ;

 

export default {
  name: "Task",
  data() {
    return {
	  // 表单校验
	  planRules: {
	    prjId: [
	      { required: true, message: "项目id不能为空", trigger: "blur" }
	    ],
	    prjName: [
	      { required: true, message: "项目名称不能为空", trigger: "blur" }
	    ],
	    infoId: [
	      { required: true, message: "账号id不能为空", trigger: "blur" }
	    ],
	    taskId: [
	      { required: true, message: "任务id不能为空", trigger: "blur" }
	    ],
	    taskName: [
	      { required: true, message: "任务名称不能为空", trigger: "blur" }
	    ],
	    pluginId: [
	      { required: true, message: "插件id不能为空", trigger: "blur" }
	    ],
	    pluginName: [
	      { required: true, message: "插件名称不能为空", trigger: "blur" }
	    ],
	  },
	  // 弹出层标题
	  titlePlan: "",
	  // 是否显示弹出层
	  openPlan: false,
	  // 表单参数
	  planForm: {},
	  tabIndex: "1",
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showTaskSearch: true,
      // rpaTask表格数据
      taskList: [],
      // 弹出层标题
      titleTask: "",
	  titlePrj: "",
      // 是否显示弹出层
      openTask: false,
	  openPrj: false,
      // 查询参数
      queryTaskParams: {
        total: 0,
        pageNum: 1,
        pageSize: 2000,
        prjId: null,
        prjName: null,
        taskName: null,
        flowData: null,
		status: "1"
      },
	  prjStatus:[{
	      value: "0",
	      label: '0-无效'
	    }, {
	      value: "1",
	      label: '1-有效'
	   }],
	  isExpandAll: false,
      // 表单参数
      taskForm: {
		  status: "1",
		  orderNum: 1,
		},
	  prjForm: {status: "1"},
      // 表单校验
      taskRules: {
		prjId: [
			{ required: true, message: "项目id不能为空", trigger: "blur" }
		],
        prjName: [
          { required: true, message: "项目名不能为空", trigger: "blur" }
        ],
        taskName: [
          { required: true, message: "任务名不能为空", trigger: "blur" }
        ],
		orderNum: [
		  { required: true, message: "顺序", trigger: "blur" }
		],
		status: [
		  { required: true, message: "状态" }
		],
      },
	  myTaskList:[],
	  myPluginList:[],
	  LogStatisticsList:[],
	  staticsSync: false,
	  prjRules: {
	    prjName: [
	      { required: true, message: "项目名不能为空", trigger: "blur" }
	    ],
		status: [
		  { required: true, message: "状态", }
		],
	  },
    };
  },
  created() {
	//console.log("home=======created");
	let that = this;
	if(that.$store.state.isMyExe){
		//接收主进程版本更新消息
		ipcRenderer.on("myMsg", (event, arg) => {
			console.log("arg=======" + JSON.stringify(arg));
			if ("startBat" == arg.cmd) {
				that.$store.state.myLoading = false; 
				if(arg.code == 200 || arg.code == 201){ //启动成功
					that.$store.state.isOpen = true;
					//that.$modal.msgSuccess(arg.msg);
					that.$store.commit("openFlag");
					that.getTaskList();
				}else{
					that.$modal.msgSuccess(arg.msg);
				}
			} else if ("stopBat" == arg.cmd) {
				if(arg.code == 200 || arg.code == 201){ //关闭成功
					that.$store.state.isOpen = false;
				}
				that.$modal.msgSuccess(arg.msg);		
			}
		});
	}
	this.openJar();
  },
  methods: {
	addSubMenu(name,url){
		console.log("url===="+url)
		this.$store.commit('addTab', {"name":name, "url":url} );
		this.$router.push(url);
	},
	openJar(){
		let that = this;
		if(that.$store.state.isMyExe && !that.$store.state.isOpen ){
			that.$store.state.myLoading = true;
			ipcRenderer.send("startBat")
		}else{
			that.$store.state.isOpen = true;
			that.$store.commit("openFlag");
			that.getTaskList();
		}
	},
	stopJar(){
		let that = this;
		if(that.$store.state.isMyExe && that.$store.state.isOpen ){
			ipcRenderer.send("stopBat");
		}
	},
    /** 查询rpaTask列表 */
    getTaskList() {
	  let that = this;
	  //console.log("this.tabIndex===="+this.tabIndex)
	  this.queryTaskParams.status = this.tabIndex;
	
	  //console.log("this.queryTaskParams===="+JSON.stringify(this.queryTaskParams))
      listTask(this.queryTaskParams).then(response => {
        this.taskList = handleTree(response.data, "nid", "parentId");
		//console.log("this.taskList======="+JSON.stringify(this.taskList))
        this.queryTaskParams.total = response.total;
      }).catch(error =>{
		  
	  });
    },
	/** 提交按钮 */
	submitPlanForm() {
	  this.$refs["planRef"].validate(valid => {
	    if (valid) {
	      if (this.planForm.id != null) {
	        updatePlan(this.planForm).then(response => {
	          this.$modal.msgSuccess("修改成功");
	          this.openPlan = false;
	          this.getPlanList();
	        });
	      } else {
	        addPlan(this.planForm).then(response => {
	          this.$modal.msgSuccess("新增成功");
	          this.openPlan = false;
	          this.getPlanList();
	        });
	      }
	    }
	  });
	},
	// 取消按钮
	cancelPlan() {
	  this.openPlan = false;
	  this.resetPlan();
	},
    // 取消按钮
    cancelTask() {
      this.openTask = false;
      this.resetTask();
    },
	// 取消按钮
	cancelPrj() {
	  this.openPrj = false;
	},
	
    // 表单重置
    resetTask() {
      this.taskForm = {
        id: null,
        prjId: null,
        prjName: null,
        taskName: null,
        flowData: null,
        createTime: null,
        updateTime: null,
		status: "1",
		orderNum: 1
      };
    },
	
	// 表单重置
	resetPrj() {
	  this.taskForm = {
	    id: null,
	    prjName: null,
		status: "1"
	  };
	},
	
    /** 搜索按钮操作 */
    handleQueryTask() {
      this.queryTaskParams.pageNum = 1;
      this.getTaskList();
    },
    /** 重置按钮操作 */
    resetQueryTask() {
      this.handleQueryTask();
    },
    // 多选框选中数据
    handleSelectionTaskChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddTask(row) {
      this.openTask = true;
      this.titleTask = "添加rpaTask";
      this.taskForm.id = null;
	  this.taskForm.prjId = row.nid.substring(1,row.nid.length);
	  this.taskForm.prjName = row.prjName;
    },
	handleAddPrj() {
	  this.openPrj = true;
	  this.titlePrj = "添加项目";
	  this.prjForm.id = null;
	},
	/** 新增按钮操作 */
	handleAddPlan(row) {
	  this.openPlan = true;
	  this.titlePlan = "添加项目执行计划";
	  this.planForm.id = null;
	  this.planForm.prjId = row.nid.substring(1,row.nid.length);
	  this.planForm.prjName = row.prjName;
	},
 
    /** 修改按钮操作 */
    handleUpdateTask(row) {
		if(row.nid.charAt(0) == 'A'){
			this.resetPrj();
			const id = row.nid.substring(1,row.nid.length) || this.ids
			getPrj(id).then(response => {
			  this.prjForm = response.data;
			  this.openPrj = true;
			  this.titlePrj = "修改项目";
			});
		}else{
			this.resetTask();
			const id = row.nid.substring(1,row.nid.length) || this.ids
			getTask(id).then(response => {
			  this.taskForm = response.data;
			  this.openTask = true;
			  this.titleTask = "修改任务";
			});
		}
    },
	submitPrjForm(){
		this.$refs["prjRef"].validate(valid => {
		  if (valid) {
		    if (this.prjForm.id != null) {
		      updatePrj(this.prjForm).then(response => {
		        this.$modal.msgSuccess("修改成功");
		        this.openPrj = false;
		        this.getTaskList();
		      });
		    } else {
		      addPrj(this.prjForm).then(response => {
		        this.$modal.msgSuccess("新增成功");
		        this.openPrj = false;
		        this.getTaskList();
		      });
		    }
		  }
		});
	},
    /** 提交按钮 */
    submitTaskForm() {
      this.$refs["taskRef"].validate(valid => {
        if (valid) {
          if (this.taskForm.id != null) {
            updateTask(this.taskForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openTask = false;
              this.getTaskList();
            });
          } else {
            addTask(this.taskForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openTask = false;
              this.getTaskList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteTask(row) {
      const ids = row.nid.substring( 1, row.nid.length) || this.ids;
      this.$modal.confirm('是否确认删除任务编号为"' + ids + '"的数据项？').then(function() {
        return delTask(ids);
      }).then(() => {
        this.getTaskList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	
	/** 删除按钮操作 */
	handleDeletePrj(row) {
	  const ids = row.nid.substring( 1, row.nid.length) || this.ids;
	  this.$modal.confirm('是否确认删除项目编号为"' + ids + '"的数据项？').then(function() {
	    return delPrj(ids);
	  }).then(() => {
	    this.getTaskList();
	    this.$modal.msgSuccess("删除成功");
	  }).catch(() => {});
	},
    /** 导出按钮操作 */
    handleExportTask() {
      this.download('rpa/task/export', {
        ...this.queryTaskParams
      }, `task_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style>
	.mb8{
		padding: 18px 8px 18px 18px;
	}
	
</style>