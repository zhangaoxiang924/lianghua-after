/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, message, Modal, Tag, Spin, Input} from 'antd'
import {hashHistory} from 'react-router'
import IconItem from '../../../components/icon/icon'
import {getVideoAuditItemInfo} from '../../../actions/audit/videoAudit.action'
import {axiosAjax, channelIdOptions, isJsonString, formatDate} from '../../../public/index'
import './videoAudit.scss'
import '../../../public/simditor/simditor.css'

const confirm = Modal.confirm
const { TextArea } = Input

class VideoAuditDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: true,
            previewVisible: false,
            previewImage: '',
            reason: ''
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getVideoAuditItemInfo({'id': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
    }

    // 删除
    _delVideoAudit () {
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
                axiosAjax('POST', '/video/status', {...sendData}, (res) => {
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
                dispatch(getVideoAuditItemInfo({'id': location.query.id}))
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
                dispatch(getVideoAuditItemInfo({'id': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 内容格式化
    createMarkup (str) {
        return {__html: str}
    }

    channelName (id) {
        let name = ''
        channelIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    edit = () => {
        const {info} = this.props
        hashHistory.push({
            pathname: '/audit-videoSend',
            query: {id: info.id}
        })
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    showModal = (src) => {
        this.setState({
            previewVisible: true,
            previewImage: src
        })
    }

    getReason = (e) => {
        this.setState({
            reason: e.target.value
        })
    }

    handleSubmit = (e) => {
        const _this = this
        let status = e.target.getAttribute('data-status')
        let statusText = '通过审核'
        switch (status) {
            case '1':
                statusText = '通过审核并发表'
                break
            case '4':
                statusText = '暂存到审核中'
                break
            case '2':
                statusText = '驳回审核'
                break
            default:
                statusText = '通过审核'
                break
        }

        e.preventDefault()
        const {info} = this.props
        if (status === '1') {
            if (!isJsonString(info.coverPic)) {
                message.error('封面暂无，请先上传相关封面！')
                return false
            } else if (!JSON.parse(info.coverPic).pc && !JSON.parse(info.coverPic).wap_small) {
                message.error('封面暂无，请先上传相关封面！')
                return false
            }
        }
        confirm({
            title: '提示',
            content: `确认要${statusText}吗 ?`,
            onOk () {
                let sendData = {
                    id: info.id,
                    status: status
                }
                if (status === '2') {
                    confirm({
                        title: '提示',
                        content: <div className="modal-input">
                            <span style={{marginRight: 10}}>请填写审核不通过原因：</span>
                            <TextArea rows={3} autoFocus onChange={(e) => { _this.getReason(e) }}/>
                        </div>,
                        onOk () {
                            _this.setState({
                                loading: true
                            })
                            if (_this.state.reason.trim() !== '') {
                                axiosAjax('POST', '/video/status', {
                                    id: info.id,
                                    status: 2,
                                    reason: _this.state.reason
                                }, (res) => {
                                    if (res.code === 1) {
                                        message.success('操作成功！')
                                        hashHistory.goBack()
                                    } else {
                                        _this.setState({
                                            loading: false
                                        })
                                        message.error(res.msg)
                                    }
                                })
                            }
                        }
                    })
                } else {
                    axiosAjax('POST', '/video/status', {...sendData}, (res) => {
                        if (res.code === 1) {
                            message.success('操作成功')
                            hashHistory.goBack()
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            }
        })
    }

    render () {
        const col = {
            md: {
                span: 15
            },
            lg: {
                span: 7,
                offset: 1
            }
        }
        const {info} = this.props
        // console.log(info.audio)
        return <Spin spinning={this.state.loading} size="large">
            {info.id ? <div className="videoAudit-detail">
                <Row>
                    <Col span={1}>
                        <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()}/>
                    </Col>
                    <Col className="text-right" span={20} offset={3}>
                        <Button onClick={this.edit} className="mr10" type="primary"><IconItem
                            type="icon-edit"/>编辑</Button>
                        {/*
                        <Button onClick={() => this._isTop(info.isTop)} className="mr10"><IconItem type={info.isTop === '1' ? 'icon-cancel-top' : 'icon-to-top'}/>{info.isTop === '1' ? '取消置顶' : '置顶'}</Button>
                        <Button onClick={() => this._forbidcomment(info.forbidComment)} className="mr10"><IconItem type={info.forbidComment === '1' ? 'icon-msg' : 'icon-no-msg'}/>{info.forbidComment === '1' ? '取消禁评' : '禁评'}</Button>
                        */}
                        <Button onClick={() => this._delVideoAudit()}><IconItem type="icon-clear"/>删除</Button>
                    </Col>
                </Row>
                {info.status === 2 ? <Row className="nopass">
                    <Col className="">
                        <span className="name">审核不通过：{info.nopassReason}</span>
                    </Col>
                </Row> : ''}
                <Row className="news-detail-info">
                    <Col className="section" {...col}>
                        <span className="name">作者：</span>
                        <span className="desc">{`${info.author}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">视频来源：</span>
                        <span className="desc">{info.author} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">发布时间：</span>
                        <span className="desc">{formatDate(info.publishTime)} </span>
                    </Col>
                </Row>
                <Row className="news-tags">
                    <Col className="section">
                        <span className="name">标签：</span>
                        {info.tags ? info.tags.split(',').map((item, index) => {
                            return <Tag key={index} color="blue" style={{marginLeft: 5}}>{item}</Tag>
                        }) : '无'}
                    </Col>
                </Row>
                <Row className="news-title">
                    <Col className="section">
                        <span className="name">视频标题：</span>
                        <span className="desc">{`${info.title}`} </span>
                    </Col>
                </Row>
                <Row className="news-summary">
                    <Col className="section">
                        <span className="name">视频简介：</span>
                        <span className="desc">{`${info.content || '无'}`} </span>
                    </Col>
                </Row>
                <Row className="news-summary">
                    <Col className="section">
                        <span className="name" style={{verticalAlign: 'middle'}}>视频：</span>
                        <ul className="desc" style={{
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }}>
                            {(() => {
                                if (isJsonString(info.url)) {
                                    if (JSON.parse(info.url).length !== 0) {
                                        return JSON.parse(info.url).map(function (item, index) {
                                            return <li className="clearfix" key={index} style={{margin: '5px 0'}}>
                                                <video width="200" style={{verticalAlign: 'middle'}} src={item.fileUrl} preload="metadata" controls="controls"></video>
                                            </li>
                                        })
                                    } else {
                                        return <span>暂无</span>
                                    }
                                } else {
                                    return <span>暂无</span>
                                }
                            })()}
                        </ul>
                    </Col>
                </Row>
                {isJsonString(info.coverPic) ? <div>
                    {(() => {
                        if (isJsonString(info.url)) {
                            if (JSON.parse(info.url).length !== 0) {
                                return <Row className="news-cover-img">
                                    <Col className="section">
                                        <span className="name">PC-播放器封面：</span>
                                        {!JSON.parse(info.coverPic).video_pc ? <span>暂无</span> : <img
                                            className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).video_pc)}
                                            src={`${JSON.parse(info.coverPic).video_pc}`}/>
                                        }

                                    </Col>
                                    <Col className="section">
                                        <span className="name">M-播放器封面：</span>
                                        {!JSON.parse(info.coverPic).video_pc ? <span>暂无</span> : <img
                                            className="desc"
                                            onClick={() => this.showModal(JSON.parse(info.coverPic).video_m)}
                                            src={`${JSON.parse(info.coverPic).video_m}`}/>
                                        }
                                    </Col>
                                </Row>
                            } else {
                                return ''
                            }
                        } else {
                            return ''
                        }
                    })()}
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name">PC-缩略图：</span>
                            {
                                (JSON.parse(info.coverPic).pc && JSON.parse(info.coverPic).pc !== '') ? <img
                                    className="desc"
                                    onClick={() => this.showModal(JSON.parse(info.coverPic).pc)}
                                    src={`${JSON.parse(info.coverPic).pc}`}/> : <span style={{padding: 6}}>
                                    暂无
                                </span>
                            }
                        </Col>
                        <Col className="section">
                            <span className="name">PC-推荐缩略图：</span>
                            {
                                (JSON.parse(info.coverPic).pc_recommend && JSON.parse(info.coverPic).pc_recommend !== '') ? <img
                                    className="desc"
                                    onClick={() => this.showModal(JSON.parse(info.coverPic).pc_recommend)}
                                    src={`${JSON.parse(info.coverPic).pc_recommend}`}/> : <span style={{padding: 6}}>
                                    暂无
                                </span>
                            }
                        </Col>
                        <Col className="section">
                            <span className="name" style={{width: '125px', verticalAlign: 'top'}}>M-缩略图：</span>
                            {
                                (JSON.parse(info.coverPic).wap_small && JSON.parse(info.coverPic).wap_small !== '') ? <img
                                    className="desc"
                                    onClick={() => this.showModal(JSON.parse(info.coverPic).wap_small)}
                                    src={`${JSON.parse(info.coverPic).wap_small}`}/> : <span style={{padding: 6}}>
                                    暂无
                                </span>
                            }
                        </Col>
                        <Col className="section">
                            <span className="name" style={{width: '125px', verticalAlign: 'top'}}>M-推荐缩略图：</span>
                            {
                                (JSON.parse(info.coverPic).wap_big && JSON.parse(info.coverPic).wap_big !== '') ? <img
                                    className="desc"
                                    onClick={() => this.showModal(JSON.parse(info.coverPic).wap_big)}
                                    src={`${JSON.parse(info.coverPic).wap_big}`}/> : <span style={{padding: 6}}>
                                    暂无
                                </span>
                            }
                        </Col>
                    </Row>
                </div> : <Row>
                    <Col className="section">
                        <span className="name">缩略图：</span>
                        <span>暂无</span>
                    </Col>
                </Row>}

                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                </Modal>
                <div className="btns" style={{margin: '20px 0'}}>
                    <Button type="primary" data-status='1' onClick={this.handleSubmit} style={{marginRight: '10px'}}>审核通过并发表</Button>
                    <Button type="primary" data-status='4' onClick={this.handleSubmit} style={{marginRight: '10px'}}>暂存到审核中</Button>
                    <Button type="primary" data-status='2' onClick={this.handleSubmit} style={{marginRight: '10px'}}>审核不通过</Button>
                    <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
                </div>
            </div> : <div style={{height: 300}}>加载中...</div>}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.videoAuditInfo.info
    }
}

export default connect(mapStateToProps)(VideoAuditDetail)
