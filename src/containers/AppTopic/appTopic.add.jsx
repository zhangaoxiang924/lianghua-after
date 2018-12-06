/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Form, Input, Upload, Icon, Modal, Button, message, Spin, Radio, Select} from 'antd'
import {getAppTopicItemInfo} from '../../actions/app/appTopic.action'
import {getChannelList} from '../../actions/index'
import {axiosPost, URL, getSig, topicTypeOptions, axiosAjax} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

class AppTopicSend extends Component {
    state = {
        updateOrNot: false,
        previewVisible: false,
        previewImage: '',
        pcImgSrcFileList: [],
        mImgSrcFileList: [],
        pcImgSrc: '',
        mImgSrc: '',
        pcBackImageFileList: [],
        mBackImageFileList: [],
        pcBackImage: '',
        mBackImage: '',
        loading: false,
        type: '1',
        newsReqType: '1',
        channelId: '1'
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getChannelList())
        if (location.query.id) {
            this.setState({
                loading: true
            })
            dispatch(getAppTopicItemInfo({'id': location.query.id}, (data) => {
                let newsReq = (data.type === 3 && data.typeLink && parseInt(data.typeLink) !== '')
                this.setState({
                    updateOrNot: true,
                    mImgSrcFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.mImgSrc
                    }],
                    mImgSrc: data.mImgSrc,
                    loading: false,
                    type: data.type.toString(),
                    channelId: newsReq ? data.typeLink : '1',
                    newsReqType: newsReq ? '1' : '2'
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    // pc 封面
    handlePcImgChange = ({file, fileList}) => {
        this.setState({
            pcImgSrcFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcImgSrc: '',
                    pcImgSrcFileList: []
                })
            }
        }
    }

    // m 封面
    handleMImgChange = ({file, fileList}) => {
        this.setState({
            mImgSrcFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mImgSrc: '',
                    mImgSrcFileList: []
                })
            }
        }
    }

