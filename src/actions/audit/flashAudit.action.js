/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {FLASHAUDIT} from '../../constants/index'
import { message } from 'antd'

// 帖子列表
export const getFlashList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/lives/showpartnerlives' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addFlashData({'list': actionData.inforList || []}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子详情
export const getFlashItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/lives/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addFlashData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addFlashData = (data) => {
    return {type: FLASHAUDIT.ADD_DATA, data}
}

export const addFlashQuery = (data) => {
    return {type: FLASHAUDIT.ADD_QUERY, data}
}

export const editFlashUserInfo = (data) => {
    return {type: FLASHAUDIT.EDIT_USER_INFO, data}
}

export const editFlashList = (data, index) => {
    return {type: FLASHAUDIT.EDIT_LIST_ITEM, data, index}
}

export const delFlashData = (index) => {
    return {type: FLASHAUDIT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: FLASHAUDIT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: FLASHAUDIT.SET_SEARCH_QUERY, data}
}
export const setPageData = (data) => {
    return {type: FLASHAUDIT.SET_PAGE_DATA, data}
}
