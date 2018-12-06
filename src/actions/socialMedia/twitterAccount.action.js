
/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {TWITTERACCOUNT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getTwitterAccountList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/crawler/social/source/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addTwitterAccountData({'list': actionData.inforList}))
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
        axiosAjax('post', '/crawler/social/source/add', {...sendData}, function (res) {
            if (fn) {
                fn()
            }
            if (res.code === 1) {
                message.success('添加成功！')
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addTwitterAccountData = (data) => {
    return {type: TWITTERACCOUNT.ADD_DATA, data}
}

export const addTwitterAccountQuery = (data) => {
    return {type: TWITTERACCOUNT.ADD_QUERY, data}
}

export const editTwitterAccountUserInfo = (data) => {
    return {type: TWITTERACCOUNT.EDIT_USER_INFO, data}
}

export const editTwitterAccountList = (data, index) => {
    return {type: TWITTERACCOUNT.EDIT_LIST_ITEM, data, index}
}

export const delTwitterAccountData = (index) => {
    return {type: TWITTERACCOUNT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: TWITTERACCOUNT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: TWITTERACCOUNT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: TWITTERACCOUNT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: TWITTERACCOUNT.SET_PAGE_DATA, data}
}
