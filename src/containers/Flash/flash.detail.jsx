/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, message, Modal, Spin } from 'antd'
import { hashHistory } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getFlashItemInfo} from '../../actions/flash/flash.action'
import {getTypeList} from '../../actions/index'
import {axiosAjax, formatDate, getContent, getTitle} from '../../public/index'
import './flash.scss'
const confirm = Modal.confirm

class FlashDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: true,
            previewImage: '',
            previewVisible: false
        }
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getTypeList())
        dispatch(getFlashItemInfo({'id': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
    }

    channelName (id) {
        let name = ''
        this.props.flashTypeList.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    // 删除
    _delFlash () {
        const {location} = this.props
        // const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    status: -1,
                    'id': location.query.id
                }
                axiosAjax('POST', '/lives/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        hashHistory.goBack()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 禁评、取消禁评
    _forbidcomment (forbidcomment) {
        const {location, dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'operate': !parseInt(forbidcomment) ? '1' : '0'
        }
        axiosAjax('post', '/post/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getFlashItemInfo({'id': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (istop) {
        const {location, dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'operate': !parseInt(istop) ? '1' : '0'
        }
        axiosAjax('post', '/post/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getFlashItemInfo({'id': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 发布
    /*
    sendPost (sendData) {
        const {location} = this.props
        let _data = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'title': sendData.postTitle,
            'content': `${sendData.postContent}`
        }

        axiosAjax('post', '/post/update', _data, (res) => {
            if (res.status === 200) {
                message.success('修改成功！')
                // hashHistory.push('/post-list')
                dispatch(getFlashItemInfo({'id': location.query.id}))
                this.setState({'isEdit': false})
            } else {
                message.error(res.msg)
            }
        })

    }
*/
    // 内容格式化
    createMarkup (str) { return {__html: str} }

    edit = () => {
        const {info} = this.props
        hashHistory.push({
            pathname: '/flash-edit',
            query: {id: info.id}
        })
    }

    handlePreview = (file) => {
        this.setState({
            previewVisible: true
        })
    }

    handleCancel = () => this.setState({previewVisible: false})

    render () {
        const col = {
            lg: {
                span: 6
            },
            md: {
                span: 11,
                offset: 1
            }
        }
        const {info} = this.props
        return <div className="flash-detail">
            <Spin spinning={this.state.loading} size="large">
                <Row>
                    <Col span={1}>
                        <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()} />
                    </Col>
                    <Col className="text-right" span={20} offset={3}>
                        <Button onClick={this.edit} className="mr10" type="primary" ><IconItem type="icon-edit"/>编辑</Button>
                        {/*
                        <Button onClick={() => this._isTop(info.isTop)} className="mr10"><IconItem type={info.isTop === '1' ? 'icon-cancel-top' : 'icon-to-top'}/>{info.isTop === '1' ? '取消置顶' : '置顶'}</Button>
                        <Button onClick={() => this._forbidcomment(info.forbidComment)} className="mr10"><IconItem type={info.forbidComment === '1' ? 'icon-msg' : 'icon-no-msg'}/>{info.forbidComment === '1' ? '取消禁评' : '禁评'}</Button>
                        */}
                        <Button onClick={() => this._delFlash()}><IconItem type="icon-clear"/>删除</Button>
                    </Col>
                </Row>
                <Row className="news-detail-info">
                    <Col className="section" {...col}>
                        <span className="name">快讯频道：</span>
                        <span className="desc">{`${this.channelName(info.channelId)}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">发布时间：</span>
                        <span className="desc">{`${formatDate(info.createdTime)}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">利好数：</span>
                        <span className="desc">{`${info.upCounts}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">利空数：</span>
                        <span className="desc">{`${info.downCounts}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">快讯标识：</span>
                        <span className="desc">{`${(parseInt(info.tag) === 1 || parseInt(info.tag) === 0) ? '普通' : '重要'}`} </span>
                    </Col>
                </Row>
                <Row className="">
                    <Col className="section">
                        <span className="name">快讯标题：</span>
                        <span className="content-text desc" dangerouslySetInnerHTML={this.createMarkup(info.title && info.title.trim() !== '' ? info.title : getTitle(info.content || ''))} />
                    </Col>
                </Row>
                {info.images && info.images !== '' && <Row className="">
                    <Col className="section" {...col}>
                        <span className="name" style={{verticalAlign: 'middle'}}>快讯图片：</span>
                        <img style={{width: 50, verticalAlign: 'middle', marginLeft: 5}} onClick={this.handlePreview} src={info.images} />
                    </Col>
                </Row>}
                <Row>
                    <Col style={{fontSize: '15px', fontWeight: 'bolder', padding: '5px', color: '#000'}}>快讯内容: </Col>
                    <Col className="page-box flash-content">
                        <div className="flash-main">
                            <span className="content-text" dangerouslySetInnerHTML={this.createMarkup(getContent(info.content || ''))} />
                            {info.url && info.url !== '' && <a href={info.url} target="_blank"> 「查看原文」</a>}
                        </div>
                    </Col>
                </Row>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="快讯" style={{width: '100%'}} src={info.images}/>
                </Modal>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.flashInfo.info,
        flashTypeList: state.flashTypeListInfo
    }
}

export default connect(mapStateToProps)(FlashDetail)
