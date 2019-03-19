/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, InputNumber } from 'antd'
import './index.scss'
import { hashHistory } from 'react-router'
import {getBannerList, setPageData, setFilterData} from '../../actions/banner/banner'
import {axiosAjax, cutString} from '../../public/index'
const confirm = Modal.confirm

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
        const {filter} = this.props
        this.doSearch('init', {status: filter.status})
        columns = [{
            title: '标题',
            key: 'title',
            render: (text, record) => (record && <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 50))} />)
        }, {
            title: 'PC 端封面 ',
            dataIndex: 'pic',
            key: 'pic',
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
            title: 'M 端封面 ',
            dataIndex: 'picMobile',
            key: 'picMobile',
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
            title: '链接跳转',
            key: 'url',
            render: (record) => {
                if (record.url) {
                    return <a target="_blank" href={record.url}>{record.url}</a>
                } else {
                    return <p>暂无</p>
                }
            }
        }, {
            title: '推荐位权重',
            key: 'topOrder',
            render: (record) => {
                if (!record.topOrder || parseInt(record.topOrder) === 0 || parseInt(record.status) === 0) {
                    return '未添加排序'
                } else {
                    return record.topOrder
                }
            }
        }, {
            title: '操作',
            key: 'action',
            width: 130,
            render: (item) => {
                let btn = ''
                switch (item.topOrder) {
                    case 0:
                        btn = <p><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>添加排序</a></p>
                        break
                    default:
                        btn = <div>
                            <p><a className="mr10 opt-btn" onClick={() => this.cancelRecommend(item)} style={{background: '#e2c40c'}}>取消排序</a></p>
                            <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>修改展示权重</a></p>
                        </div>
                        break
                }
                return <div>
                    {/*
                        <p style={{marginBottom: 10}}><Link className="mr10 opt-btn" to={{pathname: '/banner-edit', query: {id: item.id}}} style={{background: '#49a9ee'}}>修改轮播内容</Link></p>
                        */}
                    {btn}
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.delBanner(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>
            }
        }
        ]
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
                axiosAjax('POST', '/banner/deleteHomeBanner', {...sendData}, (res) => {
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
        if (!item.topOrder || parseInt(item.topOrder) === 0) {
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
                <span style={{marginRight: 10}}>请输入首页推荐位置的权重：(权重越高越靠前)</span>
                <InputNumber min={0} defaultValue={this.state.order} autoFocus type="number" onChange={_this.getOrderNum}/>
            </div>,
            onOk () {
                let {order} = _this.state
                if (order.toString().trim() === '') {
                    message.error('推荐位的权重值不能为空！')
                    return false
                }

                axiosAjax('post', '/banner/setTopOrder', {id: item.id, topOrder: order}, (res) => {
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

    cancelRecommend (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要取消排序吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    topOrder: 0
                }
                axiosAjax('POST', '/banner/setTopOrder', {...sendData}, (res) => {
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

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    render () {
        // const {list, pageData, filter, search, dispatch} = this.props
        const {list, pageData} = this.props
        return <div className="banner-index">
            <Row>
                <Col>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => hashHistory.push('/banner-edit')}>新增</Button>
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
        numArr: state.bannerInfo.numArr
    }
}

export default connect(mapStateToProps)(BannerIndex)
