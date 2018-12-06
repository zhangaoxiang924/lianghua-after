/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form } from 'antd'
import './index.scss'
// import { hashHistory } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getCityList, addCity, setSearchQuery, setPageData, setFilterData, selectData} from '../../actions/activity/activityCity.action'
import {axiosAjax, cutString, channelIdOptions} from '../../public/index'
import moment from 'moment'
// const RadioGroup = Radio.Group
const confirm = Modal.confirm
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
class CityIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            visible: false
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
        this.doSearch('init', {...filter, title: search.title})
        columns = [{
            title: '城市',
            key: 'place',
            render: (text, record) => (record && <div className="activityPublish-info clearfix">
                <div>
                    <h4 title={record.place} dangerouslySetInnerHTML={this.createMarkup(cutString(record.place, 30))} />
                </div>
            </div>)
        }, {
            title: '状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === -1) {
                    return <span className="news-status pre-publish">撤回 (未展示)</span>
                } else if (record && record.status === 1) {
                    return <span className="news-status">展示中</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '排序',
            dataIndex: 'rank',
            key: 'rank'
        }, {
            title: '操作',
            key: 'action',
            render: (item) => ((item.rank === 99 || item.rank === 100) ? <p className="btns">
                <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#f68e15'}}>
                    {(() => {
                        if (item.status === 1) {
                            return '禁用'
                        } else if (item.status === -1) {
                            return '启用'
                        } else {
                            return '无'
                        }
                    })()}
                </a>
            </p> : <div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateCity(item) }} style={{background: '#108ee9'}}>修改排序</a>
                </p>
                <p>
                    <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#f68e15'}}>
                        {(() => {
                            if (item.status === 1) {
                                return '禁用'
                            } else if (item.status === -1) {
                                return '启用'
                            } else {
                                return '无'
                            }
                        })()}
                    </a>
                </p>
                <p>
                    <a onClick={() => this.delCity(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
            </div>)
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    updateCity (item) {
        this.props.dispatch(selectData(item))
        this.setState({
            visible: true
        })
    }

    createMarkup (str) { return {__html: str} }

    disabledDate = (current) => {
        return current && current < moment().endOf('hours')
    }

    doSearch (type, data) {
        const {dispatch, pageData, filter} = this.props
        let sendData = {
            ...filter,
            // title: search.title,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getCityList(type, sendData, () => {
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
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }
    // 删除
    delCity (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    place: item.place
                }
                axiosAjax('POST', '/activity/delplace', {...sendData}, (res) => {
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

    // 启用或禁用
    _isPublish (item) {
        const _this = this
        let status = () => {
            if (item.status !== 1) {
                return 1
            } else {
                return -1
            }
        }

        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '禁用' : '启用'}吗 ?`,
            onOk () {
                let sendData = {
                    place: item.place,
                    status: status()
                }
                axiosAjax('POST', '/activity/placestatus', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`操作成功`)
                        _this.doSearch('init')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 筛选推荐状态
    handleChange1 = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    submit () {
        const {dispatch, form, selectedData} = this.props
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            if (selectedData.rank) {
                values.oldRank = values.rank
                delete values.rank
                delete values.status
                axiosAjax('POST', '/activity/updateplacerank', values, (data) => {
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
                dispatch(addCity(values, () => {
                    this.setState({ visible: false })
                    form.resetFields()
                    this.doSearch('init')
                }))
            }
        })
    }

    render () {
        const {list, filter, form, selectedData, pageData, dispatch} = this.props
        const { getFieldDecorator } = form
        return <div className="activityPublish-index">
            <Row>
                <Col>
                    <span style={{marginLeft: 0}}>推荐：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100 }} onChange={this.handleChange1}>
                        <Option value="">全部</Option>
                        <Option value="1">使用中</Option>
                        <Option value="-1">禁用</Option>
                    </Select>
                    <span>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                            this.setState({visible: true})
                            dispatch(selectData({}))
                        }}>新增城市</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="添加城市"
                visible={this.state.visible}
                onOk={() => this.submit()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="城市名称">
                        {getFieldDecorator('place', {
                            rules: [{
                                required: true, message: '请输入城市名称!'
                            }],
                            initialValue: selectedData.place === '' ? '' : selectedData.place
                        })(
                            <Input disabled={selectedData.rank} />
                        )}
                    </FormItem>
                    {/*
                    <FormItem {...formItemLayout} label="频道 ID">
                        {getFieldDecorator('channelId', {
                            rules: [{
                                required: true, message: '请输入频道 ID!'
                            }, {
                                pattern: /^[1-9]\d*$/, message: '请输入正确的频道 ID!'
                            }],
                            initialValue: selectedData.channelId === '' ? '' : selectedData.channelId
                        })(
                            <Input disabled={selectedData.channelId && selectedData.channelId !== ''} />
                        )}
                    </FormItem>
                     */}
                    {selectedData.rank && <div>
                        <FormItem {...formItemLayout} label={selectedData.rank ? '旧排序值' : '排序值'}>
                            {getFieldDecorator('rank', {
                                rules: [{
                                    required: !selectedData.rank && selectedData.rank !== '', message: '请输入排序值!'
                                }, {
                                    pattern: /^[1-9][0-8]?$/, message: '排序值应在1~98之间!'
                                }],
                                initialValue: selectedData.rank === '' ? '' : selectedData.rank
                            })(
                                <Input disabled={selectedData.rank} placeholder="升序排列, 越小越靠前"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='新排序值'>
                            {getFieldDecorator('newRank', {
                                rules: [{
                                    required: !selectedData.rank && selectedData.rank !== '', message: '请输入排序值!'
                                }, {
                                    pattern: /^[1-9][0-8]?$/, message: '排序值应在1~98之间!'
                                }],
                                initialValue: ''
                            })(
                                <Input placeholder="升序排列, 越小越靠前"/>
                            )}
                        </FormItem>
                    </div>}
                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('status', {
                            initialValue: (selectedData.status === -1 ? '-1' : '1') || '1'
                        })(
                            <RadioGroup disabled={selectedData.rank}>
                                <Radio value="1">启用</Radio>
                                <Radio value="-1">禁用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    */}
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.activityCityInfo.list,
        search: state.activityCityInfo.search,
        filter: state.activityCityInfo.filter,
        pageData: state.activityCityInfo.pageData,
        selectedData: state.activityCityInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(CityIndex))
