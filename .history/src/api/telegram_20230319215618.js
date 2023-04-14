import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: 'http://anqi.telegram-bot.top/?s=App.Index.select_where',
        method: 'post',
        params: query
    })
}

export function updateArticle(query) {
    console.log(query)
    return request({
        url: 'http://anqi.telegram-bot.top/?s=App.Index.Update',
        method: 'post',
        params: query
    })
}

export function deleteById(data) {
    return request({
        url: 'http://anqi.telegram-bot.top/?s=App.Index.Delete',
        method: 'post',
        data
    })
}
