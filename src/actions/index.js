/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import { hashHistory } from 'react-router'
// import $ from 'jquery'
import Cookies from 'js-cookie'
import { axiosAjax, deleteCookies } from '../public/index'
import { message } from 'antd'

import {
    BREADCRUMB,
    NAVIGATION,
    GETITEM,
    ALERTLOGIN
} from '../constants/index'
// 登录
export const login = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/account/login', sendData, function (data) {
            if (fn) {
                fn(data)
            }
            if (data.code === 1) {
                for (let key in data.obj) {
                    Cookies.set(`hx_${key}`, data.obj[key], {
                        expires: 30
                    })
                }
                Cookies.set('loginStatus', true)
                if (!sendData.loginType) {
                    hashHistory.push('/team-list')
                    message.success('登陆成功!')
                } else {
                    dispatch(alertLogin(false))
                    message.success('登陆成功，请刷新页面或重新提交请求!')
                }
            } else {
                message.error(data.msg)
            }
        })
    }
}

export const getItem = (data) => {
    return {
        type: GETITEM,
        payload: data
    }
}

export const alertLogin = (data) => {
    return {
        type: ALERTLOGIN,
        payload: data
    }
}

// 注销
export const logout = (sendData) => {
    return (dispatch) => {
        // Cookies.set('loginStatus', false)
        // message.success('已注销!')
        // hashHistory.push('/login')
        axiosAjax('post', '/account/editor/logout', sendData, function (data) {
            deleteCookies()
            Cookies.set('loginStatus', false)
            hashHistory.push('/login')
            if (data.code === 1) {
                message.success('已成功注销!')
            } else {
                message.success('已强制注销!')
            }
        })
    }
}

// 设置面包屑用
export const breadcrumb = (arr) => {
    return {
        type: BREADCRUMB,
        arr
    }
}

export const navigation = (selectkey, openkey) => {
    return {
        type: NAVIGATION,
        selectkey,
        openkey
    }
}
