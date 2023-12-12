<template>
	<div class="app-container">
	    <el-form :model="queryProxyParams" ref="queryProxyRef" size="small" :inline="true" v-show="showProxySearch" label-width="88px">
			 <el-form-item label="分组" prop="groupId" style="margin-right: 35px;">
				<group :my-group-id="queryProxyParams.groupId" :my-group-name="queryProxyParams.groupName" :single="true"  @myselect="getGroupIdAndName1"></group>
			 </el-form-item>
			  <el-form-item label="host地址" prop="proxyHost">
				<el-input v-model="queryProxyParams.proxyHost" placeholder="请输入host地址" clearable @keyup.enter.native="handleQueryProxy" />
			  </el-form-item>
			  <el-form-item label="端口" prop="proxyPort">
				<el-input v-model="queryProxyParams.proxyPort" placeholder="请输入端口" clearable @keyup.enter.native="handleQueryProxy" />
			  </el-form-item>
			  <el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryProxy">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQueryProxy">重置</el-button>
			  </el-form-item>
	    </el-form>
	
	    <el-row :gutter="10" class="mb8">
	      <el-col :span="1.5">
	        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddProxy" >新增</el-button>
	      </el-col>
		  
		  <el-col :span="1.5">
		    <el-button type="primary" plain icon="el-icon-plus" size="mini"  @click="handleBatchAddProxy" >批量增加</el-button>
		  </el-col>
		  
	      <el-col :span="1.5">
	        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdateProxy" >修改</el-button>
	      </el-col>
		  
		 
		  
	      <el-col :span="1.5">
	        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDeleteProxy" >删除</el-button>
	      </el-col>
	    </el-row>
	
	    <el-table v-loading="loadingProxy" :data="proxyList" @selection-change="handleSelectionProxyChange">
	      <el-table-column type="selection" width="55" align="center" />
	      <el-table-column label="主键" align="center" prop="id" />
	      <el-table-column label="分组" align="center" prop="groupName" />
	      <el-table-column label="host地址" align="center" prop="proxyHost" />
	      <el-table-column label="端口" align="center" prop="proxyPort" />
	      <el-table-column label="用户名" align="center" prop="userName" />
	      <el-table-column label="密码" align="center" prop="password" />
	      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
	        <template slot-scope="scope">
	          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateProxy(scope.row)" >修改</el-button>
	          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteProxy(scope.row)" >删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	    
	    <pagination v-show="queryProxyParams.total>0" :total="queryProxyParams.total" :page.sync="queryProxyParams.pageNum"
	                :limit.sync="queryProxyParams.pageSize" @pagination="getProxyList" />
	
	    <!-- 添加或修改代理对话框 -->
	    <el-drawer :title="titleProxy" :visible.sync="openProxy" size="38%"  append-to-body>
	      <el-card>
	      <el-form ref="proxyRef" :model="proxyForm" :rules="proxyRules" label-width="98px">
	        <el-form-item label="分组id" prop="groupId">
	        	<group :my-group-id="proxyForm.groupId" :my-group-name="proxyForm.groupName" :single="true" @myselect="getGroupIdAndName2"></group>
	        </el-form-item>
	        <el-form-item label="host地址" prop="proxyHost">
	          <el-input v-model="proxyForm.proxyHost" placeholder="请输入host地址" />
	        </el-form-item>
	        <el-form-item label="端口" prop="proxyPort">
	          <el-input v-model="proxyForm.proxyPort" placeholder="请输入端口" />
	        </el-form-item>
	        <el-form-item label="用户名" prop="userName">
	          <el-input v-model="proxyForm.userName" placeholder="请输入用户名" />
	        </el-form-item>
	        <el-form-item label="密码" prop="password">
	          <el-input v-model="proxyForm.password" placeholder="请输入密码" />
	        </el-form-item>
	      </el-form>
	      <div style="text-align: center">
	        <el-button type="primary" @click="submitProxyForm">确 定</el-button>
	        <el-button @click="cancelProxy">取 消</el-button>
	      </div>
	      </el-card>
	    </el-drawer>
		
		<!-- 添加或修改代理对话框 -->
		<el-drawer :title="titleProxy1" :visible.sync="openProxy1" size="38%"  append-to-body>
		  <el-card>
		  <el-form ref="proxyRef1" :model="proxyForm" :rules="proxyRules" label-width="98px">
		    <el-form-item label="分组id" prop="groupId">
				<group :my-group-id="proxyForm.groupId" :my-group-name="proxyForm.groupName" :single="true" @myselect="getGroupIdAndName2"></group>
		    </el-form-item>
		    <el-form-item label="代理字符串" prop="proxyStr">
		      <el-input type="textarea" v-model="proxyForm.proxyStr" placeholder="请输入代理字符串" rows="25" />
		    </el-form-item>
		  </el-form>
		  <div style="text-align: center">
		    <el-button type="primary" @click="submitBatchProxyForm">确 定</el-button>
		    <el-button @click="cancelBatchProxy">取 消</el-button>
		  </div>
		  </el-card>
		</el-drawer>
		
	  </div>
