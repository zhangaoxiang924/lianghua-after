/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {MANAGERACCOUNT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getManagerAccountList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/account/editor/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (fn) {
                fn(res)
            }
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addManagerAccountData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addAccount = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/account/editor/updaterole', {...sendData}, function (res) {
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

export const addManagerAccountData = (data) => {
    return {type: MANAGERACCOUNT.ADD_DATA, data}
}

export const addManagerAccountQuery = (data) => {
    return {type: MANAGERACCOUNT.ADD_QUERY, data}
}

export const editManagerAccountUserInfo = (data) => {
    return {type: MANAGERACCOUNT.EDIT_USER_INFO, data}
}

export const editManagerAccountList = (data, index) => {
    return {type: MANAGERACCOUNT.EDIT_LIST_ITEM, data, index}
}

export const delManagerAccountData = (index) => {
    return {type: MANAGERACCOUNT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: MANAGERACCOUNT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: MANAGERACCOUNT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: MANAGERACCOUNT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: MANAGERACCOUNT.SET_PAGE_DATA, data}
}
