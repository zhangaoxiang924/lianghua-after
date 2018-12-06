/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, Modal, Spin, Table} from 'antd'
import {hashHistory} from 'react-router'
import IconItem from '../../components/icon/icon'
import {getIcoItemInfo, selectedData} from '../../actions/others/ico.action'
import {formatDate} from '../../public/index'
import './index.scss'
import '../../public/simditor/simditor.css'

// const confirm = Modal.confirm

/*
const json = {
    update: true,
    author: '作者',
    channelId: '0',
    cateId: '0',
    coverPic: [],
    title: '标题',
    source: 'Ico来源',
    synopsis: '摘要',
    tags: '标签',
    content: '<p>content</p>'
}
*/

class IcoDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: true,
            previewVisible: false,
            previewImage: ''
        }
        this.teamColumns = [{
            width: '50%',
            title: '姓名',
            key: 'name',
            render: (text, record) => (record && <div className="ico-info clearfix">
                <div>
                    <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(record.name)} />
                </div>
            </div>)
        }, {
            width: '50%',
            title: '职位',
            key: 'job',
            render: (text, record) => (record && <div className="ico-info clearfix">
                <div>
                    <h4 title={record.job} dangerouslySetInnerHTML={this.createMarkup(record.job)} />
                </div>
            </div>)
        }]
        this.urlColumns = [{
            width: '50%',
            title: '姓名',
            key: 'name',
            render: (text, record) => (record && <div className="ico-info clearfix">
                <div>
                    <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(record.name)} />
                </div>
            </div>)
        }, {
            width: '50%',
            title: '职位',
            key: 'url',
            render: (text, record) => (record && <a title={record.url} href={record.url}>{record.url}</a>)
        }]
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getIcoItemInfo({'id': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
    }

    // 内容格式化
    createMarkup (str) {
        return {__html: str}
    }

    channelName (id) {
        if (id === 'past') {
            return <span className="ico-status pre-publish">已结束</span>
        } else if (id === 'ongoing') {
            return <span className="ico-status has-publish">进行中</span>
        } else if (id === 'upcoming') {
            return <span className="ico-status will-publish">即将开始</span>
        } else {
            return <span>暂无</span>
        }
    }

    edit = () => {
        this.props.dispatch(selectedData(this.props.info))
        hashHistory.push({
            pathname: '/ico-edit',
            query: {id: this.props.location.query.id}
        })
    }

    showModal = (src) => {
        this.setState({
            previewVisible: true,
            previewImage: src
        })
    }

    handleCancel = () => this.setState({ previewVisible: false })

    render () {
        const col = {
            span: 5,
            offset: 1
        }
        const {info, icoBase, icoTeam, icoLink} = this.props
        return <Spin spinning={this.state.loading} size="large">
            {info.icoBase ? <div className="ico-detail">
                <Row>
                    <Col span={1}>
                        <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()}/>
                    </Col>
                    <Col className="text-right" span={20} offset={3}>
                        <Button onClick={this.edit} className="mr10" type="primary"><IconItem
                            type="icon-edit"/>编辑</Button>
                    </Col>
                </Row>
                <Row className="ico-detail-info">
                    <Col className="section" {...col}>
                        <span className="name">ICO名称：</span>
                        <span className="desc">{`${icoBase.name}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">ICO简称：</span>
                        <span className="desc">{`${icoBase.symbol}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">开始时间：</span>
                        <span className="desc">{formatDate(icoBase.startTime)} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">结束时间：</span>
                        <span className="desc">{formatDate(icoBase.endTime)} </span>
                    </Col>
                </Row>
                <Row className="">
                    <Col className="section" {...col}>
                        <span className="name">ICO状态：</span>
                        <span className="ico-status">{this.channelName(icoBase.status)} </span>
                    </Col>
                    <Col className="section" span={20}>
                        <Col span={1} className="name ico-desc">ICO简介：</Col>
                        <Col span={20} className="desc" dangerouslySetInnerHTML={this.createMarkup(icoBase.description)} />
                    </Col>
                </Row>
                <Row>
                    <Col className="section">
                        <span className="name" style={{verticalAlign: 'middle'}}>ICO 图标：</span>
                        <img
                            style={{width: 100, verticalAlign: 'middle'}}
                            alt={icoBase.name}
                            className="" onClick={() => this.showModal(icoBase.img.indexOf('http') !== -1 ? icoBase.img : `${location.href.split('#')[0] + icoBase.img}`)}
                            src={icoBase.img.indexOf('http') !== -1 ? icoBase.img : `${location.href.split('#')[0] + icoBase.img}`}/>
                    </Col>
                </Row>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                </Modal>
                <Row className="ico-detail-info">
                    <Col className="section" {...col}>
                        <span className="name">已众筹数量：</span>
                        <span className="desc">{`${icoBase.raised && icoBase.raised.trim() !== '' ? icoBase.raised : '暂无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">信息总量：</span>
                        <span className="desc">{`${icoBase.supply && icoBase.supply.trim() !== '' ? icoBase.supply : '暂无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">法律形式：</span>
                        <span className="desc">{`${icoBase.legalForm && icoBase.legalForm.trim() !== '' ? icoBase.legalForm : '暂无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">代币平台：</span>
                        <span className="desc">{`${icoBase.chainType && icoBase.chainType.trim() !== '' ? icoBase.chainType : '暂无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">管辖区域：</span>
                        <span className="desc">{`${icoBase.jurisdiction && icoBase.jurisdiction.trim() !== '' ? icoBase.jurisdiction : '暂无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">安全审计：</span>
                        <span className="desc">{`${icoBase.securityAudit && icoBase.securityAudit.trim() !== '' ? icoBase.securityAudit : '暂无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">ICO分配：</span>
                        <span className="desc">{`${icoBase.assignment && icoBase.assignment.trim() !== '' ? icoBase.assignment : '暂无'}`} </span>
                    </Col>
                </Row>
                <Row>
                    <Col className="section" span={10}>
                        <span className="name" style={{display: 'inline-block'}}>团队信息：</span>
                        <Table dataSource={icoTeam.map((item, index) => ({...item, key: index}))} pagination={false} columns={this.teamColumns} bordered />
                    </Col>
                    <Col className="section" span={10} style={{marginLeft: 40}}>
                        <span className="name" style={{display: 'inline-block'}}>媒体与链接：</span>
                        <Table dataSource={icoLink.map((item, index) => ({...item, key: index}))} pagination={false} columns={this.urlColumns} bordered />
                    </Col>
                </Row>
            </div> : <div style={{height: 300}}>加载中...</div>}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.icoInfo.info,
        icoBase: state.icoInfo.info.icoBase,
        icoLink: state.icoInfo.info.icoLink,
        icoTeam: state.icoInfo.info.icoTeam
    }
}

export default connect(mapStateToProps)(IcoDetail)
