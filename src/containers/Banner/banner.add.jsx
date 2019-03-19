/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Form, Input, Upload, Icon, Modal, Button, message, Spin} from 'antd'
import {getBannerItemInfo} from '../../actions/banner/banner'
import {URL, getSig, axiosAjax} from '../../public/index'
import './index.scss'

const FormItem = Form.Item

class BannerSend extends Component {
    state = {
        updateOrNot: false,
        previewVisible: false,
        previewImage: '',
        picFileList: [],
        picMobileFileList: [],
        pic: '',
        picMobile: '',
        pcBackImageFileList: [],
        mBackImageFileList: [],
        pcBackImage: '',
        mBackImage: '',
        loading: false,
        type: '1',
        position: '1',
        newsReqType: '1'
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            this.setState({
                loading: true
            })
            dispatch(getBannerItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    position: data.position,
                    updateOrNot: true,
                    picMobileFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.picMobile
                    }],
                    picFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pic
                    }],
                    picMobile: data.picMobile,
                    pic: data.pic,
                    loading: false,
                    type: data.type.toString()
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
            picFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pic: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pic: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pic: '',
                    picFileList: []
                })
            }
        }
    }

    // m 封面
    handleMImgChange = ({file, fileList}) => {
        this.setState({
            picMobileFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                picMobile: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    picMobile: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    picMobile: '',
                    picMobileFileList: []
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
        e.preventDefault()
        this.props.form.setFieldsValue({
            pic: this.state.pic,
            picMobile: this.state.picMobile
        })

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                if (this.state.updateOrNot) {
                    values.id = this.props.location.query.id
                    axiosAjax('post', '/homerecommend/updatehomerecommend', values, (res) => {
                        if (res.code === 1) {
                            this.setState({
                                loading: false
                            })
                            message.success('修改成功！')
                            hashHistory.goBack()
                        } else {
                            this.setState({
                                loading: false
                            })
                            message.error(res.msg)
                        }
                    })
                } else {
                    axiosAjax('post', '/banner/add', values, (res) => {
                        if (res.code === 1) {
                            this.setState({
                                loading: false
                            })
                            message.success('添加成功！')
                            hashHistory.goBack()
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

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {bannerInfo} = this.props
        const {previewVisible, previewImage, picMobileFileList, updateOrNot, picFileList} = this.state
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

        return <div className="banner-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        className='bannerTitle'
                        {...formItemLayout}
                        label="标题 "
                    >
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.title}` : '',
                            rules: [{required: true, message: '请输入Banner标题！'}]
                        })(
                            <Input className="banner-name" placeholder="请输入Banner标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        className="bannerTitle"
                        label='链接'>
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && bannerInfo) ? bannerInfo.url : '',
                            rules: [
                                {type: 'url', message: '请输入正确的超链接！'},
                                {required: true, message: '地址不能为空！'}
                            ]
                        })(<Input placeholder='请输入相关链接'/>)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="pc 端封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pic', {
                                initialValue: (updateOrNot && bannerInfo) ? picFileList : '',
                                rules: [{required: true, message: '请上传pc 封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/upload/picture`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    data={{
                                        type: 'news'
                                    }}
                                    fileList={picFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handlePcImgChange}
                                >
                                    {picFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">用于 pc 端首页推荐的封面图展示</span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="M 端封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('picMobile', {
                                initialValue: (updateOrNot && bannerInfo) ? picMobileFileList : '',
                                rules: [{required: true, message: '请上传轮播封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/upload/picture`}
                                    name='uploadFile'
                                    data={{
                                        type: 'news'
                                    }}
                                    listType="picture-card"
                                    fileList={picMobileFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMImgChange}
                                >
                                    {picMobileFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">用于 M 端相关模块封面图展示</span>
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
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        bannerInfo: state.bannerInfo.info,
        selectData: state.bannerInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(BannerSend))
