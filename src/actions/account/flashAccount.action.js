/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {FLASHACCOUNT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getFlashAccountList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/liveaccount/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addFlashAccountData({'list': actionData.inforList}))
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

export const addAccount = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/liveaccount/addeditor', {...sendData}, function (res) {
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

export const addFlashAccountData = (data) => {
    return {type: FLASHACCOUNT.ADD_DATA, data}
}

export const addFlashAccountQuery = (data) => {
    return {type: FLASHACCOUNT.ADD_QUERY, data}
}

export const editFlashAccountUserInfo = (data) => {
    return {type: FLASHACCOUNT.EDIT_USER_INFO, data}
}

export const editFlashAccountList = (data, index) => {
    return {type: FLASHACCOUNT.EDIT_LIST_ITEM, data, index}
}

export const delFlashAccountData = (index) => {
    return {type: FLASHACCOUNT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: FLASHACCOUNT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: FLASHACCOUNT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: FLASHACCOUNT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: FLASHACCOUNT.SET_PAGE_DATA, data}
}
