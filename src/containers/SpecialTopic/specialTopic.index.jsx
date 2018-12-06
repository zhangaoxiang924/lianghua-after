/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Button, InputNumber, Input } from 'antd'
import './index.scss'
import { Link, hashHistory } from 'react-router'
import {getSpecialTopicList, getTopNum, setSearchQuery, setPageData, setFilterData} from '../../actions/others/specialTopic.action'
import {axiosAjax, cutString, topicStatusOptions} from '../../public/index'
// import IconItem from '../../components/icon/icon'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class SpecialTopicIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            previewVisible: false,
            previewImage: '',
            status: null,
            order: 1,
            recommend: '',
            recommendVisible: false
        }
    }

    componentWillMount () {
        const {filter} = this.props
        this.doSearch('init', {status: filter.status})
        columns = [{
            title: '专题名称',
            key: 'topicName',
            render: (text, record) => (record && <div className="specialTopic-info clearfix">
                <div>
                    <h4 title={record.topicName} dangerouslySetInnerHTML={this.createMarkup(cutString(record.topicName, 50))} />
                    {parseInt(record.status) !== 2 ? '' : <div style={{'display': 'inline-block'}}><span className="specialTopic-status has-publish mr10">首页展示中</span></div>}
                    {!record.recommend ? '' : <div style={{'display': 'inline-block'}}><span className="specialTopic-status has-recommend mr10">推荐中</span></div>}
                </div>
            </div>)
        }, {
            title: '关键字',
            key: 'tags',
            render: (record) => {
                if (record && record.tags) {
                    return <span className="specialTopic-status pre-publish">{record.tags}</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: 'PC 端封面',
            dataIndex: 'pcImgSrc',
            key: 'pcImgSrc',
            render: (record) => <div
                className="shrinkPic"
                key={record}
                style={{
                    background: `url(${record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'}) no-repeat center / cover`
                }}
                src={record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'}
                onClick={this.handlePreview}
            />
        },
        // , {
        //     title: 'PC 端背景',
        //     dataIndex: 'pcBackImage',
        //     key: 'pcBackImage',
        //     render: (record) => (<img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'} alt=""/>)
        // }, {
        //     title: '手机端封面 ',
        //     dataIndex: 'mImgSrc',
        //     key: 'mImgSrc',
        //     render: (record) => (<img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'} alt=""/>)
        // }, {
        //     title: '手机端背景',
        //     dataIndex: 'mBackImage',
        //     key: 'mBackImage',
        //     render: (record) => (<img onClick={this.handlePreview} style={{width: 70, cursor: 'pointer'}} src={record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'} alt=""/>)
        // }
        {
            title: '重新编辑',
            key: 'option',
            render: (record) => {
                return <div>
                    <p style={{marginBottom: 10}}><Link className="mr10 opt-btn" to={{pathname: '/specialTopic-edit', query: {id: record.id}}} style={{background: '#dd274e'}}>修改专题展示</Link></p>
                    <p><Link className="mr10 opt-btn" to={{pathname: '/topicContent-edit', query: {id: record.id}}} style={{background: '#007bff'}}>修改专题内容</Link></p>
                </div>
            }
        }, {
            title: '首页展示权重',
            width: 100,
            key: 'setTop',
            render: (record) => {
                if (parseInt(record.setTop) === 0 && parseInt(record.status) === 1) {
                    return '无权限'
                } else {
                    return record.setTop
                }
            }
        }, {
            title: '操作',
            key: 'action',
            render: (item) => {
                let btn = ''
                switch (item.status) {
                    case 1:
                        btn = <p><a className="mr10 opt-btn" onClick={() => this.topicToHome(item)} style={{background: '#00b45a'}}>展示到首页</a></p>
                        break
                    case 2:
                        btn = <div>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.topicToHome(item)} style={{background: '#00b45a'}}>修改首页权重</a></p>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.backFromHome(item)} style={{background: '#e9892f'}}>撤销首页展示</a></p>
                        </div>
                        break
                    default:
                        btn = ''
                }
                return <div>
                    {/*
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.handleRecommend(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#f681a1'}}>{!item.recommend ? '推荐' : '撤回推荐'}</a>
                    </p>
                    */}
                    {btn}
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.delSpecialTopic(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>
            }
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    // 状态改变
    channelName (id) {
        let name = ''
        topicStatusOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    // 列表展示
    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData, filter, search} = this.props
        let sendData = {
            search: search.search,
            type: 4,
            status: filter.status,
            recommend: filter.recommend,
            pageSize: 20,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getSpecialTopicList(type, sendData, () => {
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

    // 筛选推荐
    handleRecSelect = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'recommend': value}))
        this.setState({
            recommend: value
        })
        this.doSearch('init', {'currentPage': 1, recommend: value})
    }

    // 删除
    delSpecialTopic (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: 0
                }
                axiosAjax('POST', '/topic/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
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

    topicToHome (item) {
        const _this = this
        const {dispatch} = this.props
        dispatch(getTopNum(4, (arr) => {
            confirm({
                title: '提示',
                content: <div className="modal-input">
                    <span style={{marginRight: 10}}>请输入首页推荐位置的权重：(权重越高越靠前)</span>
                    <p>已被占用的权重：<span>{arr.join(', ')}</span></p>
                    <InputNumber min={1} defaultValue={item.setTop || 1} autoFocus type="number" onChange={_this.getOrderNum}/>
                </div>,
                onOk () {
                    let {order} = _this.state
                    if (order.toString().trim() === '') {
                        message.error('推荐位的权重值不能为空！')
                        return false
                    }
                    let sendData = {
                        id: item.id,
                        status: 2,
                        type: item.type,
                        setTop: order
                    }

                    if (_this.props.numArr.indexOf(order) !== -1) {
                        confirm({
                            title: '提示',
                            content: <div>
                                <h3>{order} 号推荐位置已经被占用！</h3>
                                <h3>点击确定原有推荐位将被删除！</h3>
                            </div>,
                            onOk () {
                                axiosAjax('POST', '/topic/status', {...sendData}, (res) => {
                                    if (res.code === 1) {
                                        message.success('替换成功')
                                        _this.doSearch('init')
                                    } else {
                                        message.error(res.msg)
                                    }
                                })
                            }
                        })
                    } else {
                        axiosAjax('POST', '/topic/status', {...sendData}, (res) => {
                            if (res.code === 1) {
                                message.success('操作成功')
                                _this.doSearch('init')
                            } else {
                                message.error(res.msg)
                            }
                        })
                    }
                }
            })
        }))
    }

    backFromHome (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要撤销在首页的展示吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: 1
                }
                axiosAjax('POST', '/topic/status', {...sendData}, (res) => {
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

    // 推荐到Banner位
    handleRecommend (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${!item.recommend ? '推荐到Banner位' : '取消推荐'}吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    recommend: !item.recommend ? 1 : 0
                }
                axiosAjax('POST', '/topic/setrecommend', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`操作成功！`)
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
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
        const {list, pageData, filter, search, dispatch} = this.props
        return <div className="specialTopic-index">
            <Row>
                <Col>
                    <span>专题筛选：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {topicStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    {/*
                    <span style={{marginLeft: 15}}>专题推荐：</span>
                    <Select defaultValue={`${filter.recommend}`} style={{width: 120, marginRight: 15}} onChange={this.handleRecSelect}>
                        {topicRecommendOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    */}
                    <Input
                        value={search.search}
                        style={{width: 150, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({search: e.target.value}))}
                        placeholder="请输入标题搜索"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => hashHistory.push('/specialTopic-add')}>新增专题</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currentPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
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
        specialTopicInfo: state.specialTopicInfo,
        list: state.specialTopicInfo.list,
        search: state.specialTopicInfo.search,
        filter: state.specialTopicInfo.filter,
        pageData: state.specialTopicInfo.pageData,
        numArr: state.specialTopicInfo.numArr
    }
}

export default connect(mapStateToProps)(SpecialTopicIndex)
