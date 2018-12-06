/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, Spin, Select, Input, Button, Form } from 'antd'
import './index.scss'
import IconItem from '../../components/icon/icon'
import {getRegisterList, setSearchQuery, setPageData, addTrip, setFilterData, selectData} from '../../actions/activity/registrant.action'
import {cutString, formatDate} from '../../public/index'
// import moment from 'moment'
// const RadioGroup = Radio.Group
const Option = Select.Option
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
class RegisterIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            acquireChannel: '',
            editNewsId: '',
            visible: false,
            passwordModal: false
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch('init', {...filter, value: search.value})
        columns = [{
            title: '姓名',
            key: 'name',
            render: (text, record) => (record && <div className="registrant-info clearfix">
                <div>
                    <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(cutString(record.name, 30))} />
                </div>
            </div>)
        }, {
            title: '手机号',
            dataIndex: 'phoneNum',
            key: 'phoneNum'
        }, {
            title: '邮箱',
            key: 'email',
            dataIndex: 'email'
        }, {
            title: '职业',
            dataIndex: 'professionAttr',
            key: 'professionAttr'
        }, {
            title: '渠道',
            dataIndex: 'acquireChannel',
            key: 'acquireChannel',
            render: (record) => (this.channelName(record) || '暂无')
        }, {
            title: '报名时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (record) => (formatDate(record))
        }, {
            title: '备注',
            width: 250,
            dataIndex: 'remark',
            key: 'remark',
            render: (record) => (record || '无')
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <a className="mr10 opt-btn" onClick={() => { this.updateRemark(item) }} style={{background: '#108ee9'}}>修改备注</a>
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
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            dispatch(addTrip({
                id: selectedData.id,
                remark: values.remark
            }, () => {
                this.setState({ visible: false })
                form.resetFields()
                this.doSearch('init')
            }))
        })
    }

    updateRemark (item) {
        this.props.dispatch(selectData(item))
        this.setState({
            visible: true
        })
    }

    doSearch (type, data) {
        this.setState({
            loading: true
        })
        const {dispatch, pageData, location, search, filter} = this.props
        let sendData = {
            ...filter,
            nameOrPhoneNum: search.value,
            cityNum: location.query.id,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getRegisterList(type, sendData, () => {
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

    // 汉字替换
    channelName (id) {
        const nameValue = [
            {value: '1', label: '朋友推荐'},
            {value: '2', label: '火星社群'},
            {value: '4', label: '微信'},
            {value: '5', label: '其他'}
        ]
        let name = ''
        nameValue.map((item, index) => {
            if (parseInt(item.value) === parseInt(id)) {
                name = item.label
            }
        })
        return name
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

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'acquireChannel': value}))
        this.setState({
            loading: true,
            acquireChannel: value
        })
        this.doSearch('init', {'currentPage': 1, acquireChannel: value})
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    render () {
        const {list, pageData, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="registrant-index">
            <Row>
                <Col>
                    <span>渠道：</span>
                    <Select defaultValue={`${filter.acquireChannel}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">朋友推荐</Option>
                        <Option value="2">火星社群</Option>
                        <Option value="4">微信</Option>
                        <Option value="5">其他</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>账号昵称：</span>
                    <Input
                        value={search.value}
                        style={{width: 150, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({value: e.target.value}))}
                        placeholder="输入昵称/手机号搜索"
                        onPressEnter={() => { this._search() }}
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            {this.state.visible && <Modal
                title="添加/修改备注"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="姓名">
                        {getFieldDecorator('name', {
                            initialValue: selectedData.name
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="添加备注">
                        {getFieldDecorator('remark', {
                            rules: [{
                                required: true, message: '请确认备注信息!'
                            }],
                            initialValue: selectedData.remark === '' ? '' : selectedData.remark
                        })(
                            <TextArea rows={5} placeholder="请输入备注信息"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>}
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        registrantInfo: state.registrantInfo,
        list: state.registrantInfo.list,
        search: state.registrantInfo.search,
        filter: state.registrantInfo.filter,
        pageData: state.registrantInfo.pageData,
        selectedData: state.registrantInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(RegisterIndex))
