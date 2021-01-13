<template>
  <div>
    <el-card>
      <!--权限列表-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限等级" prop="level" align="center">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="danger" v-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getRightsList } from "@/api/rights";

  export default {
    name: 'rights',
    data(){
      return{
        rightsList: [],
      }
    },
    created() {
      this.getRightsList();
    },
    methods: {
      getRightsList() {
        getRightsList('list').then(res => {
          this.rightsList = res.data;
        })
      }
    }
}
</script>

<style lang="less" scoped>

</style>
