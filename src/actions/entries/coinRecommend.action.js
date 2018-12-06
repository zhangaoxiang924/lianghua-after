/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {COINRECOMMEND, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getCoinRecommendList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/coin/recommend/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCoinRecommendData({'list': actionData}))
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
        axiosAjax('post', '/coin/recommend/add', {...sendData}, function (res) {
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

export const addCoinRecommendData = (data) => {
    return {type: COINRECOMMEND.ADD_DATA, data}
}

export const addCoinRecommendQuery = (data) => {
    return {type: COINRECOMMEND.ADD_QUERY, data}
}

export const editCoinRecommendUserInfo = (data) => {
    return {type: COINRECOMMEND.EDIT_USER_INFO, data}
}

export const editCoinRecommendList = (data, index) => {
    return {type: COINRECOMMEND.EDIT_LIST_ITEM, data, index}
}

export const delCoinRecommendData = (index) => {
    return {type: COINRECOMMEND.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: COINRECOMMEND.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: COINRECOMMEND.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: COINRECOMMEND.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: COINRECOMMEND.SET_PAGE_DATA, data}
}
