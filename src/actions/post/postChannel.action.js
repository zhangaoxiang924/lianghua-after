/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {CHANNEL, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getChannelList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/news/channel/showchannelist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addChannelData({'list': actionData.inforList}))
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

export const addChannel = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/channel/add', {...sendData}, function (res) {
            if (res.code === 1) {
                message.success('添加成功！')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子详情
export const getChannelItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addChannelData({'info': actionData}))
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

export const addChannelData = (data) => {
    return {type: CHANNEL.ADD_DATA, data}
}

export const addChannelQuery = (data) => {
    return {type: CHANNEL.ADD_QUERY, data}
}

export const editChannelUserInfo = (data) => {
    return {type: CHANNEL.EDIT_USER_INFO, data}
}

export const editChannelList = (data, index) => {
    return {type: CHANNEL.EDIT_LIST_ITEM, data, index}
}

export const delChannelData = (index) => {
    return {type: CHANNEL.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: CHANNEL.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: CHANNEL.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: CHANNEL.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: CHANNEL.SET_PAGE_DATA, data}
}
