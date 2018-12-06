/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {STONOTICE, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getStoNoticeList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/stoNotice/listNotice' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (fn) {
                fn(res)
            }
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addStoNoticeData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addWords = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/stoNotice/addNotice', {...sendData}, function (res) {
            if (res.code === 1) {
                message.success('添加成功！')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addStoNoticeData = (data) => {
    return {type: STONOTICE.ADD_DATA, data}
}

export const addStoNoticeQuery = (data) => {
    return {type: STONOTICE.ADD_QUERY, data}
}

export const editStoNoticeUserInfo = (data) => {
    return {type: STONOTICE.EDIT_USER_INFO, data}
}

export const editStoNoticeList = (data, index) => {
    return {type: STONOTICE.EDIT_LIST_ITEM, data, index}
}

export const delStoNoticeData = (index) => {
    return {type: STONOTICE.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: STONOTICE.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: STONOTICE.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: STONOTICE.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: STONOTICE.SET_PAGE_DATA, data}
}
