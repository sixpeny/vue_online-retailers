import request from '@/utils/request'

export function getOrdersList(data) {
    return request({
        url: '/orders',
        method: 'get',
        params: data
    })
}

export function getLogistics() {
    return request({
        url: '/kuaidi/1106975712662',
        method: 'get'
    })
}

