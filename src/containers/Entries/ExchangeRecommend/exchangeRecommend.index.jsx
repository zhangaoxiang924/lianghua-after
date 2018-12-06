/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, Form, Select } from 'antd'
import './exchangeRecommend.scss'
import IconItem from '../../../components/icon/icon'
import CollectionCreateForm from './ModalForm'
import {getExchangeRecommendList, setSearchQuery, setPageData, addCoin, selectData, setFilterData} from '../../../actions/entries/exchangeRecommend.action'
import {axiosAjax, cutString, formatDate} from '../../../public/index'
const confirm = Modal.confirm
const {Option} = Select
let columns = []
let Options = [
    {label: '前三交易对占比', value: 1},
    {label: '24H 成交额占比', value: 2}
]
class ExchangeRecommendIndex extends Component {
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
        Options.map((item, index) => {
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
            title: '名称',
            key: 'market',
            render: (text, record) => (record && <div className="exchangeRecommend-info clearfix">
                <div>
                    <h4 title={record.market} dangerouslySetInnerHTML={this.createMarkup(cutString(record.market, 30))} />
                </div>
            </div>)
        }, {
            title: '类型',
            key: 'type',
            render: (text, record) => {
                return record.type === 1 ? <span className="opt-btn recommend-btn">{this.channelName(record.type)}</span> : <span className="opt-btn type-btn">{this.channelName(record.type)}</span>
            }
        }, {
            title: '排序',
            key: 'rank',
            render: (text, record) => record.rank ? record.rank : '无'
        }, {
            title: '交易所别名',
            key: 'alias',
            render: (text, record) => record.alias ? record.alias : '无'
        }, {
            title: '创建时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))

        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                </p>
                <p>
                    <a onClick={() => this.delExchangeRecommend(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
                {/*
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
                */}
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

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
            pageSize: 500,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getExchangeRecommendList(type, sendData, () => {
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

    // 删除
    delExchangeRecommend (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    type: item.type,
                    id: item.id
                }
                axiosAjax('POST', '/coin/summary/market_del', {...sendData}, (res) => {
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
        const form = this.formRef.props.form
        this.setState({visible: false})
        form.resetFields()
    }

    submitAccount = () => {
        const {dispatch, selectedData} = this.props
        const form = this.formRef.props.form
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let sendData = {
                market: values.coinId.label,
                type: values.type,
                alias: values.alias,
                rank: values.rank
            }
            if (selectedData.id) {
                axiosAjax('post', '/coin/summary/market_update', {
                    id: selectedData.id,
                    ...sendData
                }, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        this.setState({ visible: false })
                        form.resetFields()
                        This.doSearch('init')
                    } else {
                        message.error(data.msg)
                    }
                })
            } else {
                dispatch(addCoin({
                    ...sendData
                }, () => {
                    this.setState({ visible: false })
                    form.resetFields()
                    this.doSearch('init')
                }))
            }
        })
    }

    typeHandleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            loading: true,
            type: value
        })
        this.doSearch('init', {'currentPage': 1, type: value})
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    render () {
        const {list, dispatch, selectedData, filter} = this.props
        return <div className="exchangeRecommend-index">
            <Row>
                <Col>
                    <Select defaultValue={`${filter.type}`} style={{ width: 120, marginRight: 10 }} onChange={this.typeHandleChange}>
                        <Option value="">全部</Option>
                        <Option value={1}>前三交易对占比</Option>
                        <Option value={2}>24H 成交额占比</Option>
                    </Select>
                    <Button type="primary" style={{margin: 0}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData({}))
                    }}><IconItem type="icon-post-send"/>新增</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={false} />
                </Spin>
            </div>
            <CollectionCreateForm
                selectedData={selectedData}
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.cancelModal}
                onCreate={this.submitAccount}
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        exchangeRecommendInfo: state.exchangeRecommendInfo,
        list: state.exchangeRecommendInfo.list,
        search: state.exchangeRecommendInfo.search,
        filter: state.exchangeRecommendInfo.filter,
        pageData: state.exchangeRecommendInfo.pageData,
        selectedData: state.exchangeRecommendInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(ExchangeRecommendIndex))
