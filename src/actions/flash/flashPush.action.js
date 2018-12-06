/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {FLASHPUSH, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getFlashPushList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/lives/publish/getrecordList' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addFlashPushData({'list': actionData.inforList}))
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

export const addFlashPush = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/lives/publish', {...sendData}, function (res) {
            if (res.code === 1) {
                message.success('推送成功！')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addFlashPushData = (data) => {
    return {type: FLASHPUSH.ADD_DATA, data}
}

export const addFlashPushQuery = (data) => {
    return {type: FLASHPUSH.ADD_QUERY, data}
}

export const editFlashPushUserInfo = (data) => {
    return {type: FLASHPUSH.EDIT_USER_INFO, data}
}

export const editFlashPushList = (data, index) => {
    return {type: FLASHPUSH.EDIT_LIST_ITEM, data, index}
}

export const delFlashPushData = (index) => {
    return {type: FLASHPUSH.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: FLASHPUSH.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: FLASHPUSH.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: FLASHPUSH.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: FLASHPUSH.SET_PAGE_DATA, data}
}
