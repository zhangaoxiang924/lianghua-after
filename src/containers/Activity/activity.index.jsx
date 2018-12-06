/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Button, InputNumber } from 'antd'
import './index.scss'
import { Link, hashHistory } from 'react-router'
import {getActivityList, getTopNum, setPageData, setFilterData} from '../../actions/activity/activity'
import {axiosAjax, cutString, activityNameList, actPositionOptions} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option
const statusOptions = [
    {label: '未展示', value: '0'},
    {label: '展示中', value: '1'}
]
class ActivityIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            previewVisible: false,
            previewImage: '',
            status: null,
            recommend: '1',
            order: 1,
            recommendVisible: false
        }
        this.basic = [{
            title: '标题',
            key: 'title',
            render: (text, record) => (record && <div className="activity-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title || '无', 50))} />
                    {parseInt(record.status) !== 1 ? '' : <div style={{'display': 'inline-block'}}><span className="activity-status has-publish mr10">展示中</span></div>}
                </div>
            </div>)
        }, {
            title: '描述',
            key: 'description',
            render: (text, record) => (record && <div className="activity-info clearfix">
                <div>
                    <h4 title={record.description} dangerouslySetInnerHTML={this.createMarkup(cutString(record.description || '无', 50))} />
                </div>
            </div>)
        }, {
            title: '位置',
            key: 'recommend',
            render: (text, record) => {
                let name = this.channelName(actPositionOptions, record.recommend)
                if (record.recommend === 1) {
                    return <span className="activity-status news">{name}</span>
                } else if (record.recommend === 2) {
                    return <span className="activity-status authorInfo">{name}</span>
                } else if (record.recommend === 3) {
                    return <span className="activity-status ad">{name}</span>
                } else {
                    return '暂无'
                }
            }
        }, {
            title: '状态',
            key: 'status',
            width: 80,
            render: (text, record) => {
                if (record.status === 0) {
                    return <span className="activity-status pre-publish">已撤回</span>
                } else if (record.status === 1) {
                    return <span className="activity-status has-publish">展示中</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }]
        this.option = [{
            title: '操作',
            key: 'action',
            width: 130,
            render: (item) => {
                let btn = ''
                switch (item.status) {
                    case 0:
                        btn = <p><a className="mr10 opt-btn" onClick={() => this.backRecommend(item)} style={{background: '#00b45a'}}>展示</a></p>
                        break
                    case 1:
                        btn = <div>
                            {/* <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>修改展示权重</a></p> */}
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.backRecommend(item)} style={{background: '#e9892f'}}>撤回</a></p>
                        </div>
                        break
                    default:
                        btn = ''
                }
                return <div>
                    <p style={{marginBottom: 10}}><Link className="mr10 opt-btn" to={{pathname: '/activity-add', query: {id: item.id}}} style={{background: '#49a9ee'}}>修改</Link></p>
                    {btn}
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.delActivity(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>
            }
        }]
        this.pic = [{
            title: 'PC 端封面 ',
            dataIndex: 'pcRecommendImg',
            key: 'pcRecommendImg',
            render: (record) => (!record ? '—' : <img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'https://hx24.huoxing24.com/image/news/2018/08/15/1534305399664279.png'} alt=""/>)
        }, {
            title: '手机端封面 ',
            dataIndex: 'mImg',
            key: 'mImg',
            render: (record) => (!record ? '—' : <img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'https://hx24.huoxing24.com/image/news/2018/08/15/1534305399664279.png'} alt=""/>)
        }]
        this.pcBig = [{
            title: '底部左侧大图',
            dataIndex: 'pcBigImg',
            key: 'pcBigImg',
            render: (record) => (!record ? '—' : <img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'https://hx24.huoxing24.com/image/news/2018/08/15/1534305399664279.png'} alt=""/>)
        }]
        this.pcSmall = [{
            title: '底部右侧小图',
            dataIndex: 'pcSmallImg',
            key: 'pcSmallImg',
            render: (record) => (!record ? '—' : <img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'https://hx24.huoxing24.com/image/news/2018/08/15/1534305399664279.png'} alt=""/>)
        }]
    }

    componentWillMount () {
        const {filter} = this.props
        this.doSearch('init', {type: filter.type})
    }

    createMarkup (str) { return {__html: str} }

    // 状态改变
    channelName (arr, id) {
        let name = ''
        arr.map((item, index) => {
            if (parseInt(item.value) === parseInt(id)) {
                name = item.name
            }
        })
        return name
    }

    // 列表展示
    doSearch (type, data) {
        const {dispatch, pageData, filter} = this.props
        let sendData = {
            recommend: filter.recommend,
            status: filter.status,
            type: filter.type,
            pageSize: 20,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getActivityList(type, sendData, () => {
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
        const {dispatch, filter} = this.props
        dispatch(setPageData({'currentPage': page}))
        this.doSearch('init', {'currentPage': page, ...filter})
    }

    // 筛选活动
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            loading: true,
            type: value
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    // 筛选状态
    handleTypeChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            loading: true,
            status: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    // 筛选位置
    handleRecommendChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'recommend': value}))
        this.setState({
            loading: true,
            recommend: value
        })
        // if (value === '1') {
        //     this.pic = [{
        //         title: 'PC 端封面 ',
        //         dataIndex: 'pcRecommendImg',
        //         key: 'pcRecommendImg',
        //         render: (record) => (!record ? '—' : <img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'https://hx24.huoxing24.com/image/news/2018/08/15/1534305399664279.png'} alt=""/>)
        //     }]
        // } else if (value === '2') {
        //     this.pic = this.pcBig
        // } else if (value === '3') {
        //     this.pic = this.pcSmall
        // } else {
        //     this.pic = [{
        //         title: 'PC 端封面 ',
        //         dataIndex: 'pcRecommendImg',
        //         key: 'pcRecommendImg',
        //         render: (record) => (!record ? '—' : <img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'https://hx24.huoxing24.com/image/news/2018/08/15/1534305399664279.png'} alt=""/>)
        //     }, ...this.pcBig, ...this.pcSmall]
        // }
        this.doSearch('init', {'currentPage': 1, recommend: value})
    }

    // 删除
    delActivity (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    status: -1,
                    id: item.id
                }
                axiosAjax('POST', '/specialtopic/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
                    } else {
                        res.msg && message.error(res.msg)
                    }
                })
            }
        })
    }

    getOrderNum = (value) => {
        this.setState({
            order: value
        })
    }

    recommendTopic (item) {
        const _this = this
        if (!item.showNum || parseInt(item.showNum) === 0 || parseInt(item.status) === 0) {
            this.setState({
                order: 1
            })
        } else {
            this.setState({
                order: item.showNum
            })
        }
        const {dispatch} = this.props
        dispatch(getTopNum((arr) => {
            confirm({
                title: '提示',
                content: <div className="modal-input">
                    <span style={{marginRight: 10}}>请输入首页推荐位置的权重：(权重越高越靠前)</span>
                    <p>已被占用的权重：<span>{arr.join(', ')}</span></p>
                    <InputNumber min={1} defaultValue={this.state.order} autoFocus type="number" onChange={_this.getOrderNum}/>
                </div>,
                onOk () {
                    let {order} = _this.state
                    if (order.toString().trim() === '') {
                        message.error('推荐位的权重值不能为空！')
                        return false
                    }
                    let sendData = {
                        id: item.id,
                        status: 1
                    }

                    if (item.status === 0) {
                        axiosAjax('POST', '/homerecommend/updateHomerecommendstatus', {...sendData}, (res) => {
                            if (res.code === 1) {
                                axiosAjax('post', '/homerecommend/updateHomerecommendshownum', {id: item.id, showNum: order}, (res) => {
                                    if (res.code === 1) {
                                        message.success('操作成功')
                                        _this.doSearch('init')
                                    } else {
                                        res.msg && message.error(res.msg)
                                    }
                                })
                            } else {
                                res.msg && message.error(res.msg)
                            }
                        })
                    } else {
                        axiosAjax('post', '/homerecommend/updateHomerecommendshownum', {id: item.id, showNum: order}, (res) => {
                            if (res.code === 1) {
                                message.success('操作成功')
                                _this.doSearch('init')
                            } else {
                                res.msg && message.error(res.msg)
                            }
                        })
                    }
                }
            })
        }))
    }

    backRecommend (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '撤回' : '展示'}吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: item.status === 0 ? 1 : 0
                }
                axiosAjax('POST', '/specialtopic/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        _this.doSearch('init')
                    } else {
                        res.msg && message.error(res.msg)
                    }
                })
            }
        })
    }

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    render () {
        // const {list, pageData, filter, search, dispatch} = this.props
        const {list, pageData, filter} = this.props
        return <div className="activity-index">
            <Row>
                <Col>
                    <span>活动筛选：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {activityNameList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <span style={{ marginLeft: 10 }}>位置筛选：</span>
                    <Select defaultValue={`${filter.recommend}`} style={{ width: 120 }} onChange={this.handleRecommendChange}>
                        <Option value=''>全部</Option>
                        {actPositionOptions.map(d => <Option value={d.value} key={d.value}>{d.name}</Option>)}
                    </Select>
                    <span style={{ marginLeft: 10 }}>状态筛选：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleTypeChange}>
                        <Option value=''>全部</Option>
                        {statusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => hashHistory.push('/activity-add')}>新增</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={[ ...this.basic, ...this.pic, ...this.pcBig, ...this.pcSmall, ...this.option ]} bordered pagination={{current: pageData.currentPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                    </Modal>
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        activityInfo: state.activityInfo,
        list: state.activityInfo.list,
        search: state.activityInfo.search,
        filter: state.activityInfo.filter,
        pageData: state.activityInfo.pageData,
        numArr: state.activityInfo.numArr
    }
}

export default connect(mapStateToProps)(ActivityIndex)
