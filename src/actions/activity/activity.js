/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {ACTIVITY, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 列表
export const getActivityList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/specialtopic/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addActivityData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                res.msg && message.error(res.msg)
            }
        })
    }
}

// 主题详情
export const getActivityItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/specialtopic/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addActivityData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                res.msg && message.error(res.msg)
            }
        })
    }
}

// 获取占位数
export const getTopNum = (fn) => {
    return (dispatch) => {
        axiosAjax('get', '/homerecommend/gethomerecommendshownum', {}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch({
                    type: ACTIVITY.GET_TOP_NUM,
                    actionData
                })
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addActivityData = (data) => {
    return {type: ACTIVITY.ADD_DATA, data}
}

export const addActivityQuery = (data) => {
    return {type: ACTIVITY.ADD_QUERY, data}
}

export const editActivityUserInfo = (data) => {
    return {type: ACTIVITY.EDIT_USER_INFO, data}
}

export const editActivityList = (data, index) => {
    return {type: ACTIVITY.EDIT_LIST_ITEM, data, index}
}

export const delActivityData = (index) => {
    return {type: ACTIVITY.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: ACTIVITY.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: ACTIVITY.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: ACTIVITY.SET_PAGE_DATA, data}
}
