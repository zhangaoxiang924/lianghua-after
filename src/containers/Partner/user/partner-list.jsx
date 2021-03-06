/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, InputNumber } from 'antd'
import CollectionCreateForm from '../ModalForm/index'
import './index.scss'
import { hashHistory } from 'react-router'
import {getPartnerList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../../actions/partner/partner.action'
import {formatDate, axiosAjax, cutString} from '../../../public/index'
const confirm = Modal.confirm
// const Option = Select.Option
let columns = []
const userTypeOptions = [
    { label: '合作伙伴', value: '1' },
    { label: '主持人', value: '2' },
    { label: '全部', value: '0' }
]
class Partner extends Component {
    constructor () {
        super()
        this.state = {
            visible: false,
            loading: true,
            type: null,
            data: {},
            url: '',
            previewVisible: false,
            previewImage: '',
            order: 1,
            confirmLoading: false
        }
    }

    componentWillMount () {
        const {dispatch} = this.props
        this.doSearch('init')
        columns = [{
            title: '姓名',
            key: 'name',
            render: (text, record) => (record && <div className="partner-info clearfix">
                <div>
                    <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(cutString(record.name, 30))} />
                    {/*
                    {parseInt(record.topOrder) === 0 ? '' : <div style={{'display': 'inline-block'}}><span className="partner-status has-publish mr10">置顶（{record.topOrder}）</span></div>}
                    */}
                </div>
            </div>)
        }, {
            title: '类型',
            dataIndex: 'category',
            key: 'category',
            render: (record) => {
                if (parseInt(record) === 1) {
                    return <span className="type-org tag">独家冠名</span>
                } else if (parseInt(record) === 2) {
                    return <span className="type-unit tag">联合发起方</span>
                } else if (parseInt(record) === 3) {
                    return <span className="type-media tag">合作交易所</span>
                } else if (parseInt(record) === 4) {
                    return <span className="type-person tag">特邀战略合作</span>
                } else {
                    return <span className="type-other tag">其他</span>
                }
            }
        }, {
            title: '头像 ',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (record) => (<div
                className="shrinkPic"
                key={record}
                style={{
                    background: `url(${record}) no-repeat center / cover`
                }}
                src={record}
                onClick={this.handlePreview}
            />)
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (record) => (record && formatDate(record))
        },
        // , {
        //     title: '置顶相关',
        //     key: 'topOption',
        //     render: (record) => {
        //         return <div>
        //             {record.topOrder === 0 ? <p>
        //                 <a className="mr10 opt-btn" onClick={() => this.recommendTopic(record)} style={{background: '#007bff'}}>置顶</a>
        //             </p> : <p>
        //                 <a className="mr10 opt-btn" onClick={() => this._isTop(record)} style={{background: '#007bff'}}>取消置顶</a>
        //             </p>}
        //             {record.topOrder === 0 ? '' : <p style={{marginTop: 10}}><a className="mr10 opt-btn" onClick={() => this.recommendTopic(record)} style={{background: '#dd274e'}}>修改置顶权重</a></p>}
        //         </div>
        //     }
        // }
        {
            title: '操作',
            key: 'action',
            render: (item) => {
                return <div>
                    <p>
                        <a onClick={() => {
                            dispatch(selectedData(item))
                            hashHistory.push('/partner-edit')
                        }} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#108ee9'}}>编辑</a>
                    </p>
                    <p style={{marginTop: 10}}>
                        <a onClick={() => this.delPartner(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                </div>
            }
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init'}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    getOrderNum = (value) => {
        this.setState({
            order: value
        })
    }

    recommendTopic (item) {
        const _this = this
        confirm({
            title: '提示',
            content: <div className="modal-input">
                <span style={{marginRight: 10}}>请输入置顶权重：(权重越大排序越靠前)</span>
                <InputNumber style={{margin: '10px 0'}} min={1} max={20} defaultValue={item.topOrder || 1} autoFocus type="number" onChange={_this.getOrderNum}/>
            </div>,
            onOk () {
                let {order} = _this.state
                if (order.toString().trim() === '') {
                    message.error('推荐位的权重值不能为空！')
                    return false
                }
                let sendData = {
                    id: item.id,
                    topOrder: order
                }
                _this.setState({
                    loading: true
                })
                axiosAjax('POST', '/guestInfo/updateTopOrder', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('修改成功')
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    _isTop (item) {
        const This = this
        confirm({
            title: '提示',
            content: `确认要取消置顶吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('post', '/partner/delete', sendData, (res) => {
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

    // 状态改变
    channelName (id) {
        let name = ''
        userTypeOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    // 列表请求
    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData} = this.props
        let sendData = {
            // search: search.search,
            // ...filter,
            pageSize: 20,
            currentPage: pageData.page
        }
        sendData = {...sendData, ...data}
        dispatch(getPartnerList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    // 点击搜索
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'page': 1})
        dispatch(setPageData({'page': 1}))
    }

    // 改变页数
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, filter} = this.props
        dispatch(setPageData({'page': page}))
        this.doSearch('init', {'page': page, ...filter})
    }

    showModal = () => {
        this.setState({ visible: true })
    }

    // 取消
    handleCancel = () => {
        this.setState({
            visible: false,
            data: {}
        })
    }

    getImgUrl = (data) => {
        this.setState({
            url: data
        })
    }

    // 提交表单
    handleCreate = () => {
        const form = this.form
        form.setFieldsValue({
            url: this.state.url
        })
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.setState({
                confirmLoading: true
            })
            axiosAjax('POST', '/partner/create', values, (res) => {
                this.setState({
                    confirmLoading: false
                })
                if (res.code === 1) {
                    message.success('添加成功！')
                    form.resetFields()
                    this.setState({ visible: false })
                    this.doSearch('init')
                } else {
                    message.error(res.msg)
                }
            })
        })
    }
    saveFormRef = (form) => {
        this.form = form
    }

    // 删除
    delPartner (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/partner/delete', {...sendData}, (res) => {
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

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            type: value
        })
        this.doSearch('init', {'page': 1, type: value})
    }

    handleImgModalCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    render () {
        const {list, pageData} = this.props
        return <div className="partner-index">
            <Row>
                <Col>
                    {/*
                    <span>列表筛选：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {userTypeOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <Input
                        value={search.search}
                        style={{width: 150, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({search: e.target.value}))}
                        placeholder="合作伙伴姓名"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                    */}
                    <Button type="primary" style={{margin: '0 15px'}} onClick={this.showModal}>新增合作伙伴</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table
                        dataSource={list.map((item, index) => ({...item, key: index}))}
                        columns={columns}
                        bordered
                        pagination={{
                            current: pageData.page,
                            total: pageData.totalCount,
                            pageSize: pageData.pageSize,
                            onChange: (page) => this.changePage(page)
                        }}
                    />
                </Spin>
            </div>
            <Modal className="pre-Modal" visible={this.state.previewVisible} footer={null} onCancel={this.handleImgModalCancel}>
                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
            </Modal>
            {this.state.visible && <CollectionCreateForm
                loading={this.state.confirmLoading}
                getImgData={(data) => { this.getImgUrl(data) }}
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                data={this.state.data}
            />}
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        partnerInfo: state.partnerInfo,
        list: state.partnerInfo.list,
        search: state.partnerInfo.search,
        filter: state.partnerInfo.filter,
        pageData: state.partnerInfo.pageData
    }
}

export default connect(mapStateToProps)(Partner)
