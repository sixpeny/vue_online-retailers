<template>
  <el-container style="border: 1px solid #eee" class="home_container">
    <el-aside :width="isCollapse ? '64px':'256px'">
      <div class="logo">
        <router-link to="home">
          <img src="https://blogimg2020.oss-cn-shenzhen.aliyuncs.com/blogimg/logo.png" alt="logo">
          <span :style="isCollapse ? {display: 'none'} : {display: 'inline-block'}">Vue-Shop</span>
        </router-link>
      </div>
      <el-menu
         active-text-color="#409eff"
         router
         :unique-opened="true"
         :collapse="isCollapse"
         :collapse-transition="false"
         :default-active="$route.path">
        <el-submenu  v-for="(item, index) in menuList" :index="'/'+item.path" :key="item.id">
          <template slot="title">
            <i :class="iconsObj[index]"></i>
            <span>{{item.authName}}</span>
          </template>
          <el-menu-item index="1-1" v-for="item in item.children" :index="'/'+item.path" :key="item.id" @click="addTagRoute(item.path, item.authName)">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="toggle-btn" @click="toggleCollapse">
          <i :class="isCollapse ?'el-icon-s-unfold':'el-icon-s-fold'" style="line-height: 60px"></i>
        </div>
        <el-breadcrumb separator="/" style="float: left;line-height: 60px">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.path!=='/welcome'">{{$router.currentRoute.meta.parentName}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.path!=='/welcome'">{{$router.currentRoute.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row style="float: right">
          <el-col>
            <img src="https://blogimg2020.oss-cn-shenzhen.aliyuncs.com/blogimg/小黄鸭.gif" alt=""
                 style="width: 50px;vertical-align: middle;margin-top: -5px"/>
            <el-dropdown>
          <span class="el-dropdown-link" style="cursor: pointer">
            {{username}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>关于</el-dropdown-item>
                <el-dropdown-item><span @click="logout">退出</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

      </el-header>
      <el-main>
        <div>
          <el-tag @click="$router.replace('/welcome')" size="medium" :effect="$route.path==='/welcome'?'dark':'plain'">首页</el-tag>
          <el-tag
            closable
            size="medium"
            :effect="$route.path==='/'+item.path?'dark':'plain'"
            v-for="(item, index) in tagRoutes"
            :key="index"
            @click="$router.replace('/'+item.path)"
            @close="removeTagRoute(item.path, index)">
            {{item.authName}}
          </el-tag>
        </div>
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="keepAlive">
            <router-view/>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { getMenuList } from "@/api/menu";

  export default {
    data() {
      return {
        username: '',
        menuList: [],
        iconsObj: {
          0: 'el-icon-s-custom',
          1: 'el-icon-s-management',
          2: 'el-icon-s-goods',
          3: 'el-icon-s-order',
          4: 'el-icon-s-data',
        },
        isCollapse: false,//是否折叠
        bigLogo: 'https://file.iviewui.com/admin-pro-dist/img/logo.7b8cc895.png',
        smallLogo: 'https://file.iviewui.com/admin-pro-dist/img/logo-small.4a34a883.png',
        tagRoutes: [],
        keepAlive: ['welcome', 'users', 'rights', 'roles', 'params', 'orders', 'report']
      }
    },
    created() {
      this.username = window.sessionStorage.getItem('username');
      this.getMenuList();
      this.tagRoutes = JSON.parse(window.sessionStorage.getItem('tagRoutes')||'[]');
    },
    methods: {
      logout(){
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      getMenuList(){
        getMenuList().then(res => {
          this.menuList = res.data;
        })
      },
      toggleCollapse(){
        this.isCollapse = !this.isCollapse;
      },
      addTagRoute(path, authName){
        let tagRoute = {
          path: path,
          authName: authName
        };
        this.tagRoutes.push(tagRoute);
        this.tagRoutes = this.tagRoutes.filter((element, index, self) => {
          return self.findIndex(el=>el.path===element.path)===index;
        });
        window.sessionStorage.setItem('tagRoutes', JSON.stringify(this.tagRoutes));
      },
      removeTagRoute(path, index){
        if(this.$route.path === '/welcome'){
          this.tagRoutes.splice(index, 1);
        }else{
          if(index > 0){
            if(index === this.tagRoutes.length-1){
              if('/'+path === this.$route.path){
                this.$router.replace(this.tagRoutes[index-1].path);
              }
            }else{
              this.$router.replace(this.tagRoutes[index+1].path);
            }
          }else if(index === 0){
            if(this.tagRoutes.length === 1){
              this.$router.replace('/welcome');
            }else if(this.tagRoutes.length!==1){
              if('/'+path === this.$route.path){
                this.$router.replace(this.tagRoutes[index+1].path);
              }
            }
          }
          this.tagRoutes.splice(index, 1);
        }
        window.sessionStorage.setItem('tagRoutes', JSON.stringify(this.tagRoutes));
      }
    }
  };
</script>

<style lang="less" scoped>
  .home_container{
    height: 100%;
  }

  .el-header {
    color: #333;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    line-height: 60px;
    z-index: 10;
  }

  .el-aside {
    box-shadow: 2px 0 6px rgba(0,21,41,.15);
    color: #333;
    height: 100%;
    z-index: 10;
    .el-menu{
      border: none;
      border-top: 1px solid #f8f8f8;
    }
  }
  .el-main{
    background-color: #f5f6f7;
  }
  .toggle-btn{
    float: left;
    cursor: pointer;
    margin-right: 30px;
    i{
      font-size: 20px;
      color: #909399;
    }
  }
  .logo{
    text-align: center;
    height: 63px;
    line-height: 63px;
    img{
      height: 65%;
      display: inline-block;
      margin-top: 10px;
      vertical-align: -13px;
    }
    span{
      font-size: 22px;
      font-family: Consolas,serif;
      color: #333;
      margin-left: 15px;
    }
  }
  .el-main{
    padding-top: 10px;
  }
  .el-tag{
    cursor: pointer;
    margin-bottom: 8px;
    margin-right: 8px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

</style>
