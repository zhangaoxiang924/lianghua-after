/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { hashHistory } from 'react-router'
import { Form, Radio, Input, Button, Modal, message, Spin, InputNumber } from 'antd'
import {getTypeList} from '../../actions/index'
import {getFlashItemInfo} from '../../actions/flash/flash.action'

import {axiosAjax} from '../../public/index'
import './flash.scss'

const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input
const RadioGroup = Radio.Group

/*
const json = {
    update: true,
    author: '作者',
    channelId: '0',
    cateId: '0',
    coverPic: [],
    title: '标题',
    source: '新闻来源',
    synopsis: '摘要',
    tags: '标签',
    content: '<p>content</p>'
}
*/

const tagOptions = [
    { label: '普通', value: 1 },
    { label: '重要', value: 2 }
]

class FlashSend extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            inputVisible: false,
            channelId: '1',
            inputValue: '',
            content: '',
            reason: '',
            title: '',
            loading: true,
            tag: 1,
            url: ''
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getTypeList())
        if (location.query.id) {
            dispatch(getFlashItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    content: data.content,
                    title: data.title && data.title.trim() !== '' ? data.title : '暂无',
                    url: data.url,
                    updateOrNot: true,
                    loading: false
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    // 频道改变
    channelIdChange = (e) => {
        this.setState({
            channelId: e.target.value
        })
    }

    // 状态改变
    tagChange = (e) => {
        this.setState({
            tag: e.target.value
        })
    }

    getReason = (e) => {
        this.setState({
            reason: e.target.value
        })
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        let status = e.target.getAttribute('data-status')
        const This = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = This.props.location.query.id
                if (status === '2') {
                    confirm({
                        title: '提示',
                        content: <div className="modal-input">
                            <span style={{marginRight: 10}}>请填写文章不通过原因：</span>
                            <TextArea rows={3} autoFocus onChange={(e) => { This.getReason(e) }}/>
                        </div>,
                        onOk () {
                            if (This.state.reason.trim() !== '') {
                                This.setState({
                                    loading: true
                                })
                                axiosAjax('post', '/lives/update', values, (res) => {
                                    if (res.code === 1) {
                                        axiosAjax('POST', '/lives/nopasslivesreason', {
                                            livesId: values.id,
                                            reason: This.state.reason
                                        }, (res) => {
                                            if (res.code === 1) {
                                                axiosAjax('POST', '/lives/status', {
                                                    id: values.id,
                                                    status: 2
                                                }, (res) => {
                                                    if (res.code === 1) {
                                                        message.success('操作成功！')
                                                        hashHistory.push('/flash-audit')
                                                    } else {
                                                        This.setState({
                                                            loading: false
                                                        })
                                                        message.error(res.msg)
                                                    }
                                                })
                                            } else {
                                                This.setState({
                                                    loading: false
                                                })
                                                message.error(res.msg)
                                            }
                                        })
                                    } else {
                                        This.setState({
                                            loading: false
                                        })
                                        message.error(res.msg)
                                    }
                                })
                            } else {
                                message.error('请填写审核不通过的原因！')
                                return false
                            }
                        }
                    })
                } else {
                    confirm({
                        title: '提示',
                        content: `确认要通过审核吗 ?`,
                        onOk () {
                            This.setState({
                                loading: true
                            })
                            axiosAjax('post', '/lives/update', values, (res) => {
                                if (res.code === 1) {
                                    axiosAjax('post', '/lives/status', {
                                        id: values.id,
                                        status: 1
                                    }, (res) => {
                                        if (res.code === 1) {
                                            message.success('操作成功！')
                                            hashHistory.push('/flash-audit')
                                        } else {
                                            message.error(res.msg)
                                        }
                                    })
                                } else {
                                    message.error(res.msg)
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form
        const { flashInfo } = this.props
        const { content, updateOrNot, tag, title } = this.state
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 15, offset: 1 }
        }

        return <div className="flash-send">
            <Spin spinning={this.state.loading} size="large">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="标题："
                    >
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && flashInfo) ? title : '',
                            rules: [{ required: true, message: '请输入快讯标题！' }]
                        })(
                            <Input className="flash" placeholder="快讯标题"/>
                        )}
                        <a target="_blank" href={`https://www.baidu.com/s?wd=${title}`}>去百度中搜索</a>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="内容："
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && flashInfo) ? content : '',
                            rules: [{ required: true, message: '请输入快讯内容！' }]
                        })(
                            <TextArea className="flash" placeholder="快讯内容"/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="链接地址：">
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.url ? flashInfo.url : ''}` : '',
                            rules: [{ type: 'url', message: '请输入正确的超链接地址！' }]
                        })(
                            <Input placeholder='快讯中插入的超链接地址'/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="频道：">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.channelId}` : '0'
                        })(
                            <RadioGroup
                                options={this.props.flashTypeList}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="快讯标识：">
                        {getFieldDecorator('tag', {
                            initialValue: (updateOrNot && flashInfo) ? (flashInfo.tag === 0 ? 1 : flashInfo.tag) : 1,
                            rules: [{ required: true, message: '请选择快讯标识！' }]
                        })(
                            <RadioGroup
                                options={tagOptions}
                                onChange={this.tagChange}
                                setFieldsValue={tag}>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="利好数：">
                        {getFieldDecorator('upCounts', {
                            initialValue: (updateOrNot && flashInfo.upCounts) ? flashInfo.upCounts : 0
                        })(
                            <InputNumber />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="利空数：">
                        {getFieldDecorator('downCounts', {
                            initialValue: (updateOrNot && flashInfo.downCounts) ? flashInfo.downCounts : 0
                        })(
                            <InputNumber />
                        )}
                    </FormItem>

                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" data-status="2" className="cancel" onClick={this.handleSubmit}>不通过审核</Button>
                        <Button type="primary" data-status="1" htmlType="submit" style={{marginLeft: '10px'}}>通过审核</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.flashInfo.userInfo,
        flashInfo: state.flashInfo.info,
        flashTypeList: state.flashTypeListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(FlashSend))
