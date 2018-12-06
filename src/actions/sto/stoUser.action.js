/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {STOUSER, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 用户列表
export const getStoUserList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/guestInfo/listGuest' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addStoUserData({'list': actionData.inforList}))
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
export const getStoUserItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/guestInfo/getGuest', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addStoUserData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addStoUserData = (data) => {
    return {type: STOUSER.ADD_DATA, data}
}

export const addStoUserQuery = (data) => {
    return {type: STOUSER.ADD_QUERY, data}
}

export const editStoUserUserInfo = (data) => {
    return {type: STOUSER.EDIT_USER_INFO, data}
}

export const editStoUserList = (data, index) => {
    return {type: STOUSER.EDIT_LIST_ITEM, data, index}
}

export const delStoUserData = (index) => {
    return {type: STOUSER.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: STOUSER.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: STOUSER.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: STOUSER.SET_PAGE_DATA, data}
}
