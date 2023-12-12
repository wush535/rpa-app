<template>
  <div class="app-container">
    <el-form :model="queryGroupParams" ref="queryGroupRef" size="small" :inline="true" v-show="showGroupSearch" label-width="88px">
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="queryGroupParams.groupName" placeholder="请输入分组名称" clearable @keyup.enter.native="handleQueryGroup" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGroup">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGroup">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddGroup" >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdateGroup" >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="single"  @click="handleDeleteGroup" >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loadingGroup" :data="groupList" @selection-change="handleSelectionGroupChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="分组名称" align="center" prop="groupName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateGroup(scope.row)" >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteGroup(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="queryGroupParams.total>0" :total="queryGroupParams.total" :page.sync="queryGroupParams.pageNum"
                :limit.sync="queryGroupParams.pageSize" @pagination="getGroupList" />

    <!-- 添加或修改分组对话框 -->
    <el-drawer :title="titleGroup" :visible.sync="openGroup" size="38%"  append-to-body>
      <el-card>
      <el-form ref="groupRef" :model="groupForm" :rules="groupRules" label-width="98px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="groupForm.groupName" placeholder="请输入分组名称" />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="submitGroupForm">确 定</el-button>
        <el-button @click="cancelGroup">取 消</el-button>
      </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { listGroup, getGroup, delGroup, addGroup, updateGroup } from "@/api/group/group";

export default {
  name: "Group",
  data() {
    return {
      // 遮罩层
      loadingGroup: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showGroupSearch: true,
      // 分组表格数据
      groupList: [],
      // 弹出层标题
      titleGroup: "",
      // 是否显示弹出层
      openGroup: false,
      // 查询参数
      queryGroupParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        groupName: null,
      },
      // 表单参数
      groupForm: {},
      // 表单校验
      groupRules: {
        groupName: [
          { required: true, message: "分组名称不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.getGroupList();
  },
  methods: {
    /** 查询分组列表 */
    getGroupList() {
      this.loadingGroup = true;
      listGroup(this.queryGroupParams).then(response => {
        this.groupList = response.data;
        this.queryGroupParams.total = response.total;
        this.loadingGroup = false;
      });
    },
    // 取消按钮
    cancelGroup() {
      this.openGroup = false;
      this.resetGroup();
    },
    // 表单重置
    resetGroup() {
      this.groupForm = {
        id: null,
        groupName: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("groupRef");
    },
    /** 搜索按钮操作 */
    handleQueryGroup() {
      this.queryGroupParams.pageNum = 1;
      this.getGroupList();
    },
    /** 重置按钮操作 */
    resetQueryGroup() {
      this.resetForm("queryGroupRef");
      this.handleQueryGroup();
    },
    // 多选框选中数据
    handleSelectionGroupChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddGroup() {
      this.openGroup = true;
      this.titleGroup = "添加分组";
      this.groupForm.id = null;
    },
    /** 修改按钮操作 */
    handleUpdateGroup(row) {
      this.resetGroup();
      const id = row.id || this.ids
      getGroup(id).then(response => {
        this.groupForm = response.data;
        this.openGroup = true;
        this.titleGroup = "修改分组";
      });
    },
    /** 提交按钮 */
    submitGroupForm() {
      this.$refs["groupRef"].validate(valid => {
        if (valid) {
          if (this.groupForm.id != null) {
            updateGroup(this.groupForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openGroup = false;
              this.getGroupList();
            });
          } else {
            addGroup(this.groupForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openGroup = false;
              this.getGroupList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteGroup(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除分组编号为"' + ids + '"的数据项？').then(function() {
        return delGroup(ids);
      }).then((res) => {
		if(res.code == 200){
			this.getGroupList();
			this.$modal.msgSuccess("删除成功");
		}else{
			this.$modal.msgSuccess(res.msg);
		}
      }).catch(() => {});
    },
	}
}
</script>
