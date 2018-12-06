/**
 * Author：yangbo
 * Time：2018/6/14
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Input, Button } from 'antd'
import './index.scss'
// import { Link } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getCommentList, setSearchQuery, setPageData} from '../../actions/live/liveComment.action'
import {formatDate, axiosAjax, channelIdOptions} from '../../public/index'
import img from './img/default.png'
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
            idArr: [],
            visible: false,
            preview: '',
            title: ''
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
        // {record.imgUrl ? <img src="{record.imgUrl}" alt="" onClick={() => this.previewImg(record)} /> : ''}
        const {search} = this.props
        let _this = this
        axiosAjax('post', '/caster/room/one', {'castId': this.props.location.query.id}, function (res) {
            if (res.code === 1) {
                _this.setState({
                    title: res.obj.title
                })
            } else {
                message.error(res.msg)
            }
        })
        this.doSearch(!search.type ? 'init' : search.type, search.keys === '' ? {} : {keys: search.keys})
        columns = [{
            title: '评论内容',
            key: 'content',
            render: (item, record) => {
                let reg = /<img[^<]*src=['"]([^<>]+)['"][^>]*>/
                let url = reg.exec(item.content) ? reg.exec(item.content)[1] : ''
                return <div onClick={url ? () => this.previewImg(url) : null} className="reply-content comment-info" dangerouslySetInnerHTML={this.createMarkup(record.content)}>
                </div>
            }
        }, {
            title: '昵称',
            dataIndex: 'userNickName',
            key: 'userNickName',
            render: (item, record) => <span>{record.nickName}</span>
        }, {
            title: '评论时间',
            key: 'createTime',
            render: (item, record) => formatDate(record.addTime)
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                {/*
                <a className="mr10 opt-btn" style={{background: '#108ee9'}}>评论详情</a>
                */}
                <a onClick={() => this.delPost(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                <a onClick={!item.isBan ? () => this.pushBlackList(item) : null} className="mr10 opt-btn" href="javascript:void(0)" style={{background: 'rgb(233, 93, 1)'}}>{!item.isBan ? '禁言' : '禁言中'}</a>
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
        const {dispatch, pageData, search} = this.props
        let sendData = {
            castId: this.props.location.query.id,
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
        confirm({
            title: '提示',
            content: '暂时未开放搜索功能!'
        })
        // const {dispatch, search} = this.props
        // let type = 'init'
        // if (!search.keys) {
        //     type = 'init'
        // } else {
        //     type = 'search'
        // }
        // this.doSearch(type, {castId: this.props.location.query.id, 'currentPage': 1})
        // dispatch(setSearchQuery({'type': type}))
        // dispatch(setPageData({'currPage': 1}))
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
                    castId: item.castId,
                    passportId: item.passportId,
                    addTime: item.addTime
                }
                axiosAjax('POST', '/caster/room/comment/del', {...sendData}, (res) => {
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

    // 拉黑
    pushBlackList (item) {
        const _this = this
        const {dispatch} = this.props

        confirm({
            title: '提示',
            style: {top: '30%'},
            content: '封禁该用户的评论功能，请确认！',
            onOk () {
                axiosAjax('POST', '/caster/black/add', {passportId: item.passportId}, (res) => {
                    if (res.code === 1) {
                        message.success('禁言成功！')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 查看图片
    previewImg = (url) => {
        console.log(url)
        this.setState({
            preview: url,
            visible: true
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
        confirm({
            title: '提示',
            content: '暂时未开放批量删除功能!'
        })
        // const {dispatch} = this.props
        // const _this = this
        // confirm({
        //     title: '提示',
        //     content: `确认要删除选中的所有评论吗 ?`,
        //     onOk () {
        //         let sendData = {
        //             id: _this.state.idArr.join(','),
        //             status: 0
        //         }
        //         axiosAjax('POST', '/comment/status', {...sendData}, (res) => {
        //             if (res.code === 1) {
        //                 message.success('删除成功')
        //                 _this.setState({
        //                     selectedRowKeys: []
        //                 })
        //                 _this.doSearch('init')
        //                 dispatch(setSearchQuery({'type': 'init'}))
        //             } else {
        //                 message.error(res.msg)
        //             }
        //         })
        //     }
        // })
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
            <div className='live-comment-title'>
                {this.state.title}
            </div>
            <Row style={{width: 800}}>
                <Col span={2} className="form-label">关键字：</Col>
                <Col span={4}>
                    <Input
                        value={search.keys}
                        onChange={(e) => dispatch(setSearchQuery({keys: e.target.value}))}
                        placeholder="请输入关键字搜索"
                    />
                </Col>
                <Col span={1} offset={1}>
                    <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
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
            <Modal title='图片预览' visible={this.state.visible} wrapClassName='wrap-img-box' width={520} footer={null} onCancel={() => {
                this.setState({
                    visible: false
                })
            }}>
                <img src={this.state.preview} alt=""/>
            </Modal>
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
