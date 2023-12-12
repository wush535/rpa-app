import request from '@/api/utils/request'
import qs from 'qs';

export function openRpa(data) {
  const para = qs.stringify(data);
  return request({
    url: '/rpa/open',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: para
  });
}



export function getLogWebsocketUrl() {
  let buyUrl = "ws://127.0.0.1:6858/ws/log/";
  return buyUrl;
}