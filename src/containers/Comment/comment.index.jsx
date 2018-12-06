/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Input, Button } from 'antd'
import './index.scss'
// import { Link } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getCommentList, setSearchQuery, setPageData} from '../../actions/others/comment.action'
import {formatDate, axiosAjax, cutString, channelIdOptions} from '../../public/index'
const confirm = Modal.confirm
// const Option = Select.Option

let columns = []
class PostIndex extends Component {
    constructor () {
        super()
        this.state = {
            newsStatus: null,
            loading: false,
            selectedRowKeys: [],
            idArr: []
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
        const {search} = this.props
        this.doSearch(!search.type ? 'init' : search.type, search.keys === '' ? {} : {keys: search.keys})
        columns = [{
            title: '新闻标题',
            width: '250px',
            key: 'title',
            render: (text, record) => (<div className="comment-info clearfix">
                <div className="news-link">
                    <a target="_blank" href={`//www.huoxing24.com/newsdetail?id=${record.newsId}`}>
                        <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 40))} />
                    </a>
                </div>
            </div>)
        }, {
            title: '评论内容',
            key: 'content',
            width: 350,
            render: (record) => (<span title={record.content} className="reply-content" dangerouslySetInnerHTML={this.createMarkup(record.content)}></span>)
        }, {
            title: '昵称',
            dataIndex: 'userNickName',
            key: 'userNickName'
        }, {
            title: '评论时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                {/*
                <a className="mr10 opt-btn" style={{background: '#108ee9'}}>评论详情</a>
                */}
                <a onClick={() => this.delPost(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                <a onClick={() => this.insertBlack(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#e59e21'}}>加入黑名单</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({keys: '', 'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'currPage': 1, 'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData, search} = this.props
        let sendData = {
            // status: filter.status,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        if (type !== 'init') {
            sendData = {
                ...sendData,
                'keys': search.keys
            }
        }
        sendData = {...sendData, ...data}
        // let sendData = !data ? {searchQuery: this.state.searchQuery} : {searchQuery: this.state.searchQuery, ...data}
        dispatch(getCommentList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch, search} = this.props
        let type = 'init'
        if (!search.keys) {
            type = 'init'
        } else {
            type = 'search'
        }
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, keys: search.keys})
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
                    status: 0
                }
                axiosAjax('POST', '/comment/status', {...sendData}, (res) => {
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
    // 加黑
    insertBlack (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要将此账号加入黑名单吗 ?`,
            onOk () {
                let sendData = {
                    nickname: item.userNickName
                }
                axiosAjax('POST', '/blacklist/addblacklist_by_nickname', {...sendData}, (res) => {
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let idArr = []
        selectedRows.map((item, index) => {
            idArr.push(item.id)
        })
        this.setState({ selectedRowKeys, idArr })
    }

    batchDelete = () => {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除选中的所有评论吗 ?`,
            onOk () {
                let sendData = {
                    id: _this.state.idArr.join(','),
                    status: 0
                }
                axiosAjax('POST', '/comment/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.setState({
                            selectedRowKeys: []
                        })
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const {list, pageData, dispatch, search} = this.props
        const {selectedRowKeys, loading} = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        const hasSelected = selectedRowKeys.length > 0
        return <div className="comment-index">
            <Row style={{width: 800}}>
                <Col span={2} className="form-label">关键字：</Col>
                <Col span={4}>
                    <Input
                        value={search.keys}
                        onChange={(e) => dispatch(setSearchQuery({keys: e.target.value}))}
                        onPressEnter={() => { this._search() }}
                        placeholder="请输入关键字搜索"
                    />
                </Col>
                <Col span={1} offset={1}>
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                </Col>
                <Col offset={2} span={5}>
                    <Button
                        type="primary"
                        onClick={this.batchDelete}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        批量删除
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `已选择 ${selectedRowKeys.length} 条` : ''}
                    </span>
                </Col>
            </Row>
            {/*
            <Row>
                <Col>
                    <span>新闻状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">已发表</Option>
                        <Option value="0">草稿箱</Option>
                    </Select>
                </Col>
            </Row>
            */}
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table rowSelection={rowSelection} dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        commentInfo: state.commentInfo,
        list: state.commentInfo.list,
        search: state.commentInfo.search,
        filter: state.commentInfo.filter,
        pageData: state.commentInfo.pageData
    }
}

export default connect(mapStateToProps)(PostIndex)
