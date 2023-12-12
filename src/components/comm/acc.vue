<template>
	<div>
		<el-form :model="queryInfoParams" ref="queryInfoRef" size="small" :inline="true" label-width="88px">
		  <el-form-item label="分组" prop="groupId">
				<group :my-group-id="queryInfoParams.groupId" :my-group-name="queryInfoParams.groupName" :single="true" @myselect="getGroupIdAndName" ></group>
		  </el-form-item>
		  <el-form-item label="窗口号" prop="bitNo">
			<el-input v-model="queryInfoParams.bitNo" placeholder="请输入窗口号"  clearable @keyup.enter.native="handleQueryInfo" />
		  </el-form-item>
	 
		  <el-form-item>
			<el-button type="primary" icon="el-icon-search"   @click="handleQueryInfo">搜索</el-button>
			<el-button icon="el-icon-refresh" type="info"  @click="resetQueryInfo">重置</el-button>
			<el-button type="warning" @click="myConfirm">确 认</el-button>
		  </el-form-item>
		</el-form>
		 
		<el-table ref="mySelectInfoRef" v-loading="loadingInfo" :data="accList" @selection-change="handInfoChange" :row-key="getRowKey">
		  <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
		  <el-table-column label="主键" width="88" align="center" prop="id" />
		  <el-table-column label="窗口号" width="108" align="center" prop="bitNo" />
		  <el-table-column label="组id" align="center" prop="groupId"  :formatter="groupFormatter"/>
		  <el-table-column label="用户id" align="center" prop="userId" />
		  <!-- <el-table-column label="用户名称" align="center" prop="userName" />
		  <el-table-column label="密码" align="center" prop="passwd" /> -->
		</el-table>
		
		<pagination v-show="queryInfoParams.total>0" :total="queryInfoParams.total" :page.sync="queryInfoParams.pageNum" 
			:limit.sync="queryInfoParams.pageSize" :pageSizes="[10,100,500,800,1000]" @pagination="getInfoList" />
			
	</div>
</template>

<script>

import { list } from "@/api/dict/dict"
import { listInfo } from "@/api/acc/info";
import group from "./group.vue"

export default {
  components: { group },
  props: {
	accIds: String,
  },
  data () {
	return {
		myjustify: "end", 
		accList: [],
		dictList: [],
		myAccIds: undefined,
		myBitNos: undefined,
		groupSync: false,
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
	}
  },
  watch: {
	/* accIds: {
		handler (val) {
		  console.log("val11111==="+val)
		  this.myAccIds = val
		  console.log("this.myAccIds11111==="+this.myAccIds);
		  
		},
		immediate: true
	} */
  },
  created() {
	  this.getInfoList();
  },
  methods: {
	getGroupIdAndName(data){
		//console.log("data================="+JSON.stringify(data))
		if(data.groupIds){
			this.queryInfoParams.groupId = data.groupIds;
		}
		if(data.groupNames){
			this.queryInfoParams.groupName = data.groupNames;
		}
	},
	getRowKey(row){
		return row.id;
	}, 
	myConfirm(){
		this.$emit("getAccIds", this.myAccIds);
		this.$emit("getBitNos", this.myBitNos);
	},
	/** 重置按钮操作 */
	resetQueryInfo() {
	  this.resetForm("queryInfoRef");
	  this.handleQueryInfo();
	},
	/** 搜索按钮操作 */
	handleQueryInfo() {
	  this.queryInfoParams.pageNum = 1;
	  this.getInfoList();
	},
	select(data){
		console.log("data==="+data)
		//创建一个空数组用来存放默认数据
		if(String(data) == "null" || String(data) == "undefined"){
			this.$refs.mySelectInfoRef.clearSelection();
		}else if(String(data) == "0" ){
			this.$refs.mySelectInfoRef.toggleAllSelection();
		}else{
			if(this.accList){
				let list = [];
				let ids = String(data).split(",");
				//遍历表格的数据，再遍历需要在表格中反显的数据，两者的id一致
				this.accList.forEach((item) => {
				   ids.forEach(val => {
					   if (String(val) === String(item.id)) {
						// 把判断出来的默认表格数据push到创建的数组中
						   list.push(item)
					   }
				  })
				})
				if (list) {
					//再遍历数组，将数据放入方法中
				   list.forEach((row) => {
					 this.$refs.mySelectInfoRef.toggleRowSelection(row, true)
				   })
				}
			}
		}
	},
	handInfoChange(val){
		let ids = [];
		let bitNos = [];
		//console.log("val===="+JSON.stringify(val));
		if(val){
			val.forEach(row => {
				ids.push(row.id);
				bitNos.push(row.bitNo);
			});
		}
		this.myAccIds = ids.join(",");
		this.myBitNos = bitNos.join(",");
		//console.log("this.myAccIds==="+this.myAccIds +",this.myBitNos==="+this.myBitNos )
	},
	getDictList(val){
		//console.log("dictList======"+JSON.stringify(val) )
		this.dictList = val;
	},
	groupFormatter(row){
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
	/** 查询账户信息列表 */
	getInfoList(){
	  let that = this;
	  that.loadingInfo = true;
	  listInfo(that.queryInfoParams).then(response => {
	    that.accList = response.data;
		that.select(that.myAccIds);
	    that.queryInfoParams.total = response.total;
	    that.loadingInfo = false;
	  }).catch(err =>{
		  that.loadingInfo = false;
	  });
	}
  }
}
</script>

<style>
</style>