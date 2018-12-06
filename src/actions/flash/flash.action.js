/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {FLASH, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getFlashList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/lives/showlives' : '/post/search'
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
    return {type: FLASH.ADD_DATA, data}
}

export const addFlashQuery = (data) => {
    return {type: FLASH.ADD_QUERY, data}
}

export const editFlashUserInfo = (data) => {
    return {type: FLASH.EDIT_USER_INFO, data}
}

export const editFlashList = (data, index) => {
    return {type: FLASH.EDIT_LIST_ITEM, data, index}
}

export const delFlashData = (index) => {
    return {type: FLASH.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: FLASH.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: FLASH.SET_SEARCH_QUERY, data}
}
export const setPageData = (data) => {
    return {type: FLASH.SET_PAGE_DATA, data}
}
