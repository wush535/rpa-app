<template>
<div class="app-container">
	<el-form :model="queryPluginParams" ref="queryPluginRef" size="small" :inline="true" v-show="showPluginSearch" label-width="88px">
	  <el-form-item label="插件名称" prop="pluginName">
		<el-input v-model="queryPluginParams.pluginName" placeholder="请输入插件名称" clearable @keyup.enter.native="handleQueryPlugin" />
	  </el-form-item>
	  <el-form-item label="插件路径" prop="pluginPath">
		<el-input v-model="queryPluginParams.pluginPath" placeholder="请输入插件路径" clearable @keyup.enter.native="handleQueryPlugin" />
	  </el-form-item>
	  <el-form-item>
		<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryPlugin">搜索</el-button>
		<el-button icon="el-icon-refresh" size="mini" @click="resetQueryPlugin">重置</el-button>
	  </el-form-item>
	</el-form>

	<el-row :gutter="10" class="mb8">
	  <el-col :span="1.5">
		<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddPlugin"  >新增</el-button>
	  </el-col>
	  <el-col :span="1.5">
		<el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdatePlugin" >修改</el-button>
	  </el-col>
	  <el-col :span="1.5">
		<el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="single"  @click="handleDeletePlugin" >删除</el-button>
	  </el-col>
 
	</el-row>

	<el-table v-loading="loadingPlugin" :data="pluginList" @selection-change="handleSelectionPluginChange">
		<el-table-column type="selection" width="55" align="center" />
		<el-table-column label="主键" align="center" prop="id"  width="88px" />
		<el-table-column label="插件名称" align="center" prop="pluginName"  width="258px" />
		<el-table-column label="插件路径" align="center" prop="pluginPath" />
	    <el-table-column label="状态" align="center" prop="state" :formatter="getStateLableFormatter"  width="88px"/>
		<el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="288px">
			<template slot-scope="scope">
			  <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdatePlugin(scope.row)"  >修改</el-button>
			  <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeletePlugin(scope.row)"  >删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	
	<pagination v-show="queryPluginParams.total>0" :total="queryPluginParams.total" :page.sync="queryPluginParams.pageNum"
				:limit.sync="queryPluginParams.pageSize" @pagination="getPluginList" />

	<!-- 添加或修改插件对话框 -->
	<el-drawer :title="titlePlugin" :visible.sync="openPlugin" size="38%"  append-to-body>
	  <el-card>
	  <el-form ref="pluginRef" :model="pluginForm" :rules="pluginRules" label-width="88px">
		<el-form-item label="插件名称" prop="pluginName" >
		  <el-input v-model="pluginForm.pluginName" placeholder="请输入插件名称" />
		</el-form-item>
		<el-form-item label="插件路径" prop="pluginPath">
		  <el-input v-model="pluginForm.pluginPath" placeholder="请输入插件路径" />
		</el-form-item>
		
		<el-form-item label="状态" prop="state" >
			<el-select v-model="pluginForm.state" placeholder="请选择" style="width: 100%;">
				<el-option v-for="item in stateList" :key="item.dict" :value="item.dict" :label="item.lable">
					{{item.lable}}
				</el-option>
			</el-select>
		</el-form-item>
		
		
	  </el-form>
	  <div style="text-align: center">
		<el-button type="primary" @click="submitPluginForm">确 定</el-button>
		<el-button @click="cancelPlugin">取 消</el-button>
	  </div>
	  </el-card>
	</el-drawer>
  </div>
</template>

<script>
import { listPlugin, getPlugin, delPlugin, addPlugin, updatePlugin } from "@/api/plugin/plugin";	
import dictVue from "../comm/dict.vue";
export default {
  name: "Plugin",
  data() {
    return {
      // 遮罩层
      loadingPlugin: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showPluginSearch: true,
      // 插件表格数据
      pluginList: [],
      // 弹出层标题
      titlePlugin: "",
      // 是否显示弹出层
      openPlugin: false,
      // 查询参数
      queryPluginParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pluginName: null,
        pluginPath: null
      },
      // 表单参数
      pluginForm: {
		  state: "1"
	  },
      // 表单校验
      pluginRules: { },
	  stateList: [{ "dict": "0" , "lable": "无效" }, { "dict": "1", "lable": "生效" }],
    };
  },
  created() {
    this.getPluginList();
  },
  methods: {
	getStateLableFormatter(row, column) {
		if(row.state == "0"){
			return "无效";
		}else if(row.state == "1"){
			return "生效";
		}
    },
    /** 查询插件列表 */
    getPluginList() {
      this.loadingPlugin = true;
      listPlugin(this.queryPluginParams).then(response => {
        this.pluginList = response.data;
        this.queryPluginParams.total = response.total;
        this.loadingPlugin = false;
      });
    },
    // 取消按钮
    cancelPlugin() {
      this.openPlugin = false;
      this.resetPlugin();
    },
    // 表单重置
    resetPlugin() {
      this.pluginForm = {
        id: null,
        pluginName: null,
        pluginPath: null
      };
      this.resetForm("pluginRef");
    },
    /** 搜索按钮操作 */
    handleQueryPlugin() {
      this.queryPluginParams.pageNum = 1;
      this.getPluginList();
    },
    /** 重置按钮操作 */
    resetQueryPlugin() {
      this.resetForm("queryPluginRef");
      this.handleQueryPlugin();
    },
    // 多选框选中数据
    handleSelectionPluginChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddPlugin() {
      this.openPlugin = true;
      this.titlePlugin = "添加插件";
      this.pluginForm.id = null;
    },
    /** 修改按钮操作 */
    handleUpdatePlugin(row) {
      this.resetPlugin();
      const id = row.id || this.ids
      getPlugin(id).then(response => {
        this.pluginForm = response.data;
        this.openPlugin = true;
        this.titlePlugin = "修改插件";
      });
    },
    /** 提交按钮 */
    submitPluginForm() {
      this.$refs["pluginRef"].validate(valid => {
        if (valid) {
          if (this.pluginForm.id != null) {
            updatePlugin(this.pluginForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openPlugin = false;
              this.getPluginList();
            });
          } else {
            addPlugin(this.pluginForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openPlugin = false;
              this.getPluginList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeletePlugin(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除插件编号为"' + ids + '"的数据项？').then(function() {
        return delPlugin(ids);
      }).then(() => {
        this.getPluginList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExportPlugin() {
      this.download('rpa/plugin/export', {
        ...this.queryPluginParams
      }, `plugin_${new Date().getTime()}.xlsx`)
    }
  }
};
	
	
</script>

<style>
</style>