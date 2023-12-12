import request from '@/api/utils/request'
import qs from 'qs';
// 查询项目执行计划明细列表
export function listDetail(query) {
  const para = qs.stringify(query);
  return request({
    url: '/run/detail/list',
    method: 'get',
    params: para
  })
}

// 查询项目执行计划明细详细
export function getDetail(id) {
  return request({
    url: '/run/detail/' + id,
    method: 'get'
  })
}

// 新增项目执行计划明细
export function addDetail(data) {
  return request({
    url: '/run/detail',
    method: 'post',
    data: data
  })
}

// 修改项目执行计划明细
export function updateDetail(data) {
  return request({
    url: '/run/detail',
    method: 'put',
    data: data
  })
}

// 删除项目执行计划明细
export function delDetail(id) {
  return request({
    url: '/run/detail/' + id,
    method: 'delete'
  })
}


export function runById(data) {
  return request({
    url: '/run/detail/runById',
    method: 'post',
    data: data
  })
}