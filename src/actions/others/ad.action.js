/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {AD, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 帖子列表
export const getAdList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/ad/showadlist' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAdData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize || 20, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子详情
export const getAdItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/ad/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAdData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 回复分页
export const getAdReplyList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addAdData({'replyList': actionData.datas}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 删除回复
export const delAdReplyList = (sendData, index, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/del', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                dispatch(delReplyList(index))
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addAdData = (data) => {
    return {type: AD.ADD_DATA, data}
}

export const addAdQuery = (data) => {
    return {type: AD.ADD_QUERY, data}
}

export const editAdUserInfo = (data) => {
    return {type: AD.EDIT_USER_INFO, data}
}

export const editAdList = (data, index) => {
    return {type: AD.EDIT_LIST_ITEM, data, index}
}

export const delAdData = (index) => {
    return {type: AD.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: AD.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: AD.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: AD.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: AD.SET_PAGE_DATA, data}
}
