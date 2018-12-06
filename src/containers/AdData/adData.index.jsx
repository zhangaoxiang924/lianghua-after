/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, message, Spin, Button, Input, Form } from 'antd'
import './index.scss'
import copy from 'copy-to-clipboard'
import { hashHistory } from 'react-router'
import {getAdDataList, addAdData, setSearchQuery, setPageData, selectData} from '../../actions/others/AdData.action'
import {formatDate, axiosAjax} from '../../public/index'
const confirm = Modal.confirm
const FormItem = Form.Item
let columns = []
const formItemLayout = {
    labelCol: {
        sm: { span: 6 }
    },
    wrapperCol: {
        sm: { span: 16 }
    }
}

class AdDataIndex extends Component {
    constructor () {
        super()
        this.state = {
            visible: false,
            loading: true,
            sortType: '1',
            terminal: '1, 2'
        }
    }

    componentWillMount () {
        const {dispatch, search} = this.props
        this.doSearch(!search.type ? 'init' : search.type)
        columns = [{
            title: '链接名称',
            key: 'name',
            width: 280,
            render: (text, record) => {
                return <div className="adData-info clearfix">
                    <div>
                        <h3>{record.name}</h3>
                    </div>
                </div>
            }
        }, {
            title: '统计链接',
            key: 'url',
            render: (text, record) => (<h3 className="adData-info clearfix">
                <a target='_black' href={`${record.url}?statisticalParameter=${record.statisticId}`}>{`${record.url}?statisticalParameter=${record.statisticId}`}</a>
            </h3>)
        }, {
            title: '添加时间',
            key: 'createTime',
            render: (text, record) => formatDate(record.createTime)
        }, {
            title: '点击量(pv)',
            key: 'pv',
            render: (text, record) => record.count
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => {
                        hashHistory.push({
                            pathname: '/adData-detail',
                            query: {
                                time: item.createTime,
                                id: item.statisticId
                            }
                        })
                    }} style={{background: '#469ded'}}>查看</a>
                </p>
                <p>
                    <a className="mr10 opt-btn" style={{background: '#e35ba3'}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData(item))
                    }} >修改</a>
                </p>
                <p>
                    <a onClick={() => this.delAdData(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
            </div>)
        }]
    }

    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search} = this.props
        let sendData = {
            sortType: this.state.sortType,
            like: search.like,
            currentPage: pageData.currPage
        }
        this.setState({
            loading: true
        })
        sendData = {...sendData, ...data}
        dispatch(getAdDataList(type, sendData, () => {
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
        const {dispatch, search} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page})
    }
    // 删除
    delAdData (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除本条记录吗 删除后不可恢复?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    statisticId: item.statisticId
                }
                axiosAjax('POST', '/statistic/delete', {...sendData}, (res) => {
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

    cancelModal = () => {
        const {form} = this.props
        form.resetFields()
        this.setState({
            visible: false
        })
    }

    submitAccount () {
        const {dispatch, form, selectedData} = this.props
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            if (selectedData.id) {
                confirm({
                    title: '提示',
                    content: `确认要修改统计项名称吗?`,
                    onOk () {
                        axiosAjax('post', '/statistic/updateName', {
                            name: values.name,
                            statisticId: selectedData.statisticId
                        }, (res) => {
                            if (res.code === 1) {
                                message.success('修改成功!')
                                This.setState({
                                    visible: false
                                })
                                dispatch(selectData({}))
                                This.doSearch('init')
                            }
                        })
                    }
                })
            } else {
                dispatch(addAdData(values, (res) => {
                    This.setState({
                        loading: true
                    })
                    if (res.code === 1) {
                        This.setState({
                            loading: false,
                            visible: false
                        })
                        confirm({
                            title: '提示',
                            content: <div>
                                <p style={{wordBreak: 'break-all'}}>统计链接{values.url}?statisticalParameter=${values.statisticId} 创建成功</p>
                                <p>请先反馈技术添加后方可开始统计。</p>
                                <p>点击 <span style={{fontSize: '16px'}}> 确定 </span>可自动复制链接。</p>
                            </div>,
                            onOk () {
                                copy(`${values.url}?statisticalParameter=${values.statisticId}`)
                                message.success('链接复制成功！')
                            }
                        })
                        form.resetFields()
                        this.doSearch('init')
                    } else {
                        This.setState({
                            loading: false
                        })
                        message.error(res.msg || '请求失败，请稍后重试')
                    }
                }))
            }
        })
    }

    // 导出
    tableExport = () => {
        const {search} = this.props
        confirm({
            title: '提示',
            content: '确定要导出Excel表格么?',
            onOk () {
                axiosAjax('post', '/statistic/exportExcel', {
                    sortType: 1,
                    like: search.like
                }, (data) => {
                    if (data.code === 1) {
                        window.open(data.obj)
                        message.success('已导出数据, 若没有自动下载, 请检查窗口是否被浏览器拦截~')
                    } else {
                        message.error('请求出错!')
                    }
                })
            }
        })
    }

    render () {
        const {list, pageData, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="adData-index">
            <span style={{marginLeft: 15}}>标题/内容：</span>
            <Input
                onPressEnter={() => { this._search() }}
                value={search.like}
                style={{width: 150, marginRight: 15}}
                onChange={(e) => dispatch(setSearchQuery({like: e.target.value}))}
                placeholder="请输入要搜索的内容"
            />
            <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
            <Button type="primary" style={{margin: '0 15px'}} onClick={() => {
                this.setState({visible: true})
                dispatch(selectData({}))
            }} >新增</Button>
            <Button type="primary" onClick={this.tableExport} >导出统计项</Button>
            <div style={{marginTop: 15}}>
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="添加/修改统计项"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
                footer={[
                    <Button key="back" onClick={this.cancelModal}>取消</Button>,
                    <Button key="submit" type="primary" onClick={() => { this.submitAccount() }}>确定</Button>
                ]}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="名称/位置说明"
                    >
                        {getFieldDecorator('name', {
                            initialValue: selectedData.id ? selectedData.name : '',
                            rules: [{required: true, message: '请填写统计项位置说明！'}]
                        })(
                            <Input placeholder="示例: 官网顶部币优下载统计"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="链接"
                    >
                        {getFieldDecorator('url', {
                            initialValue: selectedData.id ? selectedData.url : '',
                            rules: [
                                {required: true, message: '请填写链接地址！'},
                                {type: 'url', message: '请填写正确的链接地址！'}
                            ]
                        })(
                            <Input disabled={!!selectedData.statisticId} placeholder="请填写完整url地址, 添加成功后不可修改!"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="统计项标识">
                        {getFieldDecorator('statisticId', {
                            initialValue: selectedData.id ? selectedData.statisticId : '',
                            rules: [
                                {required: true, message: '请输入统计项唯一标识！'}
                            ]
                        })(
                            <Input disabled={!!selectedData.statisticId} placeholder="统计项唯一标识, 添加成功后不可修改!"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        selectedData: state.adDataInfo.selectedData,
        adDataInfo: state.adDataInfo,
        list: state.adDataInfo.list,
        search: state.adDataInfo.search,
        pageData: state.adDataInfo.pageData
    }
}

export default connect(mapStateToProps)(Form.create()(AdDataIndex))
