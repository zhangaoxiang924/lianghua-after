/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {COLUMNAUTHOR, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 直播列表
export const getColumnAuthorList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/author/recommendlist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addColumnAuthorData({'list': actionData.inforList}))
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

// 获取占位数
export const getAuthorNum = (fn) => {
    return (dispatch) => {
        axiosAjax('get', '/author/recommendnum', {}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch({
                    type: COLUMNAUTHOR.GET_TOP_NUM,
                    actionData
                })
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 主题详情
export const getColumnAuthorItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/topic/querytopic', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addColumnAuthorData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 内容列表
export const getTopicContentList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/topic/querycontent' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addColumnAuthorData({'contentList': actionData.inforList}))
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

export const addColumnAuthorData = (data) => {
    return {type: COLUMNAUTHOR.ADD_DATA, data}
}

export const addColumnAuthorQuery = (data) => {
    return {type: COLUMNAUTHOR.ADD_QUERY, data}
}

export const editColumnAuthorUserInfo = (data) => {
    return {type: COLUMNAUTHOR.EDIT_USER_INFO, data}
}

export const editColumnAuthorList = (data, index) => {
    return {type: COLUMNAUTHOR.EDIT_LIST_ITEM, data, index}
}

export const delColumnAuthorData = (index) => {
    return {type: COLUMNAUTHOR.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: COLUMNAUTHOR.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: COLUMNAUTHOR.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: COLUMNAUTHOR.SET_PAGE_DATA, data}
}
