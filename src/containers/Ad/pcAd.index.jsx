/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Table, Row, Col, Modal, message, Spin, Select, Button, InputNumber, Input } from 'antd'
import './index.scss'
import { hashHistory, Link } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getAdList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../actions/others/ad.action'
import {formatDate, axiosAjax, cutString, pcAdPosition} from '../../public/index'
const confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
    labelCol: {
        sm: { span: 6 }
    },
    wrapperCol: {
        sm: { span: 16 }
    }
}
let columns = []
class AdIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            adStatus: null,
            visible: false,
            previewVisible: false,
            updateVisible: false,
            previewImage: '',
            number: 1
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch(!search.type ? 'init' : search.type, {adPlace: filter.adPcPlace})
        columns = [{
            title: '广告标题',
            width: 170,
            key: 'remake',
            render: (text, record) => (<div className="ad-info clearfix">
                <div>
                    <h4 title={record.remake} dangerouslySetInnerHTML={this.createMarkup(record.remake ? cutString(record.remake, 30) : '暂无')} />
                    <div>
                        {record.adPlace === 8 && <div style={{'display': 'inline-block', color: '#222'}}>
                            <p>(位置: {record.showPosition || '无'})</p>
                        </div>}
                    </div>
                </div>
            </div>)
        }, {
            title: '广告状态',
            key: 'status',
            render: (record) => {
                if (record.status !== 1) {
                    return <span className="ad-status pre-publish">未展示</span>
                } else if (record.status === 1) {
                    return <span className="ad-status has-publish">展示中</span>
                } else {
                    return <span>暂无</span>
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
            title: '广告链接 ',
            dataIndex: 'url',
            key: 'url',
            render: (text, record) => (<a href={record.url} target='_blank' title={record.url}>{record.url ? cutString(record.url, 30) : '暂无'}</a>)
        }, {
            title: '发布时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '查看/修改',
            key: 'option',
            render: (item) => (<div>
                <p style={{marginBottom: 10}}>
                    <a className="mr10 opt-btn" onClick={() => { this.detailModal(item) }} style={{background: '#2b465f'}}>查看</a>
                </p>
                <p>
                    <Link className="mr10 opt-btn" to={{pathname: '/ad-edit', query: {id: item.id}}} style={{background: '#108ee9'}}>编辑</Link>
                </p>
                {item.adPlace === 8 && <p style={{marginTop: 10}}>
                    <a onClick={() => {
                        this.props.dispatch(selectedData(item))
                        this.setState({
                            updateVisible: true
                        })
                    }} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#f681a1'}}>修改嵌入位置</a>
                </p>}
            </div>)
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <p style={{marginBottom: 10}}>
                    <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>{item.status === 1 ? '撤回' : '发布'}</a>
                </p>
                <p>
                    <a onClick={() => this.delAd(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
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
        pcAdPosition.map((item, index) => {
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
            adPlace: filter.adPcPlace,
            type: 1,
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
        this.doSearch(search.type, {'currentPage': page, adPlace: filter.adPcPlace})
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
                        message.success(`${item.status === 2 ? '发表' : '撤回到草稿箱'}成功`)
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
        axiosAjax('post', '/ad/forbidcomment', sendData, (res) => {
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
        axiosAjax('post', '/ad/recommend', sendData, (res) => {
            if (res.code === 1) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 筛选广告状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({adPcPlace: value}))
        this.setState({
            adStatus: value
        })
        this.doSearch('init', {'currentPage': 1, adPlace: value})
    }

    // 新增
    incAd = () => {
        hashHistory.push('/ad-edit')
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

    cancelUpdateModal = (e) => {
        this.setState({
            updateVisible: false
        })
    }

    handleImgModalCancel = () => this.setState({previewVisible: false})

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src'),
            previewVisible: true
        })
    }

    setNumber = (number) => {
        this.setState({number})
    }

    submitAccount () {
        const {form, selectedData} = this.props
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            axiosAjax('post', '/ad/setshowposition', {
                id: selectedData.id,
                showPosition: values.showPosition
            }, (res) => {
                if (res.code === 1) {
                    This.setState({
                        updateVisible: false
                    })
                    This.doSearch('init')
                } else {
                    message.error(res.msg)
                }
            })
        })
    }

    render () {
        const {list, pageData, filter, selectedData, form, search, dispatch} = this.props
        const { getFieldDecorator } = form
        return <div className="ad-index">
            <Row>
                <Col span={22} className="ad-position">
                    <span>广告位置：</span>
                    <Select defaultValue={`${filter.adPcPlace}`} style={{ width: 140 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        {pcAdPosition.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
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
                    <Row style={{marginBottom: 10}}>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>位置: </Col>
                        <Col span={20} className="">{this.adPosition(selectedData.adPlace)}</Col>
                    </Row>
                    <Row style={{marginBottom: 10}}>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>标题: </Col>
                        <Col span={20} className="">{selectedData.remake || '无'}</Col>
                    </Row>
                    <Row style={{marginBottom: 10}}>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>链接地址: </Col>
                        <Col span={20} className="">{<a target="_blank" href={selectedData.url} title={selectedData.url}>{selectedData.url || '无'}</a>}</Col>
                    </Row>
                </div>
                <Row>
                    <Col className="" style={{margin: '0 auto', width: '95%'}}><img src={selectedData.imgSrc} alt=""/></Col>
                </Row>
            </Modal>
            {this.state.updateVisible && <Modal
                title="添加/修改嵌入位置"
                visible={this.state.updateVisible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelUpdateModal }
                footer={[
                    <Button key="back" onClick={this.cancelUpdateModal}>取消</Button>,
                    <Button key="submit" type="primary" onClick={() => { this.submitAccount() }}>添加</Button>
                ]}
            >
                <Form>
                    <FormItem {...formItemLayout} label="广告嵌入位置">
                        {getFieldDecorator('showPosition', {
                            rules: [{
                                required: true, message: '请输入广告嵌入位置!'
                            }],
                            initialValue: selectedData.showPosition || 1
                        })(
                            <InputNumber
                                max={30}
                                min={1}
                                placeholder="广告嵌入位置(升序排列)"
                                onPressEnter={() => this.submitAccount()}
                                style={{width: '80%'}}
                                onChange={(e) => { this.setNumber(e) }}
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>}

        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        adInfo: state.adInfo,
        selectedData: state.adInfo.selectedData,
        list: state.adInfo.list,
        search: state.adInfo.search,
        filter: state.adInfo.filter,
        pageData: state.adInfo.pageData
    }
}

export default connect(mapStateToProps)(Form.create()(AdIndex))
