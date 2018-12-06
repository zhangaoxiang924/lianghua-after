/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {APPOPENCOINRECOMMEND, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getAppOpenCoinRecommendList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/coin/weight/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAppOpenCoinRecommendData({'list': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addCoin = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/coin/weight/update', {...sendData}, function (res) {
            if (res.code === 1) {
                message.success('操作成功！')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addAppOpenCoinRecommendData = (data) => {
    return {type: APPOPENCOINRECOMMEND.ADD_DATA, data}
}

export const addAppOpenCoinRecommendQuery = (data) => {
    return {type: APPOPENCOINRECOMMEND.ADD_QUERY, data}
}

export const editAppOpenCoinRecommendUserInfo = (data) => {
    return {type: APPOPENCOINRECOMMEND.EDIT_USER_INFO, data}
}

export const editAppOpenCoinRecommendList = (data, index) => {
    return {type: APPOPENCOINRECOMMEND.EDIT_LIST_ITEM, data, index}
}

export const delAppOpenCoinRecommendData = (index) => {
    return {type: APPOPENCOINRECOMMEND.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: APPOPENCOINRECOMMEND.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: APPOPENCOINRECOMMEND.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: APPOPENCOINRECOMMEND.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: APPOPENCOINRECOMMEND.SET_PAGE_DATA, data}
}
