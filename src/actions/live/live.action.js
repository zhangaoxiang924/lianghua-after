/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {LIVE, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 直播列表
export const getLiveList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/caster/room/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addLiveData({'list': actionData.inforList}))
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

// 主持人/嘉宾获取
export const getDepartLiveUserList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/caster/usertype/list', sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                if (parseInt(sendData.type) === 1) {
                    dispatch({
                        type: LIVE.GET_GUEST_LIST,
                        actionData
                    })
                } else {
                    dispatch({
                        type: LIVE.GET_ZCR_LIST,
                        actionData
                    })
                }
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 直播详情
export const getLiveItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/caster/room/one', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addLiveData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addLiveData = (data) => {
    return {type: LIVE.ADD_DATA, data}
}

export const addLiveQuery = (data) => {
    return {type: LIVE.ADD_QUERY, data}
}

export const editLiveUserInfo = (data) => {
    return {type: LIVE.EDIT_USER_INFO, data}
}

export const editLiveList = (data, index) => {
    return {type: LIVE.EDIT_LIST_ITEM, data, index}
}

export const delLiveData = (index) => {
    return {type: LIVE.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: LIVE.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: LIVE.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: LIVE.SET_PAGE_DATA, data}
}
