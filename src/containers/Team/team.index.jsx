/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Input, Row, Col, Button, Table, Modal, message } from 'antd'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form } from 'antd'
import './index.scss'
import { Link } from 'react-router'
import {getTeamList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../actions/team/team.action'
import {formatDate, axiosAjax, cutString} from '../../public/index'
import moment from 'moment'
// import Cookies from 'js-cookie'
const confirm = Modal.confirm
const Option = Select.Option
const { TextArea } = Input
const FormItem = Form.Item
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
class TeamIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            teamStatus: null,
            editNewsId: '',
            noPassReason: '',
            visible: false
        }
    }

    channelName (id) {
        let name = ''
        this.props.channelList.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {filter, dispatch} = this.props
        this.doSearch('init', {...filter})
        let optionCol = [{
            title: '操作',
            key: 'action',
            width: 100,
            render: (item) => {
                return <div className="btns">
                    <p>
                        <Link className="mr10 opt-btn" to={{pathname: '/team-send', query: {id: item.id, passportId: item.passportId}}} style={{background: '#e35ba3'}}>编辑</Link>
                    </p>
                    <p>
                        <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => {
                            dispatch(selectedData(item))
                            this.setState({
                                visible: true
                            })
                        }} style={{background: '#e59e21'}}>资产修改</a>
                    </p>
                    {(() => {
                        if (item.registrationState === 1) {
                            return <p>
                                <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>审核驳回</a>
                            </p>
                        } else if (item.registrationState === -1) {
                            return <p>
                                <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>审核通过</a>
                            </p>
                        } else {
                            return <p>
                                <Link className="mr10 opt-btn" to={{pathname: '/team-send', query: {id: item.id, passportId: item.passportId}}} style={{background: '#108ee9'}}>开始审核</Link>
                            </p>
                        }
                    })()}
                    {/*
                    <p>
                        <a onClick={() => this.delTeam(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                    </p>
                    */}
                </div>
            }
        }]
        let basicCol = [{
            title: '团队名称',
            key: 'name',
            width: 100,
            render: (text, record) => (record && <div className="team-info clearfix">
                <div>
                    <h4 title={record.name}>{record.name}</h4>
                    {/*
                    <div>
                        {(record.original && parseInt(record.original) === 1) ? <div style={{'display': 'inline-block'}}><span className="green-bg mr10">独家</span></div> : ''}
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="org-bg mr10">推荐</span></div>}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                        {parseInt(record.topOrder) === 0 ? '' : <Tooltip placement="bottom" title={`失效时间: ${moment(record.topEndTime).format('YYYY年MM月DD日 HH:mm:ss')}; 失效热度: ${record.topEndHotcount}`} >
                            <div className="team-top clearfix">
                                <span className="top-bg">置顶</span>
                                <Input
                                    className="top-num"
                                    onBlur = {(e) => this._editTopValue(e, record)}
                                    onChange={(e) => this.changeTopValue(e, record)}
                                    value={record.topOrder}
                                />
                            </div>
                        </Tooltip>}
                    </div>
                    */}
                </div>
            </div>)
        }, {
            title: '审核状态',
            key: 'registrationState',
            width: 100,
            render: (record) => {
                if (record && record.registrationState === 0) {
                    return <span className="team-status pre-publish">未审批</span>
                } else if (record && record.registrationState === 1) {
                    return <span className="team-status">通过</span>
                } if (record && record.registrationState === -1) {
                    return <div>
                        <span className="team-status will-publish">未通过</span>
                        <p>(原因：{JSON.parse(record.jsonText).noPassReason})</p>
                    </div>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '领队信息',
            key: 'basicInfo',
            width: 120,
            render: (text, record) => (record && <div className="participate-info clearfix">
                <p className="age">姓名：{record.leaderName}</p>
                <p className="age">公司：{record.companyName}</p>
                <p className="age">职务：{record.leaderTitle}</p>
            </div>)
        }, {
            title: '联系方式',
            key: 'phonenum',
            width: 170,
            render: (record) => {
                return <div>
                    <p className="age">手机号：{record.leaderPhone || '无'}</p>
                    <p className="age">邮箱：{record.leaderMail || '无'}</p>
                </div>
            }
        }, {
            title: '团队简介',
            dataIndex: 'description',
            key: 'description',
            render: (record) => <h4 title={record} dangerouslySetInnerHTML={this.createMarkup(cutString(record, 100))} />
        }, {
            title: '资产(BTC)',
            key: 'property',
            width: 130,
            render: (record) => {
                return <div>
                    <p className="age">初始：{record.initBalance || '0'}</p>
                    <p className="age">当前：{record.curBalance || '0'}</p>
                    <p className="age">余额获取：{!record.autoFetchBalance ? '人工' : '自动'}</p>
                </div>
            }
        }, {
            title: '其他信息',
            key: 'others',
            width: 150,
            render: (record) => {
                return <div>
                    <p className="age">队伍人数：{record.memberCount || '0'}</p>
                    <p className="age">推荐机构：{record.recommendType || '无'}</p>
                </div>
            }
        }, {
            title: '发表时间',
            key: 'createTime',
            width: 80,
            render: (record) => <div dangerouslySetInnerHTML={this.createMarkup(formatDate(record.createTime, '-', true))} />
        }]
        columns = [...basicCol, ...optionCol]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    disabledDate = (current) => {
        return current && current < moment().endOf('hours')
    }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendData = {
            ...filter,
            search: search.title,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        this.setState({
            loading: true
        })
        sendData = {...sendData, ...data}
        dispatch(getTeamList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    _search () {
        const {dispatch} = this.props
        this.setState({
            loading: true
        })
        this.doSearch('init', {'currentPage': 1})
        dispatch(setSearchQuery({'type': 'init'}))
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

    // 删除
    delTeam (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                _this.setState({
                    loading: true
                })
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: -1
                }
                axiosAjax('POST', '/team/status', {...sendData}, (res) => {
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

    getReason = (e) => {
        this.setState({
            noPassReason: e.target.value
        })
    }

    // 发表或存草稿
    _isPublish (item) {
        const This = this
        let status = item.registrationState === 1 ? -1 : 1
        let sendData = {
            id: item.id,
            status: status
        }
        confirm({
            title: '提示',
            content: `确认要${status === 1 ? '通过审核' : '驳回请求'}吗 ?`,
            onOk () {
                if (status === -1) {
                    confirm({
                        title: '提示',
                        content: <div className="modal-input">
                            <span style={{marginRight: 10}}>请填写驳回原因：</span>
                            <TextArea rows={3} autoFocus onChange={(e) => {
                                This.getReason(e)
                            }}/>
                        </div>,
                        onOk () {
                            if (This.state.noPassReason.trim() !== '') {
                                This.setState({
                                    loading: true
                                })
                                sendData.jsonText = JSON.stringify({
                                    noPassReason: This.state.noPassReason
                                })
                                This.changeState(sendData)
                            } else {
                                message.error('请填写驳回原因!')
                            }
                        }
                    })
                } else {
                    sendData.jsonText = JSON.stringify({})
                    This.changeState(sendData)
                }
            }
        })
    }

    // 修改资产
    balanceChange () {
        const {selectedData, form} = this.props
        let status = selectedData.autoFetchBalance // `autoFetchBalance`: '1自动获取余额，0人工填写',
        form.validateFields((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改',
                    content: <div className="modal-input">
                        <span>确认将团队资产修改为：</span>
                        <p>初始资金：<span style={{fontSize: 15}}>{values.initBalance}</span> BTC</p>
                        {!status && <p>当前余额：<span style={{fontSize: 15}}>{values.curBalance}</span> BTC</p>}
                        吗？
                    </div>,
                    onOk: () => {
                        this.setState({
                            loading: true
                        })
                        let balance = status ? {initBalance: values.initBalance} : values
                        axiosAjax('POST', '/team/update_balance', {
                            teamId: selectedData.id,
                            ...balance
                        }, (res) => {
                            this.setState({
                                loading: false,
                                visible: false
                            })
                            if (res.code === 1) {
                                message.success(`操作成功！`)
                                form.resetFields()
                                this.doSearch('init')
                            } else {
                                message.error(res.msg)
                            }
                        })
                    },
                    onCancel: () => {
                        form.resetFields()
                        this.setState({
                            visible: false
                        })
                    }
                })
            }
        })
    }

    // 修改状态
    changeState = (item) => {
        axiosAjax('POST', '/team/update', item, (res) => {
            this.setState({
                loading: false
            })
            if (res.code === 1) {
                message.success(`${item.status === 1 ? '撤回' : '发表'}成功`)
                this.doSearch('init')
            } else {
                message.error(res.msg)
            }
        })
    }

    // 筛选新闻状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            loading: true,
            teamStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    render () {
        const {list, pageData, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="team-index">
            <Row>
                <Col>
                    <span>状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100, marginBottom: 10 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">审核通过</Option>
                        <Option value="-1">审核驳回</Option>
                        <Option value="0">未审核</Option>
                    </Select>
                    <span style={{margin: '0 15px'}}>姓名/公司/团队名：</span>
                    <Input
                        value={search.title}
                        style={{width: 180, marginRight: 10}}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入搜索内容"
                        onPressEnter={() => { this._search() }}
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="团队资产修改"
                visible={this.state.visible}
                onOk={() => this.balanceChange()}
                onCancel={() => { this.setState({visible: false}); form.resetFields() }}
            >
                <Form>
                    <FormItem {...formItemLayout} label="初始资金">
                        {getFieldDecorator('initBalance', {
                            rules: [{
                                required: true, message: '请输入初始资金!'
                            }, {
                                pattern: /^[0-9]\d*$/, message: '初始资金必须大于等于0!'
                            }],
                            initialValue: selectedData.initBalance || 0
                        })(
                            <Input min={0}/>
                        )}
                    </FormItem>
                    {!selectedData.autoFetchBalance && <FormItem {...formItemLayout} label="当前余额">
                        {getFieldDecorator('curBalance', {
                            rules: [{
                                required: false, message: '请输入当前余额!'
                            }, {
                                pattern: /^[0-9]\d*$/, message: '当前余额必须大于等于0!'
                            }],
                            initialValue: selectedData.curBalance || 0
                        })(
                            <Input min={0}/>
                        )}
                    </FormItem>}
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        teamInfo: state.teamInfo,
        list: state.teamInfo.list,
        search: state.teamInfo.search,
        filter: state.teamInfo.filter,
        pageData: state.teamInfo.pageData,
        selectedData: state.teamInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(TeamIndex))
