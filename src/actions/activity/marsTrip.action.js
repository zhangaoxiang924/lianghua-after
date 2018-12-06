/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {MARSTRIP, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getMarsTripList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/marschinatrip/searchcitypeople' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addMarsTripData({'list': actionData.inforList}))
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

export const addTrip = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/marschinatrip/addcity', {...sendData}, function (res) {
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

export const addMarsTripData = (data) => {
    return {type: MARSTRIP.ADD_DATA, data}
}

export const addMarsTripQuery = (data) => {
    return {type: MARSTRIP.ADD_QUERY, data}
}

export const editMarsTripUserInfo = (data) => {
    return {type: MARSTRIP.EDIT_USER_INFO, data}
}

export const editMarsTripList = (data, index) => {
    return {type: MARSTRIP.EDIT_LIST_ITEM, data, index}
}

export const delMarsTripData = (index) => {
    return {type: MARSTRIP.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: MARSTRIP.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: MARSTRIP.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: MARSTRIP.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: MARSTRIP.SET_PAGE_DATA, data}
}
