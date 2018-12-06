/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Input, Row, Col, Button, Table, Modal, message } from 'antd'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button } from 'antd'
import './index.scss'
import { Link } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getIcoList, setSearchQuery, setPageData, setFilterData} from '../../actions/others/ico.action'
import {formatDate, axiosAjax, cutString, icoStatusOptions} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class IcoIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            icoStatus: null
        }
    }

    channelName (id) {
        let name = ''
        icoStatusOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch('init', {...filter, symbol: search.symbol})
        columns = [{
            title: 'ICO名称',
            width: '250px',
            key: 'name',
            render: (text, record) => (record && <div className="ico-info clearfix">
                <div>
                    <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(cutString(record.name, 30))} />
                </div>
            </div>)
        }, {
            title: 'ICO简称 ',
            dataIndex: 'symbol',
            key: 'symbol'
        }, {
            title: 'ICO 图标',
            width: 140,
            key: 'img',
            render: (record) => (<img style={{width: 100}} src={record.img} alt=""/>)
        }, {
            title: 'Ico状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === 'past') {
                    return <span className="ico-status pre-publish">已结束</span>
                } else if (record && record.status === 'ongoing') {
                    return <span className="ico-status has-publish">进行中</span>
                } else if (record && record.status === 'upcoming') {
                    return <span className="ico-status will-publish">即将开始</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (record) => (record && formatDate(record))
        }, {
            title: '结束时间 ',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (record) => (record && formatDate(record))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link className="mr10 opt-btn" to={{pathname: '/ico-detail', query: {id: item.id}}} style={{background: '#108ee9'}}>详情</Link>
                <a onClick={() => this.delIco(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 10, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            symbol: search.symbol,
            pageSize: 10,
            page: pageData.page
            // 'appId': $.cookie('gameId')
        }
        if (type !== 'init') {
            sendData = {
                ...sendData,
                'nickName': search.nickName,
                'symbol': search.symbol
            }
        }
        sendData = {...sendData, ...data}
        // let sendData = !data ? {searchQuery: this.state.searchQuery} : {searchQuery: this.state.searchQuery, ...data}
        dispatch(getIcoList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch, search} = this.props
        let type = 'init'
        if (!search.nickName && !search.symbol) {
            type = 'init'
        } else {
            type = 'init'
        }
        this.doSearch(type, {'page': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'page': 1}))
    }
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'page': page})
        dispatch(setPageData({'page': page}))
        this.doSearch(search.type, {'page': page, ...filter})
    }
    // 删除
    delIco (item) {
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
                axiosAjax('POST', '/ico/delete', {...sendData}, (res) => {
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
        confirm({
            title: '提示',
            content: `确认要${item.status === 0 ? '发表' : '撤回到草稿箱'}吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: item.status === 0 ? 1 : 0
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 0 ? '发表' : '撤回'}成功`)
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

    // 筛选Ico状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            icoStatus: value
        })
        this.doSearch('init', {'page': 1, status: value})
    }

    // 筛选推荐状态
    handleChange1 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'recommend': value}))
        this.doSearch('init', {'page': 1, recommend: value})
    }

    // 筛选Ico类别
    handleChange2 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'channelId': value}))
        this.doSearch('init', {'page': 1, channelId: value})
    }

    render () {
        const {list, pageData, filter, search, dispatch} = this.props
        return <div className="ico-index">
            {/*
            <Row>
                <Col span={1} className="form-label">帖子主题:</Col>
                <Col span={3}>
                    <Input
                        value={search.title}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入帖子主题"
                    />
                </Col>
                <Col span={1} className="form-label">发帖人:</Col>
                <Col span={3}>
                    <Input
                        value={search.nickName}
                        onChange={(e) => dispatch(setSearchQuery({nickName: e.target.value}))}
                        placeholder="请输入发帖人"
                    />
                </Col>
                <Col offset={1} span={2}>
                    <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                </Col>
            </Row>
            */}
            <Row>
                <Col>
                    <span>Ico状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        {icoStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    {/*
                    <span style={{marginLeft: 15}}>推荐：</span>
                    <Select defaultValue={`${filter.recommend}`} style={{ width: 120 }} onChange={this.handleChange1}>
                        <Option value="">全部</Option>
                        <Option value="0">未推荐</Option>
                        <Option value="1">推荐</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>Ico类别：</span>
                    <Select defaultValue={`${filter.channelId}`} style={{ width: 120 }} onChange={this.handleChange2}>
                        <Option value="">全部</Option>
                        {icoStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    */}
                    <span style={{marginLeft: 15}}>Ico简称: </span>
                    <Input
                        value={search.symbol}
                        style={{width: 200, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({symbol: e.target.value}))}
                        placeholder="请输入Ico简称"
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.page, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        icoInfo: state.icoInfo,
        list: state.icoInfo.list,
        search: state.icoInfo.search,
        filter: state.icoInfo.filter,
        pageData: state.icoInfo.pageData
    }
}

export default connect(mapStateToProps)(IcoIndex)
