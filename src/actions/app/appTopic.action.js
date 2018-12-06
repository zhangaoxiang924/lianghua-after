/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {APPTOPIC, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 直播列表
export const getAppTopicList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/topic/apptopiclist' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAppTopicData({'list': actionData.inforList}))
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
export const getDepartAppTopicUserList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/caster/usertype/list', sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                if (parseInt(sendData.type) === 1) {
                    dispatch({
                        type: APPTOPIC.GET_GUEST_LIST,
                        actionData
                    })
                } else {
                    dispatch({
                        type: APPTOPIC.GET_ZCR_LIST,
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
export const getAppTopicItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/topic/querytopic', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAppTopicData({'info': actionData}))
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
                    type: APPTOPIC.GET_TOP_NUM,
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
                dispatch(addAppTopicData({'contentList': actionData.inforList}))
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

export const addAppTopicData = (data) => {
    return {type: APPTOPIC.ADD_DATA, data}
}

export const addAppTopicQuery = (data) => {
    return {type: APPTOPIC.ADD_QUERY, data}
}

export const editAppTopicUserInfo = (data) => {
    return {type: APPTOPIC.EDIT_USER_INFO, data}
}

export const editAppTopicList = (data, index) => {
    return {type: APPTOPIC.EDIT_LIST_ITEM, data, index}
}

export const delAppTopicData = (index) => {
    return {type: APPTOPIC.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: APPTOPIC.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: APPTOPIC.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: APPTOPIC.SET_PAGE_DATA, data}
}
