import request from '@/api/utils/request'
import qs from 'qs';

// 查询插件列表
export function listPlugin(data) {
 const para = qs.stringify(data);
  return request({
    url: '/rpa/plugin/list',
    method: 'get',
    params: para
  })
}

// 查询插件详细
export function getPlugin(id) {
  return request({
    url: '/rpa/plugin/' + id,
    method: 'get'
  })
}

// 新增插件
export function addPlugin(data) {
  return request({
    url: '/rpa/plugin',
    method: 'post',
    data: data
  })
}

// 修改插件
export function updatePlugin(data) {
  return request({
    url: '/rpa/plugin',
    method: 'put',
    data: data
  })
}

// 删除插件
export function delPlugin(id) {
  return request({
    url: '/rpa/plugin/' + id,
    method: 'delete'
  })
}
