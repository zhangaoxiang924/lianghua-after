/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {VERSION, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getVersionList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/app/version/listcontent' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addVersionData({'list': actionData}))
                // dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addContent = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/app/version/addcontent ', {...sendData}, function (res) {
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

export const addVersionData = (data) => {
    return {type: VERSION.ADD_DATA, data}
}

export const addVersionQuery = (data) => {
    return {type: VERSION.ADD_QUERY, data}
}

export const editVersionUserInfo = (data) => {
    return {type: VERSION.EDIT_USER_INFO, data}
}

export const editVersionList = (data, index) => {
    return {type: VERSION.EDIT_LIST_ITEM, data, index}
}

export const delVersionData = (index) => {
    return {type: VERSION.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: VERSION.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: VERSION.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: VERSION.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: VERSION.SET_PAGE_DATA, data}
}
