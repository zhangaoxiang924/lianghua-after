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
        let _url = type === 'init' ? '/banner/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addBannerData({'list': actionData}))
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

// 有一些不用的actions并未删除 留作备用
export const addBannerData = (data) => {
    return {type: BANNER.ADD_DATA, data}
}

// 设置搜索条件用
export const setSearchQuery = (data) => {
    return {type: BANNER.SET_SEARCH_QUERY, data}
}

// 设置过滤条件用
export const setFilterData = (data) => {
    return {type: BANNER.SET_FILTER_DATA, data}
}

// 设置页数总页数用
export const setPageData = (data) => {
    return {type: BANNER.SET_PAGE_DATA, data}
}
