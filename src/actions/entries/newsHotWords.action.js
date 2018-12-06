/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {NEWSHOTWORDS, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getHotWordsList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/hotkeys/gethotkeyslist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addHotWordsData({'list': actionData.inforList}))
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

export const addWords = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/hotkeys/addhotkeys', {...sendData}, function (res) {
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

export const addHotWordsData = (data) => {
    return {type: NEWSHOTWORDS.ADD_DATA, data}
}

export const addHotWordsQuery = (data) => {
    return {type: NEWSHOTWORDS.ADD_QUERY, data}
}

export const editHotWordsUserInfo = (data) => {
    return {type: NEWSHOTWORDS.EDIT_USER_INFO, data}
}

export const editHotWordsList = (data, index) => {
    return {type: NEWSHOTWORDS.EDIT_LIST_ITEM, data, index}
}

export const delHotWordsData = (index) => {
    return {type: NEWSHOTWORDS.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: NEWSHOTWORDS.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: NEWSHOTWORDS.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: NEWSHOTWORDS.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: NEWSHOTWORDS.SET_PAGE_DATA, data}
}
