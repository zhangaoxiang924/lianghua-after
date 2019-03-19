/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {ACCOUNT, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 帖子列表
export const getAccountList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/account/list' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addAccountData({'list': actionData}))
                // dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addAccount = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/account/add', {...sendData}, function (res) {
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

export const addAccountData = (data) => {
    return {type: ACCOUNT.ADD_DATA, data}
}

export const setSearchQuery = (data) => {
    return {type: ACCOUNT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: ACCOUNT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: ACCOUNT.SET_PAGE_DATA, data}
}
