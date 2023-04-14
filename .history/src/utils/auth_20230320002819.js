import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userKey = 'user_id'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function getId() {
    return Cookies.get(userKey)
}

export function getName() {
    return Cookies.get('name')
}

export function setId(user_id) {
    return Cookies.set(userKey, user_id)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
