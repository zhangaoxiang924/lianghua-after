/**
 * Author: yangbo
 * Time: 2018-05-22 14:16:31
 * Description: Description
 */
import {axiosAjax} from '../../public/index'
import {COOPERATION} from '../../constants/index'
import {message} from 'antd'

// 获取列表
export const getCooperationList = (sendData, fn) => {
    return (dispatch) => {
        let _url = '/news/getfooterinfo'
        axiosAjax('post', _url, !sendData ? {} : {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(getCooList({'cooList': actionData.inforList, maxNum: actionData.showNum}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const getCooList = (data) => {
    return {type: COOPERATION.INIT_COOPERATION, data}
}

export const setPageData = (data) => {
    return {type: COOPERATION.SET_PAGE_DATA, data}
}

export const setFilterData = (data) => {
    return {type: COOPERATION.SET_FILTER_DATA, data}
}

export const setFormData = (data) => {
    return {type: COOPERATION.SET_FORM_DATA, data}
}
