/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, Spin, Input, Button, Form, message } from 'antd'
import './index.scss'
import IconItem from '../../../components/icon/icon'
import {getParticipateList, setSearchQuery, setPageData, addTrip, setFilterData, selectData} from '../../../actions/activity/participate.action'
import {cutString, formatDate, axiosAjax} from '../../../public/index'
// import moment from 'moment'
// const RadioGroup = Radio.Group
// const Option = Select.Option
const {confirm} = Modal
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

const idArr = [
    {value: '1', label: '创始人'},
    {value: '2', label: '投资人'},
    {value: '3', label: '合伙人'},
    {value: '4', label: '高管'},
    {value: '5', label: '其他职员'}
]

class ParticipateIndex extends Component {
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
        this.doSearch('init')
        columns = [{
            title: '姓名',
            key: 'name',
            render: (text, record) => (record && <div className="participate-info clearfix">
                <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(cutString(record.name, 30))} />
            </div>)
        }, {
            title: '联系方式',
            key: 'phonenum',
            render: (record) => {
                return <div>
                    <p className="age">手机号：{record.phonenum || '无'}</p>
                    <p className="age">微信：{record.wechat || '无'}</p>
                    <p className="age">邮箱：{record.email || '无'}</p>
                </div>
            }
        }, {
            title: '基本信息',
            key: 'basicInfo',
            render: (text, record) => (record && <div className="participate-info clearfix">
                <p className="age">年龄：{record.age}</p>
                <p className="age">城市：{record.city}</p>
                <p className="age">公司：{record.company}</p>
                <p className="age">职位：{this.channelName(record.idAttr, idArr)}</p>
            </div>)
        }, {
            title: '公司简介',
            dataIndex: 'companyInfo',
            width: 300,
            key: 'companyInfo',
            render: (record) => <h4 title={record} dangerouslySetInnerHTML={this.createMarkup(cutString(record, 300))} />
        }, {
            title: '培训信息',
            dataIndex: 'trainingInfo',
            width: 100,
            key: 'trainingInfo'
        }, {
            title: '报名时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (record) => (formatDate(record))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <a className="mr10 opt-btn" onClick={() => { this.delAdData(item) }} style={{background: '#108ee9'}}>删除</a>
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

    // 删除
    delAdData (item) {
        const {search} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除本条记录吗 删除后不可恢复?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/stoenroll/delete', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch(search.type)
                    } else {
                        message.error(res.msg)
                    }
                })
            }
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
        const {dispatch, pageData} = this.props
        let sendData = {
            // ...filter,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getParticipateList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    _search () {
        const {dispatch, search} = this.props
        let type = !search.value ? 'init' : 'search'
        this.doSearch(type, {currentPage: 1, keyword: search.value})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }

    // 汉字替换
    channelName (id, arr) {
        const nameValue = !arr ? [
            {value: '1', label: '朋友推荐'},
            {value: '2', label: '火星社群'},
            {value: '4', label: '微信'},
            {value: '5', label: '其他'}
        ] : arr
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
        const {list, pageData, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="participate-index">
            <Row>
                <Col>
                    {/*
                    <span>渠道：</span>
                    <Select defaultValue={`${filter.acquireChannel}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">朋友推荐</Option>
                        <Option value="2">火星社群</Option>
                        <Option value="4">微信</Option>
                        <Option value="5">其他</Option>
                    </Select>
                    */}
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
        participateInfo: state.participateInfo,
        list: state.participateInfo.list,
        search: state.participateInfo.search,
        filter: state.participateInfo.filter,
        pageData: state.participateInfo.pageData,
        selectedData: state.participateInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(ParticipateIndex))
