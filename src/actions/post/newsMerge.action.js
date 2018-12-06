/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {NEWSMERGE, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 主体列表
export const getNewsMergeList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/publicnum/showpublicnumlist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addNewsMergeData({'list': actionData.inforList}))
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

// 主体中新闻列表
export const getNewsInMerge = (sendData, fn) => {
    return (dispatch) => {
        let _url = '/merge/parseurllist'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addNewsMergeData({'contentList': actionData}))
                // dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
            } else {
                message.error(res.msg)
            }
            if (fn) {
                fn(res)
            }
        })
    }
}

// 主题详情
export const getNewsMergeItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/topic/querytopic', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addNewsMergeData({'info': actionData}))
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
                dispatch(addNewsMergeData({'contentList': actionData.inforList}))
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

export const addNewsMergeData = (data) => {
    return {type: NEWSMERGE.ADD_DATA, data}
}

export const addNewsMergeQuery = (data) => {
    return {type: NEWSMERGE.ADD_QUERY, data}
}

export const editNewsMergeUserInfo = (data) => {
    return {type: NEWSMERGE.EDIT_USER_INFO, data}
}

export const editNewsMergeList = (data, index) => {
    return {type: NEWSMERGE.EDIT_LIST_ITEM, data, index}
}

export const delNewsMergeData = (index) => {
    return {type: NEWSMERGE.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: NEWSMERGE.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: NEWSMERGE.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: NEWSMERGE.SET_PAGE_DATA, data}
}
