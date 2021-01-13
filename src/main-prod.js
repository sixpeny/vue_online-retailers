import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/css/global.css'
// 导入树型表格
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

Vue.use(VueQuillEditor)

// 全局日期过滤器
Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal * 1000);
  const yyyy = date.getFullYear();
  const MM = (date.getMonth() + 1 + '').padStart(2, '0');
  const dd = (date.getDay() + '').padStart(2, '0');
  const hh = (date.getHours() + '').padStart(2, '0');
  const mm = (date.getMinutes() + '').padStart(2, '0');
  const ss = (date.getSeconds() + '').padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