</template>

<script>
import { listProxy, getProxy, delProxy, addProxy, updateProxy,batchAddProxy } from "@/api/proxy/proxy";
import group from "../comm/group.vue"

export default {
  name: "Proxy",
  components: { group },
  data() {
    return {
      // 遮罩层
      loadingProxy: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showProxySearch: true,
      // 代理表格数据
      proxyList: [],
      // 弹出层标题
      titleProxy: "",
	  titleProxy1: "",
      // 是否显示弹出层
      openProxy: false,
	  openProxy1: false,
      // 查询参数
      queryProxyParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        proxyHost: null,
        proxyPort: null,
        userName: null,
        password: null,
      },
      // 表单参数
      proxyForm: {},
      // 表单校验
      proxyRules: {
        groupId: [
          { required: true, message: "分组id不能为空", trigger: "blur" }
        ],
      },
	  dictList: []
    };
  },
  created() {
    this.getProxyList();
  },
  methods: {
	getGroupIdAndName1(data){
		if(data.groupIds){
			this.queryProxyParams.groupId = data.groupIds;
		}
		if(data.groupNames){
			this.queryProxyParams.groupName = data.groupNames;
		}
	},
	getGroupIdAndName2(data){
		if(data.groupIds){
		this.proxyForm.groupId = data.groupIds;
		}
		if(data.groupNames){
		this.proxyForm.groupName = data.groupNames;
		}
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
	getDictList(val){
		//console.log("dictList======"+JSON.stringify(val) )
		this.dictList = val;
	},
	dictMyChange(val){
		//console.log("535353535======"+JSON.stringify(val) )
		this.queryProxyParams.groupId = val;
	},
	dictMyChange1(val){
		//console.log("535353535======"+JSON.stringify(val) )
		this.proxyForm.groupId = val;
	},
    /** 查询代理列表 */
    getProxyList() {
      this.loadingProxy = true;
      listProxy(this.queryProxyParams).then(response => {
        this.proxyList = response.data;
        this.queryProxyParams.total = response.total;
        this.loadingProxy = false;
      });
    },
    // 取消按钮
    cancelProxy() {
      this.openProxy = false;
      this.resetProxy();
    },
	cancelBatchProxy(){
		this.openProxy1 = false;
	},
    // 表单重置
    resetProxy() {
      this.proxyForm = {
        id: null,
        groupId: null,
        proxyHost: null,
        proxyPort: null,
        userName: null,
        password: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("proxyRef");
    },
    /** 搜索按钮操作 */
    handleQueryProxy() {
      this.queryProxyParams.pageNum = 1;
      this.getProxyList();
    },
    /** 重置按钮操作 */
    resetQueryProxy() {
      this.resetForm("queryProxyRef");
      this.handleQueryProxy();
    },
    // 多选框选中数据
    handleSelectionProxyChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddProxy() {
      this.openProxy = true;
      this.titleProxy = "添加代理";
      this.proxyForm.id = null;
    },
	handleBatchAddProxy(){
		this.openProxy1 = true;
		this.proxyForm.id = null;
		this.titleProxy1 = "批量添加代理";
	},
    /** 修改按钮操作 */
    handleUpdateProxy(row) {
      this.resetProxy();
      const id = row.id || this.ids
      getProxy(id).then(response => {
        this.proxyForm = response.data;
        this.openProxy = true;
        this.titleProxy = "修改代理";
      });
    },
    /** 提交按钮 */
    submitProxyForm() {
      this.$refs["proxyRef"].validate(valid => {
        if (valid) {
          if (this.proxyForm.id != null) {
            updateProxy(this.proxyForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openProxy = false;
              this.getProxyList();
            });
          } else {
            addProxy(this.proxyForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openProxy = false;
              this.getProxyList();
            });
          }
        }
      });
    },
	/** 提交按钮 */
	submitBatchProxyForm() {
	  this.$refs["proxyRef1"].validate(valid => {
	    if (valid) {
			batchAddProxy(this.proxyForm).then(response => {
			  this.$modal.msgSuccess("批量新增成功");
			  this.openProxy = false;
			  this.getProxyList();
			});
	    }
	  });
	},
    /** 删除按钮操作 */
    handleDeleteProxy(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除代理编号为"' + ids + '"的数据项？').then(function() {
        return delProxy(ids);
      }).then(() => {
        this.getProxyList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExportProxy() {
      this.download('proxy/proxy/export', {
        ...this.queryProxyParams
      }, `proxy_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style>
</style>