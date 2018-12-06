/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {COMMENT} from '../../constants/index'
import { message } from 'antd'

// 帖子列表
export const getCommentList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/comment/showcomment' : '/comment/search'
        axiosAjax('get', _url, !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCommentData({'list': actionData.inforList}))
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
export const getCommentItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCommentData({'info': actionData}))
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
export const getCommentReplyList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addCommentData({'replyList': actionData.datas}))
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
export const delCommentReplyList = (sendData, index, fn) => {
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

// 快速发帖登录
export const _login = (sendData, fn) => {
    return (dispatch) => {
        dispatch(addCommentData({'userInfo': {...sendData}}))
        if (fn) {
            fn()
        }
        /* axiosAjax('post', '/api_game_list', {...sendData}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addCommentData({'userInfo': {...sendData, ...actionData}}))
                if (fn) {
                    fn()
                }
                message.success('登录成功！')
            } else {
                message.error(res.msg)
            }
        }) */
    }
}

export const addCommentData = (data) => {
    return {type: COMMENT.ADD_DATA, data}
}

export const addCommentQuery = (data) => {
    return {type: COMMENT.ADD_QUERY, data}
}

export const editCommentUserInfo = (data) => {
    return {type: COMMENT.EDIT_USER_INFO, data}
}

export const editCommentList = (data, index) => {
    return {type: COMMENT.EDIT_LIST_ITEM, data, index}
}

export const delCommentData = (index) => {
    return {type: COMMENT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: COMMENT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: COMMENT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: COMMENT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: COMMENT.SET_PAGE_DATA, data}
}
