/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, message, Spin, Select, Checkbox, Input, Button, Tooltip } from 'antd'
import './index.scss'
import Cookies from 'js-cookie'
import {getTwitterList, setPageData, setFilterData, getTwitterItemNum, setSearchQuery} from '../../../actions/socialMedia/twitter'
import {getItem} from '../../../actions/index'
import {axiosAjax, cutString, formatDate} from '../../../public/index'
import { hashHistory } from 'react-router'
const Option = Select.Option
const confirm = Modal.confirm

let columns = []
class TwitterIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            previewVisible: false,
            previewImage: '',
            type: '2',
            position: '0',
            selectedRowKeys: [],
            order: 1,
            recommendVisible: false
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getTwitterItemNum({type: 0}))
        dispatch(setFilterData(
            {
                type: location.query.type || '2',
                important: location.query.important || ''
            }))
        this.doSearch('init')
        columns = [{
            title: <h3>ID</h3>,
            key: 'id',
            width: 65,
            dataIndex: 'id'
        }, {
            title: <h3>来源</h3>,
            key: 'source',
            width: 80,
            render: (text, record) => {
                if (record.url.indexOf('http') !== -1) {
                    return <a target='_blank' title={record.source} href={record.url}>{record.source}</a>
                } else {
                    return <span title={record.source}>{record.source}</span>
                }
            }
        }, {
            title: <h3>内容</h3>,
            className: 'contentCell',
            key: 'content',
            render: (record) => <div className={`${record.isImportant && 'red'}`}>
                {this.contentRender(record, this.props.filter.type)}
            </div>
        }, {
            title: <h3>生成时间</h3>,
            key: 'strtime',
            align: 'center',
            width: 85,
            render: (record) => <p style={{textAlign: 'center'}} dangerouslySetInnerHTML={this.createMarkup(formatDate(record.strtime, '-', true))}/>
        }, {
            title: <h3>抓取时间</h3>,
            key: 'createTime',
            width: 85,
            render: (record) => <p style={{textAlign: 'center'}} dangerouslySetInnerHTML={this.createMarkup(formatDate(record.create_time, '-', true))}/>
        }, {
            title: <h3>操作</h3>,
            key: 'action',
            align: 'center',
            width: 100,
            render: (item) => {
                // let btn = ''
                // switch (item.status) {
                //     case 0:
                //         btn = <p><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>展示</a></p>
                //         break
                //     case 1:
                //         btn = <div>
                //             <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(item)} style={{background: '#00b45a'}}>修改展示权重</a></p>
                //             <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.backRecommend(item)} style={{background: '#e9892f'}}>撤回(取消展示)</a></p>
                //         </div>
                //         break
                //     default:
                //         btn = ''
                // }
                return <div className="btn">
                    {/*
                    <p style={{marginBottom: 10}}><Link className="mr10 opt-btn" to={{pathname: '/twitter-add', query: {id: item.id}}} style={{background: '#49a9ee'}}>修改轮播内容</Link></p>
                    {btn}
                    */}
                    {(() => {
                        if (item.read_time) {
                            return <p>
                                <a disabled className="opt-btn" style={{background: '#858585'}}>已读</a>
                            </p>
                        } else {
                            return <p>
                                <a className="opt-btn" onClick={() => {
                                    this.multiRead({
                                        item: item,
                                        type: 'read'
                                    })
                                }} style={{background: '#1aaf35'}}>标记为已读</a>
                            </p>
                        }
                    })()}
                    <Tooltip placement="bottom" title='功能暂未开放'>
                        {(() => {
                            if (item.custom && item.custom.unRelated) {
                                return <p>
                                    <a disabled className="opt-btn" style={{background: '#858585'}}>已标记不相关</a>
                                </p>
                            } else {
                                return <p>
                                    <a disabled className="opt-btn" onClick={() => {
                                        this.handleMark({
                                            item: item,
                                            type: 'unrelated'
                                        })
                                    }} style={{background: '#858585'}}>标记不相关</a>
                                </p>
                            }
                        })()}
                    </Tooltip>
                    <p>
                        <a
                            onClick={() => this.insertItem({item: item})}
                            className="opt-btn"
                            href="javascript:void(0)"
                            style={{background: '#ff9b6e'}}
                        >导入</a>
                    </p>
                </div>
            }
        }]
    }

    // 内容渲染
    contentRender = (record, type) => {
        if (type === '2') {
            return <div>
                <h4>
                    <Tooltip overlayClassName="twitter-tooltip" placement="bottom" title={`${cutString(record.brief, 4000) || '无内容'}`} >
                        <span>【{!record.title ? '无标题' : record.title}】</span>
                        {!record.brief ? '' : <span dangerouslySetInnerHTML={this.createMarkup(cutString(record.brief, 400))} />}
                    </Tooltip>
                </h4>

                {(record.content_cn || record.title_cn) ? <h4 style={{padding: '5px 0'}}>
                    <span>翻译：</span>
                    <Tooltip overlayClassName="twitter-tooltip" placement="bottom" title={`${cutString(record.brief_cn, 3000) || '无内容'}`} >
                        <span>【{!record.title_cn ? '无标题' : record.title_cn}】</span>
                        {!record.brief_cn ? '' : <span dangerouslySetInnerHTML={this.createMarkup(cutString(record.brief_cn, 300))} />}
                    </Tooltip>
                </h4> : ''}

                {!record.read_time ? '' : <h5>
                    已读时间：{formatDate(record.read_time)} 管理员：{record.userName || '暂无'}
                </h5>}
            </div>
        } else {
            return <div>
                <h4>
                    <Tooltip overlayClassName="twitter-tooltip" placement="bottom" title={`${cutString(record.content, 4000) || '无内容'}`} >
                        <span>【{!record.title ? '无标题' : record.title}】</span>
                        {!record.content ? '' : <span dangerouslySetInnerHTML={this.createMarkup(cutString(record.content, 400))} />}
                    </Tooltip>
                </h4>

                {(record.content_cn || record.title_cn) ? <h4 style={{padding: '5px 0'}}>
                    <span>翻译：</span>
                    <Tooltip overlayClassName="twitter-tooltip" placement="bottom" title={`${cutString(record.content_cn, 3000) || '无内容'}`} >
                        <span>【{!record.title_cn ? '无标题' : record.title_cn}】</span>
                        {!record.content_cn ? '' : <span dangerouslySetInnerHTML={this.createMarkup(cutString(record.content_cn, 300))} />}
                    </Tooltip>
                </h4> : ''}

                {!record.read_time ? '' : <h5>
                    已读时间：{formatDate(record.read_time)} 管理员：{record.custom.operator || '暂无'}
                </h5>}
            </div>
        }
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

    // 导入
    insertItem (data) {
        const {filter, dispatch} = this.props
        if (filter.type === '2') {
            dispatch(getItem(data))
            localStorage.setItem('insertFlash', JSON.stringify(data))
            window.open(`http://${window.location.host}/#/flash-edit?from=twitter`)
            // hashHistory.push('/flash-edit')
        } else if (filter.type === '1') {
            window.open(`http://${window.location.host}/#/post-send?from=twitter&urls=` + data.item.url)
        } else {
            message.error('仅支持快讯和新闻的直接导入!')
            return false
        }
    }

    // 列表展示
    doSearch (type, data) {
        const {dispatch, filter, location, search} = this.props
        this.setState({
            loading: true
        })
        let sendData = {
            ...search,
            ...filter,
            type: location.query.type || '2',
            important: location.query.important || null,
            pageSize: 20,
            currentPage: location.query.page || 1
        }
        sendData = {...sendData, ...data}
        dispatch(getTwitterList(type, sendData, () => {
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
        window.scrollTo(0, 0)
        const {dispatch, filter} = this.props
        hashHistory.push(`/socialMedia-twitter?page=${page}&important=${filter.important}&type=${filter.type}`)
        dispatch(setPageData({'currentPage': page}))
        this.doSearch('init', {'currentPage': page, ...filter})
    }

    // 筛选展示状态
    handleChange = (value) => {
        const {dispatch, filter} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            type: value
        })
        hashHistory.push(`/socialMedia-twitter?page=1&important=${filter.important}&type=${value}`)
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    // 筛选重要程度状态
    handleImpChange = (value) => {
        const {dispatch, filter} = this.props
        dispatch(setFilterData({'important': value}))
        this.setState({
            important: value
        })
        hashHistory.push(`/socialMedia-twitter?page=1&type=${filter.type}&important=${value}`)
        this.doSearch('init', {'currentPage': 1, important: value === '' ? null : value})
    }

    // 筛选已读
    readChange = (e) => {
        const {dispatch} = this.props
        dispatch(setFilterData({includeRead: e.target.checked}))
        this.doSearch('init', {'currentPage': 1, includeRead: e.target.checked})
    }

    // 筛选未读
    unReadChange = (e) => {
        const {dispatch} = this.props
        dispatch(setFilterData({includeUnread: e.target.checked}))
        this.doSearch('init', {'currentPage': 1, includeUnread: e.target.checked})
    }

    handleMark (option) {
        const This = this
        const {dispatch} = this.props
        confirm({
            title: '提示',
            content: `确认要对这条信息进行标记吗 ?`,
            onOk () {
                This.setState({
                    loading: true
                })
                let sendData = {
                    uuid: option.item.uuid,
                    jsonString: JSON.stringify({
                        unRelated: option.type === 'unrelated',
                        passportId: Cookies.get('hx_passportId'),
                        operator: Cookies.get('hx_nickName')
                    }),
                    passportId: Cookies.get('hx_passportId'),
                    type: This.props.filter.type
                }
                axiosAjax('POST', '/crawler/updateCustomJson', {...sendData}, (res) => {
                    This.setState({
                        loading: true
                    })
                    if (res.code === 1) {
                        dispatch(getTwitterItemNum({type: 0}))
                        message.success('操作成功')
                        This.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    multiRead (option) {
        const This = this
        const {dispatch} = this.props
        let sendData = {
            uuid: option.type && option.type === 'multi' ? This.state.idArr.join(',') : option.item.uuid,
            passportId: Cookies.get('hx_passportId'),
            type: This.props.filter.type,
            userName: Cookies.get('hx_nickName')
        }
        axiosAjax('POST', '/crawler/read', {...sendData}, (res) => {
            This.setState({
                loading: false
            })
            if (res.code === 1) {
                dispatch(getTwitterItemNum({type: 0}))
                message.success('操作成功')
                This.setState({
                    selectedRowKeys: []
                })
                This.doSearch('init')
            } else {
                message.error(res.msg)
            }
        })
    }

    getOrderNum = (value) => {
        this.setState({
            order: value
        })
    }
    /*
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
        dispatch(getTopNum(item.position, (arr) => {
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
                        axiosAjax('post', '/homerecommend/updateHomerecommendshownum', {id: item.id, position: item.position, showNum: order}, (res) => {
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
*/

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let idArr = []
        selectedRows.map((item, index) => {
            idArr.push(item.uuid)
        })
        this.setState({ selectedRowKeys, idArr })
    }

    render () {
        const {list, pageData, filter, num, location, dispatch, search} = this.props
        const {selectedRowKeys} = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        const hasSelected = selectedRowKeys.length > 1
        let twitterTypeOptions = [
            {label: `新闻`, value: '1', num: num.news_clean || 0},
            {label: `快讯`, value: '2', num: num.lives_clean || 0},
            {label: `社交媒体`, value: '3', num: num.twinfo_clean || 0},
            {label: `微博`, value: '4', num: num.weibo_clean || 0}
        ]

        return <div className="twitter-index">
            <span>类型筛选：</span>
            {num.loaded && <Select defaultValue={`${location.query.type || '2'}`} style={{ width: 120, marginRight: 10 }} onChange={this.handleChange}>
                {twitterTypeOptions.map(d => {
                    return <Option title={d.label} value={d.value} key={d.value}>
                        {d.label}
                        <span style={{color: 'red'}}> ({d.num})</span>
                    </Option>
                })}
            </Select>}
            <Select defaultValue={`${location.query.important || ''}`} style={{ width: 80, marginRight: 10 }} onChange={this.handleImpChange}>
                <Option title='全部' value=''>全部</Option>
                <Option title='重要' value='1'>重要</Option>
                <Option title='不重要' value='0'>不重要</Option>
            </Select>
            <Checkbox defaultChecked={filter.includeRead} onChange={this.readChange}>包含已读</Checkbox>
            <Checkbox defaultChecked={filter.includeUnread} onChange={this.unReadChange}>包含未读</Checkbox>
            <span>来源:</span>
            <Input
                onPressEnter={() => { this._search() }}
                value={search.sourceLike}
                style={{width: 150, marginRight: 10}}
                onChange={(e) => dispatch(setSearchQuery({sourceLike: e.target.value}))}
                placeholder="请输入要搜索的来源"
            />
            <span>内容: </span>
            <Input
                onPressEnter={() => { this._search() }}
                value={search.contentLike}
                style={{width: 150}}
                onChange={(e) => dispatch(setSearchQuery({contentLike: e.target.value}))}
                placeholder="请输入要搜索的内容"
            />
            <Button
                type="primary"
                disabled={!hasSelected}
                style={{margin: '0 15px'}}
                onClick={() => {
                    this.multiRead({
                        type: 'multi'
                    })
                }}
            >
                批量已读
            </Button>
            <Button
                type="primary"
                onClick={() => {
                    this.doSearch('init')
                }}>
                刷新
            </Button>
            <div className="mt10">
                <Spin spinning={this.state.loading} size="large">
                    <Table rowSelection={rowSelection} dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: parseInt(location.query.page) || pageData.currentPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
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
        twitterInfo: state.twitterInfo,
        list: state.twitterInfo.list,
        search: state.twitterInfo.search,
        filter: state.twitterInfo.filter,
        pageData: state.twitterInfo.pageData,
        numArr: state.twitterInfo.numArr,
        num: state.twitterInfo.num
    }
}

export default connect(mapStateToProps)(TwitterIndex)
