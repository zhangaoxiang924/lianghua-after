/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {SPECIALTOPIC, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 直播列表
export const getSpecialTopicList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/topic/list' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addSpecialTopicData({'list': actionData.inforList}))
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

// 主持人/嘉宾获取
export const getDepartSpecialTopicUserList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/caster/usertype/list', sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                if (parseInt(sendData.type) === 1) {
                    dispatch({
                        type: SPECIALTOPIC.GET_GUEST_LIST,
                        actionData
                    })
                } else {
                    dispatch({
                        type: SPECIALTOPIC.GET_ZCR_LIST,
                        actionData
                    })
                }
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 主题详情
export const getSpecialTopicItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/topic/querytopic', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addSpecialTopicData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 获取占位数
export const getTopNum = (type, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/topic/recommendnum', {type: type}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch({
                    type: SPECIALTOPIC.GET_TOP_NUM,
                    actionData
                })
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 内容列表
export const getTopicContentList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/topic/querycontent' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addSpecialTopicData({'contentList': actionData.inforList}))
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

export const addSpecialTopicData = (data) => {
    return {type: SPECIALTOPIC.ADD_DATA, data}
}

export const addSpecialTopicQuery = (data) => {
    return {type: SPECIALTOPIC.ADD_QUERY, data}
}

export const editSpecialTopicUserInfo = (data) => {
    return {type: SPECIALTOPIC.EDIT_USER_INFO, data}
}

export const editSpecialTopicList = (data, index) => {
    return {type: SPECIALTOPIC.EDIT_LIST_ITEM, data, index}
}

export const delSpecialTopicData = (index) => {
    return {type: SPECIALTOPIC.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: SPECIALTOPIC.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: SPECIALTOPIC.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: SPECIALTOPIC.SET_PAGE_DATA, data}
}
