/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {ACTIVITYPUBLISH, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getActivityPublishList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/activity/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addActivityPublishData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                res.msg && message.error(res.msg)
            }
        })
    }
}

// 帖子详情
export const getActivityPublishItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/activity/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addActivityPublishData({'info': actionData}))
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
            dispatch(addActivityPublishData({'info': JSON.parse(article)}))
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
                dispatch(addActivityPublishData({'info': actionData}))
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
export const getActivityPublishReplyList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addActivityPublishData({'replyList': actionData.datas}))
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
        axiosAjax('post', '/activity/settoporder', {...sendData}, function (res) {
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

export const addActivityPublishData = (data) => {
    return {type: ACTIVITYPUBLISH.ADD_DATA, data}
}

export const addActivityPublishQuery = (data) => {
    return {type: ACTIVITYPUBLISH.ADD_QUERY, data}
}

export const editActivityPublishUserInfo = (data) => {
    return {type: ACTIVITYPUBLISH.EDIT_USER_INFO, data}
}

export const editActivityPublishList = (data, index) => {
    return {type: ACTIVITYPUBLISH.EDIT_LIST_ITEM, data, index}
}

export const delActivityPublishData = (index) => {
    return {type: ACTIVITYPUBLISH.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: ACTIVITYPUBLISH.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: ACTIVITYPUBLISH.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: ACTIVITYPUBLISH.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: ACTIVITYPUBLISH.SET_PAGE_DATA, data}
}
