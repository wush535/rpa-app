import Vue from 'vue';

import VueRouter from "vue-router";

Vue.use(VueRouter);

import home from "../components/home.vue";
import scroll from "../components/scroll/index.vue";
import sui from "../components/sui/index.vue";
import Diagram from "../components/flow/Diagram.vue";

import rpa from "../components/rpa/index.vue";
import acc from "../components/acc/accInfo.vue";

import plan from "../components/plan/plan.vue";
import detail from "../components/plan/detail.vue";
import log from "../components/plan/log.vue";
import plugin from "../components/plugin/index.vue";
import proxy from "../components/proxy/index.vue";
import group from "../components/group/index.vue";
import statics from "../components/statics/index.vue";

export default new VueRouter({
  routes:[
    {
      //访问路径
      path: "/",
	  name: 'home',
	  meta: { keepAlive: true},
      // 引入的组件名
      component: home,
    },
	{
	  //访问路径
	  path: "/log",
	  name: 'log',
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: log,
	},
	/* {
	  //访问路径
	  path: "/sui",
	  name: 'sui',
	  // 引入的组件名
	  component: sui,
	}, */
/* 	{
	  //访问路径
	  name: 'scroll',
	  path: "/scroll",
	  // 引入的组件名
	  component: scroll,
	}, */
	{
	  //访问路径
	  name: 'acc',
	  path: "/acc",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: acc,
	},
	{
	  //访问路径
	  name: 'flow',
	  path: "/flow",
	  meta: { keepAlive: false},
	  // 引入的组件名
	  component: Diagram,
	},
	{
	  //访问路径
	  name: 'rpa',
	  path: "/rpa",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: rpa,
	},
	{
	  //访问路径
	  name: 'plan',
	  path: "/plan",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: plan,
	},
	{
	  //访问路径
	  name: 'detail',
	  path: "/detail",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: detail,
	},
	{
	  //访问路径
	  name: 'plugin',
	  path: "/plugin",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: plugin,
	},
	{
	  //访问路径
	  name: 'proxy',
	  path: "/proxy",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: proxy,
	},
	{
	  //访问路径
	  name: 'statics',
	  path: "/statics",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: statics,
	},
	{
	  //访问路径
	  name: 'group',
	  path: "/group",
	  meta: { keepAlive: true},
	  // 引入的组件名
	  component: group,
	},
	
   ],
});