/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {CITY, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getCityList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/activity/getplacelist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCityData({'list': actionData}))
                // dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addCity = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/activity/addplace', {...sendData}, function (res) {
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

// 帖子详情
export const getCityItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCityData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const newsToTop = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/setorder', {...sendData}, function (res) {
            // console.log(res)
            if (res.code === 1) {
                if (parseInt(sendData.topOrder) === 0) {
                    message.success('取消置顶成功！')
                } else {
                    message.success('置顶成功！')
                }
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addCityData = (data) => {
    return {type: CITY.ADD_DATA, data}
}

export const addCityQuery = (data) => {
    return {type: CITY.ADD_QUERY, data}
}

export const editCityUserInfo = (data) => {
    return {type: CITY.EDIT_USER_INFO, data}
}

export const editCityList = (data, index) => {
    return {type: CITY.EDIT_LIST_ITEM, data, index}
}

export const delCityData = (index) => {
    return {type: CITY.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: CITY.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: CITY.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: CITY.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: CITY.SET_PAGE_DATA, data}
}
