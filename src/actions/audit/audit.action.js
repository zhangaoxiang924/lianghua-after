/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {AUDIT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 认证列表
export const getAuditList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/account/getrealauthlist' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAuditData({'list': actionData.inforList}))
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

export const addAuditData = (data) => {
    return {type: AUDIT.ADD_DATA, data}
}

export const addAuditQuery = (data) => {
    return {type: AUDIT.ADD_QUERY, data}
}

export const editAuditUserInfo = (data) => {
    return {type: AUDIT.EDIT_USER_INFO, data}
}

export const editAuditList = (data, index) => {
    return {type: AUDIT.EDIT_LIST_ITEM, data, index}
}

export const delAuditData = (index) => {
    return {type: AUDIT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: AUDIT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: AUDIT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: AUDIT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: AUDIT.SET_PAGE_DATA, data}
}
