/**
 * Author: yangbo
 * Time: 2018-05-16 20:29:00
 * Description: Description
 */
import {axiosAjax} from '../../public/index'
import {BLACKLIST} from '../../constants/index'
import {message} from 'antd'

// 获取黑名单列表
export const getBlackList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/blacklist/showblacklist' : '/blacklist/isblacklist'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(getBlackListData({'list': actionData.inforList}))
                dispatch(setPageData({
                    'totalCount': actionData.recordCount,
                    'pageSize': actionData.pageSize,
                    'currPage': actionData.currentPage
                }))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const getBlackListData = (data) => {
    return {type: BLACKLIST.INIT_DATA, data}
}

export const setSearchResult = (data) => {
    return {type: BLACKLIST.SET_SEARCH_RESULT, data}
}

export const setPageData = (data) => {
    return {type: BLACKLIST.SET_PAGE_DATA, data}
}
