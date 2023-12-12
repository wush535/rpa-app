<template>
  <div class="app-container">
    <el-form :model="queryInfoParams" ref="queryInfoRef" size="small" :inline="true" v-show="showInfoSearch" label-width="88px">
      <el-form-item label="分组" prop="groupId">
		  <group :my-group-id="queryInfoParams.groupId" :my-group-name="queryInfoParams.groupName" :single="true" @myselect="getGroupIdAndName1"></group>
      </el-form-item>
      <el-form-item label="窗口号" prop="bitNo">
        <el-input
          v-model="queryInfoParams.bitNo"
          placeholder="请输入窗口号"
          clearable
          @keyup.enter.native="handleQueryInfo"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryInfoParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQueryInfo"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryInfo">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQueryInfo">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAddInfo"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExportInfo"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loadingInfo" :data="infoList" @selection-change="handleSelectionInfoChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" width="88" align="center" prop="id" />
	  <el-table-column label="窗口号" width="108" align="center" prop="bitNo" />
	  <el-table-column label="组名称" width="168" align="center" prop="groupName" />
      <el-table-column label="用户id" width="288" align="center" prop="userId" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column label="密码" align="center" prop="passwd" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateInfo(scope.row)" >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleOpen(scope.row)"  >打开</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="queryInfoParams.total>0" :total="queryInfoParams.total" :page.sync="queryInfoParams.pageNum" 
		:limit.sync="queryInfoParams.pageSize"  @pagination="getInfoList" />

    <!-- 添加或修改账户信息对话框 -->
    <el-drawer :title="titleInfo" :visible.sync="openInfo" size="48%"  append-to-body>
      <el-card>
      <el-form ref="infoRef" :model="infoForm" :rules="infoRules" label-width="98px">
        <el-form-item label="序号" prop="bitNo">
          <el-input v-model="infoForm.bitNo" type="number" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="infoForm.userId" placeholder="请输入用户id" />
        </el-form-item>
		<el-form-item label="分组" prop="groupId">
		   	<group :my-group-id="infoForm.groupId" :my-group-name="infoForm.groupName"  :single="true" @myselect="getGroupIdAndName2"></group>
		</el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="infoForm.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input v-model="infoForm.passwd" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="浏览器UA" prop="userAgent">
          <el-input type="textarea" :rows="3" v-model="infoForm.userAgent" placeholder="请输入浏览器UA" />
        </el-form-item>
        <el-form-item label="代理" prop="proxy">
          <el-input v-model="infoForm.proxy" placeholder="请输入代理" />
        </el-form-item>
		<el-form-item label="网络饼干" prop="cookie">
		  <el-input type="textarea" :rows="3" v-model="infoForm.cookie" placeholder="请输入cookie" />
		</el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="submitInfoForm">确 定</el-button>
        <el-button @click="cancelInfo">取 消</el-button>
      </div>
      </el-card>
    </el-drawer>
	
	<el-dialog  :visible.sync="openSync" width="35%">
		<el-card>
			<el-form ref="openFormRef" :model="openForm" label-width="108px" >
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
				
				<el-form-item label="代理">
					<el-input v-model="openForm.proxy"></el-input>
				</el-form-item>
				
				<div style="text-align: center">
				  <el-button type="primary" @click="submitOpenForm">打 开</el-button>
				  <el-button @click="cancelOpen">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</el-dialog>
	
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo, openById } from "@/api/acc/info";
import { v4 as uuidv8 } from 'uuid';
import dict from "../comm/dict.vue"
import { runTask, listPlugin } from "@/api/rpa/rpa";
import group from "../comm/group.vue"

