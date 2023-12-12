import Vue from 'vue'
import App from '@/App.vue'
import router from "@/router/index"
import ElementUI from 'element-ui';
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import modal from '@/api/utils/modal.js';
import { download } from '@/api/utils/request';
import store from '@/api/utils/store';
import { resetForm, parseTime } from '@/api/utils/my';

// 分页组件
import Pagination from "@/components/Pagination";
// 模态框对象
Vue.prototype.$message = Message;
Vue.prototype.$modal = modal;
Vue.prototype.download = download;
Vue.prototype.resetForm = resetForm;
Vue.prototype.parseTime = parseTime

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('Pagination', Pagination)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
