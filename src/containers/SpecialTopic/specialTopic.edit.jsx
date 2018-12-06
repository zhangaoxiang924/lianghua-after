/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Form, Input, Upload, Icon, Modal, Button, message, Spin} from 'antd'
import {getSpecialTopicItemInfo} from '../../actions/others/specialTopic.action'

import {axiosAjax, URL, getSig} from '../../public/index'
import './index.scss'

const FormItem = Form.Item

class SpecialTopicSend extends Component {
    state = {
        updateOrNot: false,
        previewVisible: false,
        previewImage: '',
        pcImgSrcFileList: [],
        pcNewImgSrcFileList: [],
        mImgSrcFileList: [],
        pcImgSrc: '',
        pcNewImgSrc: '',
        mImgSrc: '',
        pcBackImageFileList: [],
        mBackImageFileList: [],
        pcBackImage: '',
        mBackImage: '',
        loading: true
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            dispatch(getSpecialTopicItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    updateOrNot: true,
                    pcImgSrcFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pcImgSrc
                    }],
                    pcNewImgSrcFileList: data.newSmallPcImgSrc ? [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.newSmallPcImgSrc
                    }] : [],
                    mImgSrcFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.mImgSrc
                    }],
                    pcBackImageFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pcBackImage
                    }],
                    mBackImageFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.mBackImage
                    }],
                    pcImgSrc: data.pcImgSrc,
                    pcNewImgSrc: data.newSmallPcImgSrc,
                    mImgSrc: data.mImgSrc,
                    pcBackImage: data.pcBackImage,
                    mBackImage: data.mBackImage,
                    loading: false
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

    // 新pc 封面
    handlePcNewImgChange = ({file, fileList}) => {
        this.setState({
            pcNewImgSrcFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcNewImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcNewImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcNewImgSrc: '',
                    pcNewImgSrcFileList: []
                })
            }
        }
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

    // 提交
    handleSubmit = (e) => {
        // let status = e.target.getAttribute('data-status')
        e.preventDefault()
        this.props.form.setFieldsValue({
            pcImgSrc: this.state.pcImgSrc,
            mImgSrc: this.state.mImgSrc,
            pcBackImage: this.state.pcBackImage,
            mBackImage: this.state.mBackImage,
            pcNewImgSrc: this.state.pcNewImgSrc
        })

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.location.query.id
                values.type = 4
                values.setTop = this.props.specialTopicInfo.setTop
                values.newSmallPcImgSrc = this.state.pcNewImgSrc
                delete values.pcNewImgSrc
                axiosAjax('post', '/topic/update', values, (res) => {
                    if (res.code === 1) {
                        this.setState({
                            loading: false
                        })
                        message.success('修改成功！')
                        hashHistory.push('/specialTopic-list')
                    } else {
                        this.setState({
                            loading: false
                        })
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {specialTopicInfo} = this.props
        const {previewVisible, previewImage, pcNewImgSrcFileList, pcImgSrcFileList, pcBackImageFileList, mBackImageFileList, updateOrNot, mImgSrcFileList} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 15, offset: 1}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        return <div className="specialTopic-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        className='specialTopicTitle'
                        {...formItemLayout}
                        label="专题名称 "
                    >
                        {getFieldDecorator('topicName', {
                            initialValue: (updateOrNot && specialTopicInfo) ? `${specialTopicInfo.topicName}` : '',
                            rules: [{required: true, message: '请输入专题名称！'}]
                        })(
                            <Input className="specialTopic-name" placeholder="请输入专题名称"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='specialTopicTitle'
                        {...formItemLayout}
                        label="专题关键字 "
                    >
                        {getFieldDecorator('tags', {
                            initialValue: (updateOrNot && specialTopicInfo) ? `${specialTopicInfo.tags || ''}` : '',
                            rules: [{required: true, message: '请输入专题关键字！'}]
                        })(
                            <Input className="specialTopic-tags" placeholder="请输入专题关键字"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='specialTopicTitle'
                        {...formItemLayout}
                        label="KeyWords "
                    >
                        {getFieldDecorator('keyword', {
                            initialValue: (updateOrNot && specialTopicInfo) ? `${specialTopicInfo.keyword || ''}` : '',
                            rules: [{required: true, message: '请输入专题的 KeyWords！'}]
                        })(
                            <Input className="specialTopic-tags" placeholder="专题 KeyWords (用于 SEO 优化)"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='specialTopicTitle'
                        {...formItemLayout}
                        label="Description "
                    >
                        {getFieldDecorator('description', {
                            initialValue: (updateOrNot && specialTopicInfo) ? `${specialTopicInfo.description || ''}` : '',
                            rules: [{message: '请输入专题的描述！'}]
                        })(
                            <Input className="specialTopic-tags" placeholder="专题描述(用于 SEO 优化)"/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} className="specialTopicTitle" label="专题链接：">
                        {getFieldDecorator('typeLink', {
                            initialValue: (updateOrNot && specialTopicInfo) ? `${specialTopicInfo.typeLink || ''}` : '',
                            rules: [{ type: 'url', message: '请输入正确的超链接地址！' }]
                        })(
                            <Input placeholder='专题跳转的超链接地址(非必填)'/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="pc 首页封面(新): "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcNewImgSrc', {
                                initialValue: (updateOrNot && specialTopicInfo) ? pcNewImgSrcFileList : '',
                                rules: [{required: true, message: '请上传新首页pc 封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={pcNewImgSrcFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handlePcNewImgChange}
                                >
                                    {pcNewImgSrcFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 pc 端新首页推荐的封面图展示, 长宽比例: <font style={{color: 'red'}}>90 * 65</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="pc 封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcImgSrc', {
                                initialValue: (updateOrNot && specialTopicInfo) ? pcImgSrcFileList : '',
                                rules: [{required: true, message: '请上传pc 封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
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
                            <span className="cover-img-tip">用于 pc 端首页推荐的封面图展示, 长宽比例: <font style={{color: 'red'}}>300 * 100</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="pc 专题背景: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcBackImage', {
                                initialValue: (updateOrNot && specialTopicInfo) ? pcBackImageFileList : '',
                                rules: [{required: true, message: '请上传 pc 专题背景！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
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
                            <span className="cover-img-tip">用于专题页面的背景图展示, 长宽比例: <font style={{color: 'red'}}>1920 * 180</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="M 端专题封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mImgSrc', {
                                initialValue: (updateOrNot && specialTopicInfo) ? mImgSrcFileList : '',
                                rules: [{required: true, message: '请上传 m 专题封面图！'}]
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
                            <span className="cover-img-tip">用于 M 端首页推荐的封面图展示, 长宽比例: <font style={{color: 'red'}}>252 * 136</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="M 端专题背景: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mBackImage', {
                                initialValue: (updateOrNot && specialTopicInfo) ? mBackImageFileList : '',
                                rules: [{required: true, message: '请上传 M 端专题背景！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
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
        specialTopicInfo: state.specialTopicInfo.info,
        selectData: state.specialTopicInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(SpecialTopicSend))
