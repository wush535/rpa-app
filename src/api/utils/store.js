import Vue from 'vue'
import Vuex from 'vuex'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

var state={
    myLoading: true,//设置loading是否显示
    neddloding:0,//根据是否为0来判断是否关闭loading
	isOpen: false,
	isMyExe: true,
	myTabs: [{name:"任务列表",url: "/"}],
	tabIndex: "任务列表"
}

var mutations={
	addTab(state,tab){
		//console.log("tab====="+JSON.stringify(tab));
		let isAdd = true;
		for (var j=0; j<state.myTabs.length; j++) {
			if(state.myTabs[j].name == tab.name){
				isAdd = false;
			}
		}
		if(isAdd){
			state.myTabs.push({"name":tab.name,"url":tab.url});
		}
		//console.log("state.myTabs====="+JSON.stringify(state.myTabs));
		state.tabIndex = tab.name; 
	},
	delTab(state,name){
		//console.log("name====="+name+"===="+state.myTabs.length)
		for (var j = 0; j < state.myTabs.length; j++) {
			if(state.myTabs[j].name == name){
				break;
			}
		}
		//console.log("j====="+j)
		state.myTabs.splice(j,1);
		//state.tabIndex = state.myTabs[j-1].name; 
	},
	updateTabIndex(state,tabIndex){
		state.tabIndex = tabIndex; 
	},
    openLoading(state){
		//loading显示
        state.myLoading = true; 
    },
    closeLoading(state){
		//loading关闭
        state.myLoading = false; 
    },
    show(state){
		//每请求一次加一
        state.neddloding++
		//console.log("show======"+state.neddloding);
		if(state.neddloding > 1 ){
			state.neddloding = 1;
		}
    },
    hide(state){ 
		//每完成请求一次减一
        state.neddloding--
		//console.log("hide======"+state.neddloding);
		if(state.neddloding < 0 ){
			state.neddloding = 0;
		}
    },
	openFlag(state){
		state.isOpen = true;
	},
	closeFlag(state){
		state.isOpen = false;
	},
	stopJar(state, callback){
		stopBat().then(function(mybat){
			if(mybat.code == 200 || mybat.code == 201){ //关闭成功
				state.isOpen = false;
			}
			Message({
			  message: mybat.msg,
			  type: 'success'
			});
			callback(mybat);
		}).catch(function(error){
			/* Notification.error({
			  title: "java启动失败："+JSON.stringify(error)
			}); */
		})
	},
	openJar(state, callback){
		state.myLoading = true;
		startBat().then(function(mybat){
			state.myLoading = false;
			if(mybat.code == 200 || mybat.code == 201){ //启动成功
				state.isOpen = true;
				Message({
				  message: mybat.msg,
				  type: 'success'
				});
			}else{
				Message({
				  message: mybat.msg,
				  type: 'error'
				});
			}
			callback(mybat);
		}).catch(function(error){
			state.myLoading = false;
		})
	}
}

var plugins = [createPersistedState({ storage: window.sessionStorage })];

export default new Vuex.Store({
    state,
    mutations,
	plugins
})