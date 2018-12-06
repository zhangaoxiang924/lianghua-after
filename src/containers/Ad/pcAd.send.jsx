/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { hashHistory } from 'react-router'
import { Radio, Form, Input, Upload, Icon, Modal, Button, message, Spin } from 'antd'
// import moment from 'moment'
import {getAdItemInfo, setFilterData} from '../../actions/others/ad.action'

import {axiosAjax, URL, pcAdPosition, getSig} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const typeOptions = [
    { label: 'PC端', value: '1' },
    { label: '手机端', value: '2' }
]

class PostSend extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            adPlace: '1',
            newsVisible: false,
            type: '1',
            previewVisible: false,
            previewImage: '',
            newsTitle: '',
            newsContent: '',
            fileList: [],
            coverImgUrl: '',
            loading: true,
            adType: 1
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            dispatch(getAdItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    updateOrNot: true,
                    fileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.imgSrc
                    }],
                    coverImgUrl: data.imgSrc,
                    loading: false,
                    adType: data.useType
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    // 位置改变
    positionChange = (e) => {
        const {dispatch} = this.props
        dispatch(setFilterData({adPcPlace: e.target.value}))
        this.setState({
            adPlace: e.target.value
        })
    }

    typeChange = (e) => {
        this.setState({
            type: e.target.value
        })
    }
    adType = (e) => {
        this.setState({
            adType: e.target.value
        })
    }

    // 上传图片
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = ({ file, fileList }) => {
        this.setState({
            fileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                coverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    coverImgUrl: file.response.obj
                })
            } if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    coverImgUrl: '',
                    fileList: []
                })
            }
        }
    }

    newsVisibleHide = () => {
        this.setState({ newsVisible: false })
    }

    newsVisibleShow = () => {
        this.setState({ newsVisible: true })
    }

    // 提交
    handleSubmit = (e) => {
        let status = e.target.getAttribute('data-status')
        e.preventDefault()
        this.props.form.setFieldsValue({
            imgSrc: this.state.coverImgUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.location.query.id || ''
                values.status = status || 1
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${this.state.updateOrNot ? '/ad/update' : '/ad/add'}`, values, (res) => {
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.push('/ad-pc')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 发布
    sendPost (sendData) {
        let _data = {
            'newsTitle': sendData.postTitle || '',
            'newsContent': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    // 内容格式化
    createMarkup (str) { return {__html: str} }

    render () {
        const { getFieldDecorator } = this.props.form
        const { adInfo } = this.props
        const { previewVisible, previewImage, fileList, updateOrNot } = this.state
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 15, offset: 1 }
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        return <div className="post-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="平台: ">
                        {getFieldDecorator('type', {
                            initialValue: '1'
                        })(
                            <RadioGroup
                                disabled
                                options={typeOptions}
                                onChange={this.typeChange}
                                setFieldsValue={this.state.type}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="类型:">
                        {getFieldDecorator('useType', {
                            initialValue: this.state.adType
                        })(
                            <RadioGroup onChange={this.adType} setFieldsValue={this.state.adType}>
                                <Radio value={1}>广告</Radio>
                                <Radio value={2}>自有链接</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="位置: ">
                        {getFieldDecorator('adPlace', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.adPlace}` : '1'
                        })(
                            <RadioGroup
                                options={pcAdPosition}
                                onChange={this.positionChange}
                                setFieldsValue={this.state.adPlace}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="链接：">
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.url}` : '',
                            rules: [{ required: true, type: 'url', message: '请输入正确的超链接地址！' }]
                        })(
                            <Input placeholder='输入广告链接地址'/>
                        )}
                    </FormItem>

                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="发布日期: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择广告发布时间！'}],
                            initialValue: (updateOrNot && adInfo) ? moment(formatDate(adInfo.publishTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </FormItem>
                    */}

                    <FormItem
                        {...formItemLayout}
                        label="标题: "
                    >
                        {getFieldDecorator('remake', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.remake}` : '',
                            rules: [{ required: true, message: '请输入广告标题！' }]
                        })(
                            <Input placeholder="输入广告标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="描述: "
                    >
                        {getFieldDecorator('description', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.description || ''}` : '',
                            rules: [{ required: false, message: '请输入广告描述！' }]
                        })(
                            <Input placeholder="请输入广告描述"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="封面: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('imgSrc', {
                                initialValue: (updateOrNot && adInfo) ? fileList : '',
                                rules: [{ required: true, message: '请上传广告封面！' }]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    headers={{'Sign-Param': getSig()}}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                            {/* <span className="cover-img-tip">用于广告封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span> */}
                        </div>
                    </FormItem>

                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" data-status='1' htmlType="submit" style={{marginRight: '10px'}}>发布</Button>
                        <Button type="primary" data-status='2' onClick={this.handleSubmit} style={{marginRight: '10px'}}>放入草稿箱</Button>
                        <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        adInfo: state.adInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(PostSend))
