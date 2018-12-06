/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {LIVECONTENT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 直播列表
export const getLiveContentList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = '/caster/room/content/list'
        axiosAjax('get', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                if (type === 'init') {
                    dispatch(addLiveContentData({'list': actionData.inforList}))
                } else if (type === 'more') {
                    dispatch(moreLiveContentData({'list': actionData.inforList}))
                }
                dispatch(setPageData({'totalCount': actionData.recordCount, pageCount: actionData.pageCount, 'pageSize': actionData.pageSize, 'currentPage': actionData.currentPage}))
                if (fn) {
                    fn(res)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 发表新直播
export const addNewLive = (sendData, fn) => {
    return (dispatch) => {
        let _url = '/caster/room/content/add'
        axiosAjax('post', _url, sendData, (res) => {
            if (res.code === 1) {
                const newLive = res.obj
                dispatch({
                    type: LIVECONTENT.INSERT_LIVE,
                    newLive
                })
                if (fn) {
                    fn(res)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 删除直播
export const delLiveItem = (sendData, index, fn) => {
    return (dispatch) => {
        let _url = '/caster/room/content/delete'
        axiosAjax('post', _url, sendData, (res) => {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch({
                    type: LIVECONTENT.DEL_LIST_ITEM,
                    actionData,
                    index
                })
                if (fn) {
                    fn(res)
                }
                message.success('删除成功！')
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 修改直播
export const updateLive = (sendData, index, fn) => {
    return (dispatch) => {
        let _url = '/caster/room/content/update'
        axiosAjax('post', _url, sendData, (res) => {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch({
                    type: LIVECONTENT.EDIT_LIST_ITEM,
                    actionData,
                    index
                })
                if (fn) {
                    fn(res)
                }
                message.success('修改成功！')
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子详情
export const getLiveContentItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/caster/room/one', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addLiveContentData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addLiveContentData = (data) => {
    return {type: LIVECONTENT.ADD_DATA, data}
}

export const moreLiveContentData = (data) => {
    return {type: LIVECONTENT.MORE_DATA, data}
}

export const addLiveContentQuery = (data) => {
    return {type: LIVECONTENT.ADD_QUERY, data}
}

export const editLiveContentUserInfo = (data) => {
    return {type: LIVECONTENT.EDIT_USER_INFO, data}
}

export const editLiveContentList = (data, index) => {
    return {type: LIVECONTENT.EDIT_LIST_ITEM, data, index}
}

export const delLiveContentData = (index) => {
    return {type: LIVECONTENT.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: LIVECONTENT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: LIVECONTENT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: LIVECONTENT.SET_PAGE_DATA, data}
}
