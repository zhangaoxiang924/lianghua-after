/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {LIVEUSER, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 用户列表
export const getLiveUserList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/caster/user/list' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addLiveUserData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.totalCount, 'pageSize': actionData.pageSize, 'page': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 用户详情
export const getLiveUserItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/caster/user/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addLiveUserData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addLiveUserData = (data) => {
    return {type: LIVEUSER.ADD_DATA, data}
}

export const addLiveUserQuery = (data) => {
    return {type: LIVEUSER.ADD_QUERY, data}
}

export const editLiveUserUserInfo = (data) => {
    return {type: LIVEUSER.EDIT_USER_INFO, data}
}

export const editLiveUserList = (data, index) => {
    return {type: LIVEUSER.EDIT_LIST_ITEM, data, index}
}

export const delLiveUserData = (index) => {
    return {type: LIVEUSER.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: LIVEUSER.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: LIVEUSER.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: LIVEUSER.SET_PAGE_DATA, data}
}
