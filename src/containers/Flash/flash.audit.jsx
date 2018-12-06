/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, message, Spin, Row, Col, Select } from 'antd'
import './flash.scss'
import { Link } from 'react-router'
import {getFlashList, setSearchQuery, setPageData} from '../../actions/audit/flashAudit.action'
import {getTypeList} from '../../actions/index'
import {formatDate, axiosAjax, cutString, flashAuditStatus} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option
let columns = []
class FlashIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            flashStatus: ''
        }
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

    componentWillMount () {
        const {dispatch, search} = this.props
        dispatch(getTypeList())
        this.doSearch(!search.type ? 'init' : search.type)
        columns = [{
            title: '快讯内容',
            width: '500px',
            key: 'content',
            render: (text, record) => (<div className="flash-info clearfix">
                <div>
                    <h4>【{record.title || '快讯'}】{cutString(record.content, 50)}</h4>
                    {/*
                    <div>
                        {!parseInt(record.isTop) ? '' : <div style={{'display': 'inline-block'}}><span className="org-bg mr10">置顶</span></div>}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                    </div>
                    */}
                </div>
                {!record.pictureUrl ? '' : <img src={record.pictureUrl.split(',')[0]} />}
            </div>)
        }, {
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName'
        }, {
            title: '利好',
            dataIndex: 'upCounts',
            key: 'upCounts',
            render: (record) => record || 0
        }, {
            title: '利空 ',
            dataIndex: 'downCounts',
            key: 'downCounts',
            render: (record) => record || 0
        }, {
            title: '状态',
            key: 'status',
            render: (record) => {
                if (record.status === 0) {
                    return <span className="state-btns prev">待审核</span>
                } else if (record.status === 1) {
                    return <span className="state-btns pass">审核通过</span>
                } else if (record.status === 2) {
                    return <div>
                        <span className="state-btns nopass">审核未通过</span>
                        <p style={{marginTop: 10}}>(原因：{record.nopassLivesReason})</p>
                    </div>
                } else {
                    return <span className="state-btns none">状态暂无</span>
                }
            }
        }, {
            title: '发表时间',
            key: 'createdTime',
            render: (record) => (formatDate(record.createdTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link className="mr10" to={{pathname: '/flash-auditEdit', query: {id: item.id, audit: true}}}>
                    {item.status === 0 ? '审核' : '重新审核'}
                </Link>
                {/* <a className="mr10" href="javascript:void(0)" onClick={() => this._isTop(item)}>{item.isTop === '1' ? '取消置顶' : '置顶'}</a> */}
                {/* <a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                {/* <a onClick={() => this.delFlash(item)} className="mr10" href="javascript:void(0)">删除</a> */}
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search} = this.props
        let sendData = {
            currentPage: pageData.currPage,
            status: search.status
        }
        sendData = {...sendData, ...data}
        dispatch(getFlashList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    _search () {
        const {dispatch} = this.props
        let type = 'init'
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search} = this.props
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page})
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setSearchQuery({status: value}))
        this.setState({
            flashStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    // 删除
    delFlash (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: -1
                }
                axiosAjax('POST', '/lives/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 禁评、取消禁评
    _forbidcomment (item) {
        const {dispatch} = this.props
        let sendData = {
            // 'appId': $.cookie('gameId'),
            'id': item.id,
            'operate': !parseInt(item.forbidComment) ? '1' : '0'
        }
        axiosAjax('post', '/post/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (item) {
        const {dispatch} = this.props
        let sendData = {
            // 'appId': $.cookie('gameId'),
            'id': item.id,
            'operate': item.isTop === '1' ? '0' : '1'
        }
        axiosAjax('post', '/post/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }
    render () {
        const {list, pageData, search} = this.props
        // const {list, search, pageData, dispatch} = this.props
        return <div className="flash-index">
            <Row>
                <Col span={3} style={{minWidth: 200}}>
                    <span>帖子状态：</span>
                    <Select defaultValue={`${search.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {flashAuditStatus.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        flashInfo: state.flashAuditInfo,
        list: state.flashAuditInfo.list,
        search: state.flashAuditInfo.search,
        pageData: state.flashAuditInfo.pageData,
        flashTypeList: state.flashTypeListInfo
    }
}

export default connect(mapStateToProps)(FlashIndex)
