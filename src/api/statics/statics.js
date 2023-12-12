import request from '@/api/utils/request'
import qs from 'qs';

export function getLogStatisticsVo(query) {
	const para = qs.stringify(query);
  return request({
    url: '/my/prj/getLogStatisticsVo',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'get',
	params: para,
  })
}