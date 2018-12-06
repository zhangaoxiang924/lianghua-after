/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {HOTAUTHORANDTAGS, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 列表
export const getHotAuthorAndTagsList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/news/tags/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addHotAuthorAndTagsData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addHotAuthorAndTagsData = (data) => {
    return {type: HOTAUTHORANDTAGS.ADD_DATA, data}
}

export const addHotAuthorAndTagsQuery = (data) => {
    return {type: HOTAUTHORANDTAGS.ADD_QUERY, data}
}

export const editHotAuthorAndTagsUserInfo = (data) => {
    return {type: HOTAUTHORANDTAGS.EDIT_USER_INFO, data}
}

export const editHotAuthorAndTagsList = (data, index) => {
    return {type: HOTAUTHORANDTAGS.EDIT_LIST_ITEM, data, index}
}

export const delHotAuthorAndTagsData = (index) => {
    return {type: HOTAUTHORANDTAGS.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: HOTAUTHORANDTAGS.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: HOTAUTHORANDTAGS.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: HOTAUTHORANDTAGS.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: HOTAUTHORANDTAGS.SET_PAGE_DATA, data}
}
