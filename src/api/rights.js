import request from '@/utils/request'

export function getRightsList(type) {
    return request({
        url: `/rights/${type}`,
        method: 'get'
    })
}

export function getRolesList() {
    return request({
        url: '/roles',
        method: 'get'
    })
}

export function addRole(data) {
    return request({
        url: '/roles',
        method: 'post',
        data: data
    })
}

export function deleteRole(id) {
    return request({
        url: '/roles/'+id,
        method: 'delete'
    })
}

export function editRole(id, data) {
    return request({
        url: '/roles/'+id,
        method: 'put',
        data: data
    })
}

export function removeRightsById(roleId, rightId) {
    return request({
        url: '/roles/'+roleId+'/rights/'+rightId,
        method: 'delete'
    })
}

export function assignRights(roleId, rids) {
    return request({
        url: '/roles/'+roleId+'/rights',
        method: 'post',
        data: rids
    })
}
