import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
//解决vue-router在3.0版本以上重复点击同一路由报错的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function(location) {
  return originalPush.call(this, location).catch(err => err)
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

  const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login')
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home'),
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome'),
        },
        {
          path: '/users',
          component: () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/user/Users'),
          name: '用户列表',
          meta: {parentName: '用户管理'}
        },
        {
          path: '/rights',
          component: () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/auth/Rights'),
          name: '权限列表',
          meta: {parentName: '权限管理'}
        },
        {
          path: '/roles',
          component: () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/auth/Roles'),
          name: '角色列表',
          meta: {parentName: '权限管理'}
        },
        {
          path: '/categories',
          component: () => import(/* webpackChunkName: "categories_params" */ '@/components/goods/Categories'),
          name: '商品分类',
          meta: {parentName: '商品管理'}
        },
        {
          path: '/params',
          component: () => import(/* webpackChunkName: "categories_params" */ '@/components/goods/Params'),
          name: '分类参数',
          meta: {parentName: '商品管理'}
        },
        {
          path: '/goods',
          component: () => import(/* webpackChunkName: "goods_addGoods" */ '@/components/goods/Goods'),
          name: '商品列表',
          meta: {parentName: '商品管理'}
        },
        {
          path: '/goods/addgoods',
          component: () => import(/* webpackChunkName: "goods_addGoods" */ '@/components/goods/AddGoods'),
          name: '添加商品',
          meta: {parentName: '商品管理'}
        },
        {
          path: '/orders',
          component: () => import(/* webpackChunkName: "orders_reports" */ '@/components/order/Orders'),
          name: '订单列表',
          meta: {parentName: '订单管理'}
        },
        {
          path: '/reports',
          component: () => import(/* webpackChunkName: "orders_reports" */ '@/components/report/Reports'),
          name: '数据报表',
          meta: {parentName: '数据统计'}
        }
      ]
    }
];
/*如果路由采用 history 模式会造成刷新页面显示 cannot get 的问题，history 模式需要服务端的支持*/
const router = new VueRouter({
  routes
});

//路由导航守卫
router.beforeEach((to, form, next) => {
  if(to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
});


export default router
