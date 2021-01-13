<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        border
        show-index
        index-text="#"
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false">
        <template #isOk="scope"><!--#isOk="scope"：slot="isOk"，v-slot="scope"-->
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: #67C23A;font-size: 16px"></i>
          <i class="el-icon-error" v-if="scope.row.cat_deleted===true" style="color: #f56c6c;font-size: 16px"></i>
        </template>
        <template #level="scope">
          <el-tag size="medium" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="medium" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="danger" size="medium" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <template #operate="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--添加分类对话框-->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%"
                 @close="addCateDialogClosed">
        <el-form :model="catForm" :rules="cateRules" ref="addCateRef">
          <el-form-item label="分类名称" prop="cat_name" label-width="80px">
            <el-input v-model="catForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" >
            <!--options指定数据源-->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              style="width: 88%">
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改分类对话框-->
      <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="40%"
                @close="editCateDialogClosed">
        <el-form :model="catForm" :rules="cateRules" ref="editCateRef">
          <el-form-item label="分类名称" prop="cat_name" label-width="80px">
            <el-input v-model="catForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getCategoriesList, addCate, editCate, deleteCate } from "@/api/goods";

  export default {
    name: 'categories',
    data(){
      return{
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        categoriesList: [],
        total: 0,
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            //将当前列自定义为模板列
            type: 'template',
            //模板列名称
            template: 'isOk'
          },
          {
            label: '级别',
            //将当前列自定义为模板列
            type: 'template',
            //模板列名称
            template: 'level'
          },
          {
            label: '操作',
            type: 'template',
            template: 'operate'
          }
        ],
        addCateDialogVisible: false,
        catForm: {
          cat_id: '',
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        cateRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        parentCateList: [],
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedKeys: [],
        editCateDialogVisible: false
      }
    },
    created() {
      this.getCategoriesList();
    },
    methods: {
      getCategoriesList(){
        getCategoriesList(this.queryInfo).then(res => {
          this.categoriesList = res.data.result;
          this.total = res.data.total;
        })
      },
      handleSizeChange(newPageSize){
        this.queryInfo.pagesize = newPageSize;
        this.getCategoriesList();
      },
      handleCurrentChange(newPageNum){
        this.queryInfo.pagenum = newPageNum;
        this.getCategoriesList();
      },
      openAddCateDialog(){
        this.addCateDialogVisible = true;
        this.getParentCateList();
      },
      addCateDialogClosed(){
        this.$refs.addCateRef.resetFields();
        this.selectedKeys = [];
        this.catForm.cat_pid = 0;
        this.catForm.cat_level = 0;
      },
      addCate(){
        this.$refs.addCateRef.validate(valid => {
          if(!valid) return;
          addCate(this.catForm).then(res => {
            this.$message.success(res.meta.msg);
            this.addCateDialogVisible = false;
            this.getCategoriesList();
          })
        })
      },
      getParentCateList(){
        getCategoriesList({type: 2}).then(res => {
          this.parentCateList = res.data;
        })
      },
      parentCateChange() {
        if(this.selectedKeys.length>0){
          this.catForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
          this.catForm.cat_level = this.selectedKeys.length;
        }else{
          this.catForm.cat_pid = 0;
          this.catForm.cat_level = 0;
        }
      },
      openEditCateDialog(cate){
        this.catForm.cat_name = cate.cat_name;
        this.catForm.cat_id = cate.cat_id;
        this.editCateDialogVisible = true;
      },
      editCateDialogClosed(){
        this.catForm.cat_name = '';
        this.catForm.cat_id = '';
      },
      editCate(){
        this.$refs.editCateRef.validate(valid => {
          if(!valid) return;
          editCate(this.catForm.cat_id,{cat_name: this.catForm.cat_name}).then(res => {
            this.$message.success(res.meta.msg);
            this.editCateDialogVisible = false;
            this.getCategoriesList();
          })
        })
      },
      deleteCate(id){
        this.$confirm('确认删除该分类吗？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCate(id).then(res => {
            this.$message.success(res.meta.msg);
            this.getCategoriesList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        })
      }
    }
}
</script>

<style lang="less">
  .zk-icon{
    color: #909399;
    width: 10px;
    height: 10px;
    display: inline-block;
  }
  .zk-icon-plus-square-o:before{
    content: '>' !important;
    font-weight: 600;
  }
  .zk-icon-minus-square-o:before {
    content: "v" !important;
  }
  .zk-table__header-cell{
    color: #909399 !important;
    font-size: 13px;
  }
  .zk-table__cell-inner{
    font-size: 13px;
  }
</style>
