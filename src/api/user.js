import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/?s=App.User_User.Login',
    method: 'post',
    data
  })
}

export function getLogo(data) {
  return request({
    url: '/?s=App.Index.Select_where',
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
