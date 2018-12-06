/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {BANNER, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 列表
export const getBannerList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/homerecommend/gethomerecommendlist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addBannerData({'list': actionData.inforList}))
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

// 主题详情
export const getBannerItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/homerecommend/gethomerecommendbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addBannerData({'info': actionData}))
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
export const getTopNum = (position, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/homerecommend/gethomerecommendshownum', {position: position}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch({
                    type: BANNER.GET_TOP_NUM,
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

export const addBannerData = (data) => {
    return {type: BANNER.ADD_DATA, data}
}

export const addBannerQuery = (data) => {
    return {type: BANNER.ADD_QUERY, data}
}

export const editBannerUserInfo = (data) => {
    return {type: BANNER.EDIT_USER_INFO, data}
}

export const editBannerList = (data, index) => {
    return {type: BANNER.EDIT_LIST_ITEM, data, index}
}

export const delBannerData = (index) => {
    return {type: BANNER.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: BANNER.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: BANNER.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: BANNER.SET_PAGE_DATA, data}
}
