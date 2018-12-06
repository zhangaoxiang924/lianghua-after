/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, Form } from 'antd'
import './newsHotWords.scss'
import IconItem from '../../../components/icon/icon'
import CollectionCreateForm from './ModalForm'
import {getHotWordsList, setSearchQuery, setPageData, addWords, selectData} from '../../../actions/entries/newsHotWords.action'
import {axiosAjax, cutString, channelIdOptions, formatDate} from '../../../public/index'
const confirm = Modal.confirm
let columns = []
class NewsHotWordsIndex extends Component {
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
            key: 'keyWord',
            render: (text, record) => (record && <div className="newsHotWords-info clearfix">
                <div>
                    <h4 title={record.keyWord} dangerouslySetInnerHTML={this.createMarkup(cutString(record.keyWord, 30))} />
                </div>
            </div>)
        }, {
            title: '置顶',
            key: 'topOrder',
            render: (text, record) => {
                return record && record.topOrder !== 0 ? <p className="newsHotWords-info clearfix">
                    权重：{record.topOrder}
                </p> : <p>未设置，按热度排序</p>
            }
        }, {
            title: '点击量',
            dataIndex: 'count',
            key: 'count'
        }, {
            title: '最新搜索时间',
            key: 'lastSearchTime',
            render: (record) => (formatDate(record.lastSearchTime))

        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                </p>
                <p>
                    <a onClick={() => this.delNewsHotWords(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    updateAccount (item) {
        const {dispatch} = this.props
        dispatch(selectData(item))
        this.setState({
            visible: true
        })
    }

    doSearch (type, data) {
        const {dispatch, pageData} = this.props
        let sendData = {
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getHotWordsList(type, sendData, () => {
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

    // 改变页数
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        dispatch(setPageData({'currentPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }

    // 删除
    delNewsHotWords (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/hotkeys/delhotkeys', {...sendData}, (res) => {
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
                keyWord: values.keyWord,
                topOrder: values.topOrder
            }
            if (selectedData.id) {
                axiosAjax('post', '/hotkeys/updatehotkeys', {
                    id: selectedData.id,
                    ...sendData
                }, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        form.resetFields()
                        this.setState({ visible: false })
                        This.doSearch('init')
                    } else {
                        message.error(data.msg)
                    }
                })
            } else {
                dispatch(addWords({
                    ...sendData
                }, () => {
                    form.resetFields()
                    this.setState({ visible: false })
                    this.doSearch('init')
                }))
            }
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    openModal = () => {
        const {dispatch} = this.props
        this.setState({visible: true})
        dispatch(selectData({}))
    }

    render () {
        const {list, selectedData, pageData} = this.props
        return <div className="newsHotWords-index">
            <Row>
                <Col>
                    <Button type="primary" style={{margin: 0}} onClick={this.openModal}><IconItem type="icon-post-send"/>新增</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currentPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            {this.state.visible ? <CollectionCreateForm
                selectedData={selectedData}
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.cancelModal}
                onCreate={this.submitAccount}
            /> : ''}

        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        newsHotWordsInfo: state.newsHotWordsInfo,
        list: state.newsHotWordsInfo.list,
        search: state.newsHotWordsInfo.search,
        filter: state.newsHotWordsInfo.filter,
        pageData: state.newsHotWordsInfo.pageData,
        selectedData: state.newsHotWordsInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(NewsHotWordsIndex))
