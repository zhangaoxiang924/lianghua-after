/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form, Radio } from 'antd'
import './twitterAccount.scss'
import IconItem from '../../../../components/icon/icon'
import {getTwitterAccountList, setSearchQuery, setPageData, setFilterData, addAccount, selectData} from '../../../../actions/socialMedia/twitterAccount.action'
import {axiosAjax, twitterTypeOptions, formatDate} from '../../../../public/index'
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
class TwitterAccountIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            visible: false,
            confirmDirty: false
        }
    }

    channelName (id) {
        let name = ''
        twitterTypeOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        this.doSearch('init')
        columns = [{
            title: 'ID',
            key: 'id',
            render: (text, record) => record.id
        }, {
            title: '链接',
            width: 500,
            key: 'url',
            render: (record) => {
                return <a target='_blank' title={record.url} href={record.url}>{record.url}</a>
            }
        }, {
            title: '描述',
            key: 'description',
            render: (record) => {
                return <span>{record.description || '暂无'}</span>
            }
        }, {
            title: '媒体类型',
            key: 'type',
            render: (record) => {
                if (record && record.type === 1) {
                    return <span className="twitter-type medium1">medium 作者</span>
                } if (record && record.type === 2) {
                    return <span className="twitter-type medium2">medium 专题</span>
                } if (record && record.type === 3) {
                    return <span className="twitter-type medium3">twitter作者</span>
                } if (record && record.type === 4) {
                    return <span className="twitter-type medium4">新浪微博作者</span>
                } else {
                    return <span className="twitter-type">暂无</span>
                }
            }
        }, {
            title: '创建时间',
            key: 'createTime',
            render: (record) => formatDate(record.create_time)
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>修改</a>
                </p>
                <p>
                    <a onClick={() => this.delTwitterAccount(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
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
            if (selectedData.id) {
                axiosAjax('post', '/crawler/social/source/update', {
                    id: selectedData.id,
                    type: values.type,
                    description: values.description,
                    url: values.url
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
        this.setState({
            loading: true
        })
        const like = search.like.trim() === '' ? {} : {like: search.like}
        let sendData = {
            ...filter,
            ...like,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getTwitterAccountList(type, sendData, () => {
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
        const {dispatch, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch('init', {'currentPage': page, ...filter})
    }

    // 删除
    delTwitterAccount (item) {
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                _this.setState({
                    loading: true
                })
                axiosAjax('POST', '/crawler/social/source/delete', {...sendData}, (res) => {
                    _this.setState({
                        loading: false
                    })
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
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
            newsStatus: value
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    render () {
        const {list, pageData, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="twitterAccount-index">
            <Row>
                <Col>
                    <span>账号类型：</span>
                    <Select defaultValue={`${filter.type}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        {twitterTypeOptions.map((item, index) => {
                            return <Option value={item.value} key={index}>{item.label}</Option>
                        })}
                    </Select>
                    <Input
                        value={search.like}
                        style={{width: 150, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({value: e.target.value}))}
                        placeholder="输入关键字进行搜索"
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                            this.setState({visible: true})
                            dispatch(selectData({}))
                        }}><IconItem type="icon-post-send"/>新增</Button>
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
                    <FormItem {...formItemLayout} label="简介">
                        {getFieldDecorator('description', {
                            rules: [{
                                required: true, message: '请输入相关简介!'
                            }],
                            initialValue: !selectedData.description ? '' : selectedData.description
                        })(
                            <Input placeholder="请输入相关简介"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="链接">
                        {getFieldDecorator('url', {
                            rules: [{
                                required: true, message: '请输入手机号!'
                            }, {
                                type: 'url', message: '请输入正确的链接地址'
                            }],
                            initialValue: !selectedData.url ? '' : selectedData.url
                        })(
                            <Input placeholder="请输入链接地址"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="媒体类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: selectedData.type ? `${selectedData.type}` : '1'
                        })(
                            <RadioGroup>
                                {twitterTypeOptions.map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.label}</Radio>
                                })}
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
        twitterAccountInfo: state.twitterAccountInfo,
        list: state.twitterAccountInfo.list,
        search: state.twitterAccountInfo.search,
        filter: state.twitterAccountInfo.filter,
        pageData: state.twitterAccountInfo.pageData,
        selectedData: state.twitterAccountInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(TwitterAccountIndex))
