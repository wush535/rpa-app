import request from '@/api/utils/request'
import qs from 'qs';

// 查询账户日志列表
export function listLog(query) {
  const para = qs.stringify(query)
  return request({
    url: '/log/list',
    method: 'get',
    params: para
  })
}


// 查询账户日志列表
export function openmirror(data){
  return request({
    url: '/log/openmirror',
    method: 'post',
    data: data
  })
}


// 查询账户日志详细
export function getLog(id) {
  return request({
    url: '/log/' + id,
    method: 'get'
  })
}

// 新增账户日志
export function addLog(data) {
  return request({
    url: '/log',
    method: 'post',
    data: data
  })
}

// 修改账户日志
export function updateLog(data) {
  return request({
    url: '/log',
    method: 'put',
    data: data
  })
}

// 删除账户日志
export function delLog(id) {
  return request({
    url: '/log/' + id,
    method: 'delete'
  })
}
