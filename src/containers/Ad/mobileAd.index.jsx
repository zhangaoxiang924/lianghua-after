/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Button, InputNumber, Input } from 'antd'
import './index.scss'
import { hashHistory, Link } from 'react-router'
import {getAdList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../actions/others/ad.action'
import {formatDate, axiosAjax, cutString, mobileAdPosition} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class mobileAdIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            adStatus: null,
            visible: false,
            previewVisible: false,
            previewImage: '',
            order: 1
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch(!search.type ? 'init' : search.type, {adPlace: filter.adMobilePlace})
        columns = [{
            title: '广告标题',
            key: 'remake',
            render: (text, record) => {
                let status = ''
                if (record.status !== 1) {
                    status = <span className="ad-status pre-publish">未展示</span>
                } else if (record.status === 1) {
                    status = <span className="ad-status has-publish">展示中 ({record.topOrder === 1000 ? '未设置排序' : record.topOrder})</span>
                } else {
                    status = <span>暂无</span>
                }
                return <div className="ad-info clearfix">
                    <div>
                        <h4 title={record.remake} dangerouslySetInnerHTML={this.createMarkup(record.remake ? cutString(record.remake, 30) : '暂无')} />
                        {status}
                    </div>
                </div>
            }
        }, {
            title: '类型',
            key: 'status',
            render: (record) => {
                if (record.useType) {
                    if (record.useType === 1) {
                        return <span className="banner-status link">广告</span>
                    } else if (record.useType === 2) {
                        return <span className="banner-status will-publish">自有链接</span>
                    } else if (record.useType === 3) {
                        return <span className="banner-status news-detail">新闻详情</span>
                    } else if (record.useType === 4) {
                        return <span className="banner-status news">新闻频道</span>
                    } else if (record.useType === 5) {
                        return <span className="banner-status authorInfo">专题</span>
                    } else if (record.useType === 6) {
                        return <span className="banner-status ad">关键字/标签</span>
                    } else {
                        return <span className="banner-status no">暂无</span>
                    }
                } else {
                    return <span className="banner-status no">暂无</span>
                }
            }
        }, {
            title: '广告图',
            width: 100,
            key: 'imgSrc',
            render: (record) => <div
                className="shrinkPic"
                key={record.imgSrc}
                style={{
                    background: `url(${record.imgSrc}) no-repeat center / cover`
                }}
                src={record.imgSrc}
                onClick={this.handlePreview}
            />
        }, {
            title: '广告位置',
            dataIndex: 'adPlace',
            key: 'adPlace',
            render: (record) => (this.adPosition(record))
        }, {
            title: '相关信息 ',
            key: 'url',
            render: (text, record) => {
                if (record.useType === 1 || record.useType === 2) {
                    return <span>
                        跳转链接：
                        {record.url ? <a href={record.url} target='_blank' title={record.url}>{cutString(record.url, 30)}</a> : '暂无'}
                    </span>
                } else if (record.useType === 4) {
                    return <span>
                        新闻频道：
                        <a href={`//huoxing24.com/news/${record.url}`} target='_blank' title={`//huoxing24.com/news/${record.url}`}>{`http//huoxing24.com/news/${record.url}`} </a>
                    </span>
                } else if (record.useType === 3) {
                    return <span>
                        新闻 ID：
                        <a href={`//huoxing24.com/newsdetail/${record.url}`} target='_blank' title={`//huoxing24.com/newsdetail/${record.url}`}>{record.url}</a>
                    </span>
                } else if (record.useType === 5) {
                    return <span>
                        专题：
                        <a href={`//huoxing24.com/hot/${record.url}`} target='_blank' title={`//huoxing24.com/hot/${record.url}`}>{record.url}</a>
                    </span>
                } else if (record.useType === 6) {
                    return <span>
                        关键字/标签：
                        <a href={`//huoxing24.com/search/${record.url}`} target='_blank' title={`//huoxing24.com/search/${record.url}`}>{record.url}</a>
                    </span>
                }
            }
        }, {
            title: '发布时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '排序/展示',
            key: 'option',
            render: (item) => {
                let btn = ''
                switch (item.status) {
                    case 2:
                        btn = <p><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>发布</a></p>
                        break
                    case 1:
                        btn = <div>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this._isPublish(item)} style={{background: '#e9892f'}}>撤回</a></p>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>修改排序值</a></p>
                        </div>
                        break
                    default:
                        btn = ''
                }

                return <div className="btns">
                    {btn}
                </div>
            }
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p><a className="mr10 opt-btn" onClick={() => { this.detailModal(item) }} style={{background: '#2b465f'}}>查看</a></p>
                <p><Link className="mr10 opt-btn" to={{pathname: '/adM-edit', query: {id: item.id}}} style={{background: '#108ee9'}}>编辑</Link></p>
                <p><a onClick={() => this.delAd(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a></p>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
        dispatch(selectedData({}))
    }
    createMarkup (str) { return {__html: str} }

    // 广告位置
    adPosition (id) {
        let name = ''
        mobileAdPosition.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            search: search.search,
            adPlace: filter.adMobilePlace,
            type: 2,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getAdList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'currentPage': 1})
        dispatch(setPageData({'currPage': 1}))
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, adPlace: filter.adMobilePlace})
    }

    // 删除
    delAd (item) {
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
                axiosAjax('POST', '/ad/status', {...sendData}, (res) => {
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
            content: `确认要${item.status === 2 ? '发表' : '撤回广告'}吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: item.status === 2 ? 1 : 2
                }
                axiosAjax('POST', '/ad/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 2 ? '发表' : '撤回'}成功`)
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
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
        if (!item.topOrder || parseInt(item.status) === 2) {
            this.setState({
                order: 1
            })
        } else {
            this.setState({
                order: item.topOrder
            })
        }

        confirm({
            title: '提示',
            content: <div className="modal-input">
                <span style={{marginRight: 10}}>请输入排序号：(序号越小越靠前, 最小为 1)</span>
                <InputNumber min={1} max={999} defaultValue={item.topOrder || 1} autoFocus type="number" onChange={_this.getOrderNum}/>
            </div>,
            onOk () {
                let {order} = _this.state
                if (order.toString().trim() === '') {
                    message.error('序号不能为空！')
                    return false
                }
                let sendData = {
                    id: item.id,
                    status: 1,
                    type: item.type,
                    topOrder: order,
                    adPlace: item.adPlace
                }

                if (item.status === 2) {
                    axiosAjax('POST', '/ad/status', {
                        id: item.id,
                        status: item.status === 2 ? 1 : 2
                    }, (res) => {
                        if (res.code === 1) {
                            axiosAjax('POST', '/ad/settoporder', {...sendData}, (res) => {
                                if (res.code === 1) {
                                    message.success('操作成功')
                                    _this.doSearch('init')
                                } else {
                                    message.error(res.msg)
                                }
                            })
                        } else {
                            message.error(res.msg)
                        }
                    })
                } else if (item.status === 1) {
                    axiosAjax('POST', '/ad/settoporder', {...sendData}, (res) => {
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
    }

    // 筛选广告状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({adMobilePlace: value}))
        this.setState({
            adStatus: value
        })
        this.doSearch('init', {'currentPage': 1, adPlace: value})
    }

    // 新增
    incAd = () => {
        hashHistory.push('/adM-edit')
    }

    // 详情弹框
    detailModal (obj) {
        this.setState({
            visible: true
        })
        const {dispatch} = this.props
        dispatch(selectedData(obj))
    }

    handleOk = (e) => {
        this.setState({
            visible: false
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    }

    handleImgModalCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    render () {
        const {list, pageData, filter, selectData, search, dispatch} = this.props
        return <div className="ad-index">
            <Row>
                <Col span={22} className="ad-position">
                    <span>广告位置：</span>
                    <Select defaultValue={`${filter.adMobilePlace}`} style={{ width: 140 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        {mobileAdPosition.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <Input
                        value={search.search}
                        style={{width: 150, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({search: e.target.value}))}
                        placeholder="标题"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                    <Button type="primary" onClick={this.incAd} className="editBtn" style={{marginLeft: '10px'}}>新增广告</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal className="pre-Modal" visible={this.state.previewVisible} footer={null} onCancel={this.handleImgModalCancel}>
                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
            </Modal>
            <Modal
                title="广告详情"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div className="adInfo" style={{padding: '0 10px 10px'}}>
                    <Row>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>位置: </Col>
                        <Col span={20} className="">{this.adPosition(selectData.adPlace)}</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>标题: </Col>
                        <Col span={20} className="">{selectData.remake || '无'}</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>链接地址: </Col>
                        <Col span={20} className="">{<a target="_blank" href={selectData.url} title={selectData.url}>{selectData.url || '无'}</a>}</Col>
                    </Row>
                </div>
                <Row>
                    <Col className="" style={{margin: '0 auto', width: '95%'}}><img src={selectData.imgSrc} alt=""/></Col>
                </Row>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        adInfo: state.adInfo,
        selectData: state.adInfo.selectedData,
        list: state.adInfo.list,
        search: state.adInfo.search,
        filter: state.adInfo.filter,
        pageData: state.adInfo.pageData
    }
}

export default connect(mapStateToProps)(mobileAdIndex)