export default {
  name: "Info",
  components: { dict,group },
  data() {
    return {
      // 遮罩层
      loadingInfo: true,
      // 选中数组
      ids: [], 
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showInfoSearch: true,
      // 账户信息表格数据
      infoList: [],
      // 弹出层标题
      titleInfo: "",
      // 是否显示弹出层
      openInfo: false,
      // 查询参数
      queryInfoParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        bitNo: null,
        userId: null,
        userName: null,
        passwd: null,
        userAgent: null,
        proxy: null
      },
      // 表单参数
      infoForm: {},
      // 表单校验
      infoRules: {
        machineNo: [
          { required: true, message: "机器码不能为空", trigger: "blur" }
        ],
        bitNo: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
      },
	  dictList: [],
	  pluginList:[],
	  openForm: {
		  id: '',
		  installPath: '',
		  cachePath: '',
		  pluginPath: '',
		  pluginPaths: [],
		  proxy: ''
	  },
	  openSync: false,
    };
  },  
  created() {
 
	let id = localStorage.getItem("id");
	let installPath = localStorage.getItem("installPath");
	let pluginPaths = localStorage.getItem("pluginPaths"); 
	let cachePath = localStorage.getItem("cachePath"); 
	let proxy = localStorage.getItem("proxy"); 
 
	if(id){
		this.openForm.id = id;
	}
	
	if(installPath && typeof(installPath) != "undefined" && installPath != "undefined"){
		this.openForm.installPath = installPath;
	}
	
	if(pluginPaths && typeof(pluginPaths) != "undefined" && pluginPaths != "undefined"){
		this.openForm.pluginPaths = JSON.parse(pluginPaths);
	}
	
	if(cachePath && typeof(cachePath) != "undefined" && cachePath != "undefined"){
		this.openForm.cachePath = cachePath;
	}
	
	if(proxy && typeof(proxy) != "undefined" && proxy != "undefined" ){
		this.openForm.proxy = proxy;
	}
	
    this.getInfoList();
	this.myListPlugin();
  },
  methods: {
	getGroupIdAndName1(data){
	  if(data.groupIds){
	  	this.queryInfoParams.groupId = data.groupIds;
	  }
	  if(data.groupNames){
	  	this.queryInfoParams.groupName = data.groupNames;
	  }
	},
	getGroupIdAndName2(data){
	  if(data.groupIds){
		this.infoForm.groupId = data.groupIds;
	  }
	  if(data.groupNames){
		this.infoForm.groupName = data.groupNames;
	  }
	},
	/** 提交按钮 */
	submitOpenForm() {
		let that = this;
		localStorage.setItem("id", that.openForm.id); 
		localStorage.setItem("installPath", that.openForm.installPath); 
		localStorage.setItem("pluginPaths", JSON.stringify(that.openForm.pluginPaths));
		localStorage.setItem("cachePath", that.openForm.cachePath);
		localStorage.setItem("proxy", that.openForm.proxy);
		 
		this.$refs["openFormRef"].validate(valid => {
			if (valid) {
				let pluginPath = that.openForm.cachePath + "\\" + that.openForm.pluginPaths.join(","+that.openForm.cachePath+"\\");
				let installPath = that.$store.state.isMyExe?that.openForm.installPath+"\\resources":that.openForm.installPath;
				let data = {"id": that.openForm.id, 
				"installPath": installPath ,  
				"pluginPath": pluginPath ,
				"cachePath": that.openForm.cachePath ,
				"proxy": that.openForm.proxy ,
				};
				openById(data).then(res=>{
				   if(res.code == 200){
					   //console.log("res==="+JSON.stringify(res))
					   this.openSync = false;
				   }
				}).catch(err=>{
					//console.log("err==="+JSON.stringify(err))
				})
			}
	  });
	},
	handleOpen(row){
		this.openForm.id = row.id || this.ids;
		//console.log("id========"+this.openForm.id )
		this.openSync = true;
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
	getDictList(val){
		//console.log("dictList======"+JSON.stringify(val) )
		this.dictList = val;
	},
	groupFormatter(row){
		//console.log("dictValuett5555555===="+JSON.stringify(row))
		if(this.dictList && this.dictList.length > 0){
			for(let i = 0; i< this.dictList.length ;i++){
				//console.log(this.dictList[i].dictValue+"=========="+row.groupId)
				if(this.dictList[i].dictValue == row.groupId){
					return this.dictList[i].dictLabel;
				}
			}
		}
		return row.groupId;
	},
	dictMyChange(val){
		//console.log("535353535======"+JSON.stringify(val) )
		this.queryInfoParams.groupId = val;
	},
	dictMyChange1(val){
		//console.log("535353535======"+JSON.stringify(val) )
		this.infoForm.groupId = val;
	},
    /** 查询账户信息列表 */
    getInfoList() {
      this.loadingInfo = true;
      listInfo(this.queryInfoParams).then(response => {
        this.infoList = response.data;
        this.queryInfoParams.total = response.total;
        this.loadingInfo = false;
      });
    },
    // 取消按钮
    cancelInfo() {
      this.openInfo = false;
    },
	// 取消按钮
	cancelOpen() {
	  this.openSync = false;
	},
    // 表单重置
    resetInfo() {
      this.infoForm = {
        id: null,
        machineNo: null,
        bitNo: null,
        userId: null,
        userName: null,
        passwd: null,
        userAgent: null,
        proxy: null,
		groupId:null,
      };
    },
    /** 搜索按钮操作 */
    handleQueryInfo() {
      this.queryInfoParams.pageNum = 1;
      this.getInfoList();
    },
    /** 重置按钮操作 */
    resetQueryInfo() {
      this.resetForm("queryInfoRef");
      this.handleQueryInfo();
    },
    // 多选框选中数据
    handleSelectionInfoChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddInfo() {
      this.openInfo = true;
      this.titleInfo = "添加账户信息";
      this.infoForm.id = null;
	  const userId = uuidv8() + "" ;
	  this.infoForm.userId = userId.replace(/-/g,"");
    },
    /** 修改按钮操作 */
    handleUpdateInfo(row) {
      this.resetInfo();
      const id = row.id || this.ids
      getInfo(id).then(response => {
		//console.log("this.infoForm==="+JSON.stringify(response.data))
        this.infoForm = JSON.parse(JSON.stringify(Object.assign(this.infoForm,response.data))); ;
		console.log("this.infoForm==="+JSON.stringify(this.infoForm))
        this.openInfo = true;
        this.titleInfo = "修改账户信息";
      });
    },
    /** 提交按钮 */
    submitInfoForm() {
      this.$refs["infoRef"].validate(valid => {
        if (valid) {
          if (this.infoForm.id != null) {
            updateInfo(this.infoForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openInfo = false;
              this.getInfoList();
            });
          } else {
            addInfo(this.infoForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openInfo = false;
              this.getInfoList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteInfo(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除账户信息编号为"' + ids + '"的数据项？').then(function() {
        return delInfo(ids);
      }).then(() => {
        this.getInfoList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExportInfo() {
      this.download('acc/info/export', {
        ...this.queryInfoParams
      }, `info_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
