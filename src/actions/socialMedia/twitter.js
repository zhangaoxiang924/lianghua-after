/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {TWITTER, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 推特数据列表
export const getTwitterList = (type, sendData, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/crawler/news', !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addTwitterData({'list': actionData.inforList}))
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

// 切换语言
export const editItem = (data, index) => {
    return (dispatch) => {
        dispatch(editTwitterList(data, index))
    }
}

// 主题详情
export const getTwitterItemNum = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/crawler/unreadCount', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addTwitterData({'num': {loaded: true, ...actionData}}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addTwitterData = (data) => {
    return {type: TWITTER.ADD_DATA, data}
}

export const addTwitterQuery = (data) => {
    return {type: TWITTER.ADD_QUERY, data}
}

export const editTwitterUserInfo = (data) => {
    return {type: TWITTER.EDIT_USER_INFO, data}
}

export const editTwitterList = (data, index) => {
    return {type: TWITTER.EDIT_LIST_ITEM, data, index}
}

export const delTwitterData = (index) => {
    return {type: TWITTER.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: TWITTER.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: TWITTER.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: TWITTER.SET_PAGE_DATA, data}
}
