import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/?s=App.User_User.Login',
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
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
