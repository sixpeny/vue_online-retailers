import request from '@/utils/request'

export function getUserList(data) {
    return request({
        url: '/users',
        method: 'get',
        params: data
    });
}

export function changeUserState(uId, type) {
    return request({
        url: `/users/${uId}/state/${type}`,
        method: 'put'
    })
}

export function addUser(data) {
    return request({
        url: '/users',
        method: 'post',
        data: data
    })
}

export function deleteUser(id) {
    return request({
        url: `/users/${id}`,
        method: 'delete',
    })
}

export function editUser(id, data) {
    return request({
        url: `/users/${id}`,
        method: 'put',
        data: data
    })
}

export function setRole(id, rid) {
    return request({
        url: `/users/${id}/role`,
        method: 'put',
        data: rid
    })
}
