/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {VIDEOAUDIT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getVideoAuditList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/video/getvideolist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData, createrType: 1}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addVideoAuditData({'list': actionData.inforList}))
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
export const getVideoAuditItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/video/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addVideoAuditData({'info': actionData}))
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

export const addVideoAuditData = (data) => {
    return {type: VIDEOAUDIT.ADD_DATA, data}
}

export const addVideoAuditQuery = (data) => {
    return {type: VIDEOAUDIT.ADD_QUERY, data}
}

export const editVideoAuditUserInfo = (data) => {
    return {type: VIDEOAUDIT.EDIT_USER_INFO, data}
}

export const editVideoAuditList = (data, index) => {
    return {type: VIDEOAUDIT.EDIT_LIST_ITEM, data, index}
}

export const delVideoAuditData = (index) => {
    return {type: VIDEOAUDIT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: VIDEOAUDIT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: VIDEOAUDIT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: VIDEOAUDIT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: VIDEOAUDIT.SET_PAGE_DATA, data}
}
