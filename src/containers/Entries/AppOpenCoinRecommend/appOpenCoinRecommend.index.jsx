/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, Form } from 'antd'
import './index.scss'
import IconItem from '../../../components/icon/icon'
import CollectionCreateForm from './ModalForm'
import {getAppOpenCoinRecommendList, setSearchQuery, setPageData, addCoin, selectData} from '../../../actions/entries/appOpenCoinRecommend.action'
import {axiosAjax, cutString, channelIdOptions, formatDate} from '../../../public/index'
const confirm = Modal.confirm
let columns = []
class AppOpenCoinRecommendIndex extends Component {
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
        const {search, filter} = this.props
        this.doSearch('init', {...filter, value: search.value})
        columns = [{
            title: '名称',
            key: 'symbol',
            render: (text, record) => (record && <div className="appOpenCoinRecommend-info clearfix">
                <div>
                    <h4 title={record.symbol} dangerouslySetInnerHTML={this.createMarkup(cutString(record.symbol, 30))} />
                </div>
            </div>)
        }, {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight'
        }, {
            title: '创建时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))

        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>修改</a>
                </p>
                <p>
                    <a onClick={() => this.delAppOpenCoinRecommend(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
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
        dispatch(getAppOpenCoinRecommendList(type, sendData, () => {
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
    delAppOpenCoinRecommend (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    symbol: item.symbol,
                    weight: 0
                }
                axiosAjax('POST', '/coin/weight/update', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('已删除')
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
        const {dispatch} = this.props
        const form = this.formRef.props.form
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let sendData = {
                symbol: values.coinId.label,
                weight: values.weight
            }
            dispatch(addCoin({
                ...sendData
            }, () => {
                this.setState({ visible: false })
                form.resetFields()
                this.doSearch('init')
            }))
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    render () {
        const {list, dispatch, selectedData} = this.props
        return <div className="appOpenCoinRecommend-index">
            <Row>
                <Col>
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
        appOpenCoinRecommendInfo: state.appOpenCoinRecommendInfo,
        list: state.appOpenCoinRecommendInfo.list,
        search: state.appOpenCoinRecommendInfo.search,
        filter: state.appOpenCoinRecommendInfo.filter,
        pageData: state.appOpenCoinRecommendInfo.pageData,
        selectedData: state.appOpenCoinRecommendInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(AppOpenCoinRecommendIndex))
