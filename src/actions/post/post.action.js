/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {POST, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getPostList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/news/shownews' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPostData({'list': actionData.inforList}))
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
export const getPostItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPostData({'info': actionData}))
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
            dispatch(addPostData({'info': JSON.parse(article)}))
            if (fn) {
                fn(JSON.parse(article))
            }
        }
    }
}

// 获取twitter聚合的数据
export const getTwitterInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/crawler/social/source/importNewsInfo', {...sendData}, function (res) {
            fn && fn(res.obj)
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPostData({'info': actionData}))
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 聚合帖子详情
export const getMergeNewsInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/merge/parseurl', {...sendData}, function (res) {
            fn && fn(res.obj)
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPostData({'info': actionData}))
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 回复分页
export const getPostReplyList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addPostData({'replyList': actionData.datas}))
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

export const addPostData = (data) => {
    return {type: POST.ADD_DATA, data}
}

export const addPostQuery = (data) => {
    return {type: POST.ADD_QUERY, data}
}

export const editPostUserInfo = (data) => {
    return {type: POST.EDIT_USER_INFO, data}
}

export const editPostList = (data, index) => {
    return {type: POST.EDIT_LIST_ITEM, data, index}
}

export const delPostData = (index) => {
    return {type: POST.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: POST.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: POST.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: POST.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: POST.SET_PAGE_DATA, data}
}
