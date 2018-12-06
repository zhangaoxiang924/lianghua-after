/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
// import {connect} from 'react-redux'
import { Modal, Row, Col } from 'antd'
// import defaultImgLarge from '../../public/img/default-large.png'
import './img.scss'

const TYPE = {
    '1': '帖子图片',
    '2': '评论图片'
}

export default class ImgShow extends Component {
    render () {
        const {isShow, imgSrc, onClose, type, modalInfo} = this.props
        return <div className="img-show">
            <Modal
                className="img-main"
                title={`${TYPE[type]}预览`}
                visible={isShow}
                footer={null}
                onCancel={onClose}
                width={800}
            >
                <Row>
                    <Col span={15}><img src={imgSrc}/></Col>
                    <Col span={8} offset={1}>
                        <p>评论人账号：{!modalInfo.userName ? '' : modalInfo.userName}</p>
                        <p>评论人昵称：{modalInfo.nickName}</p>
                        <p>评论人时间：{modalInfo.time}</p>
                    </Col>
                </Row>
            </Modal>
        </div>
    }
}

/*
const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(ImgShow) */
