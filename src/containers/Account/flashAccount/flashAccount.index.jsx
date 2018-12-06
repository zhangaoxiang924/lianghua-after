/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form, Radio } from 'antd'
import './flashAccount.scss'
import IconItem from '../../../components/icon/icon'
import {getFlashAccountList, setSearchQuery, setPageData, setFilterData, addAccount, selectData} from '../../../actions/account/flashAccount.action'
import {axiosAjax, cutString, channelIdOptions} from '../../../public/index'
import UpdatePsw from './updatepsw'
const confirm = Modal.confirm
const RadioGroup = Radio.Group
const Option = Select.Option
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
class FlashAccountIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            visible: false,
            passwordModal: false,
            confirmDirty: false
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
        const {search, filter, dispatch} = this.props
        this.doSearch('init', {...filter, value: search.value})
        columns = [{
            title: '昵称',
            key: 'nickName',
            render: (text, record) => (record && <div className="flashAccount-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.nickName, 30))} />
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
            title: '手机号 ',
            dataIndex: 'phoneNum',
            key: 'phoneNum'
        }, {
            title: '账号 ID ',
            dataIndex: 'passportId',
            key: 'passportId'
        }, {
            title: '账号状态',
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
            title: '发布权限',
            key: 'role',
            render: (item) => (<div className="btns">
                <p>
                    {parseInt(item.role) === 1 ? <span
                        className="mr10 opt-btn"
                        href="javascript:void(0)"
                        style={{background: '#ff8978'}}
                    >需要审核</span> : <span
                        className="mr10 opt-btn"
                        href="javascript:void(0)"
                        style={{background: '#46c1ff'}}
                    >不需要审核</span>}
                </p>
            </div>)
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                </p>
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
                <p>
                    <a onClick={() => this.delFlashAccount(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
                <p>
                    <a
                        onClick={() => {
                            this.setState({passwordModal: true})
                            dispatch(selectData(item))
                        }}
                        className="mr10 opt-btn"
                        href="javascript:void(0)"
                        style={{background: '#64a5f8'}}
                    >修改密码</a>
                </p>
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
            if (selectedData.passportId) {
                axiosAjax('post', '/liveaccount/updateeditor', {
                    passportId: selectedData.passportId,
                    phoneNum: values.phoneNum,
                    nickName: values.nickName,
                    introduce: '',
                    role: values.role
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
                dispatch(addAccount(values, () => {
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
        dispatch(getFlashAccountList(type, sendData, () => {
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
    delFlashAccount (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId
                }
                axiosAjax('POST', '/liveaccount/delete', {...sendData}, (res) => {
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

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true })
        }
        callback()
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value
        this.setState({ confirmDirty: this.state.confirmDirty || !!value })
    }

    compareToFirstPassword = (rule, value, fn) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            fn('两次密码输入不一致!')
        } else {
            fn()
        }
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    changePassword = () => {
        const This = this
        const {selectedData, dispatch} = this.props
        const form = this.passwordForm.props.form
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            axiosAjax('post', '/liveaccount/updatepwd', {
                passportId: selectedData.passportId,
                password: values.password
            }, (data) => {
                if (data.code === 1) {
                    message.success('操作成功!')
                    this.setState({ passwordModal: false })
                    form.resetFields()
                    This.doSearch('init')
                    dispatch(selectData({}))
                } else {
                    message.success(data.msg)
                }
            })
        })
    }

    cancelPasswordModal = () => {
        const {dispatch} = this.props
        const form = this.passwordForm.props.form
        this.setState({passwordModal: false})
        form.resetFields()
        dispatch(selectData({}))
    }

    render () {
        const {list, pageData, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="flashAccount-index">
            <Row>
                <Col>
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
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                            this.setState({visible: true})
                            dispatch(selectData({}))
                        }}><IconItem type="icon-post-send"/>新增账号</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="添加/修改账号"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="账号昵称">
                        {getFieldDecorator('nickName', {
                            rules: [{
                                required: true, message: '请输入昵称!'
                            }],
                            initialValue: selectedData.nickName === '' ? '' : selectedData.nickName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {/*
                     <FormItem {...formItemLayout} label="用户名">
                     {getFieldDecorator('name', {
                     rules: [{
                     required: true, message: '请输入用户名!'
                     }],
                     initialValue: selectedData.name === '' ? '' : selectedData.name
                     })(
                     <Input />
                     )}
                     </FormItem>
                    */}
                    <FormItem {...formItemLayout} label="手机号">
                        {getFieldDecorator('phoneNum', {
                            rules: [{
                                required: true, message: '请输入手机号!'
                            }, {
                                pattern: /^1[3|4|5|8][0-9]\d{8}$/, message: '请输入正确的手机号!'
                            }],
                            initialValue: selectedData.phoneNum === '' ? '' : selectedData.phoneNum
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {!selectedData.passportId && <div>
                        <FormItem {...formItemLayout} label="账号密码">
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: !selectedData.passportId && selectedData.passportId !== '', message: '请输入密码!'
                                }, {
                                    validator: this.validateToNextPassword
                                }],
                                initialValue: selectedData.password === '' ? '' : selectedData.password
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="确认密码">
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: !selectedData.passportId && selectedData.passportId !== '', message: '请确认密码!'
                                }, {
                                    validator: this.compareToFirstPassword
                                }],
                                initialValue: selectedData.password === '' ? '' : selectedData.password
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                    </div>}
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
                </Form>
            </Modal>
            <UpdatePsw
                wrappedComponentRef={(passwordForm) => { this.passwordForm = passwordForm }}
                visible={this.state.passwordModal}
                onCreate={this.changePassword}
                onCancel={ this.cancelPasswordModal }
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        flashAccountInfo: state.flashAccountInfo,
        list: state.flashAccountInfo.list,
        search: state.flashAccountInfo.search,
        filter: state.flashAccountInfo.filter,
        pageData: state.flashAccountInfo.pageData,
        selectedData: state.flashAccountInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(FlashAccountIndex))
