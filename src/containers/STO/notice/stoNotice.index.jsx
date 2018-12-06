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
import {getStoNoticeList, setSearchQuery, setPageData, addWords, selectData} from '../../../actions/sto/stoNotice.action'
import {axiosAjax, cutString, channelIdOptions, formatDate} from '../../../public/index'
const confirm = Modal.confirm
let columns = []
class StoNoticeIndex extends Component {
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
        this.doSearch('init')
        columns = [{
            title: '标题',
            key: 'title',
            width: 300,
            render: (text, record) => (record && <p title={record.title} className="stoNotice-info clearfix">{record.title}</p>)
        }, {
            title: '内容',
            key: 'content',
            width: 400,
            render: (text, record) => (record && <div className="stoNotice-info clearfix">
                <div>
                    <h4 title={record.content} dangerouslySetInnerHTML={this.createMarkup(cutString(record.content, 100))} />
                </div>
            </div>)
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
                <p style={{marginTop: 10}}>
                    <a onClick={() => this.delStoNotice(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
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
        dispatch(getStoNoticeList(type, sendData, () => {
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
    delStoNotice (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/stoNotice/deleteNotice', {...sendData}, (res) => {
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
                title: values.title,
                content: values.content
            }
            if (selectedData.id) {
                axiosAjax('post', '/stoNotice/updateNotice', {
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
        return <div className="stoNotice-index">
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
        stoNoticeInfo: state.stoNoticeInfo,
        list: state.stoNoticeInfo.list,
        search: state.stoNoticeInfo.search,
        filter: state.stoNoticeInfo.filter,
        pageData: state.stoNoticeInfo.pageData,
        selectedData: state.stoNoticeInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(StoNoticeIndex))
