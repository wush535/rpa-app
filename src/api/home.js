import request from '@/api/utils/request'
import qs from 'qs';

// 查询rpaTask列表
export function listTask(query) {
  const para = qs.stringify(query) +"&a=1";
  //console.log("para===="+para);
  return request({
    url: '/my/task/mylist',
    method: 'get',
    params: para
  })
}


// 查询rpaTask列表
export function listSubTask(query) {
  const para = qs.stringify(query) +"&a=1";
  //console.log("para===="+para);
  return request({
    url: '/my/task/list',
    method: 'get',
    params: para
  })
}

// 查询rpaTask详细
export function getTask(id) {
  return request({
    url: '/my/task/' + id,
    method: 'get'
  })
}

// 查询rpaTask详细
export function getPrj(id) {
  return request({
    url: '/my/prj/' + id,
    method: 'get'
  })
}

// 新增addPrj
export function addPrj(data) {
  return request({
    url: '/my/prj',
    method: 'post',
    data: data
  })
}

// 修改updatePrj
export function updatePrj(data) {
  return request({
    url: '/my/prj',
    method: 'put',
    data: data
  })
}


// 新增rpaTask
export function addTask(data) {
  return request({
    url: '/my/task',
    method: 'post',
    data: data
  })
}

// 修改rpaTask
export function updateTask(data) {
  return request({
    url: '/my/task',
    method: 'put',
    data: data
  })
}

// 删除rpaTask
export function delTask(id) {
  return request({
    url: '/my/task/' + id,
    method: 'delete'
  })
}


export function delPrj(id) {
  return request({
    url: '/my/prj/' + id,
    method: 'delete'
  })
}


export function openRpa(data) {
  const para = qs.stringify(data);
  return request({
    url: '/rpa/open',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para
  });
}



export function getLogWebsocketUrl() {
  let buyUrl = "ws://127.0.0.1:6858/ws/log/";
  return buyUrl;
}