/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form, DatePicker } from 'antd'
import './video.scss'
import { Link, hashHistory } from 'react-router'
import {getMiniVideoList, setSearchQuery, setPageData, setFilterData, newsToTop, editMiniVideoList, selectedData} from '../../../actions/miniApp/miniVideo.action'
import {formatDate, axiosAjax, cutString, channelIdOptions} from '../../../public/index'
import moment from 'moment'
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
class MiniVideoIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: ''
        }
    }

    channelName (id) {
        let name = ''
        channelIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch('init', {...filter, title: search.title})
        columns = [
            {
                title: '视频标题',
                key: 'name',
                render: (text, record) => (record && <div className="miniVideo-info clearfix">
                    <div>
                        <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 30))} />
                        <div>
                            {(record.original && parseInt(record.original) === 1) ? <div style={{'display': 'inline-block'}}><span className="green-bg mr10">独家</span></div> : ''}
                            {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="org-bg mr10">推荐</span></div>}
                            {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                            {/*
                            {parseInt(record.topOrder) === 0 ? '' : <Tooltip placement="bottom" title={`失效时间: ${moment(record.topEndTime).format('YYYY年MM月DD日 HH:mm:ss')}; 失效热度: ${record.topEndHotcount}`} >
                                <div className="news-top clearfix">
                                    <span className="top-bg">置顶</span>
                                    <Input
                                        className="top-num"
                                        onBlur = {(e) => this._editTopValue(e, record)}
                                        onChange={(e) => this.changeTopValue(e, record)}
                                        value={record.topOrder}
                                    />
                                </div>
                            </Tooltip>}
                            */}
                        </div>
                    </div>
                    {!record.pictureUrl ? '' : <img src={record.pictureUrl.split(',')[0]} />}
                </div>)
            },
            {
                title: '视频状态',
                key: 'status',
                render: (record) => {
                    if (record && record.status === 0) {
                        return <span className="news-status pre-publish">草稿</span>
                    } else if (record && record.publishTime <= Date.parse(new Date())) {
                        return <span className="news-status">已发表</span>
                    } if (record && record.publishTime > Date.parse(new Date())) {
                        return <span className="news-status will-publish">定时发表</span>
                    } else {
                        return <span>暂无</span>
                    }
                }
            },
            {
                title: '视频简介 ',
                dataIndex: 'content',
                key: 'content',
                render: (text) => (<span title={text} dangerouslySetInnerHTML={this.createMarkup(cutString(text, 50))} />)
            },
            {
                title: '发表时间',
                key: 'createTime',
                width: 150,
                render: (record) => (record && formatDate(record.publishTime))
            },
            // {
            //     title: '推荐/置顶',
            //     key: 'option',
            //     render: (item) => (<div className="btns">
            //         <p>
            //             <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
            //                 {item.recommend === 1 ? '取消推荐' : '推荐'}
            //             </a>
            //         </p>
            //         {/*
            //         <p>
            //             {parseInt(item.topOrder) ? <Tooltip placement="bottom" title={`置顶失效时间: ${moment(item.topEndTime).format('YYYY年MM月DD日 HH:mm:ss')}; 失效热度: ${item.topEndHotcount}`} >
            //                 <a
            //                     className="mr10 opt-btn"
            //                     href="javascript:void(0)"
            //                     style={{background: '#ff4f3e'}}
            //                     onClick={() => this.showToTopModal(parseInt(item.topOrder), item.id, item)}
            //                 >取消置顶</a>
            //             </Tooltip> : <a
            //                 className={`mr10 opt-btn top-btn ${item.status !== 1 ? 'disabled' : ''}`}
            //                 disabled={item.status !== 1 && true}
            //                 href="javascript:void(0)"
            //                 onClick={() => this.showToTopModal(parseInt(item.topOrder), item.id, item)}
            //             >置顶</a>}
            //         </p>
            //         */}
            //     </div>)
            // },
            {
                title: '操作',
                key: 'action',
                render: (item) => (<div className="btns">
                    <p>
                        <Link className="mr10 opt-btn" to={{pathname: '/miniVideo-detail', query: {id: item.id}}} style={{background: '#108ee9'}}>详情</Link>
                    </p>
                    <p>
                        <Link className="mr10 opt-btn" to={{pathname: '/miniVideo-send', query: {id: item.id}}} style={{background: '#e07091'}}>编辑</Link>
                    </p>
                    <p>
                        <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                            {(() => {
                                if (item.status === 1) {
                                    return '撤回到草稿'
                                } else if (item.status === 0) {
                                    if (item.publishTime > Date.parse(new Date())) {
                                        return '定时发表'
                                    } else {
                                        return '发表'
                                    }
                                }
                            })()}
                        </a>
                    </p>
                    {/* <a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                    <p>
                        <a onClick={() => this.delMiniVideo(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>)
            }
        ]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    // 视频置顶
    showToTopModal (topOrder, id, item) {
        const {dispatch} = this.props
        if (!topOrder) {
            this.setState({
                editNewsId: id,
                topIsShow: true
            })
            dispatch(selectedData(item))
        } else {
            this.newsIsToTop({
                'id': id,
                topEndHotcount: 0,
                'topOrder': 0,
                topEndTime: 0
            })
        }
    }

    newsIsToTop (sendData) {
        const {dispatch} = this.props
        dispatch(newsToTop(sendData, () => {
            this.doSearch('init')
            dispatch(setSearchQuery({'type': 'init'}))
        }))
    }

    setNewsTop () {
        const form = this.props.form
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.setState({ topIsShow: false })
            this.newsIsToTop({
                'id': this.state.editNewsId,
                'topOrder': values.order,
                'topEndHotcount': values.topEndHotcount,
                topEndTime: Date.parse(values.topEndTime.format('YYYY-MM-DD HH:mm:ss'))
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
        dispatch(editMiniVideoList({topOrder: val}, record.key))
    }

    _editTopValue (e, item) {
        // console.log(item)
        // const {dispatch} = this.props
        let val = e.target.value
        // let index = item.key
        let id = item.id
        // editMiniVideoList(data, index)
        if (!val) {
            message.warning('请输入置顶权重值！')
        } else if (!(/^\d+$/.test(val))) {
            message.warning('置顶权重值必须是整数！')
        } else {
            this.newsIsToTop({
                'id': id,
                topEndHotcount: item.topEndHotcount || 10000,
                'topOrder': val,
                topEndTime: item.topEndTime || Date.parse(moment().add('day', 1).format('YYYY-MM-DD HH:mm:ss'))
            })
        }
    }

    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            title: search.title,
            pageSize: 20,
            currentPage: pageData.currPage
            // 'appId': $.cookie('gameId')
        }
        if (type !== 'init') {
            sendData = {
                ...sendData,
                'nickName': search.nickName,
                'title': search.title
            }
        }
        sendData = {...sendData, ...data}
        dispatch(getMiniVideoList(type, sendData, () => {
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
    delMiniVideo (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id
                    // status: -1
                }
                axiosAjax('POST', '/miniappvideo/delete', {...sendData}, (res) => {
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

    // 发表或存草稿
    _isPublish (item) {
        const {dispatch} = this.props
        const _this = this
        // if (item.status === 0 && item.publishTime > Date.parse(new Date())) {
        //     message.error('视频发布时间大于当前时间，直接发表请先修改发布时间！')
        //     return false
        // }
        let status = () => {
            if (item.status === 0) {
                return 1
            } else {
                return 0
            }
        }

        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '撤回' : '发表'}吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: status()
                }
                axiosAjax('POST', '/miniappvideo/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 1 ? '撤回' : '发表'}成功`)
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

    // 推荐
    _isTop (item) {
        const {dispatch} = this.props
        let sendData = {
            // 'appId': $.cookie('gameId'),
            'id': item.id,
            'recommend': item.recommend === 1 ? 0 : 1
        }
        axiosAjax('post', '/miniappvideo/recommend', sendData, (res) => {
            if (res.code === 1) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 筛选视频状态
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

    // 筛选视频类别
    handleChange2 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'channelId': value}))
        this.doSearch('init', {'currentPage': 1, channelId: value})
    }

    render () {
        const {list, pageData, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="miniVideo-index">
            <Row>
                <Col>
                    <span>视频状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">已发表</Option>
                        <Option value="2">定时发表</Option>
                        <Option value="0">草稿箱</Option>
                    </Select>
                    {/*
                    <span style={{marginLeft: 15}}>推荐：</span>
                    <Select defaultValue={`${filter.recommend}`} style={{ width: 100 }} onChange={this.handleChange1}>
                        <Option value="">全部</Option>
                        <Option value="0">未推荐</Option>
                        <Option value="1">推荐</Option>
                    </Select>
                    // 筛选视频类别
                    <span style={{marginLeft: 15}}>视频类别：</span>
                    <Select defaultValue={`${filter.channelId}`} style={{ width: 100 }} onChange={this.handleChange2}>
                        <Option value="">全部</Option>
                        {channelIdOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    */}
                    <span style={{marginLeft: 15}}>视频标题：</span>
                    <Input
                        value={search.title}
                        style={{width: 150, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入视频标题"
                        onPressEnter={() => { this._search() }}
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => { hashHistory.push('/miniVideo-send') }}>新增</Button>
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
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        miniVideoInfo: state.miniVideoInfo,
        list: state.miniVideoInfo.list,
        search: state.miniVideoInfo.search,
        filter: state.miniVideoInfo.filter,
        pageData: state.miniVideoInfo.pageData,
        selectedData: state.miniVideoInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(MiniVideoIndex))
