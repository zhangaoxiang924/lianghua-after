/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Button, Input, InputNumber } from 'antd'
import CollectionCreateForm from './ModalForm'
import './index.scss'
import { hashHistory } from 'react-router'
import {getNewsMergeList, setSearchQuery, setPageData, setFilterData} from '../../actions/post/newsMerge.action'
import {axiosAjax, cutString, mergeStatusOptions, mergeTypeOptions} from '../../public/index'
import {getSignature} from '../../public/sig'
import Cookies from 'js-cookie'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class NewsMergeIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            loading: true,
            previewVisible: false,
            previewImage: '',
            status: null,
            type: '0',
            order: '',
            recommendVisible: false,
            codeValue: ''
        }
    }

    componentWillMount () {
        console.log(getSignature(4711676588, 0))
        const {filter} = this.props
        this.doSearch('init', {status: filter.status})
        columns = [{
            title: '名称',
            key: 'publicName',
            render: (text, record) => (record && <div className="columnAuthor-info clearfix">
                <div>
                    <h3 title={record.publicName} dangerouslySetInnerHTML={this.createMarkup(cutString(record.publicName, 50))} />
                    <span style={{marginTop: 5}}>(排序: {record.rank})</span>
                </div>
            </div>)
        }, {
            title: '来源',
            key: 'type',
            render: (record) => {
                if (record && record.type === 0) {
                    return <span className="newsMerge-status pre-publish">微信公众号</span>
                } else if (record && record.type === 1) {
                    return <span className="newsMerge-status pre-publish">网站</span>
                } else if (record && record.type === 2) {
                    return <span className="newsMerge-status pre-publish">头条号</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '地址',
            key: 'publicId',
            render: (record) => {
                if (record && record.publicId) {
                    return <span className="newsMerge-status" style={{background: '#ff8978'}}>{record.publicId}</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (record) => {
                if (parseInt(record) === 1) {
                    return <span className="newsMerge-status" style={{background: '#349d58'}}>正常</span>
                } else {
                    return <span className="newsMerge-status" style={{background: '#f2782a'}}>禁用</span>
                }
            }
        }, {
            title: '操作',
            key: 'option',
            render: (record) => {
                return (
                    <div>
                        <a disabled={record.status !== 1} onClick={() => this.intoContentList(record)} style={{background: '#3dadf2'}} className={`mr10 opt-btn ${record.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)">新闻列表</a>
                        <a disabled={record.status !== 1} onClick={() => this.changeRank(record)} style={{background: '#5d7bbe'}} className={`mr10 opt-btn ${record.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)">修改排序</a>
                        {parseInt(record.status) === 1 ? <a onClick={() => this.changeMergeStatus(record)} style={{background: '#f2782a'}} className="mr10 opt-btn" href="javascript:void(0)">
                            禁用
                        </a> : <a onClick={() => this.changeMergeStatus(record)} style={{background: '#349d58'}} className="mr10 opt-btn" href="javascript:void(0)">
                            启用
                        </a>}
                        <a onClick={() => this.delMerge(record)} style={{background: '#dd274e'}} className="mr10 opt-btn" href="javascript:void(0)">删除</a>
                    </div>
                )
            }
        }]
    }

    getUid = (url) => {
        let arr1 = url.split('user/')
        let uid = arr1[1].split('/')[0]
        let sig = JSON.parse(getSignature(uid || '', 0))
        Cookies.set('snuid', `${sig.as}&${sig.cp}&${sig._signature}`)
        return `${sig.as}&${sig.cp}&${sig._signature}`
    }

    intoContentList (item) {
        hashHistory.push({
            pathname: '/merge-edit',
            query: {
                snuid: item.type === 2 ? this.getUid(item.publicId) : '',
                id: item.publicId,
                type: item.type === 0 ? `weixin_${item.publicName}` : (item.type === 2 ? `toutiao_${item.publicName}` : item.publicName)
            }
        })
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    channelName (arr, id) {
        let name = ''
        arr.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    getOrderNum = (value) => {
        this.setState({
            order: value
        })
    }

    changeRank (item) {
        const _this = this
        this.setState({
            order: item.rank
        })
        confirm({
            title: '提示',
            content: <div className="modal-input">
                <span style={{marginRight: 10}}>请输入排序值：(数值越小越靠前)</span>
                <InputNumber min={1} defaultValue={item.rank || 1} autoFocus type="number" onChange={_this.getOrderNum}/>
            </div>,
            onOk () {
                let {order} = _this.state
                if (!order) {
                    message.error('排序值不能为空！')
                    return false
                }
                let sendData = {
                    type: item.type,
                    publicId: item.publicId,
                    newRank: order,
                    oldRank: item.rank
                }

                axiosAjax('POST', '/publicnum/updaterank', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 列表展示
    doSearch (type, data) {
        const {dispatch, pageData, filter, search} = this.props
        let sendData = {
            type: filter.type,
            status: filter.status,
            value: search.symbol,
            pageSize: 20,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getNewsMergeList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    // 点击搜索
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'currentPage': 1})
        dispatch(setPageData({'currentPage': 1}))
    }

    // 改变页数
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        dispatch(setPageData({'currentPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            status: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    // 筛选类型
    typeChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            type: value
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    // 改变状态
    changeMergeStatus (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${parseInt(item.status) === 1 ? '禁用' : '启用'}新闻主体吗 ?`,
            onOk () {
                let sendData = {
                    type: item.type,
                    publicId: item.publicId,
                    status: parseInt(item.status) === 1 ? 0 : 1
                }
                axiosAjax('POST', '/publicnum/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    delMerge (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `删除不可恢复，确认要删除此新闻主体吗？`,
            onOk () {
                let sendData = {
                    type: item.type,
                    publicId: item.publicId,
                    status: -1
                }
                axiosAjax('POST', '/publicnum/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    showModal = () => {
        this.setState({ visible: true })
    }
    handleFormCancel = () => {
        this.setState({ visible: false })
    }
    handleCreate = () => {
        const form = this.formRef.props.form
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            axiosAjax('POST', '/publicnum/addpublicnum', values, (res) => {
                if (res.code === 1) {
                    message.success('添加成功！')
                    this.doSearch('init')
                } else {
                    message.error(res.msg)
                }
            })
            form.resetFields()
            this.setState({ visible: false })
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    render () {
        const {list, pageData, filter, dispatch, search} = this.props
        return <div className="newsMerge-index">
            <Row>
                <Col>
                    <span>类型：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120 }} onChange={this.typeChange}>
                        {mergeTypeOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <span>状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {mergeStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <span style={{marginLeft: 15}}>新闻主体：</span>
                    <Input
                        value={search.symbol}
                        style={{width: 200, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({symbol: e.target.value}))}
                        onPressEnter={() => { this._search() }}
                        placeholder="输入 ID 或名称搜索"
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={this.showModal}>添加新闻主体</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currentPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleFormCancel}
                onCreate={this.handleCreate}
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        newsMergeInfo: state.newsMergeInfo,
        list: state.newsMergeInfo.list,
        search: state.newsMergeInfo.search,
        filter: state.newsMergeInfo.filter,
        pageData: state.newsMergeInfo.pageData,
        numArr: state.newsMergeInfo.numArr
    }
}

export default connect(mapStateToProps)(NewsMergeIndex)
