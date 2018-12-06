/**
 * Author：tantingting
 * Time：2017/9/21
 * Description：Description
 */

import './index.scss'
import React, { Component } from 'react'
// import { connect } from 'react-redux'
import defImg from './img/default.png'
import {Button, Icon} from 'antd'

class PostUserInfo extends Component {
    render () {
        const {info, click} = this.props
        return <div className="user-info-componet">
            <div className="user-info">
                <div className="img-radius">
                    <img src={!info.img ? defImg : info.img} />
                </div>
                <div>
                    <h4 className="mb10">{!info.name ? '用户名称' : info.name }</h4>
                    <div>
                        <span className="mr20">发帖数{!info.sendCount ? 0 : info.sendCount}</span>
                        <span className="mr20">回帖数{!info.responCount ? 0 : info.responCount}</span>
                        <span>点赞数{!info.likeCount ? 0 : info.likeCount}</span>
                    </div>
                </div>
            </div>
            <div className="btns"><Button type="primary" htmlType="submit" onClick={() => click()}><Icon type="logout" />退出</Button></div>
        </div>
    }
}

export default PostUserInfo
