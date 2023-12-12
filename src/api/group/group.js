import request from '@/api/utils/request'
import qs from 'qs';


// 查询分组列表
export function listGroup(query) {
  let paras = qs.stringify(query)
  return request({
    url: '/crypto/group/list',
    method: 'get',
    params: paras
  })
}

// 查询分组详细
export function getGroup(id) {
  return request({
    url: '/crypto/group/' + id,
    method: 'get'
  })
}

// 新增分组
export function addGroup(data) {
  return request({
    url: '/crypto/group',
    method: 'post',
    data: data
  })
}

// 修改分组
export function updateGroup(data) {
  return request({
    url: '/crypto/group',
    method: 'put',
    data: data
  })
}

// 删除分组
export function delGroup(id) {
  return request({
    url: '/crypto/group/' + id,
    method: 'delete'
  })
}
