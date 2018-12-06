import React, {Component} from 'react'
import { connect } from 'react-redux'
import {hashHistory} from 'react-router'
import { Modal, Form, Input, Radio, message, Icon, Upload, Button, Spin } from 'antd'
import {getLiveUserItemInfo} from '../../actions/live/liveUser.action'
import {URL, axiosAjax, getSig} from '../../public/index'
const FormItem = Form.Item

class LiveUserEdit extends Component {
    constructor (props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            coverImgUrl: '',
            description: '',
            loading: true,
            userType: '1'
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getLiveUserItemInfo({'id': location.query.id}, (data) => {
            let img = data.headUrl
            this.setState({
                updateOrNot: true,
                fileList: [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: img
                }],
                description: data.description,
                coverImgUrl: img,
                loading: false,
                userType: data.userType,
                userName: data.userName
            })
        }))
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = ({file, fileList}) => {
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
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    coverImgUrl: '',
                    fileList: []
                })
            }
        }
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.setFieldsValue({
            headUrl: this.state.coverImgUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.userId = this.props.userInfo.userId
                axiosAjax('post', '/caster/user/update', values, (res) => {
                    if (res.code === 1) {
                        message.success('修改成功')
                        hashHistory.push('/live-userList')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const {form, userInfo} = this.props
        const { getFieldDecorator } = form
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
        return (
            <Form onSubmit={this.handleSubmit}>
                <Spin spinning={this.state.loading} size='large'>
                    <FormItem
                        {...formItemLayout}
                        label="用户名">
                        {getFieldDecorator('userName', {
                            initialValue: userInfo.userName ? userInfo.userName : '',
                            rules: [{ required: true, message: '请输入直播用户名！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        className=""
                        label="用户类型"
                    >
                        {getFieldDecorator('userType', {
                            initialValue: userInfo.userType ? `${userInfo.userType}` : '1'
                        })(
                            <Radio.Group>
                                <Radio value="1">嘉宾</Radio>
                                <Radio value="2">主持人</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户头像"
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('headUrl', {
                                initialValue: (userInfo && userInfo.headUrl) ? this.state.fileList : '',
                                rules: [{required: true, message: '请上传用户头像！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {this.state.fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                            </Modal>
                            <span className="cover-img-tip" style={{display: 'inline-block', marginTop: '70px'}}>用于直播页面头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户描述">
                        {getFieldDecorator('description', {
                            initialValue: (userInfo && userInfo.description) ? userInfo.description : ''
                        })(<Input rows={4} type="textarea" />)}
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
                </Spin>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.liveUserInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(LiveUserEdit))
