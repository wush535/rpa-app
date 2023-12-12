import request from '@/api/utils/request'
import qs from 'qs';
// 查询代理列表
export function listProxy(data) {
  const para = qs.stringify(data);
  return request({
    url: '/proxy/proxy/list',
    method: 'get',
    params: para
  })
}

// 查询代理详细
export function getProxy(id) {
  return request({
    url: '/proxy/proxy/' + id,
    method: 'get'
  })
}

// 新增代理
export function addProxy(data) {
  return request({
    url: '/proxy/proxy',
    method: 'post',
    data: data
  })
}

// 批量新增代理
export function batchAddProxy(data) {
  return request({
    url: '/proxy/proxy/batchAddProxy',
    method: 'post',
    data: data
  })
}


// 修改代理
export function updateProxy(data) {
  return request({
    url: '/proxy/proxy',
    method: 'put',
    data: data
  })
}

// 删除代理
export function delProxy(id) {
  return request({
    url: '/proxy/proxy/' + id,
    method: 'delete'
  })
}