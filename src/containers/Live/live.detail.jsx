/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Row, Col, Spin, Modal, message, Form, Input, Button, Select} from 'antd'
import PostEditor from '../../components/postEditor'
// import ModalEditor from './ModalEditor'
import {hashHistory} from 'react-router'
import {getLiveItemInfo} from '../../actions/live/live.action'
import {
    getLiveContentList,
    selectedData,
    addNewLive,
    delLiveItem,
    updateLive,
    setFilterData
} from '../../actions/live/liveContent.action'
import {axiosAjax, formatDate} from '../../public/index'
import './index.scss'

const confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option

class LiveDetail extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            visible: false,
            isEdit: false,
            loading: false,
            previewVisible: false,
            previewImage: '',
            radioValue: '',
            disabled: false,
            content: '',
            editorContent: '',
            data: {},
            contentLoading: true,
            currentPage: 1,
            editor: '',
            roleId: '',
            zcrId: '',
            guestId: '',
            title: ''
        }
    }

    componentWillMount () {
        const {location, actions} = this.props
        actions.getLiveItemInfo({'castId': location.query.id}, (data) => {
            this.setState({
                title: data.title,
                roleId: data.presenterId,
                zcrId: data.presenterId,
                guestId: data.guestId,
                radioValue: `${data.status}` || '0'
            })
        })
        actions.getLiveContentList('init', {
            castId: location.query.id,
            currentPage: 1,
            pageSize: 30
        }, () => {
            this.setState({
                contentLoading: false
            })
        })
    }

    // 内容格式化
    createMarkup (str) {
        return {__html: str}
    }

    onChange = (e) => {
        let value = e.target.value
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    castId: this.props.location.query.id,
                    status: value
                }
                axiosAjax('POST', '/caster/room/update/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 富文本编写
    sendPost = (sendData) => {
        let _data = {
            'content': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    setSimditor (editor) {
        this.setState({
            editor: editor
        })
    }

    clear = () => {
        this.state.editor.setValue('')
    }

    // 切换身份
    changeStatus = (value) => {
        console.log(value)
        this.setState({
            roleId: value
        })
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        confirm({
            title: '提示',
            style: {top: '30%'},
            content: `发布内容身份为：${this.state.roleId === this.state.zcrId ? '主持人' : '嘉宾'}；继续发布请确认`,
            onOk: () => {
                const {data, updateOrNot, content} = this.state
                this.props.form.setFieldsValue({
                    content: content.replace(/style=['"][^"']+['"]/ig, '')
                })
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.setState({
                            disabled: true,
                            loading: true
                        })
                        values.castId = this.props.location.query.id || ''
                        values.userId = this.state.roleId
                        // values.role = this.state.role

                        if (updateOrNot) {
                            delete values.castId
                            values.contentId = data.contentId
                        }
                        !updateOrNot ? this.props.actions.addNewLive(values, (res) => {
                            if (res.code === 1) {
                                message.success('发表成功！')
                                this.clear()
                                this.setState({
                                    disabled: false,
                                    content: '',
                                    loading: false,
                                    visible: false
                                })
                            } else {
                                this.setState({
                                    disabled: false,
                                    loading: false
                                })
                                message.error(res.msg)
                            }
                        }) : this.props.actions.updateLive(values, data.index, (res) => {
                            if (res.code === 1) {
                                this.clear()
                                this.setState({
                                    disabled: false,
                                    content: '',
                                    loading: false,
                                    updateOrNot: false,
                                    visible: false
                                })
                            } else {
                                this.setState({
                                    disabled: false,
                                    loading: false
                                })
                                message.error(res.msg)
                            }
                        })
                    }
                })
            }
        })
    }

    // 删除item
    delListItem (id, index) {
        let _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                _this.props.actions.delLiveItem({
                    contentId: id
                }, index)
            }
        })
    }

    // 编辑框文字替换
    showModal = (item, index) => {
        let $simditor = $('.live-editor .simditor-body')
        document.getElementsByClassName('shop-content')[0].scrollTop = 0
        this.props.actions.selectedData(item)
        $simditor.html(item.content)
        $simditor.focus()
        this.props.form.setFieldsValue({
            roleId: item.userId
        })
        this.setState({
            updateOrNot: true,
            visible: true,
            roleId: item.userId,
            content: item.content,
            data: {...item, index: index}
        })
    }

    // 取消本次编辑
    cancelEdit = () => {
        this.clear()
        this.setState({
            updateOrNot: false,
            visible: false,
            content: ''
        })
    }

    // 加载更多
    loadMore = () => {
        const {location, actions, pageData} = this.props
        this.setState({
            contentLoading: true
        })
        actions.getLiveContentList('more', {
            castId: location.query.id,
            currentPage: pageData.currentPage + 1,
            pageSize: 30
        }, (data) => {
            if (data.code === 1) {
                this.setState({
                    contentLoading: false,
                    currentPage: pageData.currentPage + 1
                })
            } else {
                this.setState({
                    contentLoading: false
                })
            }
        })
    }

    changeLiveStatus = (e) => {
        let status = e.target.getAttribute('data-status')
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${status === '1' ? '结束直播' : '开始直播'}吗 ?`,
            onOk () {
                let sendData = {
                    castId: _this.props.location.query.id,
                    status: status === '1' ? '2' : '1'
                }
                axiosAjax('POST', '/caster/room/update/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功!')
                        _this.setState({
                            radioValue: status === '1' ? '2' : '1'
                        })
                        _this.props.actions.setFilterData({'status': status === '1' ? '2' : '1'})
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {contentList, pageData} = this.props
        const {content, loading, contentLoading, data, updateOrNot, radioValue} = this.state
        return <div className="live-detail-content">
            <Button type="primary" data-status={radioValue} style={{marginRight: '15px'}} onClick={this.changeLiveStatus}>{radioValue === '1' ? '结束直播' : '开始直播'}</Button>
            <Button type="primary" className="cancel" onClick={() => {
                hashHistory.goBack()
            }}>返回</Button>
            <div className="live-detail-title">{this.state.title}</div>
            <div className="live-detail-section">
                <Col span={8} className="live-detail simditor">
                    <Spin spinning={contentLoading} size="large">
                        {!contentList ? <div className="tips">加载中...</div> : <div>
                            {contentList.map((item, index) => {
                                return <Row className="item-section simditor-body" key={index}>
                                    <Col className='item-content' dangerouslySetInnerHTML={this.createMarkup(item.content)}></Col>
                                    <Col span={4} className='item-opts'>
                                        <a onClick={() => {
                                            this.showModal(item, index)
                                        }}>编辑</a>
                                        <a onClick={() => {
                                            this.delListItem(item.contentId, index)
                                        }}>删除</a>
                                    </Col>
                                    <Col span={12} className='item-date'>{formatDate(item.createTime)}<span>{item.userId === this.state.zcrId ? '（主持人）' : '（嘉宾）'}</span></Col>
                                </Row>
                            })}
                            {(() => {
                                if (contentList.length === 0) {
                                    return <div className="tips">直播好像还没开始哦~</div>
                                } else {
                                    if (this.state.currentPage >= pageData.pageCount) {
                                        return <div className="content-end">已加载全部~</div>
                                    } else {
                                        return <div className="check-more-load" onClick={this.loadMore}>查看更多</div>
                                    }
                                }
                            })()}
                        </div>}
                    </Spin>
                </Col>
                <Col span={11} offset={1} className="live-editor">
                    <Spin spinning={loading} size="large">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label="身份：">
                                {getFieldDecorator('roleId', {
                                    initialValue: this.state.zcrId,
                                    rules: [{required: true}]
                                })(
                                    <Select style={{width: 120}} onChange={this.changeStatus}>
                                        <Option value={this.state.zcrId}>主持人</Option>
                                        <Option value={this.state.guestId}>嘉宾</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="直播内容: "
                            >
                                {getFieldDecorator('content', {
                                    initialValue: '',
                                    rules: [{required: true, message: '请输入直播内容！'}]
                                })(
                                    <Input className="news" style={{display: 'none'}}/>
                                )}
                                <PostEditor
                                    setSimditor={(editor) => this.setSimditor(editor)}
                                    toolBar={['image', 'bold', 'italic', 'color']}
                                    info={{postContent: updateOrNot ? data.content : content}}
                                    subSend={(data) => this.sendPost(data)}
                                />
                            </FormItem>

                            <FormItem>
                                <Button
                                    disabled={this.state.disabled}
                                    type="primary" data-status='1' htmlType="submit"
                                    style={{marginRight: '10px'}}>发表</Button>
                                {
                                    this.state.visible ? <Button type="primary" data-status='2' htmlType="button" style={{marginRight: '10px'}} onClick={this.cancelEdit}>取消</Button> : ''
                                }
                            </FormItem>
                        </Form>
                    </Spin>
                </Col>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.liveInfo.info,
        contentList: state.liveContent.list,
        pageData: state.liveContent.pageData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            setFilterData,
            getLiveContentList,
            getLiveItemInfo,
            selectedData,
            addNewLive,
            delLiveItem,
            updateLive
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveDetail))
