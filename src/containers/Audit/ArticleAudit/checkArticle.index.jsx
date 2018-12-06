/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Form, Tag, Select, Input, Button, Tooltip, DatePicker } from 'antd'
import moment from 'moment'
import './checkArticle.scss'
import { Link } from 'react-router'
import IconItem from '../../../components/icon/icon'
import {getArticleList, setSearchQuery, setPageData, setFilterData, newsToTop, selectData, editArticleList} from '../../../actions/audit/articleAudit.action'
import {getChannelList} from '../../../actions/index'
import {formatDate, axiosAjax, cutString, isJsonString} from '../../../public/index'
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
class ArticleAuditIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null
        }
    }

    channelName (id) {
        let name = ''
        let hasId = this.props.channelList.every((item) => {
            return parseInt(item.value) !== id
        })
        if (hasId) {
            name = '无'
        } else {
            this.props.channelList.map((item, index) => {
                if (parseInt(item.value) === id) {
                    name = item.label
                }
            })
        }
        return name
    }

    componentWillMount () {
        const {search, filter, dispatch} = this.props
        dispatch(getChannelList())
        this.doSearch('init', {...filter, title: search.title})
        columns = [{
            title: '文章标题',
            key: 'name',
            width: 250,
            render: (text, record) => (record && <div className="post-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(record.title)} />
                    <div>
                        {(record.original && parseInt(record.original) === 1) ? <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="green-bg mr10">独家</span></div> : ''}
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="org-bg mr10">推荐</span></div>}
                        {/* !parseInt(record.status) === 0 ? '' : <span className="pre-bg">草稿状态</span> */}
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
                    </div>
                </div>
                {!record.pictureUrl ? '' : <img src={record.pictureUrl.split(',')[0]} />}
            </div>)
        }, {
            title: '文章状态',
            key: 'status',
            width: 100,
            render: (record) => {
                if (record && record.status === 4) {
                    return <span className="news-status audit-publish">审核中</span>
                } else if (record && record.status === 0) {
                    return <span className="news-status pre-publish">草稿箱</span>
                } else if (record && record.status === 1) {
                    return <span className="news-status has-publish">审核通过</span>
                } else if (record && record.status === 2) {
                    return <div>
                        <span className="news-status has-forbidden">审核驳回</span>
                        <p className="reason" style={{marginTop: 10}}>( 原因：{record.nopassReason && record.nopassReason.trim() !== '' ? record.nopassReason : '未填写'} )</p>
                    </div>
                } else if (record && record.status === 3) {
                    return <div>
                        <span className="news-status will-publish">定时发表</span>
                    </div>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '文章作者',
            dataIndex: 'author',
            key: 'author',
            width: 100,
            render: (text, record) => (record.author && record.author.trim() !== '' ? <span title={record.author}>{cutString(record.author, 25)}</span> : '无')
        }, {
            title: '频道 ',
            dataIndex: 'channelId',
            width: 50,
            key: 'channelId',
            render: (record) => {
                if (record) {
                    return this.channelName(record)
                } else {
                    return '暂无'
                }
            }
        }, {
            title: '标签',
            dataIndex: 'tags',
            width: 100,
            key: 'tags',
            render: (record) => ((record && record.trim() !== '') ? record.split(',').map((item, index) => {
                if (item.trim() === '') {
                    return ''
                } else {
                    return <Tag key={index} color="blue" style={{margin: '5px'}}>{item}</Tag>
                }
            }) : '无')
        }, {
            title: '发表时间',
            key: 'createTime',
            width: 130,
            render: (record) => (record && formatDate(record.publishTime))
        }, {
            title: '推荐/置顶',
            key: 'option',
            width: 120,
            render: (item) => (item.status === 0 ? '无' : <div className="btns checkBtns">
                <p style={{marginBottom: 10}}>
                    <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this.homeShow(item)} disabled={item.status !== 1 && true}>
                        {item.recCreaterType === 1 ? '从头条撤回' : '推至头条'}
                    </a>
                </p>
                {/*
                <p style={{marginBottom: 10}}>
                    <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
                        {item.recommend === 1 ? '取消推荐' : '推荐'}
                    </a>
                </p>
                */}
                <p>
                    {parseInt(item.topOrder) ? <Tooltip placement="bottom" title={`置顶失效时间: ${moment(item.topEndTime).format('YYYY年MM月DD日 HH:mm:ss')}; 失效热度: ${item.topEndHotcount}`} >
                        <a
                            className="mr10 opt-btn"
                            href="javascript:void(0)"
                            style={{background: '#ff4f3e'}}
                            onClick={() => this.showToTopModal(parseInt(item.topOrder), item.id, item)}
                        >取消置顶</a>
                    </Tooltip> : <a
                        className={`mr10 opt-btn topBtn ${(item.status !== 1 || item.recCreaterType !== 1) ? 'disabled' : ''}`}
                        disabled={(item.status !== 1 || item.recCreaterType !== 1) && true}
                        href="javascript:void(0)"
                        onClick={() => this.showToTopModal(parseInt(item.topOrder), item.id, item)}
                    >置顶</a>}
                </p>
            </div>)
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (item) => (item.status === 0 ? '无' : <div>
                {item.status === 4 ? <Link
                    className="mr10 opt-btn"
                    to={{pathname: '/checkArticle-detail', query: {id: item.id}}}
                    style={{background: '#108ee9'}}>
                    审核
                </Link> : <Link
                    className="mr10 opt-btn"
                    to={{pathname: '/checkArticle-detail', query: {id: item.id}}}
                    style={{background: '#2e55a3'}}>
                    重新审核
                </Link>}
                <p style={{margin: '10px 0'}}>
                    <a className={`mr10 opt-btn publish-btn ${item.status === 2 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isPublish(item)} disabled={item.status === 2 && true}>
                        {(item.status === 1 || item.status === 3) ? '撤回到审核' : '发表'}
                    </a>
                </p>
                {/* <a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                <a onClick={() => this.delPost(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    // 新闻置顶
    showToTopModal (topOrder, id, item) {
        const {dispatch} = this.props
        if (!topOrder) {
            this.setState({
                editNewsId: id,
                topIsShow: true
            })
            dispatch(selectData(item))
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
        dispatch(editArticleList({topOrder: val}, record.key))
    }

    _editTopValue (e, item) {
        let val = e.target.value
        let id = item.id
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
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            pageSize: 20,
            title: search.title,
            authorName: search.authorName,
            currentPage: pageData.currPage
        }
        this.setState({
            loading: true
        })
        sendData = {...sendData, ...data}
        dispatch(getArticleList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'currentPage': 1})
        dispatch(setSearchQuery({'type': 'init'}))
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
    delPost (item) {
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
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
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
        if (item.status === 4) {
            if (!isJsonString(item.coverPic)) {
                message.error('新闻封面暂无，请先上传相关封面！')
                return false
            } else if (!JSON.parse(item.coverPic).pc && !JSON.parse(item.coverPic).pc_recommend) {
                message.error('新闻封面暂无，请先上传相关封面！')
                return false
            }
        }
        confirm({
            title: '提示',
            content: `确认要${item.status === 4 ? '发表' : '撤回到审核中'}吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: item.status === 4 ? 1 : 4
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 4 ? '发表' : '撤回'}成功`)
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
            'recommend': item.recommend === 1 ? 0 : 1
        }
        axiosAjax('post', '/news/recommend', sendData, (res) => {
            if (res.code === 1) {
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
                message.success('操作成功!')
            } else {
                message.error(res.msg)
            }
        })
    }
    // 推至头条
    homeShow (item) {
        const {dispatch} = this.props
        const This = this
        let sendData = {
            'id': item.id,
            'recCreaterType': item.recCreaterType === 1 ? 0 : 1
        }
        confirm({
            title: '提示',
            content: `确认要${item.recCreaterType === 1 ? '从头条撤回(置顶会被取消)' : '推至头条'}吗 ?`,
            onOk () {
                axiosAjax('post', '/news/column/recommend', sendData, (res) => {
                    if (res.code === 1) {
                        This.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                        message.success('操作成功!')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 筛选文章状态
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

    // 筛选新闻类别
    handleChange2 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'channelId': value}))
        this.doSearch('init', {'currentPage': 1, channelId: value})
    }

    render () {
        const {list, pageData, filter, search, dispatch, selectedData, form} = this.props
        const { getFieldDecorator } = form
        return <div className="article-index">
            <Row>
                <Col style={{margin: '0 0 20px'}}>
                    <span>文章来源：</span>
                    <span> 火星号</span>
                </Col>
                <Col>
                    <span>文章状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120, marginBottom: 10 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">审核通过</Option>
                        <Option value="4">审核中</Option>
                        <Option value="2">审核驳回</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>推荐：</span>
                    <Select defaultValue={`${filter.recommend}`} style={{ width: 120 }} onChange={this.handleChange1}>
                        <Option value="">全部</Option>
                        <Option value="0">未推荐</Option>
                        <Option value="1">推荐</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>新闻类别：</span>
                    <Select defaultValue={`${filter.channelId}`} style={{ width: 120 }} onChange={this.handleChange2}>
                        <Option value="">全部</Option>
                        {this.props.channelList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                </Col>
                <Col>
                    <span>新闻标题: </span>
                    <Input
                        value={search.title}
                        style={{width: 180, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入新闻标题"
                        onPressEnter={() => { this._search() }}
                    />
                    <span>作者名: </span>
                    <Input
                        value={search.authorName}
                        style={{width: 165, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({authorName: e.target.value}))}
                        placeholder="请输入作者名"
                        onPressEnter={() => { this._search() }}
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
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
        articleAudit: state.articleAudit,
        list: state.articleAudit.list,
        search: state.articleAudit.search,
        filter: state.articleAudit.filter,
        pageData: state.articleAudit.pageData,
        selectedData: state.postInfo.selectedData,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(ArticleAuditIndex))
