/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, Spin, Select, Input, Button } from 'antd'
import Cookies from 'js-cookie'
import '../index.scss'
import { hashHistory } from 'react-router'
import {getAuditList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../../actions/audit/audit.action'
import {formatDate, cutString, auditStatus} from '../../../public/index'
// const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class AuditIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            auditStatus: null,
            visible: false,
            previewVisible: false,
            previewImage: ''
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch(!search.type ? 'init' : search.type, {state: filter.status})
        columns = [{
            title: '姓名',
            key: 'identityName',
            // width: 100,
            render: (text, record) => (<div className="audit-info clearfix">
                <div>
                    <h4 title={record.identityName} dangerouslySetInnerHTML={this.createMarkup(record.identityName ? cutString(record.identityName, 30) : '暂无')} />
                    <div>
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block'}}><span className="org-bg mr10">推荐</span></div>}
                    </div>
                </div>
            </div>)
        }, {
            title: '审核状态',
            key: 'state',
            width: 100,
            render: (record) => {
                if (record.state === 0) {
                    return <span className="state-btns pre-identify">{this.auditStatus(record.state)}</span>
                } else if (record.state === 1) {
                    return <span className="state-btns pass-identify">{this.auditStatus(record.state)}</span>
                } else if (record.state === -1) {
                    return <div>
                        <span className="state-btns cant-identify">{this.auditStatus(record.state)}</span>
                        <p>(原因：{record.noPassReason})</p>
                    </div>
                } else if (record.state === -2) {
                    return <span className="state-btns hasnot-identify">{this.auditStatus(record.state)}</span>
                } else {
                    return this.auditStatus(record.state)
                }
            }
        }, {
            title: '昵称',
            width: 130,
            dataIndex: 'nickName',
            key: 'nickName',
            render: (text, record) => (<h3 title={record.nickName}>{record.nickName ? cutString(record.nickName, 30) : '暂无'}</h3>)
        }, {
            title: '手机号',
            width: 130,
            dataIndex: 'phoneNum',
            key: 'phoneNum',
            render: (text, record) => (<h3 title={record.phoneNum}>{record.phoneNum ? cutString(record.phoneNum, 30) : '暂无'}</h3>)
        },
        // , {
        //     title: '标识',
        //     dataIndex: 'vGrade',
        //     width: 88,
        //     key: 'vGrade',
        //     render: (record) => {
        //         if (record === 0) {
        //             return <span className="state-btns ordinary-v">普通</span>
        //         } else if (record === 1) {
        //             return <span className="state-btns personal-v">个人大 V </span>
        //         } else if (record === 2) {
        //             return <span className="state-btns company-v">企业大 V </span>
        //         } else {
        //             return <span className="state-btns ordinary-v">普通</span>
        //         }
        //     }
        // },
        {
            title: '认证类型',
            dataIndex: 'type',
            width: 88,
            key: 'type',
            render: (record) => {
                if (record === 3) {
                    return <span className="state-btns company-v">企业认证</span>
                } else if (record === 1) {
                    return <span className="state-btns personal-v">个人认证 </span>
                } else if (record === 2) {
                    return <span className="state-btns media-v">媒体认证</span>
                } else {
                    return <span className="state-btns ordinary-v">普通</span>
                }
            }
        },
        {
            width: 170,
            title: '证件号',
            dataIndex: 'identityNum',
            key: 'identityNum',
            render: (text, record) => (<h3 title={record.identityNum}>{record.identityNum ? cutString(record.identityNum, 30) : '暂无'}</h3>)
        },
        // , {
        //     title: '证件照',
        //     width: 140,
        //     key: 'idFaceUrl',
        //     render: (record) => (!record.idFaceUrl ? '暂无' : <div
        //         className="shrinkPic"
        //         key={record.idFaceUrl}
        //         style={{
        //             background: `url(${record.idFaceUrl}) no-repeat center / cover`
        //         }}
        //         onClick={this.handlePreview}
        //         src={record.idFaceUrl}
        //     />)
        // }
        {
            title: '上传时间',
            key: 'createTime',
            width: 130,
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (item) => (<div>
                {/* <a className="mr10 opt-btn" onClick={() => { this.detailModal(item) }} style={{background: '#2b465f'}}>查看</a> */}
                {item.state !== 0 ? <a
                    className="mr10 opt-btn"
                    onClick={() => { this.detailModal(item) }}
                    style={{background: '#E95D01'}}>
                    重新审核
                </a> : <a
                    className="mr10 opt-btn"
                    onClick={() => { this.detailModal(item) }}
                    style={{background: '#108ee9'}}>
                    开始审核
                </a>}
                {/* <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
                    {item.recommend === 1 ? '取消推荐' : '推荐'}
                </a><a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                {/* <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                    {item.status === 1 ? '撤回' : '发布'}
                </a> */}
                {/* <a onClick={() => this.delAudit(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a> */}
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'pageSize': 200, 'totalCount': 0}))
        // dispatch(selectedData({}))
    }
    createMarkup (str) { return {__html: str} }

    // 认证状态
    auditStatus (id) {
        let name = ''
        auditStatus.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            type: filter.type,
            state: filter.status,
            search: search.search,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getAuditList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'currentPage': 1})
        dispatch(setPageData({'currPage': 1}))
    }
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch('init', {'currentPage': page, state: filter.status})
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({status: value}))
        this.setState({
            auditStatus: value,
            loading: true
        })
        this.doSearch('init', {'currentPage': 1, state: value})
    }

    // 筛选类型
    typeChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({type: value}))
        this.setState({
            loading: true
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    // 详情
    detailModal (obj) {
        hashHistory.push({
            pathname: '/audit-details',
            query: {id: obj.passportid}
        })
        const {dispatch} = this.props
        dispatch(selectedData(obj))
        Cookies.set('hx_identify_info', JSON.stringify(obj))
    }

    handleOk = (e) => {
        this.setState({
            visible: false
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    }

    handleImgModalCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    render () {
        const {list, filter, dispatch, search, pageData} = this.props
        return <div className="audit-index">
            <Row>
                <Col span={22} className="audit-position">
                    <span>审核状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {auditStatus.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    {/*
                    <span style={{marginLeft: 10}}>认证类型：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120 }} onChange={this.typeChange}>
                        <Option value=''>全部</Option>
                        <Option value='1'>个人认证</Option>
                        <Option value='2'>媒体认证</Option>
                        <Option value='3'>企业/机构认证</Option>
                    </Select>
                    */}
                    <Input
                        value={search.search}
                        style={{width: 150, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({search: e.target.value}))}
                        placeholder="手机号/昵称/姓名"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal className="pre-Modal" visible={this.state.previewVisible} footer={null} onCancel={this.handleImgModalCancel}>
                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        auditInfo: state.auditInfo,
        selectedData: state.auditInfo.selectedData,
        list: state.auditInfo.list,
        search: state.auditInfo.search,
        filter: state.auditInfo.filter,
        pageData: state.auditInfo.pageData
    }
}

export default connect(mapStateToProps)(AuditIndex)
