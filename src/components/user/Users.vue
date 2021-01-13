<template>
  <div>
    <el-card>
      <!--头部-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUserList" @keyup.enter.native="searchUser">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="姓名" prop="username" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
        <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
        <el-table-column label="状态" prop="mg_state" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑用户" placement="top-end" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditUserDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="openSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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
      <!--添加用户对话框-->
      <el-dialog :title="id === 1 ? '添加用户':'编辑用户'" :visible.sync="dialogFormVisible" width="40%"
      @close="userDialogClosed">
        <el-form :model="userForm" :rules="id === 1 ? addUserFormRules : editUserFormRules" ref="userFormRef">
          <el-form-item label="用户名" prop="username" label-width="65px">
            <el-input v-model="userForm.username" :disabled="id===2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="65px" :class="{show_password:id===2}">
            <el-input v-model="userForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" label-width="65px">
            <el-input v-model="userForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" label-width="65px">
            <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="35%" @close="setRoleDialogClosed">
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <div>
          分配新角色：
          <el-select v-model="roleId" placeholder="请选择" size="small">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getUserList, changeUserState, addUser, deleteUser, editUser, setRole } from "@/api/user";
  import { getRolesList } from "@/api/rights";

  export default {
    name: 'users',
    data(){
      //验证邮箱
      let checkEmail = (rule, value, callback) => {
        const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if(regEmail.test(value)){
          return callback();
        }else{
          return callback(new Error('请输入合法的邮箱'));
        }
      };
      let checkMobile = (rule, value, callback) => {
        const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
        if(regMobile.test(value)){
          return callback();
        }else{
          return callback(new Error('请输入合法的手机号'));
        }
      };
      return{
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        dialogFormVisible: false,
        id: 0,//1代表添加用户，2代表编辑用户
        isAddUser: false,
        userForm: {
          id: '',
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addUserFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        editUserFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        setRoleDialogVisible: false,
        userInfo: {
          username: '',
          role_name: ''
        },
        rolesList: [],
        userId: '',
        roleId: '',
      }
    },
    created() {
      this.getUserList();
      this.getRolesList();
    },
    methods: {
      getUserList(){
        getUserList(this.queryInfo).then(res => {
          this.userList = res.data.users;
          this.total = res.data.total;
        })
      },
      getRolesList(){
        getRolesList().then(res => {
          this.rolesList = res.data;
        })
      },
      searchUser(){
        this.queryInfo.pagenum = 1;
        this.getUserList();
      },
      //监听一页显示数目
      handleSizeChange(newPageSize){
        this.queryInfo.pagesize = newPageSize;
        this.getUserList();
      },
      //监听当前页码
      handleCurrentChange(newPageNum){
        this.queryInfo.pagenum = newPageNum;
        this.getUserList();
      },
      changeUserState(userInfo){
        changeUserState(userInfo.id, userInfo.mg_state).then(res => {
          if(res.meta.status !== 200){
            userInfo.mg_state = !userInfo.mg_state;
          }
          this.$message({
            type: 'success',
            message: '更新用户状态成功'
          })
        });
      },
      //监听用户对话框的关闭事件
      userDialogClosed(){
        if(this.id === 2){
          this.$refs.userFormRef.resetFields();
        }else{
          if(this.isAddUser === false){
            this.$refs.userFormRef.resetFields();
          }
        }
      },
      clearUserForm(){
        for(let key in this.userForm){
          this.userForm[key] = '';
        }
      },
      addOrEditUser(){
        if(this.id===1){
          this.addUser();
        }else{
          this.editUser();
        }
      },
      openAddUserDialog(){
        this.id = 1;
        this.dialogFormVisible = true;
        this.clearUserForm();
      },
      addUser(){
        this.isAddUser = true;
        this.$refs.userFormRef.validate(valid => {
          if(!valid) return;
          addUser(this.userForm).then(res => {
              this.$message({
                type: 'success',
                message: res.meta.msg
              });
              this.getUserList();
            });
          this.dialogFormVisible = false;
        })
      },
      openEditUserDialog(userInfo){
        this.id = 2;
        this.dialogFormVisible = true;
        this.userForm.id = userInfo.id;
        this.userForm.username = userInfo.username;
        this.userForm.email = userInfo.email;
        this.userForm.mobile = userInfo.mobile;
      },
      editUser(){
        this.$refs.userFormRef.validate(valid => {
          if(!valid) return;
          editUser(this.userForm.id, {
            email: this.userForm.email,
            mobile: this.userForm.mobile
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.meta.msg
            });
            this.dialogFormVisible = false;
            this.getUserList();
          });
        })
      },
      deleteUser(id){
        this.$confirm('确认删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(res => {
            this.$message({
              type: 'success',
              message: res.meta.msg
            });
            this.queryInfo.pagenum = 1;
            this.getUserList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openSetRoleDialog(role){
        this.setRoleDialogVisible = true;
        this.userId = role.id;
        this.userInfo.username = role.username;
        this.userInfo.role_name = role.role_name;
      },
      setRole(){
        setRole(this.userId, {
          rid: this.roleId
        }).then(res => {
          this.setRoleDialogVisible = false;
          if(res){
            this.$message.success(res.meta.msg);
          }
          this.getUserList();
        })
      },
      setRoleDialogClosed(){
        this.roleId = '';
      }
    }
}
</script>

<style lang="less" scoped>
  .show_password{
    display: none;
  }
</style>
