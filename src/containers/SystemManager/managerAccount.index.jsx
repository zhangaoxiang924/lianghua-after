/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Input, Button, Form, Radio } from 'antd'
import './managerAccount.scss'
// import IconItem from '../../components/icon/icon'
import {getManagerAccountList, setSearchQuery, setPageData, addAccount, selectData} from '../../actions/account/managerAccount.action'
import {axiosAjax, cutString, channelIdOptions} from '../../public/index'
const confirm = Modal.confirm
const RadioGroup = Radio.Group
const formItemLayout = {
    labelCol: {
        sm: { span: 6 }
    },
    wrapperCol: {
        sm: { span: 16 }
    }
}
let columns = []
const FormItem = Form.Item
class ManagerAccountIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            visible: false,
            confirmDirty: false,
            phone: '',
            authorInfo: {}
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
        const {search, filter} = this.props
        this.doSearch('init', {...filter, value: search.value})
        columns = [{
            title: '昵称',
            key: 'nickName',
            render: (text, record) => (record && <div className="managerAccount-info clearfix">
                <div>
                    <h3 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.nickName, 30))} />
                </div>
            </div>)
        }, {
            title: '身份',
            dataIndex: 'role',
            key: 'role',
            render: (text) => {
                if (text === 3) return '超级管理员'
                if (text === 2) return '后台管理员'
                if (text === 5) return '火星中国行管理'
                if (text === 6) return '广告数据管理'
                if (text === 4) return '推送管理员'
            }
        }, {
            title: '登陆名/手机号 ',
            dataIndex: 'phoneNum',
            key: 'phoneNum',
            render: (text) => (!text ? '--' : text)
        }, {
            title: '账号 ID ',
            dataIndex: 'passportId',
            key: 'passportId'
        }, {
            width: 120,
            title: '用户实名认证',
            key: 'realAuth',
            render: (record) => {
                if (record && record.realAuth === 1) {
                    return <span className="news-status">已实名认证</span>
                } else if (record && record.realAuth === -1) {
                    return <span className="news-status cont-publish">实名认证未通过</span>
                } else if (record && record.realAuth === 0) {
                    return <span className="news-status pre-publish">待审核</span>
                } else {
                    return <span className="news-status not-publish">未提交审核</span>
                }
            }
        }, {
            width: 120,
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a onClick={() => this.updManagerAccount(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#199ede'}}>修改管理员</a>
                </p>
                <p style={{marginTop: 10}}>
                    <a disabled={item.role === 3} onClick={() => this.delManagerAccount(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: `${item.role !== 3 ? '#d73435' : '#5d555c'}`}}>取消管理员</a>
                </p>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            value: search.value,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getManagerAccountList(type, sendData, () => {
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
    delManagerAccount (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要取消 ${item.nickName} 的管理员权限吗 ?`,
            onOk () {
                let sendData = {
                    role: 1,
                    passportId: item.passportId
                }
                axiosAjax('POST', '/account/editor/updaterole', {...sendData}, (res) => {
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

    // 修改管理员
    updManagerAccount (item) {
        const {dispatch} = this.props
        dispatch(selectData(item))
        this.setState({
            visible: true,
            authorInfo: item
        })
    }

    cancelModal = () => {
        const {form} = this.props
        form.resetFields()
        this.setState({
            phone: '',
            authorInfo: {},
            visible: false
        })
    }

    checkAuthor = () => {
        axiosAjax('post', '/account/getaccountinfo', {
            phoneNumOrNickName: this.state.phone
        }, (data) => {
            if (data.code === 1) {
                message.success('查询成功！')
                this.setState({
                    authorInfo: data.obj
                })
            } else if (data.code === -1) {
                message.error('未查询到此账号！')
            }
        })
    }

    setPhone = (e) => {
        this.setState({
            phone: e.target.value,
            authorInfo: {}
        })
    }

    submitAccount () {
        const {dispatch, form} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let sendData = {
                passportId: this.state.authorInfo.passportId,
                role: values.role
            }
            dispatch(addAccount(sendData, () => {
                this.setState({
                    phone: '',
                    authorInfo: {},
                    visible: false
                })
                form.resetFields()
                this.doSearch('init')
            }))
        })
    }

    render () {
        const {list, pageData, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="managerAccount-index">
            <Row>
                <Col>
                    <Button type="primary" style={{margin: 0}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData({}))
                    }}>新增/修改管理员</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="添加/修改管理员"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
                footer={[
                    <Button key="back" onClick={this.cancelModal}>取消</Button>,
                    <Button disabled={!this.state.authorInfo.passportId} key="submit" type="primary" onClick={() => { this.submitAccount() }}>确定</Button>
                ]}
            >
                <Form>
                    <FormItem {...formItemLayout} label="手机号/昵称">
                        {getFieldDecorator('phoneNumOrNickName', {
                            rules: [{
                                required: true, message: '请输入手机号/昵称!'
                            }],
                            initialValue: selectedData.phoneNum || ''
                        })(
                            <Input
                                placeholder="输入手机号/昵称进行搜索"
                                onPressEnter={this.checkAuthor}
                                type='tel'
                                style={{width: '75%', marginRight: '4%'}}
                                onChange={(e) => { this.setPhone(e) }}
                            />
                        )}
                        <Button type="primary" onClick={this.checkAuthor}>查询</Button>
                    </FormItem>
                    {this.state.authorInfo && this.state.authorInfo.nickName !== undefined ? <FormItem {...formItemLayout} label="查询结果">
                        {getFieldDecorator('authorInfo')(
                            <span>{this.state.authorInfo.nickName}</span>
                        )}
                    </FormItem> : ''}
                    <FormItem
                        {...formItemLayout}
                        label="管理员权限"
                    >
                        {getFieldDecorator('role', {
                            initialValue: '2'
                        })(
                            <RadioGroup>
                                <Radio value="2">系统</Radio>
                                <Radio value="5">火星中国行</Radio>
                                <Radio value="4">App推送管理</Radio>
                                <Radio value="6">广告数据管理</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        managerAccountInfo: state.managerAccountInfo,
        list: state.managerAccountInfo.list,
        search: state.managerAccountInfo.search,
        filter: state.managerAccountInfo.filter,
        pageData: state.managerAccountInfo.pageData,
        selectedData: state.managerAccountInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(ManagerAccountIndex))
