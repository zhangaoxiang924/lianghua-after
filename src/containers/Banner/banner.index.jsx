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
import {getBannerList, getTopNum, setSearchQuery, setPageData, setFilterData} from '../../actions/banner/banner'
import {getChannelList} from '../../actions/index'
import {axiosAjax, cutString, bannerStatusOptions, positionOptions} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class BannerIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            previewVisible: false,
            previewImage: '',
            status: null,
            position: '0',
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
            key: 'title',
            render: (text, record) => (record && <div className="banner-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 50))} />
                    {(() => {
                        if (record.status === 0) {
                            return <span className="banner-status pre-publish">已撤回</span>
                        } else if (record.status === 1) {
                            return <span className="banner-status has-publish">展示中</span>
                        } else {
                            return <span>暂无</span>
                        }
                    })()}
                </div>
            </div>)
        }, {
            title: '位置',
            key: 'position',
            render: (text, record) => {
                return !record.position ? '暂无' : <span title={record.description} dangerouslySetInnerHTML={this.createMarkup(this.channelName(positionOptions, record.position))} />
            }
        }, {
            title: '类型',
            key: 'type',
            width: 105,
            render: (record) => {
                if (record) {
                    if (record.type === 1) {
                        return <span className="banner-status link">新闻详情</span>
                    } else if (record.type === 2) {
                        return <span className="banner-status will-publish">新闻列表</span>
                    } else if (record.type === 3) {
                        return <span className="banner-status news">关键字/标签</span>
                    } else if (record.type === 4) {
                        return <span className="banner-status news">专题</span>
                    } else if (record.type === 5) {
                        return <span className="banner-status authorInfo">作者信息</span>
                    } else if (record.type === 6) {
                        return <span className="banner-status ad">广告</span>
                    } else if (record.type === 7) {
                        return <span className="banner-status link">链接跳转</span>
                    } else if (record.type === 8) {
                        return <span className="banner-status link">产品</span>
                    } else if (record.type === 9) {
                        return <span className="banner-status link">活动</span>
                    } else {
                        return <span className="banner-status no">暂无</span>
                    }
                } else {
                    return <span className="banner-status no">暂无</span>
                }
            }
        }, {
            title: '相关信息',
            key: 'typeLink',
            render: (record) => {
                if (record.type === 1) {
                    return <a target="_blank" href={record.typeLink && record.typeLink.trim() !== '' ? 'http://www.huoxing24.com/newsdetail/' + record.typeLink + '.html' : '#/banner-list'}>{`${record.typeLink && record.typeLink.trim() !== '' ? 'http://www.huoxing24.com/newsdetail/' + record.typeLink + '.html' : '暂无链接'}`}</a>
                } else if (record.type === 2) {
                    return <p>频道：{this.channelName(this.props.channelList, record.typeLink)}</p>
                } else if (record.type === 3) {
                    return <p>新闻关键字：{record.typeLink || '暂无'}</p>
                } else if (record.type === 4) {
                    return <p>专题：{record.typeLink || '暂无'}</p>
                } else if (record.type === 5) {
                    return <p>作者昵称/ID：{record.typeLink}</p>
                } else if (record.type === 6 || record.type === 7 || record.type === 8 || record.type === 9) {
                    return <a target="_blank" href={record.typeLink && record.typeLink.trim() !== '' ? record.typeLink : '#/banner-list'}>{record.typeLink && record.typeLink.trim() !== '' ? record.typeLink : '暂无链接'}</a>
                } else {
                    return <p>暂无</p>
                }
            }
        }, {
            title: 'PC 端封面 ',
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
        }, {
            title: '推荐位权重',
            key: 'showNum',
            render: (record) => {
                if (!record.showNum || parseInt(record.showNum) === 0 || parseInt(record.status) === 0) {
                    return '无权限'
                } else {
                    return record.showNum
                }
            }
        }, {
            title: '操作',
            key: 'action',
            width: 130,
            render: (item) => {
                let btn = ''
                switch (item.status) {
                    case 0:
                        btn = <p><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>展示</a></p>
                        break
                    case 1:
                        btn = <div>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>修改展示权重</a></p>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.backRecommend(item)} style={{background: '#e9892f'}}>撤回(取消展示)</a></p>
                        </div>
                        break
                    default:
                        btn = ''
                }
                return <div>
                    <p style={{marginBottom: 10}}><Link className="mr10 opt-btn" to={{pathname: '/banner-add', query: {id: item.id}}} style={{background: '#49a9ee'}}>修改轮播内容</Link></p>
                    {btn}
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.delBanner(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>
            }
        }]
    }

    createMarkup (str) { return {__html: str} }

    // 状态改变
    channelName (arr, id) {
        let name = ''
        arr.map((item, index) => {
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
            position: filter.position,
            status: filter.status,
            pageSize: 20,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getBannerList(type, sendData, () => {
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
        dispatch(setFilterData({'position': value}))
        this.setState({
            position: value
        })
        this.doSearch('init', {'currentPage': 1, position: value})
    }

    // 删除
    delBanner (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/homerecommend/delhomerecommend', {...sendData}, (res) => {
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
                                axiosAjax('post', '/homerecommend/updateHomerecommendshownum', {id: item.id, position: item.position, showNum: order}, (res) => {
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
                    } else {
                        axiosAjax('post', '/homerecommend/updateHomerecommendshownum', {id: item.id, showNum: order}, (res) => {
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
                    status: 0
                }
                axiosAjax('POST', '/homerecommend/updateHomerecommendstatus', {...sendData}, (res) => {
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
        return <div className="banner-index">
            <Row>
                <Col>
                    <span>状态筛选：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {bannerStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <span style={{ marginLeft: 10 }}>类型筛选：</span>
                    <Select defaultValue={`${filter.position}`} style={{ width: 120 }} onChange={this.handleTypeChange}>
                        <Option value="0">全部</Option>
                        {positionOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => hashHistory.push('/banner-add')}>新增</Button>
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
        bannerInfo: state.bannerInfo,
        list: state.bannerInfo.list,
        search: state.bannerInfo.search,
        filter: state.bannerInfo.filter,
        pageData: state.bannerInfo.pageData,
        numArr: state.bannerInfo.numArr,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(BannerIndex)
