/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Button, Form } from 'antd'
import './version.scss'
import IconItem from '../../../components/icon/icon'
import CollectionCreateForm from './ModalForm'
import {getVersionList, setSearchQuery, setPageData, addContent, selectData} from '../../../actions/app/version.action'
import {axiosAjax, cutString, channelIdOptions, formatDate} from '../../../public/index'
const confirm = Modal.confirm
let columns = []
class VersionIndex extends Component {
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
            title: '版本号',
            key: 'version',
            render: (text, record) => (record && <div className="newsHotWords-info clearfix">
                <div>
                    <h4 title={record.version} dangerouslySetInnerHTML={this.createMarkup(cutString(record.version || '无', 30))} />
                </div>
            </div>)
        }, {
            title: '内容',
            width: 500,
            key: 'content',
            render: (text, record) => <p>{record.content}</p>
        }, {
            title: '创建时间',
            key: 'create_time',
            render: (record) => (formatDate(record.create_time))

        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                </p>
                <p>
                    <a onClick={() => this.delVersion(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
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
        this.props.dispatch(selectData(item))
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
        dispatch(getVersionList(type, sendData, () => {
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
    delVersion (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id
                }
                axiosAjax('POST', '/app/version/deletecontent ', {...sendData}, (res) => {
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
            if (selectedData.id) {
                axiosAjax('post', '/app/version/updatecontent', {
                    id: selectedData.id,
                    ...values
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
                dispatch(addContent(values, () => {
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
        const {list, dispatch, selectedData, pageData} = this.props
        return <div className="version-index">
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
        versionInfo: state.versionInfo,
        list: state.versionInfo.list,
        search: state.versionInfo.search,
        filter: state.versionInfo.filter,
        pageData: state.versionInfo.pageData,
        selectedData: state.versionInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(VersionIndex))
