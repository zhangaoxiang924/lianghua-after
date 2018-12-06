/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {REGISTRANT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getRegisterList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/marschinatrip/searcheachcitypeople' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addRegistrantData({'list': actionData.inforList}))
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

export const addRegistrantData = (data) => {
    return {type: REGISTRANT.ADD_DATA, data}
}

export const addRegistrantQuery = (data) => {
    return {type: REGISTRANT.ADD_QUERY, data}
}

export const editRegistrantUserInfo = (data) => {
    return {type: REGISTRANT.EDIT_USER_INFO, data}
}

export const editRegistrantList = (data, index) => {
    return {type: REGISTRANT.EDIT_LIST_ITEM, data, index}
}

export const delRegistrantData = (index) => {
    return {type: REGISTRANT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: REGISTRANT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: REGISTRANT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: REGISTRANT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: REGISTRANT.SET_PAGE_DATA, data}
}
