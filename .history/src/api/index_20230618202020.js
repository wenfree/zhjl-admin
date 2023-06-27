import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/?s=App.Index.Select_where',
    method: 'post',
    params: query
  })
}
export function fetchZhjl(query) {
  return request({
    url: '/?s=App.Index.Select_zhjl',
    method: 'post',
    params: query
  })
}

export function getMenu() {
  return request({
    url: '/?s=App.VueAdmin.Get_menu',
    method: 'get'
  })
}
export function getUnit(data) {
  return request({
    url: '/?s=App.Fcjd.GetUnit',
    method: 'get',
    params: data
  })
}

// 更新单位设置
export function getUintPreson(data) {
  return request({
    url: '/?s=App.Fcjd.GetPerson',
    method: 'get',
    params: data
  })
}

// 更新单位设置
export function upDateUnit() {
  return request({
    url: '/?s=App.Fcjd.GetUnit',
    method: 'get'
  })
}

export function deleteById(data) {
  return request({
    url: '/?s=App.Index.Delete',
    method: 'post',
    data
  })
}

export function UpdateById(data) {
  return request({
    url: '/?s=App.Index.Update',
    method: 'post',
    data
  })
}
export function upDateInfo(data) {
  return request({
    url: '/?s=App.Index.upDateInfo',
    method: 'post',
    data
  })
}

export function upDateInfo(data) {
  return request({
    url: '/?s=App.Index.order',
    method: 'post',
    data
  })
}

