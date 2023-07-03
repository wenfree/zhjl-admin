import request from '@/utils/request'

export function c(query) {
  return request({
    url: '/?s=App.Zhjlsb.getsb',
    method: 'post',
    params: query
  })
}

