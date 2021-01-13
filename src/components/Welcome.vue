<template>
  <div>
    <el-card>
      <el-alert
        :title="'欢迎进入vue后台管理系统，当前登录：'+username"
        type="success"
        show-icon
        center
        :closable="false">
      </el-alert>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data(){
    return{
      username: ''
    }
  },
  created() {
    this.username = window.sessionStorage.getItem('username');
  }
}
</script>

<style lang="less">

</style>
