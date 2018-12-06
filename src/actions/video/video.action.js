/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {VIDEO, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getVideoList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/video/getvideolist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addVideoData({'list': actionData.inforList}))
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
export const getVideoItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/video/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addVideoData({'info': actionData}))
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

export const addVideoData = (data) => {
    return {type: VIDEO.ADD_DATA, data}
}

export const addVideoQuery = (data) => {
    return {type: VIDEO.ADD_QUERY, data}
}

export const editVideoUserInfo = (data) => {
    return {type: VIDEO.EDIT_USER_INFO, data}
}

export const editVideoList = (data, index) => {
    return {type: VIDEO.EDIT_LIST_ITEM, data, index}
}

export const delVideoData = (index) => {
    return {type: VIDEO.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: VIDEO.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: VIDEO.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: VIDEO.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: VIDEO.SET_PAGE_DATA, data}
}
