/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Input, Row, Col, Button, Table, Modal, message } from 'antd'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form } from 'antd'
import './index.scss'
import { Link, hashHistory } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getActivityPublishList, setSearchQuery, setPageData, setFilterData, editActivityPublishList, selectedData} from '../../actions/activity/activityPublish.action'
import {getActivityCityList} from '../../actions/index'
import {formatDate, axiosAjax, cutString} from '../../public/index'
import moment from 'moment'
// import Cookies from 'js-cookie'
const confirm = Modal.confirm
const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 }
    }
}
let columns = []
class ActivityPublishIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            activityId: ''
        }
    }

    channelName (id) {
        let name = ''
        this.props.placeList.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search, filter, dispatch} = this.props
        dispatch(getActivityCityList())
        this.doSearch('init', {...filter, title: search.title})
        /*
        let readCountsCol = parseInt(Cookies.get('hx_role')) === 3 ? [{
            width: 60,
            title: '全部点击量',
            dataIndex: 'readCounts',
            key: 'readCounts'
        }, {
            width: 60,
            title: 'App 点击量',
            dataIndex: 'appReadCount',
            key: 'appReadCount'
        }] : []
        */
        let optionCol = [{
            title: '推荐',
            key: 'option',
            width: 110,
            render: (item) => (<div className="btns">
                <p>
                    <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
                        {item.recommend === 1 ? '取消推荐' : '推荐'}
                    </a>
                </p>
                <p>
                    {parseInt(item.topOrder) ? <a
                        className="mr10 opt-btn"
                        href="javascript:void(0)"
                        style={{background: '#ff4f3e'}}
                        onClick={() => this.cancelTop(item.id)}
                    >取消置顶</a> : <a
                        className={`mr10 top-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`}
                        disabled={item.status !== 1 && true}
                        href="javascript:void(0)"
                        onClick={() => this.showToTopModal(item.id, item)}
                    >置顶</a>}
                </p>
                {parseInt(item.topOrder) ? <p><a
                    className={`mr10 top-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`}
                    disabled={item.status !== 1 && true}
                    href="javascript:void(0)"
                    onClick={() => this.showToTopModal(item.id, item)}
                >修改置顶位</a></p> : ''}
            </div>)
        }, {
            title: '操作',
            key: 'action',
            width: 130,
            render: (item) => {
                return <div className="btns">
                    <p>
                        <Link className="mr10 opt-btn" to={{pathname: '/activityPublish-detail', query: {id: item.id}}} style={{background: '#108ee9'}}>详情</Link>
                    </p>
                    <p>
                        <Link className="mr10 opt-btn" to={{pathname: '/activityPublish-send', query: {id: item.id}}} style={{background: '#e35ba3'}}>编辑</Link>
                    </p>
                    <p>
                        <a disabled={item.status !== 1 && item.status !== 0} className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                            {(() => {
                                if (item.status === 1) {
                                    return '撤回'
                                } else if (item.status === 0) {
                                    return '发布'
                                } else if (item.status === -1) {
                                    return '已删除'
                                } else {
                                    return '不可操作'
                                }
                            })()}
                        </a>
                    </p>
                    <p>
                        <a onClick={() => this.delActivityPublish(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>
            }
        }]
        let basicCol = [{
            title: '活动标题',
            width: 200,
            key: 'name',
            render: (text, record) => (record && <div className="activityPublish-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 30))} />
                    {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="org-bg mr10">推荐</span></div>}
                    {record.status !== 1 ? <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="gray-bg mr10">未发布</span></div> : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="green-bg mr10">已发布</span></div>}
                    {!record.topOrder || parseInt(record.topOrder) === 0 ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}} className="news-top clearfix">
                        <span className="top-bg">置顶({record.topOrder})</span>
                    </div>}
                    {/*
                    <div>
                        {(record.original && parseInt(record.original) === 1) ? <div style={{'display': 'inline-block'}}><span className="green-bg mr10">独家</span></div> : ''}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                    </div>
                    */}
                </div>
            </div>)
        }, {
            title: '状态',
            key: 'ingOrEnd',
            width: 80,
            render: (record) => {
                if (record && record.ingOrEnd === 2) {
                    return <span className="news-status pre-publish">已结束</span>
                } else if (record && record.ingOrEnd === 1) {
                    return <span className="news-status">进行中</span>
                } else {
                    return <span className="news-status will-publish">暂无</span>
                }
            }
        }, {
            title: '城市',
            width: 50,
            dataIndex: 'place',
            key: 'place',
            render: (record) => {
                if (record === 'overseas') {
                    return '海外'
                } else if (record === 'others') {
                    return '其他'
                } else {
                    return record
                }
            }
        }, {
            title: '开始时间',
            key: 'startTime',
            width: 150,
            render: (record) => (record && formatDate(record.startTime))
        }, {
            title: '结束时间',
            key: 'endTime',
            width: 150,
            render: (record) => (record && formatDate(record.endTime))
        }]
        columns = [...basicCol, ...optionCol]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    // 取消置顶
    cancelTop (id) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要取消置顶吗 ?`,
            onOk () {
                let sendData = {
                    id: id,
                    topOrder: 0
                }
                axiosAjax('POST', '/activity/settoporder', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('取消置顶成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 活动置顶
    showToTopModal (id, item) {
        const {dispatch} = this.props
        this.setState({
            activityId: id,
            topIsShow: true
        })
        dispatch(selectedData(item))
    }

    setNewsTop () {
        const form = this.props.form
        const _this = this
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.setState({ topIsShow: false })
            axiosAjax('post', '/activity/settoporder', {
                'id': this.state.activityId,
                'topOrder': values.order
            }, function (res) {
                if (res.code === 1) {
                    message.success('操作成功！')
                    _this.doSearch('init')
                } else {
                    message.error(res.msg)
                }
            })
            form.resetFields()
        })
    }

    disabledDate = (current) => {
        return current && current < moment().endOf('hours')
    }

    changeTopValue (e, record) {
        const {dispatch} = this.props
        let val = e.target.value
        if (parseInt(val) === 0) {
            // this.newsIsToTop({'id': record.id, 'topOrder': val})
            message.warning('置顶权重值不能为0！')
            return
        }
        dispatch(editActivityPublishList({topOrder: val}, record.key))
    }

    _editTopValue (e, item) {
        // console.log(item)
        // const {dispatch} = this.props
        let val = e.target.value
        // let index = item.key
        let id = item.id
        // editActivityPublishList(data, index)
        if (!val) {
            message.warning('请输入置顶权重值！')
        } else if (!(/^\d+$/.test(val))) {
            message.warning('置顶权重值必须是整数！')
        } else {
            this.newsIsToTop({
                'id': id,
                'topOrder': val
            })
        }
    }

    doSearch (type, data) {
        console.log(123)
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            title: search.title,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        this.setState({
            loading: true
        })
        sendData = {...sendData, ...data}
        dispatch(getActivityPublishList('init', sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch, search} = this.props
        let type = 'init'
        if (!search.nickName && !search.title) {
            type = 'init'
        } else {
            type = 'init'
        }
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }
    // 删除
    delActivityPublish (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: -1
                }
                axiosAjax('POST', '/activity/status', {...sendData}, (res) => {
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

    // 发布或下线活动
    _isPublish (item) {
        const {dispatch} = this.props
        const _this = this
        let status = () => {
            if (item.status === 0) {
                return 1
            } else {
                return 0
            }
        }

        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '下线' : '发布'}吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: status()
                }
                axiosAjax('POST', '/activity/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 1 ? '下线' : '发布'}成功`)
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 推荐
    _isTop (item) {
        const This = this
        confirm({
            title: '提示',
            content: `确认要${item.recommend === 1 ? '撤销推荐（从轮播位撤回）' : '推荐到轮播位'}吗 ?`,
            onOk () {
                let sendData = {
                    'id': item.id,
                    'recommend': item.recommend === 1 ? 0 : 1
                }
                axiosAjax('POST', '/activity/recommend', sendData, (res) => {
                    if (res.code === 1) {
                        message.success(`操作成功`)
                        This.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 筛选活动状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            newsStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    // 筛选推荐状态
    handleChange1 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'recommend': value}))
        this.doSearch('init', {'currentPage': 1, recommend: value})
    }

    // 筛选活动类别
    handleChange2 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'ingOrEnd': value}))
        this.doSearch('init', {'currentPage': 1, ingOrEnd: value})
    }

    render () {
        const {list, pageData, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="activityPublish-index">
            <Row>
                <Col>
                    <span>未发布/已发布：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100, marginBottom: 10 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">已发布</Option>
                        <Option value="0">未发布</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>状态：</span>
                    <Select defaultValue={`${filter.ingOrEnd}`} style={{ width: 100 }} onChange={this.handleChange2}>
                        <Option value="">全部</Option>
                        <Option value="1">进行中</Option>
                        <Option value="2">已结束</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>推荐：</span>
                    <Select defaultValue={`${filter.recommend}`} style={{ width: 100 }} onChange={this.handleChange1}>
                        <Option value="">全部</Option>
                        <Option value="0">未推荐</Option>
                        <Option value="1">推荐</Option>
                    </Select>
                    {/*
                    <span style={{marginLeft: 15}}>城市：</span>
                    <Select defaultValue={`${filter.channelId}`} style={{ width: 100 }} onChange={this.handleChange2}>
                        <Option value="">全部</Option>
                        {this.props.placeList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    */}
                    <span style={{marginLeft: 15}}>活动标题：</span>
                    <Input
                        value={search.title}
                        style={{width: 150, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入活动标题"
                        onPressEnter={() => { this._search() }}
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => { hashHistory.push('/activityPublish-send') }}>新增</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="置顶权重"
                visible={this.state.topIsShow}
                onOk={() => this.setNewsTop()}
                onCancel={() => { this.setState({topIsShow: false}); form.resetFields() }}
            >
                <Form>
                    <FormItem {...formItemLayout} label="置顶权重">
                        {getFieldDecorator('order', {
                            rules: [{
                                required: true, message: '请输入置顶权重!'
                            }, {
                                pattern: /^[1-9]\d*$/, message: '设置权重必须大于0!'
                            }],
                            initialValue: selectedData.topOrder === 0 ? 1 : selectedData.topOrder
                        })(
                            <Input min={1}/>
                        )}
                    </FormItem>
                    {/*
                    <FormItem {...formItemLayout} label="失效热度">
                        {getFieldDecorator('topEndHotcount', {
                            rules: [{
                                required: true, message: '请输入置顶失效热度!'
                            }, {
                                pattern: /^[1-9]\d*$/, message: '置顶失效热度必须大于0!'
                            }],
                            initialValue: selectedData.topEndHotcount && selectedData.topEndHotcount !== 0 ? selectedData.topEndHotcount : 10000
                        })(
                            <Input min={10000}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="失效时间: "
                    >
                        {getFieldDecorator('topEndTime', {
                            rules: [{required: true, message: '请选择置顶失效时间！'}],
                            initialValue: (selectedData.topEndTime && selectedData.topEndTime !== '') ? moment(formatDate(selectedData.topEndTime), 'YYYY-MM-DD HH:mm:ss') : moment().add('hours', 1)
                        })(
                            <DatePicker
                                showTime
                                disabledDate={this.disabledDate}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        )}
                    </FormItem>
                     */}
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        activityPublishInfo: state.activityPublishInfo,
        list: state.activityPublishInfo.list,
        search: state.activityPublishInfo.search,
        filter: state.activityPublishInfo.filter,
        pageData: state.activityPublishInfo.pageData,
        selectedData: state.activityPublishInfo.selectedData,
        placeList: state.placeListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(ActivityPublishIndex))
