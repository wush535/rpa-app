import request from '@/api/utils/request'
import qs from 'qs';
// 查询账户信息列表
export function listInfo(query) {
  const para = qs.stringify(query);
  return request({
    url: '/acc/info/list',
    method: 'get',
    params: para
  })
}

// 查询账户信息详细
export function getInfo(id) {
  return request({
    url: '/acc/info/' + id,
    method: 'get'
  })
}

// 新增账户信息
export function addInfo(data) {
  return request({
    url: '/acc/info',
    method: 'post',
    data: data
  })
}

// 修改账户信息
export function updateInfo(data) {
  return request({
    url: '/acc/info',
    method: 'put',
    data: data
  })
}

// 删除账户信息
export function delInfo(id) {
  return request({
    url: '/acc/info/' + id,
    method: 'delete'
  })
}


// 打开窗口
export function openById(data) {
  const para = qs.stringify(data);
  return request({
    url: '/acc/info/openById',
    method: 'post',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para,
  });
}