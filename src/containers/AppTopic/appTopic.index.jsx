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
import {getAppTopicList, getTopNum, setSearchQuery, setPageData, setFilterData} from '../../actions/app/appTopic.action'
import {axiosAjax, cutString, topicStatusOptions, topicTypeOptions} from '../../public/index'
import {getChannelList} from '../../actions/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class AppTopicIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            previewVisible: false,
            previewImage: '',
            status: null,
            type: '0',
            order: 1,
            recommendVisible: false
        }
    }

    componentWillMount () {
        const {filter, dispatch} = this.props
        dispatch(getChannelList())
        this.doSearch('init', {status: filter.status})
        columns = [{
            title: '标题',
            key: 'topicName',
            render: (text, record) => (record && <div className="appTopic-info clearfix">
                <div>
                    <h4 title={record.topicName} dangerouslySetInnerHTML={this.createMarkup(cutString(record.topicName, 50))} />
                    {parseInt(record.status) !== 2 ? '' : <div style={{'display': 'inline-block'}}><span className="appTopic-status has-publish mr10">首页展示中</span></div>}
                </div>
            </div>)
        }, {
            title: '手机端封面 ',
            dataIndex: 'mImgSrc',
            key: 'mImgSrc',
            render: (record) => <div
                className="shrinkPic"
                key={record}
                style={{
                    background: `url(${record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'}) no-repeat center / cover`
                }}
                src={record || 'http://static.huoxing24.com/images/2018/03/31/1522470188490129.png'}
                onClick={this.handlePreview}
            />
        }, {
            title: '状态',
            key: 'status',
            render: (text, record) => {
                if (record.status === 0) {
                    return <span className="banner-status pre-publish">已撤回</span>
                } else if (record.status === 1) {
                    return <span className="banner-status has-publish">展示中</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '类型',
            key: 'type',
            render: (record) => {
                if (record && record.type === 1) {
                    return <span className="appTopic-status link">链接跳转</span>
                } else if (record && record.type === 2) {
                    return <span className="appTopic-status will-publish">待定</span>
                } else if (record && record.type === 3) {
                    return <span className="appTopic-status news">新闻</span>
                } else if (record && record.type === 5) {
                    return <span className="appTopic-status authorInfo">作者信息</span>
                } else {
                    return <span className="appTopic-status no">暂无</span>
                }
            }
        }, {
            title: '相关信息',
            key: 'typeLink',
            width: 500,
            render: (record) => {
                if (record.type === 1) {
                    return <a target="_blank" href={record.typeLink && record.typeLink.trim() !== '' ? record.typeLink : '#/appTopic-list'}>{record.typeLink && record.typeLink.trim() !== '' ? record.typeLink : '暂无链接'}</a>
                } else if (record.type === 2) {
                    return <p>待定</p>
                } else if (record.type === 3) {
                    if (parseInt(record.typeLink).toString() === record.typeLink) {
                        return <p>频道：{this.channelName(record.typeLink)}</p>
                    } else {
                        return <p>新闻关键字：{record.typeLink || '暂无'}</p>
                    }
                } else if (record.type === 5) {
                    return <p>作者昵称/ID：{record.typeLink}</p>
                }
            }
        }, {
            title: '推荐位权重',
            width: 100,
            key: 'setTop',
            render: (record) => {
                if (!record.setTop || parseInt(record.setTop) === 0 || parseInt(record.status) === 1) {
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
                        btn = <p><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>展示</a></p>
                        break
                    case 2:
                        btn = <div>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>修改展示权重</a></p>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.backRecommend(item)} style={{background: '#e9892f'}}>撤回(取消展示)</a></p>
                        </div>
                        break
                    default:
                        btn = ''
                }
                return <div>
                    <p style={{marginBottom: 10}}><Link className="mr10 opt-btn" to={{pathname: '/appTopic-add', query: {id: item.id}}} style={{background: '#49a9ee'}}>修改轮播内容</Link></p>
                    {btn}
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.delAppTopic(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
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
        this.props.channelList.map((item, index) => {
            if (parseInt(item.value) === parseInt(id)) {
                name = item.label
            }
        })
        return name
    }

    // 列表展示
    doSearch (type, data) {
        const {dispatch, pageData, filter} = this.props
        let sendData = {
            type: filter.type,
            status: filter.status,
            pageSize: 20,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getAppTopicList(type, sendData, () => {
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

    // 筛选展示状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            status: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    // 筛选类型
    handleTypeChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            type: value
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    // 删除
    delAppTopic (item) {
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

    recommendTopic (item) {
        const _this = this
        if (!item.setTop || parseInt(item.setTop) === 0 || parseInt(item.status) === 1) {
            this.setState({
                order: 1
            })
        } else {
            this.setState({
                order: item.setTop
            })
        }
        const {dispatch} = this.props
        dispatch(getTopNum(1, (arr) => {
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
                        status: 2,
                        type: item.type,
                        setTop: order
                    }

                    if (_this.props.numArr.indexOf(order) !== -1) {
                        confirm({
                            title: '提示',
                            content: <div>
                                <h3>{order} 号轮播位置已经被占用！</h3>
                                <h3>点击确定原有轮播内容将被 替换！</h3>
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

    backRecommend (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要撤回推荐吗 ?`,
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

    // 发表或存草稿
    _isPublish (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${item.status === 0 ? '开启直播' : '结束直播'}吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: item.status === 0 ? 1 : 0
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
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
            'recommend': item.recommend === 1 ? 0 : 1
        }
        axiosAjax('post', '/ico/recommend', sendData, (res) => {
            if (res.code === 1) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
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
        return <div className="appTopic-index">
            <Row>
                <Col>
                    <span>状态筛选：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {topicStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <span style={{ marginLeft: 10 }}>类型筛选：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120 }} onChange={this.handleTypeChange}>
                        <Option value="0">全部</Option>
                        {topicTypeOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => hashHistory.push('/appTopic-add')}>新增</Button>
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
        appTopicInfo: state.appTopicInfo,
        list: state.appTopicInfo.list,
        search: state.appTopicInfo.search,
        filter: state.appTopicInfo.filter,
        pageData: state.appTopicInfo.pageData,
        numArr: state.appTopicInfo.numArr,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(AppTopicIndex)
