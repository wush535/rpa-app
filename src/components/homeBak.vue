<template>
  <div id="myApp">
	<el-row :align="middle" :justify="center">
		<el-col :span="24">
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
				<span>任务列表</span>
			  </div>
			  <div class="text item">
				<router-link :to="{path: '/sui'}" >sui任务(dev)</router-link>
			  </div>
			  <div class="text item">
				<router-link :to="{path: '/scroll'}">scroll任务(test)</router-link>
			  </div>
			</el-card>
		</el-col>
	</el-row>
	
	 <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
	      <el-form-item label="部门名称" prop="prjName">
	        <el-input v-model="queryParams.prjName" placeholder="请输入部门名称" clearable
	          @keyup.enter.native="handleQuery" />
	      </el-form-item>
	       
	      <el-form-item>
	        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
	        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
	      </el-form-item>
	    </el-form>

	
	<el-row :align="middle" :justify="center">
		<el-table v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId" 
			:default-expand-all="isExpandAll" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" >
		      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
		      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
			  
		      <el-table-column prop="status" label="状态" width="100">
		        <template slot-scope="scope">
		          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
		        </template>
		      </el-table-column>
			  
		      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
		        <template slot-scope="scope">
		          <span>{{ parseTime(scope.row.createTime) }}</span>
		        </template>
		      </el-table-column>
			  <el-table-column label="更新时间" align="center" prop="createTime" width="200">
			    <template slot-scope="scope">
			      <span>{{ parseTime(scope.row.updateTime) }}</span>
			    </template>
			  </el-table-column>
		      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
		        <template slot-scope="scope">
		          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']" >修改</el-button>
		          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']" >新增</el-button>
		        </template>
		      </el-table-column>
		    </el-table>
	</el-row>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
       
    }
  },
  computed: {},
  watch: {},
  created() {
	 
	
  },
  mounted() {},
  methods: {
	 
  }
}

</script>
<style>
 #myApp{
	text-align: center;
 }
 
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
