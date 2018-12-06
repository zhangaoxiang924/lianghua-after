/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {MINIAPP, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getMiniAppList = (type, sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/miniapp/getlist', !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addMiniAppData({'list': actionData.inforList}))
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

// 帖子详情
export const getMiniAppItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addMiniAppData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 获取缓存数据
export const getLocalInfo = (sendData, fn) => {
    return (dispatch) => {
        let article = localStorage.getItem('articleData')
        if (!article) {
            return false
        } else {
            dispatch(addMiniAppData({'info': JSON.parse(article)}))
            if (fn) {
                fn(JSON.parse(article))
            }
        }
    }
}
// 聚合帖子详情
export const getMergeNewsInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/merge/parseurl', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addMiniAppData({'info': actionData}))
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
export const getMiniAppReplyList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addMiniAppData({'replyList': actionData.datas}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const newsToTop = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/setorder', {...sendData}, function (res) {
            // console.log(res)
            if (res.code === 1) {
                if (parseInt(sendData.topOrder) === 0) {
                    message.success('取消置顶成功！')
                } else {
                    message.success('置顶成功！')
                }
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addMiniAppData = (data) => {
    return {type: MINIAPP.ADD_DATA, data}
}

export const addMiniAppQuery = (data) => {
    return {type: MINIAPP.ADD_QUERY, data}
}

export const editMiniAppUserInfo = (data) => {
    return {type: MINIAPP.EDIT_USER_INFO, data}
}

export const editMiniAppList = (data, index) => {
    return {type: MINIAPP.EDIT_LIST_ITEM, data, index}
}

export const delMiniAppData = (index) => {
    return {type: MINIAPP.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: MINIAPP.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: MINIAPP.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: MINIAPP.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: MINIAPP.SET_PAGE_DATA, data}
}
