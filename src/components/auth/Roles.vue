<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand" align="center">
          <template v-slot="scope">
            <el-row :class="['bd-bottom',index1===0?'bd-top':'','v-center']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index2===0?'':'bd-top','v-center']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRightsById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="danger" v-for="item3 in item2.children" :key="item3.id"
                            @close="removeRightsById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" width="350px" align="center">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditRoleDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="openSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="40%" @close="resetDefaultKeys">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        ref="treeRef"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="defaultKeys">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%">
      <el-form :model="roleForm" ref="roleRef" :rules="roleRules">
        <el-form-item label="角色名称" prop="roleName" label-width="80px">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑角色对话框-->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleClosed">
      <el-form :model="roleForm" ref="roleRef" :rules="roleRules">
        <el-form-item label="角色名称" prop="roleName" label-width="80px">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getRolesList, getRightsList, removeRightsById, assignRights, addRole, deleteRole, editRole } from "@/api/rights";

  export default {
    name: 'roles',
    data(){
      return{
        rolesList: [],
        rightsList: [],
        setRightDialogVisible: false,
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        defaultKeys: [],
        roleId: '',
        addRoleDialogVisible: false,
        editRoleDialogVisible: false,
        roleForm: {
          id: '',
          roleName: '',
          roleDesc: '',
        },
        roleRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getRolesList();
    },
    methods: {
      getRolesList(){
        getRolesList().then(res => {
          this.rolesList = res.data;
        })
      },
      removeRightsById(role, rightId){
        this.$confirm('确认删除该权限吗？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRightsById(role.id, rightId).then(res => {
            this.$message({
              type: 'success',
              message: res.meta.msg
            });
            role.children = res.data;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      openSetRightDialog(role) {
        this.roleId = role.id;
        this.setRightDialogVisible = true;
        this.getRightsList();
        this.getLeafList(role, this.defaultKeys);
      },
      getRightsList(){
        getRightsList('tree').then(res => {
          this.rightsList = res.data;
        })
      },
      getLeafList(node, arr){
        if(!node.children){
          return arr.push(node.id);
        }
        node.children.forEach(item => {
          this.getLeafList(item, arr);
        })
      },
      resetDefaultKeys(){
        this.defaultKeys = [];
      },
      assignRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ];
        const rids = keys.join(',');
        assignRights(this.roleId, {rids: rids}).then(res => {
          this.$message({
            type: 'success',
            message: res.meta.msg
          });
          this.setRightDialogVisible = false;
          this.getRolesList();
        })
      },
      clearUserForm(){
        for(let key in this.roleForm){
          this.roleForm[key] = '';
        }
      },
      openAddRoleDialog(){
        this.addRoleDialogVisible = true;
        this.clearUserForm();
      },
      addRole(){
        this.$refs.roleRef.validate(valid => {
          if(!valid) return;
          addRole(this.roleForm).then(res => {
            this.$message({
              type: 'success',
              message: res.meta.msg
            });
            this.addRoleDialogVisible = false;
            this.getRolesList();
          })
        })
      },
      deleteRole(roleId){
        this.$confirm('确认删除该角色吗？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(roleId).then(res => {
            this.$message.success(res.meta.msg);
            this.getRolesList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        })
      },
      openEditRoleDialog(role){
        this.editRoleDialogVisible = true;
        this.roleForm.id = role.id;
        this.roleForm.roleName = role.roleName;
        this.roleForm.roleDesc = role.roleDesc;
      },
      editRole(){
        this.$refs.roleRef.validate(valid => {
          if(!valid) return;
          editRole(this.roleForm.id,{
            roleName: this.roleForm.roleName,
            roleDesc: this.roleForm.roleDesc
          }).then(res => {
            this.$message.success(res.meta.msg);
            this.editRoleDialogVisible = false;
            this.getRolesList();
          })
        })
      },
      editRoleClosed(){
        this.$refs.roleRef.resetFields();
      }
    }
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 8px;
    display: inline-block;
  }
  .el-row{
    text-align: left;
  }
  .bd-top{
    border-top: 1px solid #eee;
  }
  .bd-bottom{
    border-bottom: 1px solid #eee;
  }
  .v-center{
    display: flex;
    align-items: center;
  }
</style>
