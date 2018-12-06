/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Row, Col, Button, message } from 'antd'
import IconItem from '../../components/icon/icon'
import ImgsReview from './img.review'
import ImgsPost from './img.post'
import {replaceImgs} from '../../actions/useless/imgs.action'
import './img.scss'

const TabPane = Tabs.TabPane

class ImgsIndex extends Component {
    constructor () {
        super()
        this.state = {
            'ley': '',
            'type': 'post',
            'isSearch': false,
            'chkData': {}
        }
    }

    selectData (_data) {
        this.setState({'chkData': _data})
    }
    // 批量替换
    replace () {
        const {chkData, type} = this.state
        let _url = type === 'post' ? '/image/replacePostPic' : '/image/replaceReplyPic'
        let ids = this.formatData(chkData, type)
        if (!ids.length) {
            message.warning('请选择图片！')
            return
        }
        let sendData = {
            [type]: ids
        }
        this.props.dispatch(replaceImgs(sendData, _url, () => {
            this.setState({'isSearch': true})
        }))
    }

    // 格式化提交数据
    formatData (data, type) {
        let arr = []
        let idKey = type === 'post' ? 'postsId' : 'replyId'
        for (let [key, item] of Object.entries(data)) {
            for (let j = 0; j < item.length; j++) {
                arr.push({[idKey]: key, 'pictureUrl': item[j]})
            }
        }
        return arr
    }

    render () {
        // const {list} = this.props
        return <div>
            <div className="img-main clearfix">
                <Row>
                    <Col className="text-right" span={21} offset={3}>
                        <Button onClick={() => this.replace()} className="mr10" type="primary"><IconItem type='icon-img-replace'/>批量替换</Button>
                    </Col>
                </Row>
                <Tabs activeKey={this.state.type} onChange={(key) => this.setState({'type': key})}>
                    <TabPane tab="帖子图片鉴别" key="post"><ImgsPost isSearch={this.state.isSearch} selectData={(data) => this.selectData(data)} /></TabPane>
                    <TabPane tab="评论图片鉴别" key="reply"><ImgsReview isSearch={this.state.isSearch} selectData={(data) => this.selectData(data)} /></TabPane>
                </Tabs>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.imgsInfo.list,
        selectData: state.imgsInfo.selectData
    }
}

export default connect(mapStateToProps)(ImgsIndex)
