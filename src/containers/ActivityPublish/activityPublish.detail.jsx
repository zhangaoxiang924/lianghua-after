/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, message, Modal, Spin} from 'antd'
import {hashHistory} from 'react-router'
import IconItem from '../../components/icon/icon'
import {getActivityPublishItemInfo} from '../../actions/activity/activityPublish.action'
import {axiosAjax, isJsonString, formatDate} from '../../public/index'
import './index.scss'
import '../../public/simditor/simditor.css'

const confirm = Modal.confirm

/*
const json = {
    update: true,
    author: '作者',
    channelId: '0',
    cateId: '0',
    coverPic: [],
    title: '标题',
    source: '活动来源',
    synopsis: '摘要',
    tags: '标签',
    content: '<p>content</p>'
}
*/

class ActivityPublishDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: true,
            previewVisible: false,
            previewImage: ''
        }
    }

    componentDidMount () {
        const {dispatch, location} = this.props
        dispatch(getActivityPublishItemInfo({'id': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
    }

    // 删除
    _delActivityPublish () {
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
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
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
        axiosAjax('POST', '/activityPublish/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getActivityPublishItemInfo({'id': location.query.id}))
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
        axiosAjax('POST', '/activityPublish/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getActivityPublishItemInfo({'id': location.query.id}))
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
        this.props.channelList.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    edit = () => {
        const {info} = this.props
        hashHistory.push({
            pathname: '/activityPublish-send',
            query: {id: info.id}
        })
        sessionStorage.setItem('hx_content', JSON.stringify(info))
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    showModal = (src) => {
        this.setState({
            previewVisible: true,
            previewImage: src
        })
    }

    render () {
        const col = {
            md: {
                span: 6
            },
            sm: {
                span: 12
            }
        }
        const col1 = {
            md: {
                span: 8
            },
            sm: {
                span: 15
            }
        }
        const {info} = this.props
        // console.log(info.audio)
        return <Spin spinning={this.state.loading} size="large">
            {info.id ? <div className="activityPublish-detail">
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
                        <Button onClick={() => this._delActivityPublish()}><IconItem type="icon-clear"/>删除</Button>
                        */}
                    </Col>
                </Row>
                <Row className="news-detail-info">
                    <Col className="section" {...col}>
                        <span className="name">举办方：</span>
                        <span className="desc">{info.sponsor} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">联系方式：</span>
                        <span className="desc">{info.connection}</span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">费用：</span>
                        <span className="desc">{info.fee}</span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">人数：</span>
                        <span className="desc">{info.numPeople}</span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">推荐：</span>
                        <span className="desc">{`${(info.recommend && parseInt(info.recommend) === 1) ? '是' : '否'}`} </span>
                    </Col>
                    <Col className="section" span={18}>
                        <span className="name">报名链接：</span>
                        <a title={info.url} href={info.url} target="_blank">{info.url}</a>
                    </Col>
                </Row>
                <Row className="news-title">
                    <Col className="section" {...col1}>
                        <span className="name">开始时间：</span>
                        <span className="desc">{formatDate(info.startTime)}</span>
                    </Col>
                    <Col className="section" {...col1}>
                        <span className="name">结束时间：</span>
                        <span className="desc">{formatDate(info.endTime)}</span>
                    </Col>
                </Row>
                <Row className="news-title">
                    <Col className="section" {...col1}>
                        <span className="name">举办城市：</span>
                        <span className="desc">{(() => {
                            if (info.place === 'others') {
                                return '其他'
                            } else if (info.place === 'overseas') {
                                return '海外'
                            } else {
                                return info.place
                            }
                        })()} </span>
                    </Col>
                    <Col className="section" {...col1}>
                        <span className="name">具体地址：</span>
                        <span className="desc">{info.detailPlace}</span>
                    </Col>
                </Row>
                {/*
                <Row className="news-summary">
                    <Col className="section">
                        <span className="name" style={{verticalAlign: 'middle'}}>音频：</span>

                        <ul className="desc" style={{
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }}>
                            {(() => {
                                if (isJsonString(info.audio)) {
                                    if (JSON.parse(info.audio).length !== 0) {
                                        return JSON.parse(info.audio).map(function (item, index) {
                                            return <li className="clearfix" key={index} style={{margin: '5px 0'}}>
                                                <span style={{verticalAlign: 'middle'}}>{item.fileName}</span>
                                                <audio style={{verticalAlign: 'middle'}} src={item.fileUrl} controls="controls"></audio>
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
                <Row className="news-summary">
                    <Col className="section">
                        <span className="name" style={{verticalAlign: 'middle'}}>视频：</span>
                        <ul className="desc" style={{
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }}>
                            {(() => {
                                if (isJsonString(info.video)) {
                                    if (JSON.parse(info.video).length !== 0) {
                                        return JSON.parse(info.video).map(function (item, index) {
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
                */}
                {isJsonString(info.coverPic) ? <div style={{margin: '15px 0'}}>
                    {(() => {
                        if (isJsonString(info.video)) {
                            if (JSON.parse(info.video).length !== 0) {
                                return <Row className="news-cover-img">
                                    <Col className="section">
                                        <span className="name">PC-视频封面：</span>
                                        <img
                                            className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).video_pc)}
                                            src={`${JSON.parse(info.coverPic).video_pc}`}/>
                                    </Col>
                                    <Col className="section">
                                        <span className="name">M-视频封面：</span>
                                        <img
                                            className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).video_m)}
                                            src={`${JSON.parse(info.coverPic).video_m}`}/>
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
                            <span className="name">PC-活动封面：</span>
                            <img
                                className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).pc)}
                                src={`${JSON.parse(info.coverPic).pc}`}/>
                        </Col>
                    </Row>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name">PC-推荐位封面：</span>
                            {
                                (JSON.parse(info.coverPic).pc_recommend && JSON.parse(info.coverPic).pc_recommend !== '') ? <img
                                    className="desc"
                                    onClick={() => this.showModal(JSON.parse(info.coverPic).pc_recommend)}
                                    src={`${JSON.parse(info.coverPic).pc_recommend}`}/> : <span style={{padding: 6}}>暂无推荐位封面</span>}
                        </Col>
                    </Row>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name" style={{width: '125px', verticalAlign: 'top'}}>M-活动封面：</span>
                            <img
                                className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).wap_small)}
                                style={{width: 95, border: '1px solid #eee'}}
                                src={`${JSON.parse(info.coverPic).wap_small}`}/>
                        </Col>
                    </Row>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name" style={{width: '125px', verticalAlign: 'top'}}>M-推荐：</span>
                            <img
                                className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).wap_big)}
                                style={{width: 95, border: '1px solid #eee'}}
                                src={`${JSON.parse(info.coverPic).wap_big}`}/>
                        </Col>
                    </Row>
                </div> : <Row className="news-cover-img">
                    <Col className="section">
                        <span className="name">活动封面：</span>
                        <span>暂无</span>
                    </Col>
                </Row>}

                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                </Modal>
                <Row className="news-title">
                    <Col className="section">
                        <span className="name">活动标题：</span>
                        <span className="desc">{`${info.title}`} </span>
                    </Col>
                </Row>
                <Row className="news-summary">
                    <Col className="section">
                        <span className="name">活动特色(简介)：</span>
                        <span className="desc">{`${info.synopsis}`} </span>
                    </Col>
                </Row>
                <Row>
                    <Col style={{fontSize: '15px', fontWeight: 'bolder', padding: '5px', color: '#000'}}>活动内容: </Col>
                    <Col className="page-box activityPublish-content simditor">
                        <div className="activityPublish-main simditor-body">
                            <div className="content-text" dangerouslySetInnerHTML={this.createMarkup(info.content)}/>
                        </div>
                    </Col>
                </Row>
            </div> : <div style={{height: 300}}>加载中...</div>}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.activityPublishInfo.info,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(ActivityPublishDetail)
