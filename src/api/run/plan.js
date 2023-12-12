import request from '@/api/utils/request'
import qs from 'qs';
// 查询项目执行计划列表
export function listPlan(query) {
  const para = qs.stringify(query);
  return request({
    url: '/run/plan/list',
    method: 'get',
    params: para
  })
}

export function openById(id) {
  return request({
    url: '/run/plan/openById/'+id,
    method: 'post'
  })
}

// 查询项目执行计划详细
export function getPlan(id) {
  return request({
    url: '/run/plan/' + id,
    method: 'get'
  })
}

// 新增项目执行计划
export function addPlan(data) {
  return request({
    url: '/run/plan',
    method: 'post',
    data: data
  })
}

// 修改项目执行计划
export function updatePlan(data) {
  return request({
    url: '/run/plan',
    method: 'put',
    data: data
  })
}

// 删除项目执行计划
export function delPlan(id) {
  return request({
    url: '/run/plan/' + id,
    method: 'delete'
  })
}
