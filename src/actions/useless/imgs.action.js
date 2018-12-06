/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../../public/index'
import {IMGS} from '../../constants/index'
import { message } from 'antd'

// 回复图片列表
export const getReviewImgsList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/image/replylist', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addImgsData({'ReviewList': actionData.datas}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子图片列表
export const getPostImgsList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('POST', '/image/postlist', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addImgsData({'postList': actionData.datas}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 批量替换
export const replaceImgs = (sendData, url, fn) => {
    return (dispatch) => {
        let _data = JSON.stringify({'appId': $.cookie('gameId'), ...sendData})
        // console.log(_data)
        axiosAjax('POST', url, _data, function (res) {
            if (res.status === 200) {
                message.success('替换成功')
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        }, {'Content-Type': 'application/json'})
    }
}

export const addImgsData = (data) => {
    return {type: IMGS.ADD_DATA, data}
}

export const editImgsList = (data, index) => {
    return {type: IMGS.EDIT_LIST_ITEM, index}
}

export const editImgsSelect = (data, isChk) => {
    return {type: IMGS.EDIT_SELECT_DATA, data, isChk}
}
