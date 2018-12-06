import React, {Component} from 'react'
import { connect } from 'react-redux'
import {hashHistory} from 'react-router'
import { Modal, Form, Input, Radio, message, Icon, Upload, Button, Spin } from 'antd'
import {getStoUserItemInfo} from '../../../actions/sto/stoUser.action'
import {URL, axiosAjax, getSig} from '../../../public/index'
const FormItem = Form.Item

class StoUserEdit extends Component {
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
        dispatch(getStoUserItemInfo({'id': location.query.id}, (data) => {
            let img = data.imgUrl
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
            imgUrl: this.state.coverImgUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.userInfo.id
                axiosAjax('post', '/guestInfo/updateGuest', values, (res) => {
                    if (res.code === 1) {
                        message.success('修改成功')
                        hashHistory.push('/sto-userList')
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
            labelCol: {span: 2},
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
                        label="顾问名">
                        {getFieldDecorator('guestName', {
                            initialValue: userInfo.guestName ? userInfo.guestName : '',
                            rules: [{ required: true, message: '请输入STO顾问名！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        className=""
                        label="顾问类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: userInfo.type ? `${userInfo.type}` : '0'
                        })(
                            <Radio.Group>
                                <Radio value="0">个人</Radio>
                                <Radio value="1">机构</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="顾问头像"
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('imgUrl', {
                                initialValue: (userInfo && userInfo.imgUrl) ? this.state.fileList : '',
                                rules: [{required: true, message: '请上传顾问头像！'}]
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
                            <span className="cover-img-tip" style={{display: 'inline-block', marginTop: '70px'}}>用于STO顾问头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="顾问描述">
                        {getFieldDecorator('introduction', {
                            initialValue: (userInfo && userInfo.introduction) ? userInfo.introduction : ''
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
        userInfo: state.stoUserInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(StoUserEdit))
