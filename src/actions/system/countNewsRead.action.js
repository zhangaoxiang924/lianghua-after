/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {NEWSREADCOUNT} from '../../constants/index'
import { message } from 'antd'

// 帖子列表
export const getNewsReadCountList = (type, sendData, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/news/getnewscountinfo', !sendData ? {} : sendData, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addNewsReadCountData({'list': actionData.inforList || []}))
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

export const addNewsReadCountData = (data) => {
    return {type: NEWSREADCOUNT.ADD_DATA, data}
}

export const setSearchQuery = (data) => {
    return {type: NEWSREADCOUNT.SET_SEARCH_QUERY, data}
}

export const setPageData = (data) => {
    return {type: NEWSREADCOUNT.SET_PAGE_DATA, data}
}
