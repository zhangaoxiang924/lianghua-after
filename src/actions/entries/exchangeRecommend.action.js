/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {EXCHANGERECOMMEND, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 列表
export const getExchangeRecommendList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/coin/summary/market_list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addExchangeRecommendData({'list': actionData}))
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
        axiosAjax('post', '/coin/summary/market_add', {...sendData}, function (res) {
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

export const addExchangeRecommendData = (data) => {
    return {type: EXCHANGERECOMMEND.ADD_DATA, data}
}

export const addExchangeRecommendQuery = (data) => {
    return {type: EXCHANGERECOMMEND.ADD_QUERY, data}
}

export const editExchangeRecommendUserInfo = (data) => {
    return {type: EXCHANGERECOMMEND.EDIT_USER_INFO, data}
}

export const editExchangeRecommendList = (data, index) => {
    return {type: EXCHANGERECOMMEND.EDIT_LIST_ITEM, data, index}
}

export const delExchangeRecommendData = (index) => {
    return {type: EXCHANGERECOMMEND.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: EXCHANGERECOMMEND.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: EXCHANGERECOMMEND.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: EXCHANGERECOMMEND.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: EXCHANGERECOMMEND.SET_PAGE_DATA, data}
}
