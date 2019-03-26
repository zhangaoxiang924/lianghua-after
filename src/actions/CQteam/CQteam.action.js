/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {CQTEAM, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getCQTeamList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/team/page' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCQTeamData({'list': actionData.inforList}))
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

// 详情
export const getCQTeamItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/team/detail', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCQTeamData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 获取已绑定交易所
export const getExchangeInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/api_key/list', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addCQTeamData({'apiList': actionData || []}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addCQTeamData = (data) => {
    return {type: CQTEAM.ADD_DATA, data}
}

export const setSearchQuery = (data) => {
    return {type: CQTEAM.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: CQTEAM.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: CQTEAM.SET_PAGE_DATA, data}
}
