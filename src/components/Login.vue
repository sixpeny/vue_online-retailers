<template>
    <div class="login-container">
      <div class="login-box">
        <div class="avatar-box">
          <img src="@/assets/logo.png" alt="">
        </div>
        <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
            placeholder="用户名"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
            placeholder="密码"
            prefix-icon="el-icon-lock"
            type="password"
            v-model="loginForm.password"
            />
          </el-form-item>
          <el-form-item class="btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import { login } from '@/api/login'
export default {
  data(){
    return{
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(valid => {
        if(!valid) return;
        login(this.loginForm).then(res => {
          window.sessionStorage.setItem('token', res.data.token);
          window.sessionStorage.setItem('username', res.data.username);
          this.$message({
            type: 'success',
            message: res.meta.msg
          });
          this.$router.push('/home');
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container{
    background-color: #2d3436;
    width: 100%;
    height: 100%;
    .login-box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .avatar-box{
        width: 120px;
        height: 120px;
        border: 1px solid #eee;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 0 10px #ddd;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
      .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        .btn{
          display: flex;
          justify-content: center;
          .el-button{
            margin: 0 20px;
          }
        }
      }
    }
  }
</style>
