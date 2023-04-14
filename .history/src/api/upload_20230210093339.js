import request from '@/utils/request'

export function SaveImg(data) {
  return request({
    url: '/?s=App.HongKongImg.SaveImg',
    method: 'post',
    data
  })
}
