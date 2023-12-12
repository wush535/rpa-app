<template>
  <div class="app-container">
    <el-form :model="queryStaticsParams" ref="queryStaticsRef" size="small" :inline="true" v-show="showStaticsSearch" label-width="88px">
		<el-row>
			<el-col :span="9">
				<el-form-item label="项目">
					<prj :mydata="queryStaticsParams.prjId" :single="true" @myselect="getPrjIdAndName"></prj>
				</el-form-item>
			</el-col>
			<el-col :span="9">
				<el-form-item label="分组" prop="groupId">
					<group :my-group-id="queryStaticsParams.groupId" :my-group-name="queryStaticsParams.groupName" @myselect="getGroupIdAndName"></group>
				</el-form-item>
			</el-col>
			
			<el-col :span="6">
				<el-form-item style="margin: 0px 35px;">
				  <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryStatics">搜索</el-button>
				  <el-button icon="el-icon-refresh" size="mini" @click="resetQueryStatics">重置</el-button>
				</el-form-item>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col :span="24" >
				<el-form-item label="任务">
					<el-select v-model="queryStaticsParams.taskIds" multiple placeholder="请选择"  clearable style="width: 800px">
						<el-option v-for="item in taskList" :key="item.id" :value="item.id" :label="item.taskName">
							{{item.id}}-{{item.taskName}}
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
		</el-row>

    </el-form>

    <el-table v-loading="loadingStatics" :data="staticsList" >
      <el-table-column label="分组" align="center" prop="groupId" />
      <el-table-column label="任务编号" align="center" prop="taskId" />
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="总用户数" align="center" prop="totalNum" />
      <el-table-column label="成功用户数" align="center" prop="sucNum" />
    </el-table>
    
    <pagination v-show="queryStaticsParams.total>0" :total="queryStaticsParams.total" :page.sync="queryStaticsParams.pageNum"
                :limit.sync="queryStaticsParams.pageSize" @pagination="getStaticsList" />
				
  </div>
</template>

<script>
import { getLogStatisticsVo } from "@/api/statics/statics";
import { listPrj, listTask } from "@/api/prj/prj";
import prj from "../comm/prj.vue"
import group from "../comm/group.vue"

export default {
  name: "statics",
  components: { prj,group },
  data() {
    return {
      // 遮罩层
      loadingStatics: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showStaticsSearch: true,
      // 统计表格数据
      staticsList: [],
	  taskList: [],
      // 弹出层标题
      titleStatics: "",
      // 是否显示弹出层
      openStatics: false,
      // 查询参数
      queryStaticsParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        taskId: null,
        taskName: null,
      },
      // 表单参数
      staticsForm: {},
      // 表单校验
      staticsRules: {
        groupId: [
          { required: true, message: "分组不能为空", trigger: "blur" }
        ],
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
	//console.log("statics created!!")
  },
  methods: {
	getPrjIdAndName(data){
		console.log("data================="+JSON.stringify(data))
		if(data.prjIds){
			this.queryStaticsParams.prjId = data.prjIds;
		}
		if(data.prjNames){
			this.queryStaticsParams.prjName = data.prjNames;
		}
		this.myListTask();
	},
	getGroupIdAndName(data){
		console.log("data================="+JSON.stringify(data))
		if(data.groupIds){
			this.queryStaticsParams.groupIds = data.groupIds;
		}
		if(data.groupNames){
			this.queryStaticsParams.groupNames = data.groupNames;
		}
	},
	myListTask(){
		let that = this;
		let rpjTask = {prjId: that.queryStaticsParams.prjId, pageSize: 535};
		listTask(rpjTask).then(res=>{
			if(res.code == 200){
				that.taskList = res.data;
			}else{
				that.$message.error(res.msg);
			}
		}).catch(err=>{
			that.$message.error(err);
		})
	},
    /** 查询统计列表 */
    getStaticsList() {
		if(!this.queryStaticsParams.prjId){
			this.$message.error("请先选择项目！！！！");
			return;
		}
	  //console.log("================"+JSON.stringify(this.queryStaticsParams.taskIds))
      this.loadingStatics = true;
	  let taskIds = null;
	  if(this.queryStaticsParams.taskIds){
		  taskIds = this.queryStaticsParams.taskIds.join(",");
	  }
	  let data = {"prjId": this.queryStaticsParams.prjId, 
				  "groupIds": this.queryStaticsParams.groupIds,
				  "taskIds": taskIds
				 };
      getLogStatisticsVo(data).then(response => {
        this.staticsList = response.data;
        this.queryStaticsParams.total = response.total;
        this.loadingStatics = false;
      });
    },
    /** 搜索按钮操作 */
    handleQueryStatics() {
      this.queryStaticsParams.pageNum = 1;
      this.getStaticsList();
    },
    /** 重置按钮操作 */
    resetQueryStatics() {
      this.resetForm("queryStaticsRef");
      this.handleQueryStatics();
    }
  }
};
</script>
