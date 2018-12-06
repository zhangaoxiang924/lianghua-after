/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {ADDATA, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getAdDataList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/statistic/page' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAdDataData({'list': actionData.inforList || []}))
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

// 新增数据
export const addAdData = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/statistic/create', {...sendData}, (res) => {
            if (res.code === 1) {
                message.success('添加成功!')
            }
            if (fn) {
                fn(res)
            }
        })
    }
}

// 数据详情
export const getAdDataItemInfo = (type, sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/statistic/detailPage', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAdDataData({'listDetail': actionData.inforList || []}))
                dispatch(setPageDetailData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(res)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addAdDataData = (data) => {
    return {type: ADDATA.ADD_DATA, data}
}

export const addAdDataQuery = (data) => {
    return {type: ADDATA.ADD_QUERY, data}
}

export const editAdDataUserInfo = (data) => {
    return {type: ADDATA.EDIT_USER_INFO, data}
}

export const editAdDataList = (data, index) => {
    return {type: ADDATA.EDIT_LIST_ITEM, data, index}
}

export const delAdDataData = (index) => {
    return {type: ADDATA.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: ADDATA.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: ADDATA.SET_SEARCH_QUERY, data}
}
export const setPageData = (data) => {
    return {type: ADDATA.SET_PAGE_DATA, data}
}
export const setPageDetailData = (data) => {
    return {type: ADDATA.SET_PAGE_DETAIL_DATA, data}
}
