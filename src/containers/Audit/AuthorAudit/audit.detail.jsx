/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, message, Modal, Spin, Radio, Input } from 'antd'
import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'
import {axiosAjax, auditStatus, formatDate} from '../../../public/index'
import '../index.scss'
const confirm = Modal.confirm
const RadioGroup = Radio.Group
const { TextArea } = Input

class AuditDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: false,
            previewVisible: false,
            previewImage: '',
            noPassReason: '',
            ifAddV: JSON.parse(Cookies.get('hx_identify_info')).type ? parseFloat(JSON.parse(Cookies.get('hx_identify_info')).type) : 1
        }
    }

    // 删除
    _delAudit () {
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
        const {location} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'operate': !parseInt(forbidcomment) ? '1' : '0'
        }
        axiosAjax('audit', '/audit/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (istop) {
        const {location} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'operate': !parseInt(istop) ? '1' : '0'
        }
        axiosAjax('audit', '/audit/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
            } else {
                message.error(res.msg)
            }
        })
    }

    // 发布
    /*
    sendAudit (sendData) {
        const {location} = this.props
        let _data = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'title': sendData.auditTitle,
            'content': `${sendData.auditContent}`
        }

        axiosAjax('audit', '/audit/update', _data, (res) => {
            if (res.status === 200) {
                message.success('修改成功！')
                // hashHistory.push('/audit-list')
                dispatch(selectedData({'id': location.query.id}))
                this.setState({'isEdit': false})
            } else {
                message.error(res.msg)
            }
        })

    }
*/
    // 内容格式化
    createMarkup (str) { return {__html: str} }

    auditStatus (id) {
        let name = ''
        auditStatus.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    getReason = (e) => {
        this.setState({
            noPassReason: e.target.value
        })
    }

    handleSubmit = (e) => {
        let status = e.target.getAttribute('data-status')
        const This = this
        e.preventDefault()
        const params = {
            ifAddV: this.state.ifAddV,
            passportId: JSON.parse(Cookies.get('hx_identify_info')).passportid || this.props.selectData.passportid,
            state: parseInt(status),
            noPassReason: ''
        }
        confirm({
            title: '提示',
            content: `确认要${parseInt(status) === 1 ? '通过审核' : '驳回请求'}吗 ?`,
            onOk () {
                if (status === '-1') {
                    confirm({
                        title: '提示',
                        content: <div className="modal-input">
                            <span style={{marginRight: 10}}>请填写认证不通过原因：</span>
                            <TextArea rows={3} autoFocus onChange={(e) => {
                                This.getReason(e)
                            }}/>
                        </div>,
                        onOk () {
                            if (This.state.noPassReason.trim() !== '') {
                                This.setState({
                                    loading: true
                                })
                                params.noPassReason = This.state.noPassReason
                                axiosAjax('get', '/account/updateauthstate', params, (res) => {
                                    if (res.code === 1) {
                                        message.success('操作成功！')
                                        hashHistory.goBack()
                                    } else {
                                        message.error(res.msg)
                                    }
                                })
                            } else {
                                message.error('请填写驳回原因!')
                            }
                        }
                    })
                } else {
                    axiosAjax('get', '/account/updateauthstate', params, (res) => {
                        if (res.code === 1) {
                            message.success('操作成功！')
                            hashHistory.goBack()
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            }
        })
    }

    handleCancel = () => this.setState({ previewVisible: false })

    showModal = (src) => {
        this.setState({
            previewVisible: true,
            previewImage: src
        })
    }

    onChangeResult = (e) => {
        this.setState({
            reason: e.target.value
        })
    }

    addVChange = (e) => {
        this.setState({
            ifAddV: e.target.value
        })
    }

    render () {
        const col = {
            md: {
                span: 20,
                offset: 1
            }
        }
        const cols = {
            span: 16,
            offset: 1
        }
        const selectData = JSON.parse(Cookies.get('hx_identify_info')) || this.props.selectData
        return <Spin spinning={this.state.loading} size="large">
            {selectData.passportid ? <div className="audit-detail">
                <Row>
                    <Col span={1}>
                        <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()} />
                    </Col>
                </Row>
                {selectData.state === -1 ? <Row className="nopass">
                    <Col className="">
                        <span className="name">认证不通过：{selectData.noPassReason}</span>
                    </Col>
                </Row> : ''}
                <Row className="audit-detail-selectData" style={{fontSize: 16}}>
                    <Col className="section" lg={{span: 9, offset: 1}} {...col}>
                        <span className="name">ID：</span>
                        <span className="">{`${selectData.passportid}`} </span>
                    </Col>
                    <Col className="section" lg={{span: 8, offset: 1}} {...col}>
                        <span className="name">创建时间：</span>
                        <span className="">{`${formatDate(selectData.createTime)}`} </span>
                    </Col>
                    <Col className="section" lg={{span: 7, offset: 1}} {...col}>
                        <span className="name">状态：</span>
                        {this.auditStatus(selectData.state)}
                    </Col>
                </Row>
                <Row className="audit-title" style={{margin: '20px 0 0', borderTop: '1px solid #eee'}}>
                    <Col className="section" {...cols}>
                        <span className="name">姓名：</span>
                        <span className="desc">{`${selectData.identityName}`} </span>
                    </Col>
                </Row>
                <Row className="audit-title" style={{margin: '0 0'}}>
                    <Col className="section" {...cols}>
                        <span className="name">证件号：</span>
                        <span className="desc">{`${selectData.identityNum}`} </span>
                    </Col>
                </Row>
                <Row className="audit-cover-img">
                    <Col className="section">
                        <span className="name">正面照：</span>
                        <img className="desc" onClick={() => this.showModal(selectData.idFaceUrl)} src={selectData.idFaceUrl}/>
                    </Col>
                </Row>
                {selectData.idBackUrl && <Row className="audit-cover-img">
                    <Col className="section">
                        <span className="name">身份证反面：</span>
                        <img className="desc" onClick={() => this.showModal(selectData.idBackUrl)} src={selectData.idBackUrl}/>
                    </Col>
                </Row>}
                {selectData.idUserUrl && <Row className="audit-cover-img">
                    <Col className="section">
                        <span className="name">手持身份证：</span>
                        {selectData.idUserUrl ? <img className="desc" onClick={() => this.showModal(selectData.idUserUrl)} src={selectData.idUserUrl}/> : <span style={{fontSize: 15, paddingLeft: 5}}>无</span>}
                    </Col>
                </Row>}

                <Row className="" style={{margin: '0 0 20px', borderBottom: '1px solid #eee', borderTop: '1px solid #eee'}}>
                    <Col className="section">
                        <span className="name" style={{marginRight: 10}}>大 V 标识：</span>
                        <RadioGroup onChange={this.addVChange} value={this.state.ifAddV}>
                            {/* <Radio value={0}>普通用户</Radio> */}
                            <Radio value={1}>个人大 V</Radio>
                            <Radio value={2}>媒体大 V</Radio>
                            <Radio value={3}>企业/机构大 V</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                {/* 帖子内容
                <Row style={{margin: '20px 0'}}>
                    <Col style={{fontSize: '15px', fontWeight: 'bolder', padding: '5px', color: '#000'}}>驳回理由: </Col>
                    <TextArea rows={4} defaultValue={this.state.reason} onChange={this.onChangeResult} />
                </Row>
                */}
                <Button type="primary" data-status='1' onClick={this.handleSubmit} style={{marginRight: '10px'}}>审核通过</Button>
                <Button type="primary" data-status='-1' onClick={this.handleSubmit} style={{marginRight: '10px'}}>审核驳回</Button>
                <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
            </div> : <div style={{height: 300}}>加载中...</div>}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        selectData: state.auditInfo.selectedData
    }
}

export default connect(mapStateToProps)(AuditDetail)
