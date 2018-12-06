/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Button, InputNumber, Input } from 'antd'
import CollectionCreateForm from './ModalForm'
import './index.scss'
// import { Link } from 'react-router'
import {getColumnAuthorList, getAuthorNum, setSearchQuery, setPageData, setFilterData} from '../../actions/others/columnAuthor.action'
import {axiosAjax, cutString, authorTypeOptions} from '../../public/index'
// import IconItem from '../../components/icon/icon'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class ColumnAuthorIndex extends Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            loading: true,
            previewVisible: false,
            previewImage: '',
            status: null,
            order: 1,
            recommendVisible: false
        }
    }

    componentWillMount () {
        const {filter} = this.props
        this.doSearch('init', {type: filter.type})
        columns = [{
            title: '作者昵称',
            key: 'nickName',
            render: (text, record) => (record && <div className="columnAuthor-info clearfix">
                <div>
                    <h4 title={record.nickName} dangerouslySetInnerHTML={this.createMarkup(cutString(record.nickName, 50))} />
                    {parseInt(record.recommend) === 0 ? '' : <div style={{'display': 'inline-block'}}><span className="columnAuthor-status has-publish mr10">置顶（{record.recommend}）</span></div>}
                </div>
            </div>)
        }, {
            title: '手机号',
            key: 'phoneNum',
            render: (record) => {
                if (record && record.phoneNum) {
                    return <span className="columnAuthor-status pre-publish">{record.phoneNum}</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '作者头像',
            dataIndex: 'iconUrl',
            key: 'iconUrl',
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
            title: '作者 ID',
            dataIndex: 'passportId',
            key: 'passportId'
        }, {
            title: '置顶相关',
            key: 'topOption',
            render: (record) => {
                return <div>
                    {record.recommend === 0 ? <p>
                        <a className="mr10 opt-btn" onClick={() => this.recommendTopic(record)} style={{background: '#349d58'}}>置顶</a>
                    </p> : <p>
                        <a className="mr10 opt-btn" onClick={() => this._isTop(record)} style={{background: '#007bff'}}>取消置顶</a>
                    </p>}
                    {record.recommend === 0 ? '' : <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(record)} style={{background: '#dd274e'}}>修改置顶权重</a></p>}
                </div>
            }
        }, {
            title: '操作',
            key: 'option',
            render: (record) => {
                return (<a onClick={() => this.delSpecialTopic(record)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>取消推荐</a>)
            }
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    // 状态改变
    channelName (id) {
        let name = ''
        authorTypeOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    // 列表展示
    doSearch (type, data) {
        const {dispatch, pageData, filter, search} = this.props
        this.setState({
            loading: true
        })
        let sendData = {
            type: filter.type,
            search: search.search,
            pageSize: 20,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getColumnAuthorList(type, sendData, () => {
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
        const {dispatch, search, filter} = this.props
        dispatch(setPageData({'currentPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            type: value
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    // 取消推荐
    delSpecialTopic (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要取消专栏作者的推荐吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId
                }
                axiosAjax('POST', '/author/cancelrecommend', {...sendData}, (res) => {
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

    // 取消置顶
    _isTop (item) {
        const This = this
        confirm({
            title: '提示',
            content: `确认要取消置顶吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId,
                    recommend: 0
                }
                axiosAjax('post', '/author/recommendauthor', sendData, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        This.doSearch('init')
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
        const {dispatch} = this.props
        dispatch(getAuthorNum())
        const _this = this
        confirm({
            title: '提示',
            content: <div className="modal-input">
                <span style={{marginRight: 10}}>请输入置顶权重：(最小为1，最大为20，且不能重复)</span>
                <InputNumber style={{margin: '10px 0'}} min={1} max={20} defaultValue={item.recommend || 1} autoFocus type="number" onChange={_this.getOrderNum}/>
            </div>,
            onOk () {
                let {order} = _this.state
                if (order.toString().trim() === '') {
                    message.error('推荐位的权重值不能为空！')
                    return false
                }
                let sendData = {
                    passportId: item.passportId,
                    recommend: order
                }
                if (_this.props.numArr.indexOf(order) !== -1) {
                    confirm({
                        title: '提示',
                        content: <div>
                            <h3>{order} 号置顶位已经被占用！</h3>
                            <h3>点击确定将直接 替换 原有专栏作者！</h3>
                        </div>,
                        onOk () {
                            axiosAjax('POST', '/author/recommendauthor', {...sendData}, (res) => {
                                if (res.code === 1) {
                                    message.success('替换成功')
                                    _this.doSearch('init')
                                } else {
                                    message.error(res.msg)
                                }
                            })
                        }
                    })
                } else {
                    axiosAjax('POST', '/author/recommendauthor', {...sendData}, (res) => {
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

    backRecommend (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要撤回推荐吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: 1
                }
                axiosAjax('POST', '/topic/status', {...sendData}, (res) => {
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

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    showModal = () => {
        this.setState({ visible: true })
    }
    handleFormCancel = () => {
        this.setState({ visible: false })
    }
    handleCreate = () => {
        const form = this.formRef.props.form
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            values.recommend = 0
            axiosAjax('POST', '/author/recommendauthor', values, (res) => {
                if (res.code === 1) {
                    message.success('添加成功！')
                    this.doSearch('init')
                } else {
                    message.error(res.msg)
                }
            })
            form.resetFields()
            this.setState({ visible: false })
        })
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    render () {
        const {list, pageData, filter, search, dispatch} = this.props
        return <div className="columnAuthor-index">
            <Row>
                <Col>
                    <span>状态：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {authorTypeOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <Input
                        value={search.search}
                        style={{width: 200, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({search: e.target.value}))}
                        placeholder="请输入名称搜索"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={this.showModal}>新增专栏作者</Button>
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
            <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleFormCancel}
                onCreate={this.handleCreate}
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        columnAuthorInfo: state.columnAuthorInfo,
        list: state.columnAuthorInfo.list,
        search: state.columnAuthorInfo.search,
        filter: state.columnAuthorInfo.filter,
        pageData: state.columnAuthorInfo.pageData,
        numArr: state.columnAuthorInfo.numArr
    }
}

export default connect(mapStateToProps)(ColumnAuthorIndex)
