/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table, Row, Col, Modal, message, Spin, Input, Button, Form} from 'antd'
import './blackListAccount.scss'
import IconItem from '../../../components/icon/icon'
import {
    getBlackList,
    setSearchResult,
    setPageData
} from '../../../actions/account/blackList.action'
import {axiosAjax} from '../../../public/index'

// const confirm = Modal.confirm
const formItemLayout = {
    labelCol: {
        xs: {span: 2},
        sm: {span: 4}
    },
    wrapperCol: {
        xs: {span: 4},
        sm: {span: 16}
    }
}
let columns = []
const FormItem = Form.Item

class BlackListAccount extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            visible: false,
            value: ''
        }
    }

    componentWillMount () {
        const {search} = this.props
        this.setState({
            ...this.state,
            value: search.phoneNum || ''
        })
        this.doSearch('init', {...search, phoneNum: search.phoneNum === '' ? null : search.phoneNum})
        columns = [{
            title: '手机号 ',
            dataIndex: 'phoneNum',
            key: 'phoneNum'
        }, {
            title: '拉黑时间',
            dataIndex: 'createTime',
            key: 'createTime'
        }, {
            title: '账号状态',
            key: 'status',
            render: (record) => <span className="news-status cont-publish">黑名单</span>
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (
                <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this.removeBlackList(item)} style={{background: '#00a854'}}>移除黑名单</a>)
        }]
    }

    doSearch (type, data) {
        const {dispatch, pageData, search} = this.props
        let sendData = {
            phoneNum: search.phoneNum,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getBlackList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    inputChange = (e) => {
        const {search} = this.props

        this.setState({
            ...this.state,
            value: e.target.value
        })
        if (e.target.value === '') {
            this.doSearch('init', {...search, phoneNum: ''})
        }
    }

    _search () {
        const {dispatch} = this.props
        let type = 'init'
        dispatch(setPageData({'currPage': 1}))
        dispatch(setSearchResult({'type': type}))
        this.doSearch(type, {'currentPage': 1, phoneNum: this.state.value})
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch} = this.props
        dispatch(setPageData({'currPage': page}))
        this.doSearch('init', {'currentPage': page})
    }

    removeBlackList (item) {
        let that = this
        Modal.confirm({
            title: '提示',
            content: `确认要移除黑名单吗 ?`,
            onOk () {
                axiosAjax('post', '/blacklist/delblacklist', {phoneNum: item.phoneNum}, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        that.setState({ visible: false })
                        that.doSearch('init')
                    } else {
                        message.success(data.msg)
                    }
                })
            }
        })
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    submitBlackList = () => {
        let that = this
        const {form} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            axiosAjax('post', '/blacklist/addblacklist', {phoneNum: parseInt(values.phoneNum)}, (data) => {
                if (data.code === 1) {
                    message.success('操作成功!')
                    that.setState({ visible: false })
                    form.resetFields()
                    that.doSearch('init')
                } else {
                    message.success(data.msg)
                }
            })
        })
    }

    render () {
        const {list, pageData, form} = this.props
        const {getFieldDecorator} = form
        return <div className="blackList-index">
            <Row>
                <Col>
                    <span style={{marginLeft: 15}}>手机号码：</span>
                    <Input
                        value={this.state.value}
                        style={{width: 150, marginRight: 15}}
                        onChange={this.inputChange}
                        placeholder="输入手机号搜索"
                    />
                    <span>
                        <Button type="primary" onClick={() => {
                            this._search()
                        }}><IconItem type="icon-search"/>搜索</Button>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                            this.setState({visible: true})
                        }}><IconItem type="icon-post-send"/>新增黑名单</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}}/>
                </Spin>
            </div>
            <Modal
                title="添加黑名单"
                visible={this.state.visible}
                onOk={this.submitBlackList}
                onCancel={this.cancelModal}
            >
                <Form>
                    <FormItem {...formItemLayout} label="手机号">
                        {getFieldDecorator('phoneNum', {
                            rules: [{
                                required: true, message: '请输入手机号!'
                            }, {
                                pattern: /^1[3|4|5|8][0-9]\d{8}$/, message: '请输入正确的手机号!'
                            }],
                            initialValue: ''
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.blackListInfo.list,
        search: state.blackListInfo.search,
        pageData: state.blackListInfo.pageData
    }
}

export default connect(mapStateToProps)(Form.create()(BlackListAccount))
