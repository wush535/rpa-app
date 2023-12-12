import request from '@/api/utils/request'
import qs from 'qs';


// 查询字典列表
export function list(query) {
  const para = qs.stringify(query);
  return request({
    url: '/dict/list',
    method: 'get',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    params: para,
	
  })
}