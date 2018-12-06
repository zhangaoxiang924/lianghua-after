/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {INITGAME} from '../../constants/index'
import {message} from 'antd'

// 列表
export const getInitGameList = (sendData, fun) => {
    return (dispatch) => {
        axiosAjax('get', '/sysinfo/list', {...sendData}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addInitGameData({'list': actionData.datas}))
                fun(res.data)
            } else {
                message.error(res.message)
            }
        })
    }
}

// 游戏信息
export const getInfoById = (sendData, fun) => {
    return (dispatch) => {
        axiosAjax('get', '/sysinfo/getbyid', {...sendData}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addInitGameQuery(actionData))
                fun(res.data)
            } else {
                message.error(res.message)
            }
        })
    }
}

export const addInitGameData = (data) => {
    return {type: INITGAME.ADD_DATA, data}
}

export const addInitGameQuery = (data) => {
    return {type: INITGAME.ADD_QUERY, data}
}

export const editInitGameList = (data, index) => {
    return {type: INITGAME.EDIT_LIST_ITEM, data, index}
}
