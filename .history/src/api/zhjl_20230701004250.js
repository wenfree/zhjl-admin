import request from '@/utils/request'

export function getsb(query) {
  return request({
    url: '/?s=App.Zhjlsb.getsb',
    method: 'post',
    params: query
  })
}

