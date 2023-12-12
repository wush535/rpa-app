<template>
	<div class="app-container">
		<el-row>
			<el-col :span="21">
				<el-input v-model="groupCommId" v-show="false"></el-input>
				<el-input v-model="groupCommName" disabled></el-input>
			</el-col>
			<el-col :span="3">
				<el-button size="mini" style="margin: 0 10px;" type="primary" @click="openGroupComm">选择</el-button>
			</el-col>
		</el-row>
 
		<el-dialog :visible.sync="groupCommSync" width="38%" :append-to-body="true">
			<el-form :model="queryGroupCommParams" ref="queryGroupRef" size="small" :inline="true" label-width="88px">
			  <el-form-item label="分组名称" prop="groupName">
				<el-input v-model="queryGroupCommParams.groupName" placeholder="请输入分组名称" clearable @keyup.enter.native="handleQueryGroup" />
			  </el-form-item>
			  <el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryCommGroup">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQueryCommGroup">重置</el-button>
				<el-button type="warning" @click="myConfirm">确 认</el-button>
			  </el-form-item>
			</el-form>
			
			<el-table ref="mySelectGroupRef2" v-loading="loadingGroup" :data="groupList" highlight-current-row  
					@current-change="handleGroupCommChange" :row-key="getGroupCommRowKey" v-show="single">
			  <el-table-column label="主键" align="center" prop="id" />
			  <el-table-column label="分组名称" align="center" prop="groupName" />  
			</el-table>
			
			
			<el-table ref="mySelectGroupRef1" v-loading="loadingGroup" :data="groupList"
				@selection-change="handleSelectionGroupCommChange" :row-key="getGroupCommRowKey" v-show="!single">
			  <el-table-column type="selection" width="55" align="center" :reserve-selection="true"  />
			  <el-table-column label="主键" align="center" prop="id" />
			  <el-table-column label="分组名称" align="center" prop="groupName" />  
			</el-table>
			
			<pagination v-show="queryGroupCommParams.total>0" :total="queryGroupCommParams.total" :page.sync="queryGroupCommParams.pageNum"
						:limit.sync="queryGroupCommParams.pageSize" @pagination="getGroupList" />
	  </el-dialog>
  
  </div>
</template>

<script>
import { listGroup } from "@/api/group/group";

export default {
  name: "GroupComm",
  props: {
  	myGroupId: String,
	myGroupName: String,
	single: false,
  },
  data() {
    return {
      // 遮罩层
      loadingGroup: true,
	  groupCommSync: false,
      // 选中数组
      groupIds: [],
	  groupNames: [],
	  selectGroupList: [],
      // 分组表格数据
      groupList: [],
	  groupCommId:undefined,
	  groupCommName:undefined,
      // 查询参数
      queryGroupCommParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        groupName: null,
      },
    };
  },
  created() {
    this.getGroupList();
  },
 watch: {
	  myGroupId: {
		handler (newVal, oldVal) {
		  //console.log(newVal+'====这样也可以得到数据====='+oldVal);
		  this.groupCommId = newVal;
		  this.groupCommName = this.myGroupName
		  },
		immediate: true,
		deep: true,
	  }
  },
  methods: {
	openGroupComm(){
		this.groupCommSync = true
		this.select();
	},
	getGroupCommRowKey(row){
		return row.id;
	},
	select(){
		let that = this;
		//创建一个空数组用来存放默认数据
		if( !that.single ){
			if(that.selectGroupList){
				that.selectGroupList.forEach((row) => {
					setTimeout(function(){
						//console.log("row111=="+row)
						that.$refs.mySelectGroupRef1.toggleRowSelection(row, true)
					}, 350)
					
				})
			}
		}else if( that.single ){
			//创建一个空数组用来存放默认数据 
			if(that.selectGroupList){
				that.selectGroupList.forEach((row) => {
					setTimeout(function(){
						//console.log("row22222=="+JSON.stringify(row))
						that.$refs.mySelectGroupRef2.setCurrentRow(row) 
					}, 350)
				})
			}
		}
	},
    /** 查询分组列表 */
    getGroupList() {
	  let that = this;
      this.loadingGroup = true;
      listGroup(this.queryGroupCommParams).then(response => {
        that.groupList = response.data;
        that.queryGroupCommParams.total = response.total;
		//that.getName(that.mydata);
        that.loadingGroup = false;
      });
    },  
    /** 搜索按钮操作 */
    handleQueryCommGroup() {
      this.queryGroupCommParams.pageNum = 1;
      this.getGroupList();
    },
    /** 重置按钮操作 */
    resetQueryCommGroup() {
      this.resetForm("queryGroupRef");
      this.handleQueryCommGroup();
    },
    // 多选框选中数据
    handleSelectionGroupCommChange(selection) {
      this.groupIds = selection.map(item => item.id)
	  this.groupNames = selection.map(item => item.groupName)
    },
	handleGroupCommChange(row){
		let ids = [row.id];
		let names = [row.groupName];
		this.groupIds = ids;
		this.groupNames = names;
		//console.log("this.groupIds222==="+JSON.stringify(this.groupIds));
		//console.log("this.groupNames222==="+JSON.stringify(this.groupNames));
	},
	myConfirm(){
		this.groupCommSync = false;
		this.groupCommId = this.groupIds.join(",");
		this.groupCommName = this.groupNames.join(",");
		this.$emit("myselect", {"groupIds":this.groupCommId,"groupNames":this.groupCommName} );
	},
  }
};
</script>