    // pc 背景
    handlePcBackImgChange = ({file, fileList}) => {
        this.setState({
            pcBackImageFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcBackImage: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcBackImage: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcBackImage: '',
                    pcBackImageFileList: []
                })
            }
        }
    }

    // m 背景
    handleMBackImgChange = ({file, fileList}) => {
        this.setState({
            mBackImageFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mBackImage: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mBackImage: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mBackImage: '',
                    mBackImageFileList: []
                })
            }
        }
    }

    typeOnChange = (e) => {
        this.setState({
            type: e.target.value
        })
    }

    newsOnChange = (e) => {
        this.setState({
            newsReqType: e.target.value
        })
    }

    // 提交
    handleSubmit = (e) => {
        // let status = e.target.getAttribute('data-status')
        this.props.form.setFieldsValue({
            mImgSrc: this.state.mImgSrc
        })
        e.preventDefault()
        let topic = {
            type: this.state.type,
            status: 1,
            pcImgSrc: '',
            mImgSrc: this.state.mImgSrc,
            pcBackImage: '',
            mBackImage: ''
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                topic.topicName = values.topicName
                topic.tags = ''
                if (this.state.type === '3' && this.state.newsReqType === '1') {
                    topic.typeLink = values.typeLink_channel
                } else if (this.state.type === '3' && this.state.newsReqType === '2') {
                    topic.typeLink = values.typeLink_tags
                } else if (this.state.type === '1') {
                    topic.typeLink = values.typeLink
                } else if (this.state.type === '5') {
                    topic.typeLink = values.typeLink_author
                } else {
                    topic.typeLink = values.typeLink_2
                }
                if (this.state.updateOrNot) {
                    topic.id = this.props.location.query.id
                    topic.setTop = this.props.appTopicInfo.setTop
                    topic.status = this.props.appTopicInfo.status
                    axiosAjax('post', '/topic/update', topic, (res) => {
                        if (res.code === 1) {
                            this.setState({
                                loading: false
                            })
                            message.success('修改成功！')
                            hashHistory.push('/appTopic-list')
                        } else {
                            this.setState({
                                loading: false
                            })
                            message.error(res.msg)
                        }
                    })
                } else {
                    axiosPost('/topic/add', {topic: topic}, (res) => {
                        if (res.code === 1) {
                            this.setState({
                                loading: false
                            })
                            message.success('添加成功！')
                            hashHistory.push('/appTopic-list')
                        } else {
                            message.error(res.msg)
                            this.setState({
                                loading: false
                            })
                        }
                    })
                }
            }
        })
    }

    handleChange2 = (value) => {
        this.setState({
            channelId: value
        })
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {appTopicInfo} = this.props
        const newsReq = (appTopicInfo.type === 3 && appTopicInfo.typeLink && parseInt(appTopicInfo.typeLink) !== '')
        const {previewVisible, previewImage, mImgSrcFileList, updateOrNot} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 19}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        let label = () => {
            if (this.state.type === '3' && this.state.newsReqType === '1') {
                return '新闻频道'
            } else if (this.state.type === '3' && this.state.newsReqType === '2') {
                return '关键词(tags)'
            } else if (this.state.type === '1') {
                return '专题跳转链接'
            } else if (this.state.type === '5') {
                return '作者信息'
            } else {
                return '待定'
            }
        }

        let formItem = () => {
            if (this.state.type === '3' && this.state.newsReqType === '1') {
                return <FormItem
                    {...formItemLayout}
                    className="appTopicTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_channel', {
                        initialValue: this.state.channelId,
                        rules: [
                            {required: true, message: '请选择新闻频道！'}
                        ]
                    })(
                        <Select
                            style={{ width: 100 }}
                            onChange={this.handleChange2}
                        >
                            {this.props.channelList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                        </Select>
                    )}
                </FormItem>
            } else if (this.state.type === '3' && this.state.newsReqType === '2') {
                return <FormItem
                    {...formItemLayout}
                    className="appTopicTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_tags', {
                        initialValue: newsReq ? '' : (appTopicInfo.typeLink || '无'),
                        rules: [
                            {required: true, message: '关键词不能为空！'}
                        ]
                    })(<Input placeholder='请输入新闻关键词(tags)'/>)}
                </FormItem>
            } else if (this.state.type === '1') {
                return <FormItem
                    {...formItemLayout}
                    className="appTopicTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink', {
                        initialValue: (updateOrNot && appTopicInfo) ? `${appTopicInfo.type === 1 ? appTopicInfo.typeLink : ''}` : '',
                        rules: [
                            {type: 'url', message: '请输入正确的超链接地址！'},
                            {required: true, message: '超链接地址不能为空！'}
                        ]})(<Input placeholder='请输入专题跳转的超链接地址'/>)
                    }
                </FormItem>
            } else if (this.state.type === '5') {
                return <FormItem
                    {...formItemLayout}
                    className="appTopicTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_author', {
                        initialValue: (updateOrNot && appTopicInfo) ? `${appTopicInfo.type === 5 ? appTopicInfo.typeLink : ''}` : '',
                        rules: [
                            {required: true, message: '作者昵称/作者ID不能为空！'}
                        ]
                    })(<Input placeholder='请输入作者昵称/作者ID'/>)}
                </FormItem>
            } else {
                return <FormItem
                    {...formItemLayout}
                    className="appTopicTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_2', {
                        initialValue: '',
                        rules: [
                            {required: true, message: '内容不能为空！'}
                        ]
                    })(<Input disabled placeholder='待定'/>)}
                </FormItem>
            }
        }

        return <div className="appTopic-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        className='appTopicTitle'
                        {...formItemLayout}
                        label="标题 "
                    >
                        {getFieldDecorator('topicName', {
                            initialValue: (updateOrNot && appTopicInfo) ? `${appTopicInfo.topicName}` : '',
                            rules: [{required: true, message: '请输入专题标题！'}]
                        })(
                            <Input className="appTopic-name" placeholder="请输入专题标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='appTopicTitle'
                        {...formItemLayout}
                        label="专题类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: (updateOrNot && appTopicInfo) ? `${appTopicInfo.type}` : '1',
                            rules: [{required: true, message: '请选择专题类型！'}]
                        })(
                            <RadioGroup onChange={this.typeOnChange}>
                                {topicTypeOptions.map((item, index) => {
                                    return <Radio key={index} value={item.value}>{item.label}</Radio>
                                })}
                            </RadioGroup>
                        )}
                    </FormItem>

                    {this.state.type === '3' ? <FormItem
                        className='appTopicTitle'
                        {...formItemLayout}
                        label="新闻类型"
                    >
                        {getFieldDecorator('newsType', {
                            initialValue: this.state.newsReqType,
                            rules: [{required: true, message: '请选择新闻类型！'}]
                        })(
                            <RadioGroup onChange={this.newsOnChange}>
                                <Radio value='1'>频道</Radio>
                                <Radio value='2'>关键字(tags)</Radio>
                            </RadioGroup>
                        )}
                    </FormItem> : ''}
                    {formItem()}
                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="pc 封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcImgSrc', {
                                initialValue: '',
                                rules: [{required: true, message: '请上传pc 封面图！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={pcImgSrcFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handlePcImgChange}
                                >
                                    {pcImgSrcFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 pc 端首页推荐的封面图展示, 长宽比例: <font style={{color: 'red'}}>300 * 160</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="pc 专题背景: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcBackImage', {
                                initialValue: '',
                                rules: [{required: true, message: '请上传 pc 专题背景！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={pcBackImageFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handlePcBackImgChange}
                                >
                                    {pcBackImageFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于专题页面的背景图展示, 长宽比例: <font style={{color: 'red'}}>1920 * 460</font></span>
                        </div>
                    </FormItem>
                    */}
                    <FormItem
                        {...formItemLayout}
                        label="M 端轮播封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mImgSrc', {
                                initialValue: (updateOrNot && appTopicInfo) ? mImgSrcFileList : '',
                                rules: [{required: true, message: '请上传轮播封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={mImgSrcFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMImgChange}
                                >
                                    {mImgSrcFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 APP 发现模块轮播的封面图展示, 长宽比例: <font style={{color: 'red'}}>496 * 267</font></span>
                        </div>
                    </FormItem>
                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="M 端专题背景: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mBackImage', {
                                initialValue: '',
                                rules: [{required: true, message: '请上传 M 端专题背景！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={mBackImageFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMBackImgChange}
                                >
                                    {mBackImageFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 M 端专题页面的背景图展示, 长宽比例: <font style={{color: 'red'}}>待定</font></span>
                        </div>
                    </FormItem>
                    */}
                    <FormItem
                        wrapperCol={{span: 12, offset: 2}}
                    >
                        <Button
                            type="primary" data-status='1' htmlType="submit"
                            style={{marginRight: '10px'}}>保存</Button>
                        <Button
                            type="primary" className="cancel"
                            onClick={() => {
                                hashHistory.goBack()
                            }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        appTopicInfo: state.appTopicInfo.info,
        selectData: state.appTopicInfo.selectedData,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(AppTopicSend))
