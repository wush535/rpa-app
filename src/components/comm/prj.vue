<template>
  <div class="app-container">
	<el-row>
		<el-col :span="21">
			<el-input v-model="prjCommId" v-show="false"></el-input>
			<el-input v-model="prjCommName" disabled></el-input>
		</el-col>
		<el-col :span="3">
			<el-button size="mini" style="margin: 0 10px;" type="primary" @click="openPrjComm">选择</el-button>
		</el-col>
	</el-row>
	
	<el-dialog :visible.sync="prjCommSync" width="38%" :append-to-body="true">
		<el-form :model="queryPrjCommParams" ref="queryPrjCommRef" size="small" :inline="true" label-width="88px">
		  <el-form-item label="项目名" prop="prjName">
		    <el-input v-model="queryPrjCommParams.prjName" placeholder="请输入项目名" clearable @keyup.enter.native="handleQueryPrjComm" />
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryPrjComm">搜索</el-button>
		    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryPrjComm">重置</el-button>
			<el-button type="warning" @click="myConfirm">确 认</el-button>
		  </el-form-item>
		</el-form>
		
		<el-table ref="mySelectPrjCommRef2" v-loading="loadingPrj" :data="prjList" highlight-current-row  @current-change="handlePrjCommChange" :row-key="getPrjCommRowKey" v-show="single">
		  <el-table-column label="主键" align="center" prop="id" />
		  <el-table-column label="项目名" align="center" prop="prjName" />
		</el-table>
		
		<el-table ref="mySelectPrjCommRef1" v-loading="loadingPrj" :data="prjList"  @selection-change="handleSelectionPrjCommChange" :row-key="getPrjCommRowKey" v-show="!single">
		  <el-table-column type="selection" width="55" align="center" :reserve-selection="true"  />
		  <el-table-column label="主键" align="center" prop="id" />
		  <el-table-column label="项目名" align="center" prop="prjName" />
		</el-table>
		
		
		<pagination v-show="queryPrjCommParams.total>0" :total="queryPrjCommParams.total" :page.sync="queryPrjCommParams.pageNum"
		            :limit.sync="queryPrjCommParams.pageSize" @pagination="getPrjList" />
	</el-dialog>
    
				
  </div>
</template>

<script>
import { listPrj } from "@/api/prj/prj";

export default {
  name: "PrjComm",
  props: {
  	mydata: String,
	single: false
  },
  data() {
    return {
      // 遮罩层
      loadingPrj: true,
      // 选中数组
      prjCommId: undefined,
	  prjCommName: undefined,
	  prjCommIds: [],
	  prjCommNames: [],
	  prjCommSync: false,
	  selectPrjCommList: [],
      // prj表格数据
      prjList: [],
      // 查询参数
      queryPrjCommParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        prjName: null,
      },
    };
  },
  created() {
    this.getPrjList();
  },
  watch: {
  	  mydata: {
  		handler (newVal, oldVal) {
  		  console.log(newVal+'====这样也可以得到数据====='+oldVal);
  		  this.getName(newVal)
  		  }
  	  }
  },
  methods: {
	openPrjComm(){
		this.prjCommSync=true;
		this.select();
	},
	getPrjCommRowKey(row){
		return row.id;
	},
	getName(data){
		let that = this;
		console.log("data===="+data);
		that.prjCommId = undefined;
		that.prjCommName = undefined;
		that.prjCommIds = [];
		that.prjCommNames = [];
		that.selectPrjCommList = [];
		if(that.prjList && data){
			if( that.single ){
				that.prjCommId = String(data);
				that.prjCommIds =  [String(data)]; 
			}else{
				that.prjCommId = String(data);
				that.prjCommIds =  String(data).split(",");
			}
			that.prjList.forEach((item) => {
			   that.prjCommIds.forEach(val => {
				   if (String(val) === String(item.id)) {
					   that.selectPrjCommList.push(item)
				   }
			  })
			})
			if (that.selectPrjCommList) {
				that.prjCommNames = that.selectPrjCommList.map(item => item.prjName);
				that.prjCommName = that.prjCommNames.join(",");
			}
		}
	},
	select(){
		let that = this;
		//创建一个空数组用来存放默认数据
		if( !that.single ){
			if(that.selectPrjCommList){
				that.selectPrjCommList.forEach((row) => {
					setTimeout(function(){
						//console.log("row22222=="+JSON.stringify(row))
						that.$refs.mySelectPrjCommRef1.toggleRowSelection(row, true)
					}, 350)
				})
			}
		}else if( that.single ){
			//创建一个空数组用来存放默认数据 
			if(that.selectPrjCommList){
				that.selectPrjCommList.forEach((row) => {
					setTimeout(function(){
						//console.log("row22222=="+JSON.stringify(row))
						that.$refs.mySelectPrjCommRef2.setCurrentRow(row)
					}, 350)
				})
			}
		}
	},
    /** 查询prj列表 */
    getPrjList() {
	  let that = this;
      this.loadingPrj = true;
      listPrj(this.queryPrjCommParams).then(response => {
        that.prjList = response.data;
        that.queryPrjCommParams.total = response.total;
		that.getName(that.mydata)
        that.loadingPrj = false;
      });
    },
    /** 搜索按钮操作 */
    handleQueryPrjComm() {
      this.queryPrjCommParams.pageNum = 1;
      this.getPrjList();
    },
    /** 重置按钮操作 */
    resetQueryPrjComm() {
      this.resetForm("queryPrjCommRef");
      this.handleQueryPrjComm();
    },
	handleSelectionPrjCommChange(selection){
		this.prjCommIds = selection.map(item => item.id)
		this.prjCommNames = selection.map(item => item.prjName)
	
	},
	handlePrjCommChange(row){		
		this.prjCommIds = [row.id];
		this.prjCommNames = [row.prjName];
		//console.log("this.prjId==="+this.prjId);
		//console.log("this.prjName==="+this.prjName);
	},
	myConfirm(){
		//console.log("this.prjId1==="+this.prjId);
		//console.log("this.prjName1==="+this.prjName);
		this.prjCommId = this.prjCommIds.join(",");
		this.prjCommName = this.prjCommNames.join(",");
		this.prjCommSync = false;
		this.$emit("myselect", {"prjIds": this.prjCommId,"prjNames":this.prjCommName} );
	},
  }
};
</script>
