/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {USERPOST} from '../../constants/index'
import { message } from 'antd'

// 发帖用户帖子列表
export const getUserList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/user/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addUserPostData({'list': !actionData ? [] : actionData.datas}))
                dispatch(setUserPage({'totalCount': actionData.totalCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentIndex}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子列表
export const getPostList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/post/getByUserName', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addUserPostData({'postList': actionData.datas}))
                dispatch(setPostPage({'totalCount': actionData.totalCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentIndex}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 评论列表
export const getCommentList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/reply/getByUserName', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addUserPostData({'commentList': actionData.datas}))
                dispatch(setReviewPage({'totalCount': actionData.totalCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentIndex}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 禁用/启用
export const changeUserStatus = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/user/forbid', {...sendData, appId: $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                // const actionData = res.data
                if (fn) {
                    fn()
                }
                // message.success('删除成功')
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子用户信息
export const getUserInfo = (sendData) => {
    return (dispatch) => {
        axiosAjax('post', '/user/getbyid', {...sendData}, function (res) {
            if (res.status === 200) {
                dispatch(addUserPostData({'query': res.data}))
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 删除帖子
export const delPostListItem = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/post/del', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                message.success('删除成功')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 删除评论
export const delCommentListItem = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/reply/del', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                message.success('删除成功')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addUserPostData = (data) => {
    return {type: USERPOST.ADD_DATA, data}
}

export const addUserPostQuery = (data) => {
    return {type: USERPOST.ADD_QUERY, data}
}

export const editUserList = (data, index) => {
    return {type: USERPOST.EDIT_USER_LIST_ITEM, index}
}

export const editPostList = (data, index) => {
    return {type: USERPOST.EDIT_USER_POST_LIST_ITEM, data, index}
}

export const editCommentList = (data, index) => {
    return {type: USERPOST.EDIT_COMMENT_LIST_ITEM, data, index}
}

export const delPostData = (index) => {
    return {type: USERPOST.DEL_USER_POST_LIST_ITEM, index}
}

export const delCommentData = (index) => {
    return {type: USERPOST.DEL_COMMENT_LIST_ITEM, index}
}

// search
export const setUserSearch = (data) => {
    return {type: USERPOST.SET_SEARCH_QUERY, data}
}

// page
export const setUserPage = (data) => {
    return {type: USERPOST.SET_PAGE_DATA, data}
}
export const setPostPage = (data) => {
    return {type: USERPOST.SET_POST_LIST_PAGE_DATA, data}
}
export const setReviewPage = (data) => {
    return {type: USERPOST.SET_COMMENT_LIST_PAGE_DATA, data}
}
