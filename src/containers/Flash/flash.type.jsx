/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Input, Button, Form, Radio } from 'antd'
import './flash.scss'
// import { hashHistory } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getTypeList, addType, setSearchQuery, setPageData, setFilterData, selectData} from '../../actions/flash/flashType.action'
import {formatDate, axiosAjax, cutString, channelIdOptions} from '../../public/index'
import moment from 'moment'
const RadioGroup = Radio.Group
const confirm = Modal.confirm
// const Option = Select.Option
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
class TypeIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            flashStatus: null,
            editNewsId: '',
            visible: false
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
        this.doSearch('init', {...filter, title: search.title})
        columns = [{
            title: '频道名称',
            key: 'channelName',
            render: (text, record) => (record && <div className="flash-info clearfix">
                <div>
                    <h4 title={record.channelName} dangerouslySetInnerHTML={this.createMarkup(cutString(record.channelName, 30))} />
                </div>
            </div>)
        }, {
            title: '频道 ID',
            dataIndex: 'channelId',
            key: 'channelId'
        }, {
            title: '频道状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === 0) {
                    return <span className="flash-status pre-publish">关闭 (禁用)</span>
                } else if (record && record.status === 1) {
                    return <span className="flash-status">打开 (使用中)</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '创建时间',
            key: 'createTime',
            render: (record) => (record && formatDate(record.createTime))
        }, {
            title: '排序权重',
            dataIndex: 'rank',
            key: 'rank'
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateType(item) }} style={{background: '#108ee9'}}>修改</a>
                </p>
                <p style={{margin: '10px 0'}}>
                    <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#f68e15'}}>
                        {(() => {
                            if (item.status === 1) {
                                return '禁用'
                            } else if (item.status === 0) {
                                return '启用'
                            }
                        })()}
                    </a>
                </p>
                <p>
                    <a onClick={() => this.delType(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
            </div>)
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    updateType (item) {
        this.props.dispatch(selectData(item))
        this.setState({
            visible: true
        })
    }

    createMarkup (str) { return {__html: str} }

    disabledDate = (current) => {
        return current && current < moment().endOf('hours')
    }

    doSearch (type, data) {
        const {dispatch, pageData, filter} = this.props
        let sendData = {
            ...filter,
            // title: search.title,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getTypeList(type, sendData, () => {
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
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }
    // 删除
    delType (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/lives/channel/del', {...sendData}, (res) => {
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

    // 启用或禁用
    _isPublish (item) {
        const _this = this
        let status = () => {
            if (item.status === 0) {
                return 1
            } else {
                return 0
            }
        }

        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '禁用' : '启用'}吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    channelId: item.channelId,
                    channelName: item.channelName,
                    rank: item.rank,
                    status: status()
                }
                axiosAjax('POST', '/lives/channel/update', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`操作成功`)
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 筛选推荐状态
    handleChange1 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    submit () {
        const {dispatch, form, selectedData} = this.props
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            values.id = selectedData.id
            if (selectedData.id) {
                axiosAjax('POST', '/lives/channel/update', values, (data) => {
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
                dispatch(addType(values, () => {
                    this.setState({ visible: false })
                    form.resetFields()
                    this.doSearch('init')
                }))
            }
        })
    }

    render () {
        const {list, form, selectedData, pageData, dispatch} = this.props
        const { getFieldDecorator } = form
        return <div className="flash-index">
            <Row>
                <Col>
                    {/*
                    <span style={{marginLeft: 15}}>状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100 }} onChange={this.handleChange1}>
                        <Option value="">全部</Option>
                        <Option value="1">使用中</Option>
                        <Option value="0">禁用</Option>
                    </Select>
                    */}
                    <span>
                        <Button type="primary" style={{margin: 0}} onClick={() => {
                            this.setState({visible: true})
                            dispatch(selectData({}))
                        }}><IconItem type="icon-flash-send"/>新增</Button>
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
                onOk={() => this.submit()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="频道名称">
                        {getFieldDecorator('channelName', {
                            rules: [{
                                required: true, message: '请输入频道名称!'
                            }],
                            initialValue: selectedData.channelName === '' ? '' : selectedData.channelName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="频道 ID">
                        {getFieldDecorator('channelId', {
                            rules: [{
                                required: true, message: '请输入频道 ID!'
                            }, {
                                pattern: /^[1-9]\d*$/, message: '请输入正确的频道 ID!'
                            }],
                            initialValue: selectedData.channelId === '' ? '' : selectedData.channelId
                        })(
                            <Input disabled={selectedData.id && selectedData.id !== ''} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序权重">
                        {getFieldDecorator('rank', {
                            rules: [{
                                required: !selectedData.rank && selectedData.rank !== '', message: '请输入排序权重!'
                            }, {
                                pattern: /^[0-9]\d*$/, message: '请输入正确的权重值!'
                            }],
                            initialValue: selectedData.rank === '' ? '' : selectedData.rank
                        })(
                            <Input placeholder="权重越大, 排序越靠前"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('status', {
                            initialValue: (selectedData.status === 0 ? '0' : '1') || '1'
                        })(
                            <RadioGroup>
                                <Radio value="1">启用</Radio>
                                <Radio value="0">禁用</Radio>
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
        flashInfo: state.flashTypeInfo,
        list: state.flashTypeInfo.list,
        search: state.flashTypeInfo.search,
        filter: state.flashTypeInfo.filter,
        pageData: state.flashTypeInfo.pageData,
        selectedData: state.flashTypeInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(TypeIndex))
