/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {PARTNER, SELECTEDDATA} from '../../constants/index'
import { message } from 'antd'

// 选中数据
export const selectedData = (data) => {
    return {type: SELECTEDDATA, data}
}

// 用户列表
export const getPartnerList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/partner/page' : '/post/search'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (fn) {
                fn(res)
            }
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPartnerData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.totalCount, 'pageSize': actionData.pageSize, 'page': actionData.currentPage}))
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 用户详情
export const getPartnerItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/partner/getpartner', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addPartnerData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addPartnerData = (data) => {
    return {type: PARTNER.ADD_DATA, data}
}

export const setSearchQuery = (data) => {
    return {type: PARTNER.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: PARTNER.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: PARTNER.SET_PAGE_DATA, data}
}
