/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Form, Input, Upload, Icon, Modal, Button, message, Spin, DatePicker, Select} from 'antd'
import moment from 'moment'
import {getLiveItemInfo, getDepartLiveUserList} from '../../actions/live/live.action'

import {axiosAjax, URL, formatDate, emptyOrNot, getSig} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const Option = Select.Option
// const RadioGroup = Radio.Group
const {TextArea} = Input

// const cateIdOptions = [
//     {label: '原创', value: '1'},
//     {label: '转载', value: '2'}
// ]

class LiveSend extends Component {
    state = {
        updateOrNot: false,
        isLogin: false,
        icoVisible: false,
        cateId: '1',
        previewVisible: false,
        previewImage: '',
        fileList: [],
        mFileList: [],
        coverImgUrl: '',
        mCoverImgUrl: '',
        coverPicImgUrl: '',
        loading: true,
        coverFileList: [],
        status: 'upcoming'
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getDepartLiveUserList({type: 1}))
        dispatch(getDepartLiveUserList({type: 2}))
        if (location.query.id) {
            dispatch(getLiveItemInfo({'castId': location.query.id}, (data) => {
                this.setState({
                    updateOrNot: true,
                    fileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.backImage
                    }],
                    mFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.mBackImage
                    }],
                    coverFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.coverPic
                    }],
                    coverImgUrl: data.backImage,
                    mCoverImgUrl: data.mBackImage,
                    coverPicImgUrl: data.coverPic,
                    loading: false
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    cateIdChange = (e) => {
        this.setState({
            status: e.target.value
        })
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

    handleCoverChange = ({file, fileList}) => {
        this.setState({
            coverFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                coverPicImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    coverPicImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    coverPicImgUrl: '',
                    coverFileList: []
                })
            }
        }
    }

    mHandleChange = ({file, fileList}) => {
        this.setState({
            mFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mCoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mCoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mCoverImgUrl: '',
                    mFileList: []
                })
            }
            console.log(this.state)
        }
    }
    // 提交
    handleSubmit = (e) => {
        // let status = e.target.getAttribute('data-status')
        e.preventDefault()

        this.props.form.setFieldsValue({
            backImage: this.state.coverImgUrl,
            coverPic: this.state.coverPicImgUrl,
            mBackImage: this.state.mCoverImgUrl
        })

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.location.query.id
                values.beginTime = Date.parse(values['beginTime'].format('YYYY-MM-DD HH:mm:ss'))
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${!this.state.updateOrNot ? '/caster/room/add' : '/caster/room/update'}`, values, (res) => {
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.push('/live-list')
                    } else {
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
        const {liveInfo, guestList, zcrList} = this.props
        const {previewVisible, previewImage, fileList, updateOrNot, coverFileList, mFileList} = this.state
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

        return <div className="live-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        className='liveTitle'
                        {...formItemLayout}
                        label="直播标题 "
                    >
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && liveInfo) ? `${liveInfo.title}` : '',
                            rules: [{required: true, message: '请输入直播标题！'}]
                        })(
                            <Input className="live-name" placeholder="请输入直播标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='liveTime'
                        {...formItemLayout}
                        label="直播时间: "
                    >
                        {getFieldDecorator('beginTime', {
                            rules: [{required: true, message: '请选择直播开始时间！'}],
                            initialValue: (updateOrNot && liveInfo) ? moment(formatDate(liveInfo.beginTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='inviteName'
                        {...formItemLayout}
                        label="嘉宾名称: "
                    >
                        {getFieldDecorator('guestId', (updateOrNot && liveInfo) ? {
                            initialValue: emptyOrNot(liveInfo.guestId),
                            rules: [{required: true, message: '请选择直播嘉宾！'}]
                        } : {
                            rules: [{required: true, message: '请选择直播嘉宾！'}]
                        })(
                            <Select
                                placeholder="请选择直播嘉宾！"
                            >
                                {guestList.map((item, index) => {
                                    return <Option key={index} value={item.userId}>{item.userName}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        className='inviteName'
                        {...formItemLayout}
                        label="主持人名称: "
                    >
                        {getFieldDecorator('presenterId', (updateOrNot && liveInfo) ? {
                            initialValue: emptyOrNot(liveInfo.presenterId),
                            rules: [{required: true, message: '请选择直播主持人！'}]
                        } : {
                            rules: [{required: true, message: '请选择直播主持人！'}]
                        })(
                            <Select placeholder="请选择主持人！" showSearch>
                                {zcrList.map((item, index) => {
                                    return <Option key={index} value={item.userId}>{item.userName}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        className="inviteInfo"
                        {...formItemLayout}
                        label="直播简介: "
                    >
                        {getFieldDecorator('casterDesc', {
                            initialValue: (updateOrNot && liveInfo) ? `${emptyOrNot(liveInfo.casterDesc)}` : '',
                            rules: [
                                {required: true, message: '请输入直播简介！', max: 300},
                                {message: '简介最多300字！', max: 300}
                            ]
                        })(
                            <TextArea rows={4} className="live-supply" placeholder="请输入直播简介"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="pc端直播背景图: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('backImage', {
                                initialValue: (updateOrNot && liveInfo) ? fileList : '',
                                rules: [{required: true, message: '请上传直播背景图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
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
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于pc端直播页面的背景图展示, 长宽比例: <font style={{color: 'red'}}>1920 * 465</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="m端直播背景图: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mBackImage', {
                                initialValue: (updateOrNot && liveInfo) ? mFileList : '',
                                rules: [{required: true, message: '请上传直播背景图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={mFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.mHandleChange}
                                >
                                    {mFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于m端直播页面的背景图展示, 长宽比例: <font style={{color: 'red'}}>640 * 478</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="直播间封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('coverPic', {
                                initialValue: (updateOrNot && liveInfo) ? coverFileList : '',
                                rules: [{required: true, message: '请上传直播间封面！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={coverFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleCoverChange}
                                >
                                    {coverFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于列表页面的封面图展示, 长宽比例: <font style={{color: 'red'}}>390 * 260</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        wrapperCol={{span: 12, offset: 1}}
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
        userInfo: state.liveInfo.userInfo,
        liveInfo: state.liveInfo.info,
        selectData: state.liveInfo.selectedData,
        zcrList: state.liveInfo.zcrList,
        guestList: state.liveInfo.guestList
    }
}

export default connect(mapStateToProps)(Form.create()(LiveSend))
