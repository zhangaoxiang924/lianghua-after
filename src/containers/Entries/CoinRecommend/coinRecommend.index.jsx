/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, Form } from 'antd'
import './coinRecommend.scss'
import IconItem from '../../../components/icon/icon'
import CollectionCreateForm from './ModalForm'
import {getCoinRecommendList, setSearchQuery, setPageData, addCoin, selectData} from '../../../actions/entries/coinRecommend.action'
import {axiosAjax, cutString, channelIdOptions, formatDate} from '../../../public/index'
const confirm = Modal.confirm
let columns = []
class CoinRecommendIndex extends Component {
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
            render: (text, record) => (record && <div className="coinRecommend-info clearfix">
                <div>
                    <h4 title={record.symbol} dangerouslySetInnerHTML={this.createMarkup(cutString(record.symbol, 30))} />
                </div>
            </div>)
        }, {
            title: '标识',
            dataIndex: 'coinId',
            key: 'coinId'
        }, {
            title: '排序',
            dataIndex: 'rank',
            key: 'rank'
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
                    <a onClick={() => this.delCoinRecommend(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
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
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getCoinRecommendList(type, sendData, () => {
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
    delCoinRecommend (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/coin/recommend/del', {...sendData}, (res) => {
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
                symbol: values.coinId.label,
                coinId: values.coinId.key,
                rank: values.rank
            }
            if (selectedData.id) {
                axiosAjax('post', '/coin/recommend/update', {
                    id: selectedData.id,
                    ...sendData
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

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    render () {
        const {list, dispatch, selectedData} = this.props
        return <div className="coinRecommend-index">
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
        coinRecommendInfo: state.coinRecommendInfo,
        list: state.coinRecommendInfo.list,
        search: state.coinRecommendInfo.search,
        filter: state.coinRecommendInfo.filter,
        pageData: state.coinRecommendInfo.pageData,
        selectedData: state.coinRecommendInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(CoinRecommendIndex))
