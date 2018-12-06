/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { Table, Row, Col, Modal, message, Spin, Input, Button, Form } from 'antd'
import './index.scss'
import IconItem from '../../components/icon/icon'
import {getMarsTripList, setSearchQuery, setPageData, setFilterData, addTrip, selectData} from '../../actions/activity/marsTrip.action'
import {axiosAjax, cutString} from '../../public/index'
// import moment from 'moment'
const confirm = Modal.confirm
// const RadioGroup = Radio.Group
// const Option = Select.Option
const {TextArea} = Input
const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 }
    }
}
let columns = []
const FormItem = Form.Item
class MarsTripIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            visible: false,
            passwordModal: false
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch('init', {...filter, value: search.value})
        columns = [{
            title: '城市',
            key: 'city',
            render: (text, record) => (record && <div className="marsTrip-info clearfix">
                <div>
                    <h4 title={record.city} dangerouslySetInnerHTML={this.createMarkup(cutString(record.city, 30))} />
                    {/*
                    <div>
                        {(record.original && parseInt(record.original) === 1) ? <div style={{'display': 'inline-block'}}><span className="green-bg mr10">独家</span></div> : ''}
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="org-bg mr10">推荐</span></div>}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                        {parseInt(record.topOrder) === 0 ? '' : <Tooltip placement="bottom" title={`置顶失效时间: ${moment(record.setTopOrderTime).format('YYYY年MM月DD日 HH:mm:ss')}`} >
                            <div className="news-top clearfix">
                                <span className="top-bg">置顶</span>
                                <Input
                                    className="top-num"
                                    onBlur = {(e) => this._editTopValue(e, record)}
                                    onChange={(e) => this.changeTopValue(e, record)}
                                    value={record.topOrder}
                                />
                            </div>
                        </Tooltip>}
                    </div>
                    */}
                </div>
            </div>)
        }, {
            title: '编号 ',
            dataIndex: 'cityNum',
            key: 'cityNum'
        }, {
            title: '活动时间',
            key: 'activityTime',
            dataIndex: 'activityTime'
            // render: (record) => (formatDate(record.createTime))
        }, {
            title: '活动地址',
            dataIndex: 'detailAddress',
            key: 'detailAddress'
        }, {
            title: '报名人数',
            dataIndex: 'personNum',
            key: 'personNum',
            render: (record) => (record || '暂无')
        }, {
            title: '状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === 1) {
                    return <span className="news-status">正常</span>
                } if (record && record.status === -1) {
                    return <span className="news-status cont-publish">封禁</span>
                } else {
                    return <span className="news-status pre-publish">暂无</span>
                }
            }
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <a onClick={() => {
                    hashHistory.push({
                        pathname: '/registrant-list',
                        query: {
                            id: item.cityNum
                        }
                    })
                }} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#64a5f8'}}
                >报名详情</a>
                <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                {/*
                <p>
                    <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                        {(() => {
                            if (item.status === 1) {
                                return '封禁'
                            } else if (item.status === -1) {
                                return '解封'
                            }
                        })()}
                    </a>
                </p>
                */}
                <a onClick={() => this.delMarsTrip(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    submitAccount () {
        const {dispatch, form, selectedData} = this.props
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            delete values.confirm
            if (selectedData.cityNum) {
                axiosAjax('post', '/marschinatrip/updatecity', {
                    cityNum: selectedData.cityNum,
                    city: values.city,
                    detailAddress: values.detailAddress,
                    // activityTime: Date.parse(values.activityTime.format('YYYY-MM-DD HH:mm:ss'))
                    activityTime: values.activityTime
                }, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        this.setState({ visible: false })
                        form.resetFields()
                        This.doSearch('init')
                    } else {
                        message.success(data.msg)
                    }
                })
            } else {
                dispatch(addTrip({
                    ...values
                    // activityTime: Date.parse(values.activityTime.format('YYYY-MM-DD HH:mm:ss'))
                }, () => {
                    this.setState({ visible: false })
                    form.resetFields()
                    this.doSearch('init')
                }))
            }
        })
    }

    updateAccount (item) {
        this.props.dispatch(selectData(item))
        this.setState({
            visible: true
        })
    }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            value: search.value,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getMarsTripList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    _search () {
        const {dispatch} = this.props
        let type = 'init'
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }

    // 删除
    delMarsTrip (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    cityNum: item.cityNum
                }
                axiosAjax('POST', '/marschinatrip/delcity', {...sendData}, (res) => {
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

    // 封禁/解封
    _isPublish (item) {
        const {dispatch} = this.props
        const _this = this

        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '封禁' : '解封'}用户吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId,
                    status: item.status === 1 ? -1 : 1
                }
                axiosAjax('POST', '/liveaccount/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
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
        dispatch(setFilterData({'status': value}))
        this.setState({
            newsStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    render () {
        const {list, pageData, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="marsTrip-index">
            <Row>
                <Col>
                    {/*
                    <span>账号状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">正常</Option>
                        <Option value="-1">封禁</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>账号昵称：</span>
                    <Input
                        value={search.value}
                        style={{width: 150, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({value: e.target.value}))}
                        placeholder="输入昵称/手机号搜索"
                    />
                    <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                    */}
                    <Button type="primary" style={{margin: 0}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData({
                            cityNum: ''
                        }))
                    }}><IconItem type="icon-post-send"/>新增城市</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            {this.state.visible && <Modal
                title="添加/修改城市"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="城市">
                        {getFieldDecorator('city', {
                            rules: [{
                                required: true, message: '请输入城市名!'
                            }],
                            initialValue: selectedData.cityNum === '' ? '' : selectedData.city
                        })(
                            <Input placeholder="请输入城市名"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="城市编号">
                        {getFieldDecorator('cityNum', {
                            rules: [{
                                required: true, message: '请输入城市编号!'
                            }, {
                                pattern: /^[1-9]\d*$/, message: '请输入正确的城市编号!'
                            }],
                            initialValue: selectedData.cityNum === '' ? '' : selectedData.cityNum
                        })(
                            <Input disabled={selectedData.cityNum !== ''} placeholder="城市编号, 添加后编号不可修改"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="活动时间: "
                    >
                        {getFieldDecorator('activityTime', {
                            rules: [{required: true, message: '请设置活动时间！'}],
                            initialValue: selectedData.cityNum === '' ? '' : selectedData.activityTime
                        })(
                            <Input placeholder="请输入活动时间"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="活动地点">
                        {getFieldDecorator('detailAddress', {
                            rules: [{
                                required: true, message: '请确认活动地点!'
                            }],
                            initialValue: selectedData.cityNum === '' ? '' : selectedData.detailAddress
                        })(
                            <TextArea placeholder="请输入活动地点"/>
                        )}
                    </FormItem>
                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="发表权限"
                    >
                        {getFieldDecorator('role', {
                            initialValue: selectedData.role ? `${selectedData.role}` : '1'
                        })(
                            <RadioGroup>
                                <Radio value="1">需要审核</Radio>
                                <Radio value="2">无需审核</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    */}
                </Form>
            </Modal>}
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        marsTripInfo: state.marsTripInfo,
        list: state.marsTripInfo.list,
        search: state.marsTripInfo.search,
        filter: state.marsTripInfo.filter,
        pageData: state.marsTripInfo.pageData,
        selectedData: state.marsTripInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(MarsTripIndex))
