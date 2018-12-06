/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {LANGUAGE} from '../../constants/index'
import {message} from 'antd'

// 语言列表
export const getLanguage = (sendData) => {
    return (dispatch) => {
        axiosAjax('post', '/i18n/langlist', {...sendData}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addLanguageData({'language': actionData}))
            } else {
                message.error(res.message)
            }
        })
    }
}

// 词条列表
export const getWordsList = (sendData, callBack) => {
    return (dispatch) => {
        axiosAjax('post', '/i18n/list', {...sendData}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addLanguageData({'list': actionData.datas}))
                callBack(actionData)
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 删除词条
export const delWordItem = (sendData, index) => {
    return (dispatch) => {
        axiosAjax('POST', '/i18n/del', {...sendData}, function (res) {
            if (res.status === 200) {
                // const actionData = res.data
                dispatch(delLanguageData(index))
                message.success('删除成功')
            } else {
                message.error(res.message)
            }
        })
    }
}

// 通过id查询
export const getListById = (sendData) => {
    return (dispatch) => {
        axiosAjax('POST', '/i18n/getbyid', {...sendData}, function (res) {
            if (res.status === 200) {
                // const actionData = res.data
                dispatch(addLanguageQuery(res.data))
            } else {
                message.error(res.message)
            }
        })
    }
}

export const addLanguageData = (data) => {
    return {type: LANGUAGE.ADD_DATA, data}
}

export const addLanguageQuery = (data) => {
    return {type: LANGUAGE.ADD_QUERY, data}
}

export const editLanguageList = (data, index) => {
    return {type: LANGUAGE.EDIT_LIST_ITEM, data, index}
}

export const delLanguageData = (index) => {
    return {type: LANGUAGE.DEL_LIST_ITEM, index}
}

export const editLanguageRepeatList = (data, index) => {
    return {type: LANGUAGE.EDIT_REPEAT_LIST_ITEM, data, index}
}

export const selectLanguageRepeatList = (data, isChk) => {
    return {type: LANGUAGE.SELECT_REPEAT_LIST_ITEM, data, isChk}
}
