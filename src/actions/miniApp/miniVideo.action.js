/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {MINIVIDEO, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getMiniVideoList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/miniappvideo/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addMiniVideoData({'list': actionData.inforList}))
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
export const getMiniVideoItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/miniappvideo/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addMiniVideoData({'info': actionData}))
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

export const addMiniVideoData = (data) => {
    return {type: MINIVIDEO.ADD_DATA, data}
}

export const addMiniVideoQuery = (data) => {
    return {type: MINIVIDEO.ADD_QUERY, data}
}

export const editMiniVideoUserInfo = (data) => {
    return {type: MINIVIDEO.EDIT_USER_INFO, data}
}

export const editMiniVideoList = (data, index) => {
    return {type: MINIVIDEO.EDIT_LIST_ITEM, data, index}
}

export const delMiniVideoData = (index) => {
    return {type: MINIVIDEO.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: MINIVIDEO.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: MINIVIDEO.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: MINIVIDEO.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: MINIVIDEO.SET_PAGE_DATA, data}
}
