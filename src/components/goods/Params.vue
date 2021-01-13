<template>
  <div>
    <el-card>
      <el-alert
        title="注意，只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <el-row style="margin: 15px 0">
        <el-col>
          请选择商品分类：<el-cascader
                v-model="selectedKeys"
                :options="cateList"
                :props="cascaderProps"
                @change="handleCateChange"
                style="width: 30%">
        </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="isDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe :style="{display: isDisplay}">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteParamsItem(scope.row, index)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="isDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe :style="{display: isDisplay}">
            <el-table-column type="expand" align="center">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteParamsItem(scope.row, index)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--添加动态参数/静态属性对话框-->
      <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="40%"
                 @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item :label="titleText" prop="attr_name" label-width="80px">
            <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改动态参数/静态属性对话框-->
      <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="40%"
                 @close="editDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item :label="titleText" prop="attr_name" label-width="80px">
            <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getCategoriesList, getParamsList, addParams, editParams, deleteParams, updateParamsItem } from "@/api/goods";

  export default {
    name: 'params',
    data(){
      return{
        cateList: [],
        selectedKeys: [],
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        activeName: 'many',
        cateId: '',
        manyTableData: [],
        onlyTableData: [],
        inputVisible: false,
        inputValue: '',
        addDialogVisible: false,
        addForm: {
          attrId: '',
          attr_name: ''
        },
        addFormRules: {
          attr_name: [
            { required: true, message: '请输入参数或属性名称', trigger: 'blur' }
          ]
        },
        editDialogVisible: false
      }
    },
    created() {
      this.getCategoriesList();
    },
    computed: {
      titleText() {
        if(this.activeName === 'many'){
          return '动态参数';
        }else{
          return '静态属性';
        }
      },
      isDisabled() {
        return this.selectedKeys.length !== 3;
      },
      isDisplay() {
        if(this.selectedKeys.length!==3) {
          return 'none';
        }else{
          return 'block';
        }
      }
    },
    methods: {
      getCategoriesList() {
        getCategoriesList().then(res => {
          this.cateList = res.data;
        })
      },
      handleCateChange() {
        this.getParamsList();
      },
      handleClick() {
        this.getParamsList();
      },
      getParamsList() {
        // 如果选中的不是三级分类，则重置
        if(this.selectedKeys.length !== 3){
          this.selectedKeys = [];
          this.$message.warning('请选择三级分类');
          this.manyTableData = [];
          this.onlyTableData = [];
          return;
        }
        this.cateId = this.selectedKeys[this.selectedKeys.length - 1];
        getParamsList(this.cateId, {sel: this.activeName}).then(res => {
          res.data.forEach(item => {
            if(item.attr_vals.indexOf(',') !== -1){
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
            }else{
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
            }
            item.inputVisible = false;
            item.inputValue = '';
          });
          if(this.activeName === 'many'){
            this.manyTableData = res.data;
          }else{
            this.onlyTableData = res.data;
          }
        })
      },
      showInput(row) {
        row.inputVisible = true;
        // $nextTick方法：当页面上的元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm(row) {
        if(row.inputValue.trim().length === 0){
          row.inputVisible = false;
          row.inputValue = '';
          return;
        }
        row.attr_vals.push(row.inputValue);
        this.updateParamsItem(row);
      },
      deleteParamsItem(row, index) {
        row.attr_vals.splice(index, 1);
        this.updateParamsItem(row);
      },
      updateParamsItem(row) {
        updateParamsItem(this.cateId, row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }).then(res => {
          row.inputVisible = false;
          row.inputValue = '';
          this.$message.success(res.meta.msg);
        })
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      addParams() {
        this.$refs.addFormRef.validate(valid => {
          if(!valid) return;
          addParams(this.cateId, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            this.$message.success(res.meta.msg);
            this.addDialogVisible = false;
            this.getParamsList();
          })
        })
      },
      openEditDialog(params) {
        this.editDialogVisible = true;
        this.addForm.attr_name = params.attr_name;
        this.addForm.attrId = params.attr_id;
      },
      editDialogClosed() {
        this.$refs.addFormRef.resetFields();
        this.addForm.attr_name = '';
        this.addForm.attrId = '';
      },
      editParams() {
        this.$refs.addFormRef.validate(valid => {
          if(!valid) return;
          editParams(this.cateId, this.addForm.attrId, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            if(res.meta.status === 200){
              this.$message.success(res.meta.msg);
              this.editDialogVisible = false;
              this.getParamsList();
            }
          })
        })
      },
      deleteParams(params) {
        this.$confirm('确认删除该'+this.titleText+'吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteParams(this.cateId, params.attr_id).then(res => {
            this.$message.success(res.meta.msg);
            this.getParamsList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        })
      }
    }
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 0 5px;
    float: left;
  }
  .button-new-tag {
    margin-left: 5px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    float: left;
  }
  .input-new-tag {
    width: 150px;
    margin-left: 5px;
    vertical-align: bottom;
    float: left;
  }
</style>
