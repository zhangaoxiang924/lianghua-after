/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {WORDSFILTER, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getWordsFilterList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/sensitiveword/showsensitiveword' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addWordsFilterData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addWords = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/sensitiveword/addsensitiveword', {...sendData}, function (res) {
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

export const addWordsFilterData = (data) => {
    return {type: WORDSFILTER.ADD_DATA, data}
}

export const addWordsFilterQuery = (data) => {
    return {type: WORDSFILTER.ADD_QUERY, data}
}

export const editWordsFilterUserInfo = (data) => {
    return {type: WORDSFILTER.EDIT_USER_INFO, data}
}

export const editWordsFilterList = (data, index) => {
    return {type: WORDSFILTER.EDIT_LIST_ITEM, data, index}
}

export const delWordsFilterData = (index) => {
    return {type: WORDSFILTER.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: WORDSFILTER.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: WORDSFILTER.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: WORDSFILTER.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: WORDSFILTER.SET_PAGE_DATA, data}
}
