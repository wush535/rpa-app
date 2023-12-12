// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcMain } = require('electron')
const { spawn, exec  } = require('child_process')
const path = require('path')
const iconvLite = require('iconv-lite')
/* import store from '@/api/utils/store'; */

let mainWindow = null;
export function preload(window) {
	mainWindow = window;
	ipcMain.on("startBat", (e, callback) => {
		console.log("开始了！！！！===" + callback);
	    //执行自动更新检查
		startForBat().then(res=>{
			res['cmd'] = 'startBat' ;
			sendMainMsg("myMsg", res);
		}).catch(err=>{
			sendMainMsg("myMsg", { "code":500, "cmd":"startBat", "msg": JSON.stringify(err) });
		});
	})
	
	
	ipcMain.on("statusBat", (e, callback) => {
	    //执行自动更新检查
		statusForBat().then(res=>{
			res['cmd'] = 'statusBat' ;
			sendMainMsg("myMsg", res);
		}).catch(err=>{
			sendMainMsg("myMsg", { "code":500, "cmd":"statusBat", "msg": JSON.stringify(err) });
		})
	})
	
	
	ipcMain.on("stopBat", (e, callback) => {
	    //执行自动更新检查
		stopForBat().then(res=>{
			res['cmd'] = 'stopBat' ;
			sendMainMsg("myMsg", res);
		}).catch(err=>{
			sendMainMsg("myMsg", { "code":500, "cmd":"stopBat", "msg": JSON.stringify(err) });
		})
	})
	
}

//给渲染进程发送消息
function sendMainMsg(type,msg) {
  mainWindow.webContents.send(type, msg)
}

function startForBat(){
	return new Promise(function (resolve, reject) {
		try{
			let path1 = path.join(__dirname, "../app/admin-crypto.bat");
			let path3 = path1 + " start ";
			//console.log("path3====="+path3)
			const bat = exec(path3, {encoding:'GBK', windowsVerbatimArguments: true});
			let count = 0;
			bat.stdout.on('data', (data) => {
				let str = iconvLite.decode(data.toString(),'GBK');
				//console.log(count+"=======0data1======"+str)
				if(count == 0 && str.indexOf("wushCryptoApp start success") > -1){
					count = 1;
					resolve({"code":200,"msg":"启动服务成功"});					               
				}else if(count == 0 && str.indexOf("service is running") > -1){
					count = 2;
					resolve({"code":201,"msg":"已经启动服务"});
				}
			});
		  
			bat.stderr.on('data', (data) => {
				console.log("=======data2======"+JSON.stringify(iconvLite.decode(data,'GBK')))
				//reject({"code":500,"msg":"启动服务失败："+JSON.stringify(data)})
			});
		  
			bat.on('close', (code) => {
				reject({"code":500,"msg":"启动服务失败并退出！"})
			});
		}catch(error){
		   reject({"code":500,"msg":error.message})
		}
	});
}

 function statusForBat(){
	return new Promise(function (resolve, reject) {
		try{
			let path1 = path.join(__dirname, "..\\app\\admin-crypto.bat ");
			let path3 = path1 + " status ";
			console.log("path3====="+path3)
			const bat = exec(path3, {encoding:'GBK', windowsVerbatimArguments: true});
			bat.stdout.on('data', (data) => {
				//alert("stdout====="+data.toString());
				if(data.toString().indexOf("service is running")  > -1){
					resolve({"code":200,"msg":"服务启动中"});					               
				}else if(data.toString().indexOf("service is dead") > -1){
				resolve({"code":201,"msg":"服务未启动"});	
			}else{
				resolve({"code":202,"msg":"服务未启动"});	
			}
			});
		  
			bat.stderr.on('data', (data) => { 
				//alert("stderr====="+data.toString());		
				reject({"code":500,"msg":"查询服务失败"})
			});
		  
			bat.on('close', (code) => {
				//alert("子进程退出码====="+data.toString());
				reject({"code":500,"msg":"查询服务状态失败并退出"})
			});
		  }catch(error){
			//alert("错误:"+error.message)
			reject({"code":500,"msg":error.message})
		  }
	});
 }
 
function stopForBat(){
	return new Promise(function (resolve, reject) {
		try{
			let path1 = path.join(__dirname, "..\\app\\admin-crypto.bat ");
			let path3 = path1 + " stop ";
			//alert("path3======="+path3);
			const bat = exec(path3, {encoding:'GBK', windowsVerbatimArguments: true});
			bat.stdout.on('data', (data) => {
				//alert("stdout====="+data.toString());
				if(data.toString().indexOf("service stop success")  > -1){
					resolve({"code":200,"msg":"服务停止成功"});					               
				}else if(data.toString().indexOf("service not exists")  > -1){
					resolve({"code":201,"msg":"服务未启动"});	
				}
			});
		  
			bat.stderr.on('data', (data) => { 
				//alert("stderr====="+data.toString());		
				reject({"code":500,"msg":"服务停止失败"})
			});
		  
			bat.on('close', (code) => {
				//alert("子进程退出码====="+data.toString());
				reject({"code":500,"msg":"服务停止失败并退出"})
			});
		  }catch(error){
			//alert("错误:"+error.message)
		reject({"code":500,"msg":error.message})
		  }
	});
 }
