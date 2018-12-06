/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {HOTCOIN, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getHotCoinList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/coin/getcoinhotkeyslist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addHotCoinData({'list': actionData.inforList}))
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

export const addCoin = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/coin/addcoinhotkeys', {...sendData}, function (res) {
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

export const addHotCoinData = (data) => {
    return {type: HOTCOIN.ADD_DATA, data}
}

export const addHotCoinQuery = (data) => {
    return {type: HOTCOIN.ADD_QUERY, data}
}

export const editHotCoinUserInfo = (data) => {
    return {type: HOTCOIN.EDIT_USER_INFO, data}
}

export const editHotCoinList = (data, index) => {
    return {type: HOTCOIN.EDIT_LIST_ITEM, data, index}
}

export const delHotCoinData = (index) => {
    return {type: HOTCOIN.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: HOTCOIN.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: HOTCOIN.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: HOTCOIN.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: HOTCOIN.SET_PAGE_DATA, data}
}
