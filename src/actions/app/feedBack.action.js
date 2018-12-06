/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {FEEDBACK, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 帖子列表
export const getFeedBackList = (type, sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/feedback/list', !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addFeedBackData({'list': actionData.inforList}))
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
export const getFeedBackItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/ad/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addFeedBackData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addFeedBackData = (data) => {
    return {type: FEEDBACK.ADD_DATA, data}
}

export const addFeedBackQuery = (data) => {
    return {type: FEEDBACK.ADD_QUERY, data}
}

export const delFeedBackData = (index) => {
    return {type: FEEDBACK.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: FEEDBACK.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: FEEDBACK.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: FEEDBACK.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: FEEDBACK.SET_PAGE_DATA, data}
}
