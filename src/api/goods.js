import request from '@/utils/request'

export function getCategoriesList(data) {
    return request({
        url: '/categories',
        method: 'get',
        params: data
    })
}

export function addCate(data) {
    return request({
        url: '/categories',
        method: 'post',
        data: data
    })
}

export function editCate(id, data) {
    return request({
        url: `/categories/${id}`,
        method: 'put',
        data: data
    })
}

export function deleteCate(id) {
    return request({
        url: `/categories/${id}`,
        method: 'delete'
    })
}

export function getParamsList(id, data) {
    return request({
        url: `/categories/${id}/attributes`,
        method: 'get',
        params: data
    })
}

export function addParams(id, data) {
    return request({
        url: `/categories/${id}/attributes`,
        method: 'post',
        data: data
    })
}

export function editParams(id, attrId, data) {
    return request({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'put',
        data: data
    })
}

export function deleteParams(id, attrId) {
    return request({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'delete'
    })
}

export function updateParamsItem(id, attrId, data) {
    return request({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'put',
        data: data
    })
}

export function getGoodsList(data) {
    return request({
        url: '/goods',
        method: 'get',
        params: data
    })
}

export function addGoods(data) {
    return request({
        url: '/goods',
        method: 'post',
        data: data
    })
}

export function deleteGoods(id) {
    return request({
        url: `/goods/${id}`,
        method: 'delete'
    })
}
