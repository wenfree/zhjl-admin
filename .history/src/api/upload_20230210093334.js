import request from '@/utils/request'

export function SaveImg(data) {
  return request({
    url: '/?s=App.HongKongImg.SaveImg',
    method: 'post',
    data
  })
}

export function getInfo(user_id, token) {
  return request({
    url: '/?s=App.User_User.Profile',
    method: 'get',
    params: { user_id, token }
  })
}

export function logout() {
  return request({
    url: '/?s=App.User_User.logout',
    method: 'post'
  })
}
