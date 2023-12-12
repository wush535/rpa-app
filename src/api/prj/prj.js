import request from '@/api/utils/request'
import qs from 'qs';


export function listPrj(query) {
  const para = qs.stringify(query);
  return request({
    url: '/my/prj/listPrj',
    method: 'get',
    params: para
  })
}

// 查询rpaTask列表
export function listTask(query) {
  const para = qs.stringify(query);
  //console.log("para===="+para);
  return request({
    url: '/my/task/list',
    method: 'get',
    params: para
  })
}
