/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {TEAM, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getTeamList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/team/page' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addTeamData({'list': actionData.inforList}))
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
export const getTeamItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/team/detail', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addTeamData({'info': actionData}))
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
                dispatch(addTeamData({'apiList': actionData || []}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addTeamData = (data) => {
    return {type: TEAM.ADD_DATA, data}
}

export const setSearchQuery = (data) => {
    return {type: TEAM.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: TEAM.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: TEAM.SET_PAGE_DATA, data}
}
