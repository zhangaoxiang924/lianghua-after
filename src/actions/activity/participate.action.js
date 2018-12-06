/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {PARTICIPATE, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getParticipateList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/stoenroll/list' : '/stoenroll/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addParticipateData({'list': actionData.inforList}))
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
        axiosAjax('post', '/marschinatrip/addremarks', {...sendData}, function (res) {
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

export const addParticipateData = (data) => {
    return {type: PARTICIPATE.ADD_DATA, data}
}

export const addParticipateQuery = (data) => {
    return {type: PARTICIPATE.ADD_QUERY, data}
}

export const editParticipateUserInfo = (data) => {
    return {type: PARTICIPATE.EDIT_USER_INFO, data}
}

export const editParticipateList = (data, index) => {
    return {type: PARTICIPATE.EDIT_LIST_ITEM, data, index}
}

export const delParticipateData = (index) => {
    return {type: PARTICIPATE.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: PARTICIPATE.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: PARTICIPATE.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: PARTICIPATE.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: PARTICIPATE.SET_PAGE_DATA, data}
}
