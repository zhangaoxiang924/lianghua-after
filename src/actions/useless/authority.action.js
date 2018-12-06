/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {AUTHORITY} from '../../constants/index'
import { message } from 'antd'

// 权限列表
export const getAuthorityList = (sendData) => {
    return (dispatch) => {
        axiosAjax('POST', '/api_game_list', !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 200) {
                const actionData = res.data
                dispatch(addAuthorityData({'list': actionData}))
            } else {
                message.error(res.message)
            }
        })
    }
}

// 删除用户权限
export const delAuthorityListItem = (sendData, index) => {
    return (dispatch) => {
        axiosAjax('POST', '/api_game_list', {...sendData}, function (res) {
            if (res.code === 200) {
                // const actionData = res.data
                dispatch(delAuthorityData(index))
                message.success('删除成功')
            } else {
                message.error(res.message)
            }
        })
    }
}

// 编辑项目权限
export const editAuthorityListItem = (sendData, index) => {
    return (dispatch) => {
        axiosAjax('POST', '/api_game_list', {...sendData}, function (res) {
            if (res.code === 200) {
                // const actionData = res.data
                dispatch(editAuthorityList(sendData, index))
                message.success('修改成功')
            } else {
                message.error(res.message)
            }
        })
    }
}

export const addAuthorityData = (data) => {
    return {type: AUTHORITY.ADD_DATA, data}
}

export const addAuthorityQuery = (data) => {
    return {type: AUTHORITY.ADD_QUERY, data}
}

export const editAuthorityList = (data, index) => {
    return {type: AUTHORITY.EDIT_LIST_ITEM, data, index}
}

export const delAuthorityData = (index) => {
    return {type: AUTHORITY.DEL_LIST_ITEM, index}
}
