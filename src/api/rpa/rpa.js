import request from '@/api/utils/request'
import qs from 'qs';

export function runTask(data) {
  const para = qs.stringify(data);
  return request({
    url: '/my/prj/runTask',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para,
	isLoading: false
  });
}


export function runAccTask(data) {
  const para = qs.stringify(data);
  return request({
    url: '/my/prj/runAccTask',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para,
	isLoading: false
  });
}


export function getLogStatisticsVo(id) {
  return request({
    url: '/my/prj/getLogStatisticsVo/' + id,
    method: 'get'
  })
}



export function runAccTaskForError(data) {
  const para = qs.stringify(data);
  return request({
    url: '/my/prj/runAccTaskForError',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para,
	isLoading: false
  });
}

export function getErrorAccInfo(data) {
  const para = qs.stringify(data);
  return request({
    url: '/my/prj/getErrorAccInfo',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para,
	isLoading: false
  });
}


export function listPlugin(data) {
  const para = qs.stringify(data);
  return request({
    url: '/rpa/plugin/list',
    method: 'get',
    params: para,
	isLoading: false
  });
}


