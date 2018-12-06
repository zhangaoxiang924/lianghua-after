/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {POSTACCOUNT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 列表
export const getPostAccountList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/account/author/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPostAccountData({'list': actionData.inforList}))
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
        axiosAjax('post', '/account/author/add', {...sendData}, function (res) {
            if (fn) {
                fn(res)
            }
            if (res.code === 1) {
                message.success('添加成功！')
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addPostAccountData = (data) => {
    return {type: POSTACCOUNT.ADD_DATA, data}
}

export const addPostAccountQuery = (data) => {
    return {type: POSTACCOUNT.ADD_QUERY, data}
}

export const editPostAccountUserInfo = (data) => {
    return {type: POSTACCOUNT.EDIT_USER_INFO, data}
}

export const editPostAccountList = (data, index) => {
    return {type: POSTACCOUNT.EDIT_LIST_ITEM, data, index}
}

export const delPostAccountData = (index) => {
    return {type: POSTACCOUNT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: POSTACCOUNT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: POSTACCOUNT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: POSTACCOUNT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: POSTACCOUNT.SET_PAGE_DATA, data}
}
