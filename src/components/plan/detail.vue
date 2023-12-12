<template>
  <div class="app-container">
    <el-form :model="queryDetailParams" ref="queryDetailRef" size="small" :inline="true" v-show="showDetailSearch" label-width="88px">
      <el-form-item label="计划id" prop="planId">
        <el-input
          v-model="queryDetailParams.planId"
          placeholder="请输入计划id"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="项目id" prop="prjId">
        <el-input
          v-model="queryDetailParams.prjId"
          placeholder="请输入项目id"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="prjName">
        <el-input
          v-model="queryDetailParams.prjName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="账号id" prop="accId">
        <el-input
          v-model="queryDetailParams.accId"
          placeholder="请输入账号id"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="序号" prop="bitNo">
        <el-input
          v-model="queryDetailParams.bitNo"
          placeholder="请输入序号"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryDetailParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="分组" prop="groupId">
        <el-input
          v-model="queryDetailParams.groupId"
          placeholder="请输入分组"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="任务id" prop="taskId">
        <el-input
          v-model="queryDetailParams.taskId"
          placeholder="请输入任务id"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryDetailParams.taskName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQueryDetail"
        />
      </el-form-item>
      <el-form-item label="执行时间" prop="planDate">
        <el-date-picker clearable
          v-model="queryDetailParams.planDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择执行时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker clearable
          v-model="queryDetailParams.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker clearable
          v-model="queryDetailParams.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryDetail">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQueryDetail">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAddDetail" 
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdateDetail" 
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDeleteDetail" 
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
          plain icon="el-icon-download"
          size="mini"
          @click="handleExportDetail" 
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loadingDetail" :data="detailList" @selection-change="handleSelectionDetailChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划id" align="center" prop="planId" />
      <el-table-column label="项目名称" align="center" prop="prjName" />
      <el-table-column label="序号" align="center" prop="bitNo" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="分组" align="center" prop="groupId" />
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="执行时间" align="center" prop="planDate" width="180">
        <template slot-scope="scope">
          <span>{{  scope.row.planDate  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startDate" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="runStatus" />
      <el-table-column label="失败原因" align="center" prop="failReason" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateDetail(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteDetail(scope.row)" 
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="queryDetailParams.total>0"
      :total="queryDetailParams.total"
      :page.sync="queryDetailParams.pageNum"
      :limit.sync="queryDetailParams.pageSize"
      @pagination="getDetailList"
    />

    <!-- 添加或修改项目执行计划明细对话框 -->
    <el-drawer :title="titleDetail" :visible.sync="openDetail" size="38%"  append-to-body>
      <el-card>
      <el-form ref="detailRef" :model="detailForm" :rules="detailRules" label-width="98px">	
        <el-form-item label="项目名称" prop="prjName">
          <el-input v-model="detailForm.prjName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="账号id" prop="accId">
          <el-input v-model="detailForm.accId" placeholder="请输入账号id" />
        </el-form-item>
        <el-form-item label="序号" prop="bitNo">
          <el-input v-model="detailForm.bitNo" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="分组" prop="groupId">
          <el-input v-model="detailForm.groupId" placeholder="请输入分组" />
        </el-form-item>
		
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="detailForm.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="执行时间" prop="planDate">
          <el-date-picker clearable
            v-model="detailForm.planDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择执行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker clearable
            v-model="detailForm.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker clearable
            v-model="detailForm.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失败原因" prop="failReason">
          <el-input v-model="detailForm.failReason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="submitDetailForm">确 定</el-button>
        <el-button @click="cancelDetail">取 消</el-button>
      </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { listDetail, getDetail, delDetail, addDetail, updateDetail } from "@/api/run/detail";

export default {
  name: "Detail",
  data() {
    return {
      // 遮罩层
      loadingDetail: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showDetailSearch: true,
      // 项目执行计划明细表格数据
      detailList: [],
      // 弹出层标题
      titleDetail: "",
      // 是否显示弹出层
      openDetail: false,
      // 查询参数
      queryDetailParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        planId: null,
        prjId: null,
        prjName: null,
        accId: null,
        bitNo: null,
        userId: null,
        groupId: null,
        taskId: null,
        taskName: null,
        planDate: null,
        startDate: null,
        endDate: null,
        runStatus: null,
        failReason: null
      },
      // 表单参数
      detailForm: {},
      // 表单校验
      detailRules: {
        planId: [
          { required: true, message: "计划id不能为空", trigger: "blur" }
        ],
        prjId: [
          { required: true, message: "项目id不能为空", trigger: "blur" }
        ],
        accId: [
          { required: true, message: "账号id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getDetailList();
  },
  methods: {
    /** 查询项目执行计划明细列表 */
    getDetailList() {
      this.loadingDetail = true;
      listDetail(this.queryDetailParams).then(res => {
		if(res.code == 200){
			this.detailList = res.data;
			this.queryDetailParams.total = res.total;
			this.loadingDetail = false;
		}else{
			this.$message.error(res.msg);
		}
      });
    },
    // 取消按钮
    cancelDetail() {
      this.openDetail = false;
      this.resetDetail();
    },
    // 表单重置
    resetDetail() {
      this.detailForm = {
        id: null,
        planId: null,
        prjId: null,
        prjName: null,
        accId: null,
        bitNo: null,
        userId: null,
        groupId: null,
        taskId: null,
        taskName: null,
        planDate: null,
        startDate: null,
        endDate: null,
        runStatus: "0",
        failReason: null
      };
      this.resetForm("detailRef");
    },
    /** 搜索按钮操作 */
    handleQueryDetail() {
      this.queryDetailParams.pageNum = 1;
      this.getDetailList();
    },
    /** 重置按钮操作 */
    resetQueryDetail() {
      this.resetForm("queryDetailRef");
      this.handleQueryDetail();
    },
    // 多选框选中数据
    handleSelectionDetailChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddDetail() {
      this.openDetail = true;
      this.titleDetail = "添加项目执行计划明细";
      this.detailForm.id = null;
    },
    /** 修改按钮操作 */
    handleUpdateDetail(row) {
      this.resetDetail();
      const id = row.id || this.ids
      getDetail(id).then(response => {
        this.detailForm = response.data;
        this.openDetail = true;
        this.titleDetail = "修改项目执行计划明细";
      });
    },
    /** 提交按钮 */
    submitDetailForm() {
      this.$refs["detailRef"].validate(valid => {
        if (valid) {
          if (this.detailForm.id != null) {
            updateDetail(this.detailForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openDetail = false;
              this.getDetailList();
            });
          } else {
            addDetail(this.detailForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openDetail = false;
              this.getDetailList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteDetail(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除项目执行计划明细编号为"' + ids + '"的数据项？').then(function() {
        return delDetail(ids);
      }).then(() => {
        this.getDetailList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExportDetail() {
      this.download('plan/detail/export', {
        ...this.queryDetailParams
      }, `detail_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
