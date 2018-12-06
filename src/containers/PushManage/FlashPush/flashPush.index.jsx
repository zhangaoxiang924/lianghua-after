/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Input, Button, Form, Checkbox, Radio } from 'antd'
import './flashPush.scss'
// import IconItem from '../../components/icon/icon'
import {getFlashPushList, setSearchQuery, setPageData, addFlashPush, selectData} from '../../../actions/flash/flashPush.action'
import {axiosAjax, cutString, channelIdOptions} from '../../../public/index'
const confirm = Modal.confirm
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const { TextArea } = Input
const formItemLayout = {
    labelCol: {
        sm: { span: 6 }
    },
    wrapperCol: {
        sm: { span: 16 }
    }
}
const terminal = {
    '财经App': {
        key: 1,
        class: 'news-status'
    },
    '币优': {
        key: 2,
        class: 'news-status cont-publish'
    }
}
let columns = []
const FormItem = Form.Item
class ManagerFlashPush extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            visible: false,
            terminal: ''
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
        this.doSearch('init', {...filter, search: search.value})
        columns = [{
            title: '快讯 ID',
            key: 'id',
            width: 160,
            render: (text, record) => (record && <div className="flashPush-info clearfix">
                <div>
                    <h4 title={record.id}>{record.id}</h4>
                </div>
            </div>)
        }, {
            title: '快讯标题',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (!text ? '--' : <span title={text}>{cutString(text, 30)}</span>)
        }, {
            title: '快讯内容',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (!text ? '--' : <span title={text}>{cutString(text, 40)}</span>)
        }, {
            title: '推送描述',
            dataIndex: 'notifyContent',
            key: 'notifyContent',
            render: (text) => (!text ? '--' : <span title={text}>{cutString(text, 40)}</span>)
        }, {
            title: '推送方',
            key: 'terminal',
            width: 90,
            render: (record) => {
                let arr = record.terminal.split(',')
                return arr.map((item, index) => {
                    for (let key in terminal) {
                        if (parseInt(item) === terminal[key].key) {
                            return <p className={terminal[key].class} key={index}>{key}</p>
                        }
                    }
                })
            }
        }, {
            title: '推送类型',
            key: 'type',
            render: (record) => {
                if (record && record.type === 'flash') return '快讯'
                if (record && record.type === 'news') return '新闻'
                if (record && record.type === 'lives') return '直播'
                if (record && record.type === 'video') return '视频'
            }
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        this.setState({
            loading: true
        })
        let sendData = {
            ...filter,
            search: search.value,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getFlashPushList(type, sendData, () => {
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

    cancelModal = () => {
        const {form} = this.props
        form.resetFields()
        this.setState({
            visible: false
        })
    }

    submitAccount () {
        const {dispatch, form} = this.props
        form.validateFields((err, values) => {
            values.terminal = this.state.terminal
            values.createTime = Date.parse(new Date())
            if (err) {
                return false
            }
            dispatch(addFlashPush(values, () => {
                this.setState({
                    visible: false
                })
                form.resetFields()
                this.doSearch('init')
            }))
        })
    }

    terminalChange = (value) => {
        this.setState({
            terminal: value.join(',')
        })
    }

    render () {
        const {list, pageData, dispatch, form, search} = this.props
        const { getFieldDecorator } = form
        return <div className="flashPush-index">
            <Row>
                <Col>
                    <Input
                        value={search.value}
                        style={{width: 150}}
                        onChange={(e) => dispatch(setSearchQuery({value: e.target.value}))}
                        placeholder="请输入新闻标题"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => { this._search() }}>搜索</Button>
                    <Button type="primary" style={{margin: 0}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData({}))
                    }}>添加推送</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="添加推送信息"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
                footer={[
                    <Button key="back" onClick={this.cancelModal}>取消</Button>,
                    <Button key="submit" type="primary" onClick={() => { this.submitAccount() }}>添加</Button>
                ]}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="推送类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: 'flash',
                            rules: [{required: true, message: '请选择推送类型！'}]
                        })(
                            <RadioGroup>
                                <Radio value="flash">快讯</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="推送方"
                    >
                        {getFieldDecorator('terminal', {
                            initialValue: [],
                            rules: [{required: true, message: '请选择推送方！'}]
                        })(
                            <CheckboxGroup onChange={this.terminalChange}>
                                <Checkbox value="1">火星财经APP</Checkbox>
                                {/* <Checkbox value="3">火星社区APP</Checkbox> */}
                                <Checkbox value="2">第三方(币优)</Checkbox>
                            </CheckboxGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="快讯ID: ">
                        {getFieldDecorator('id', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '请输入快讯 ID！'}
                            ]
                        })(
                            <Input placeholder="快讯 ID"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="标题: ">
                        {getFieldDecorator('title', {
                            initialValue: '',
                            rules: [{required: true, message: '请输入快讯标题！'}]
                        })(
                            <Input placeholder="快讯标题"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容: ">
                        {getFieldDecorator('content', {
                            initialValue: '',
                            rules: [{required: true, message: '请输入快讯内容！'}]
                        })(
                            <TextArea rows={4} placeholder="快讯内容"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="推送描述: ">
                        {getFieldDecorator('notifyContent', {
                            initialValue: '',
                            rules: [{required: true, message: '请输入快讯的推送描述！'}]
                        })(
                            <TextArea rows={4} placeholder="快讯推送描述"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        flashPushInfo: state.flashPushInfo,
        list: state.flashPushInfo.list,
        search: state.flashPushInfo.search,
        filter: state.flashPushInfo.filter,
        pageData: state.flashPushInfo.pageData,
        selectedData: state.flashPushInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(ManagerFlashPush))
