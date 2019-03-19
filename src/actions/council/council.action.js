/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {COUNCIL, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 用户列表
export const getCouncilList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/juror/page' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCouncilData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.totalCount, 'pageSize': actionData.pageSize, 'page': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addCouncilData = (data) => {
    return {type: COUNCIL.ADD_DATA, data}
}

export const setSearchQuery = (data) => {
    return {type: COUNCIL.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: COUNCIL.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: COUNCIL.SET_PAGE_DATA, data}
}
