/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {COUNT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 帖子列表
export const getCountList = (sendData, fn) => {
    return (dispatch) => {
        let _url = '/news/getcountinfo'
        axiosAjax('post', _url, !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCountData({'list': actionData}))
                // dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize || 20, 'currPage': actionData.currentPage}))
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

export const addCountData = (data) => {
    return {type: COUNT.ADD_DATA, data}
}

export const addCountQuery = (data) => {
    return {type: COUNT.ADD_QUERY, data}
}

export const editCountUserInfo = (data) => {
    return {type: COUNT.EDIT_USER_INFO, data}
}

export const editCountList = (data, index) => {
    return {type: COUNT.EDIT_LIST_ITEM, data, index}
}

export const delCountData = (index) => {
    return {type: COUNT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: COUNT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: COUNT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: COUNT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: COUNT.SET_PAGE_DATA, data}
}
