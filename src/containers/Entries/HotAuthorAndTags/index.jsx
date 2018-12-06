/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, message, Spin, Form, Row, Col, Input, Button } from 'antd'
import './index.scss'
// import IconItem from '../../../components/icon/icon'
import {getHotAuthorAndTagsList, setSearchQuery, setPageData, selectData, setFilterData} from '../../../actions/entries/hotAuthorAndTags.action'
import {axiosAjax, cutString, formatDate} from '../../../public/index'
const confirm = Modal.confirm
// const {Option} = Select
const FormItem = Form.Item
let columns = []
let Options = [
    {label: '前三交易对占比', value: 1},
    {label: '24H 成交额占比', value: 2}
]
class HotAuthorAndTagsIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            topIsShow: false,
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
        this.doSearch('init', {...filter, search: search.search})
        columns = [{
            title: '名称',
            key: 'tag',
            render: (text, record) => (record && <div className="hotAuthorAndTags-info clearfix">
                <div>
                    <h4 title={record.tag} dangerouslySetInnerHTML={this.createMarkup(cutString(record.tag, 30))} />
                    {record.showNum === 0 ? '' : <p className="top-tag">置顶: {record.showNum}</p>}
                </div>
            </div>)
        }, {
            title: '热度',
            key: 'hotCount',
            dataIndex: 'hotCount'
        }, {
            title: '更新时间',
            key: 'updateTime',
            render: (record) => (formatDate(record.updateTime))

        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                {parseInt(item.showNum) ? <p><a
                    className="mr10 opt-btn"
                    href="javascript:void(0)"
                    style={{background: '#ff4f3e'}}
                    onClick={() => this.cancelTop(item.id)}
                >取消置顶</a></p> : ''}
                <p>
                    {parseInt(item.showNum) ? <a
                        className="mr10 opt-btn"
                        href="javascript:void(0)"
                        style={{background: '#ff4f3e'}}
                        onClick={() => this.showToTopModal(item.id, item)}
                    >修改置顶位</a> : <a
                        className={`mr10 top-btn opt-btn`}
                        href="javascript:void(0)"
                        onClick={() => this.showToTopModal(item.id, item)}
                    >置顶</a>}
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
        const {dispatch, pageData, search} = this.props
        this.setState({
            loading: true
        })
        let sendData = {
            search: search.search,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getHotAuthorAndTagsList(type, sendData, () => {
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
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
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

    // 取消置顶
    cancelTop (id) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要取消置顶吗 ?`,
            onOk () {
                let sendData = {
                    id: id,
                    showNum: 0
                }
                axiosAjax('POST', '/news/tags/setorder', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('取消置顶成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 活动置顶
    showToTopModal (id, item) {
        const {dispatch} = this.props
        this.setState({
            activityId: id,
            topIsShow: true
        })
        dispatch(selectData(item))
    }

    setNewsTop () {
        const form = this.props.form
        const _this = this
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.setState({
                topIsShow: false,
                loading: true
            })
            axiosAjax('post', '/news/tags/setorder', {
                'id': this.state.activityId,
                'showNum': values.showNum
            }, function (res) {
                if (res.code === 1) {
                    message.success('操作成功！')
                    _this.doSearch('init')
                } else {
                    message.error(res.msg)
                }
            })
            form.resetFields()
        })
    }

    render () {
        const {list, form, selectedData, pageData, dispatch, search} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        return <div className="hotAuthorAndTags-index">

            <Row>
                <Col>
                    {/*
                    <Select defaultValue={`${filter.type}`} style={{ width: 120, marginRight: 10 }} onChange={this.typeHandleChange}>
                        <Option value="">全部</Option>
                        <Option value={1}>前三交易对占比</Option>
                        <Option value={2}>24H 成交额占比</Option>
                    </Select>
                    <Button type="primary" style={{margin: 0}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData({}))
                    }}><IconItem type="icon-post-send"/>新增</Button>
                    */}
                    <Input
                        value={search.search}
                        style={{width: 150, margin: '0 15px'}}
                        onChange={(e) => dispatch(setSearchQuery({search: e.target.value}))}
                        placeholder="手机号/昵称/姓名"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                </Col>
            </Row>

            <div className="mt10">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="置顶权重"
                visible={this.state.topIsShow}
                onOk={() => this.setNewsTop()}
                onCancel={() => { this.setState({topIsShow: false}); form.resetFields() }}
            >
                <Form>
                    <FormItem {...formItemLayout} label="置顶权重">
                        {getFieldDecorator('showNum', {
                            rules: [{
                                required: true, message: '请输入置顶权重!'
                            }, {
                                pattern: /^[1-9]\d*$/, message: '设置权重必须为数字且大于0!'
                            }],
                            initialValue: selectedData.showNum === 0 ? 1 : selectedData.showNum
                        })(
                            <Input min={1} placeholder="请输入置顶位"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        hotAuthorAndTagsInfo: state.hotAuthorAndTagsInfo,
        list: state.hotAuthorAndTagsInfo.list,
        search: state.hotAuthorAndTagsInfo.search,
        filter: state.hotAuthorAndTagsInfo.filter,
        pageData: state.hotAuthorAndTagsInfo.pageData,
        selectedData: state.hotAuthorAndTagsInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(HotAuthorAndTagsIndex))
