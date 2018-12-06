/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {OFFICIALAUDIT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 认证列表
export const getOfficialAuditList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/account/noVerificationlist' : '/post/search'
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
    return {type: OFFICIALAUDIT.ADD_DATA, data}
}

export const addAuditQuery = (data) => {
    return {type: OFFICIALAUDIT.ADD_QUERY, data}
}

export const editAuditUserInfo = (data) => {
    return {type: OFFICIALAUDIT.EDIT_USER_INFO, data}
}

export const editAuditList = (data, index) => {
    return {type: OFFICIALAUDIT.EDIT_LIST_ITEM, data, index}
}

export const delAuditData = (index) => {
    return {type: OFFICIALAUDIT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: OFFICIALAUDIT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: OFFICIALAUDIT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: OFFICIALAUDIT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: OFFICIALAUDIT.SET_PAGE_DATA, data}
}
