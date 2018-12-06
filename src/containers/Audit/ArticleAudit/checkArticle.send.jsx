/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
// import html2canvas from 'html2canvas'
import { hashHistory } from 'react-router'
import PostEditor from '../../../components/postEditor'
import Cropper from '../../../../node_modules/cropperjs/dist/cropper.esm.js'
import '../../../../node_modules/cropperjs/dist/cropper.css'

import { Radio, Form, Input, Upload, Icon, Modal, Button, message, Row, Col, Spin, DatePicker, Switch } from 'antd'
import moment from 'moment'
import {getArticleItemInfo} from '../../../actions/audit/articleAudit.action'
import {getChannelList} from '../../../actions/index'
import {axiosAjax, URL, getSig, formatDate, isJsonString, dataURLtoBlob} from '../../../public/index'
import './checkArticle.scss'
import UploadFile from '../../../components/upload/UploadFile'
import UploadImg from '../../../components/upload/UploadImg'
import Cookies from 'js-cookie'
const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group
const confirm = Modal.confirm

const cateIdOptions = [
    { label: '原创', value: '1' },
    { label: '转载', value: '2' }
]

class ArticleAuditSend extends Component {
    constructor () {
        super()
        this.state = {
            confirmLoading: false,
            editor: '',
            reason: '',
            updateOrNot: false,
            tags: '',
            inputVisible: false,
            inputValue: '',
            isLogin: false,
            channelId: '1',
            newsVisible: false,
            cateId: '1',
            previewVisible: false,
            previewImage: '',
            newsTitle: '',
            newsContent: '',
            fileList: [],
            pcfileList: [],
            mfileList: [],
            mcfileList: [],
            allfileList: [],
            coverImgUrl: '',
            pccoverImgUrl: '',
            mcoverImgUrl: '',
            mccoverImgUrl: '',
            allcoverImgUrl: '',
            loading: true,
            original: 0,
            aFileInfo: null,
            vFileInfo: null,
            uploadAllImgModal: false,
            cropper: null,
            focusImg: -1,
            ratio: 2,
            cropImgRule: [
                {
                    coverName: 'mccoverImgUrl',
                    coverList: 'mcfileList',
                    width: '640px',
                    height: '320px',
                    ratio: 640 / 320,
                    intro: 'M端推荐新闻的滚动:640 * 320'
                }, {
                    coverName: 'pccoverImgUrl',
                    coverList: 'pcfileList',
                    width: '266px',
                    height: '167px',
                    ratio: 532 / 335,
                    intro: 'PC端推荐位新闻封面:532 * 335'
                }, {
                    coverName: 'coverImgUrl',
                    coverList: 'fileList',
                    width: '220px',
                    height: '160px',
                    ratio: 220 / 160,
                    intro: 'PC 端新闻封面:220 * 160'
                }, {
                    coverName: 'mcoverImgUrl',
                    coverList: 'mfileList',
                    width: '164px',
                    height: '124px',
                    ratio: 290 / 220,
                    intro: 'M端新闻封面:164 * 124'
                }
            ],
            wordBreak: 0,
            alignLeft: 0
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        Cookies.set('watermark', 0)
        dispatch(getChannelList())
        if (location.query.id) {
            dispatch(getArticleItemInfo({'id': location.query.id}, (data) => {
                let filterContent = data.content.replace(/<style(.+)<\/style>/, '')
                this.state.editor.setValue(filterContent)
                let coverPic = isJsonString(data.coverPic) ? JSON.parse(data.coverPic) : {pc_recommend: '', pc: '', wap_big: '', wap_small: ''}
                let pcfileList = (coverPic.pc_recommend && coverPic.pc_recommend !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.pc_recommend
                }] : []
                let fileList = (coverPic.pc && coverPic.pc !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.pc
                }] : []
                let mfileList = (coverPic.wap_small && coverPic.wap_small !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.wap_small
                }] : []
                let mcfileList = (coverPic.wap_big && coverPic.wap_big !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.wap_big
                }] : []
                this.setState({
                    updateOrNot: true,
                    fileList: fileList,
                    pcfileList: pcfileList,
                    mfileList: mfileList,
                    mcfileList: mcfileList,
                    tags: !data.tags ? '' : data.tags,
                    newsContent: filterContent,
                    coverImgUrl: coverPic.pc,
                    pccoverImgUrl: coverPic.pc_recommend || '',
                    mcoverImgUrl: coverPic.wap_small,
                    mccoverImgUrl: coverPic.wap_big,
                    loading: false,
                    original: data.original || 0,
                    vFileInfo: !data.video || data.video.indexOf('[') === -1 ? null : JSON.parse(data.video)[0],
                    aFileInfo: !data.audio || data.audio.indexOf('[') === -1 ? null : JSON.parse(data.audio)[0],
                    vmUrl: !data.coverPic || !JSON.parse(data.coverPic).video_m ? '' : JSON.parse(data.coverPic).video_m,
                    vpcUrl: !data.coverPic || !JSON.parse(data.coverPic).video_pc ? '' : JSON.parse(data.coverPic).video_pc
                })
                // 音频
                let audioData = !data.audio || data.audio.indexOf('[') === -1 ? null : JSON.parse(data.audio)[0]
                if (!audioData) {
                } else {
                    let uploadAudio = this.uploadAudio
                    let uploadAudioData = uploadAudio.state.uploadData
                    uploadAudio.setState({
                        uploadData: {
                            ...uploadAudioData,
                            fileName: !audioData.fileName ? '' : audioData.fileName,
                            url: !audioData.fileUrl ? '' : audioData.fileUrl,
                            isFinish: !!audioData.fileUrl
                        }
                    })
                }

                // 视频
                let videoData = !data.video || data.video.indexOf('[') === -1 ? null : JSON.parse(data.video)[0]
                if (!videoData) {
                } else {
                    let uploadVideo = this.uploadVideo
                    let uploadVideoData = uploadVideo.state.uploadData
                    uploadVideo.setState({
                        uploadData: {
                            ...uploadVideoData,
                            fileName: !videoData.fileName ? '' : videoData.fileName,
                            url: !videoData.fileUrl ? '' : videoData.fileUrl,
                            isFinish: !!videoData.fileUrl
                        }
                    })
                }
            }))
        } else {
            this.setState({
                loading: false
            })
            sessionStorage.setItem('hx_content', '')
        }
    }

    // 频道改变
    channelIdChange = (e) => {
        this.setState({
            channelId: e.target.value
        })
    }

    cateIdChange = (e) => {
        this.setState({
            cateId: e.target.value
        })
    }

    /*
    // 标签设置
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag)
        this.setState({ tags })
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus())
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value })
    }

    handleInputConfirm = () => {
        const state = this.state
        const inputValue = state.inputValue
        let tags = state.tags
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue.slice(0, 20)]
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: ''
        })
    }

    saveInputRef = (input) => {
        this.input = input
    }
    */
    // 上传图片
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        if (file.hasOwnProperty('target')) {
            const type = file.target.getAttribute('data-type')
            if (this.state[type] !== '') {
                this.setState({
                    previewImage: this.state[type],
                    previewVisible: true
                })
            } else {
                message.info('请先上传图片')
            }
        } else {
            this.setState({
                previewImage: file.url || file.thumbUrl,
                previewVisible: true
            })
        }
    }

    // 异步判断图片分辨率
    file = (file) => {
        let data = new Promise((resolve) => {
            let reader = new FileReader()
            let image = new Image()
            reader.readAsDataURL(file)
            reader.onload = function (e) {
                let data = e.target.result
                image.src = data
            }
            resolve(image)
        })
        return data
    }

    image = (img) => {
        let image = new Promise((resolve) => {
            img.onload = function () {
                let width = img.width
                let height = img.height
                if (width <= 800 && height <= 800) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
        return image
    }

    beforeUpload = async (file) => {
        let res = await this.file(file).then(resolve => {
            return this.image(resolve)
        }).then(res => {
            return res
        })
        return res
    }

    handleChange = async ({ file, fileList }) => {
        if (file.status === 'removed') {
            this.setState({
                coverImgUrl: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 800 * 800, 请重新选择图片或使用统一上传!')
                return false
            }
        }
        this.setState({
            fileList: fileList
        })

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

    handlePcChange = async ({ file, fileList }) => {
        if (file.status === 'removed') {
            this.setState({
                pccoverImgUrl: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 800 * 800, 请重新选择图片或使用统一上传!')
                return false
            }
        }
        this.setState({
            pcfileList: fileList
        })

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pccoverImgUrl: file.response.obj
                })
            } if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pccoverImgUrl: '',
                    pcfileList: []
                })
            }
        }
    }

    handleMobileChange = async ({ file, fileList }) => {
        if (file.status === 'removed') {
            this.setState({
                mcoverImgUrl: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 800 * 800, 请重新选择图片或使用统一上传!')
                return false
            }
        }
        this.setState({
            mfileList: fileList
        })

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mcoverImgUrl: file.response.obj
                })
            } if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mcoverImgUrl: '',
                    mfileList: []
                })
            }
        }
    }

    handleMobileCommentChange = async ({ file, fileList }) => {
        if (file.status === 'removed') {
            this.setState({
                mccoverImgUrl: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 800 * 800, 请重新选择图片或使用统一上传!')
                return false
            }
        }
        this.setState({
            mcfileList: fileList
        })

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mccoverImgUrl: file.response.obj
                })
            } if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mccoverImgUrl: '',
                    mcfileList: []
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

    getReason = (e) => {
        this.setState({
            reason: e.target.value
        })
    }

    // 统一上传
    uploadAllImg = ({file, fileList}) => {
        const This = this
        this.setState({
            allfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                allfilelist: [],
                allcoverImgUrl: ''
            })

            this.state.cropImgRule.map(function (item, index) {
                This.setState({
                    [item.coverName]: '',
                    [item.coverList]: []
                })
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    allcoverImgUrl: file.response.obj,
                    uploadAllImgModal: true,
                    focusImg: -1
                }, () => {
                    const image = document.querySelector('#croppedImg')
                    image.src = file.thumbUrl

                    This.setState({
                        cropper: new Cropper(image, {
                            aspectRatio: this.state.ratio,
                            viewMode: 1,
                            crop: function (e) {
                                const cropper = this.cropper
                                const imageData = cropper.getCroppedCanvas({
                                    maxWidth: 640
                                })
                                const base64url = imageData.toDataURL('image/jpeg')

                                const $cropperWrap = $('.crop-preview-item')
                                const focusImg = This.state.focusImg
                                if (focusImg === -1) {
                                    $cropperWrap.each(function (item, index) {
                                        $(this).children('img').attr('src', base64url)
                                    })
                                } else {
                                    $cropperWrap.eq(focusImg).children('img').attr('src', base64url)
                                }
                            }
                        })
                    })
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    allcoverImgUrl: '',
                    allfileList: []
                })
            }
        }
    }

    changeActiveImg (e, item, index) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        if (index === this.state.focusImg) {
            return false
        }
        this.setState({
            ratio: item.ratio,
            focusImg: index
        }, () => {
            this.state.cropper.setAspectRatio(item.ratio)
        })
    }

    sureCropImg = () => {
        let count = 0
        const This = this
        this.setState({
            loading: true,
            uploadAllImgModal: false,
            confirmLoading: true
        })
        message.warning('上传中，请稍候！')
        this.state.cropper.destroy()
        $('.crop-preview-item').each(function (d, i) {
            setTimeout(() => {
                const coverName = $(this).data('type')
                const coverList = $(this).data('list')
                This.setState({
                    [coverName]: '',
                    [coverList]: []
                })
                let blob = dataURLtoBlob($(this).find('img').prop('src'))
                const formData = new FormData()
                formData.append('uploadFile', blob)
                $.ajax(`${URL}/pic/upload`, {
                    headers: {'Sign-Param': getSig()},
                    method: 'POST',
                    data: formData,
                    processData: false,
                    timeout: 30000,
                    contentType: false,
                    success: function (data) {
                        count += 1
                        if (count === 4) {
                            This.setState({
                                loading: false,
                                confirmLoading: false
                            })
                            message.success('上传完毕！')
                        }
                        This.setState({
                            [coverName]: data.obj,
                            [coverList]: [{
                                uid: 0,
                                name: 'xxx.png',
                                status: 'done',
                                url: data.obj
                            }]
                        }, function () {
                            // console.log(This.state[coverName])
                        })
                    },
                    error: function (XMLHttpRequest, status) {
                        This.setState({
                            confirmLoading: false,
                            loading: false
                        })
                        if (status === 'timeout') {
                            message.error('网络不稳定, 请检查网络后重新上传！')
                        } else {
                            message.error('上传发生错误, 请尝试重新上传！')
                        }
                        XMLHttpRequest.abort()
                    }
                })
            }, d * 500)
        })
    }

    uploadAllImgCancel = () => {
        this.setState({
            uploadAllImgModal: false
        })
        this.state.cropper.destroy()
    }

    // 提交
    handleSubmit = (e) => {
        let pt = Date.parse(this.props.form.getFieldValue('publishTime').format('YYYY-MM-DD HH:mm:ss'))
        let nt = Date.parse(new Date())
        const {vFileInfo, aFileInfo, vmUrl, vpcUrl} = this.state
        const _this = this
        const {newsInfo} = this.props
        let status = e.target.getAttribute('data-status')
        e.preventDefault()

        if (status === '2') {
            confirm({
                title: '提示',
                content: <div className="modal-input">
                    <span style={{marginRight: 10}}>请填写文章不通过原因：</span>
                    <TextArea rows={3} autoFocus onChange={(e) => { _this.getReason(e) }}/>
                </div>,
                onOk () {
                    _this.setState({
                        loading: true
                    })
                    if (_this.state.reason.trim() !== '') {
                        axiosAjax('POST', '/news/status', {
                            id: _this.props.newsInfo.id,
                            status: 2,
                            reason: _this.state.reason
                        }, (res) => {
                            if (res.code === 1) {
                                message.success('操作成功！')
                                hashHistory.push('/audit-list')
                            } else {
                                _this.setState({
                                    loading: false
                                })
                                message.error(res.msg)
                            }
                        })
                    } else {
                        _this.setState({
                            loading: false
                        })
                        message.error('原因不能为空!')
                    }
                }
            })
            return false
        }

        if ($('.simditor').find('img.uploading').length > 0) {
            message.warning('编辑器中图片正在上传, 请稍候提交!')
            return false
        }
        if (this.state.uploading) {
            message.warning('视频正在上传, 请稍候提交!')
            this.setState({
                iconLoading: false
            })
            return false
        }

        if (status === '3' && (pt <= nt)) {
            this.setState({
                iconLoading: false
            })
            message.warning('预发布新闻时间应 大于 当前时间，请重新设置!')
            return false
        }

        if (status === '1' && (pt > nt)) {
            this.setState({
                iconLoading: false
            })
            message.warning('直接发布新闻的时间应 小于等于 当前时间，请重新设置!')
            return false
        }
        this.props.form.setFieldsValue({
            original: this.state.original,
            // tags: this.state.tags.join(','),
            content: this.state.newsContent,
            pc_recommend: this.state.pccoverImgUrl,
            pc: this.state.coverImgUrl,
            wap_small: this.state.mcoverImgUrl,
            wap_big: this.state.mccoverImgUrl,
            video_pc: this.state.vpcUrl,
            video_m: this.state.vmUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && status !== '2') {
                values.publishTime = Date.parse(values['publishTime'].format('YYYY-MM-DD HH:mm:ss'))
                values.coverPic = JSON.stringify({
                    mainImg: isJsonString(newsInfo.coverPic) ? (JSON.parse(newsInfo.coverPic).mainImg || JSON.parse(newsInfo.coverPic).wap_big || '') : '',
                    pc_recommend: values.pc_recommend || '',
                    pc: values.pc,
                    wap_big: values.wap_big,
                    wap_small: values.wap_small
                })
                delete values.pc
                delete values.pc_recommend
                delete values.wap_big
                delete values.wap_small
                delete values.watermark
                delete values.alignLeft
                delete values.wordBreak
                values.id = this.props.location.query.id || ''
                values.status = status || 1
                if (vFileInfo) {
                    let coverPic = JSON.parse(values.coverPic)
                    coverPic = {
                        ...coverPic,
                        video_pc: vpcUrl,
                        video_m: vmUrl
                    }
                    values = {
                        ...values,
                        video: JSON.stringify([this.state.vFileInfo]),
                        coverPic: JSON.stringify(coverPic)
                    }
                } else {
                    values = {
                        ...values,
                        video: ''
                    }
                }
                if (aFileInfo) {
                    values = {
                        ...values,
                        audio: JSON.stringify([this.state.aFileInfo])
                    }
                } else {
                    values = {
                        ...values,
                        audio: ''
                    }
                }
                delete values.video_pc
                delete values.video_m
                !this.state.updateOrNot && delete values.id

                this.setState({
                    loading: true
                })
                axiosAjax('post', `${this.state.updateOrNot ? '/news/update' : '/news/add'}`, values, (res) => {
                    if (res.code === 1) {
                        _this.setState({
                            loading: false
                        })
                        if (parseInt(status) === 4) {
                            message.success('已存储到列表!')
                        } else {
                            message.success('操作成功！')
                        }
                        hashHistory.push('/audit-list')
                    } else {
                        _this.setState({
                            loading: false
                        })
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 发布
    sendPost = (sendData) => {
        const {wordBreak, alignLeft} = this.state
        let style = `<style type="text/css"> .details .details-cont p, p {word-break: ${wordBreak ? 'break-all !important' : 'normal'}; text-align: ${alignLeft ? 'left !important' : 'unset'}} p img {text-align: center !important;} </style>`
        let _data = {
            'newsTitle': sendData.postTitle || '',
            'newsContent': `<div class=${alignLeft ? 'simditorSupport' : ''}>${style}${sendData.postContent}</div>` || ''
        }
        this.setState({...this.state, ..._data})
    }

    // 内容格式化
    createMarkup (str) { return {__html: str} }

    handleCheck = (e) => {
        this.setState({
            previewVisible: true,
            previewImage: e.target.src
        })
    }

    // 上传图片组件
    FormItem = (imgName, label, imgUrl, newsInfo, fileList, changeEvent, size) => {
        const {updateOrNot} = this.state
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 20, offset: 1}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        return <FormItem
            {...formItemLayout}
            label={label}>
            <div className="dropbox">
                {getFieldDecorator(imgName, {
                    initialValue: (updateOrNot && newsInfo) ? fileList : '',
                    rules: [{required: true, message: `请上传${label}封面！`}]
                })(
                    <Upload
                        headers={{'Sign-Param': getSig()}}
                        action={`${URL}/pic/upload`}
                        name='uploadFile'
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={changeEvent}>
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                )}
                <Button
                    data-type={imgUrl}
                    onClick={this.handlePreview}
                    className="img-preview"
                    type="primary">预览</Button>
                <span className="cover-img-tip">用于 PC 端新闻封面展示, 建议尺寸: <font style={{color: 'red'}}>{size}</font></span>
            </div>
        </FormItem>
    }

    render () {
        const This = this
        const { getFieldDecorator } = this.props.form
        const { newsInfo } = this.props
        const { focusImg, allfileList, uploadAllImgModal, previewVisible, previewImage, fileList, pcfileList, mfileList, mcfileList, newsContent, updateOrNot, newsVisible } = this.state
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 20, offset: 1 }
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        // 获取内容并显示, 暂时这么写(已更新)
        // const hxContent = location.query.id ? JSON.parse(sessionStorage.getItem('hx_content')).content : ''

        return <div className="post-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="作者: "
                    >
                        {getFieldDecorator('author', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.author || ''}` : '',
                            rules: [{ required: true, message: '请输入作者！' }]
                        })(
                            <Input className="news-author" placeholder="请输入作者"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="来源: "
                    >
                        {getFieldDecorator('source', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.author || ''}` : '',
                            rules: [{ required: true, message: '请输入新闻来源！' }]
                        })(
                            <Input className="news-source" placeholder="请输入新闻来源"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否独家: "
                    >
                        {getFieldDecorator('original', {
                            initialValue: (updateOrNot && newsInfo.original) ? parseInt(newsInfo.original) === 1 : false, valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => { this.setState({original: checked ? 1 : 0}) }}
                                checkedChildren="是"
                                unCheckedChildren="否"
                            />
                        )}
                    </FormItem>
                    {this.props.channelList.length !== 0 && <FormItem {...formItemLayout} label="频道: ">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.channelId || '1'}` : '1'
                        })(
                            <RadioGroup
                                options={this.props.channelList}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>}

                    <FormItem {...formItemLayout} label="类别: ">
                        {getFieldDecorator('cateId', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.cateId}` : '1'
                        })(
                            <RadioGroup
                                options={cateIdOptions}
                                onChange={this.cateIdChange}
                                setFieldsValue={this.state.cateId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="发布日期: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择新闻发布时间！'}],
                            initialValue: (updateOrNot && newsInfo) ? moment(formatDate(newsInfo.publishTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="阅读数: "
                    >
                        {getFieldDecorator('hotCounts', {
                            initialValue: (updateOrNot && newsInfo) ? newsInfo.hotCounts : 0,
                            rules: [{ required: true, pattern: /^[0-9]+$/, message: '请输入不小于 0 的新闻阅读数量！' }]
                        })(
                            <Input className="news-source" placeholder="请输入新闻阅读数"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传音频: "
                    >
                        <div>
                            <UploadFile ref={(ref) => {
                                this.uploadAudio = ref
                            }} isBtn={false} setUrl={(url, name, fileInfo) => this.setState({'aUrl': url, 'aName': name, 'aFileInfo': fileInfo})} title=' 点击上传音频'/>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传视频: "
                    >
                        <div>
                            <UploadFile ref={(ref) => {
                                this.uploadVideo = ref
                            }} isBtn={false} setUrl={(url, name, fileInfo) => this.setState({'vUrl': url, 'vName': name, 'vFileInfo': fileInfo})} title=' 点击上传视频'/>
                        </div>
                    </FormItem>
                    {
                        !this.state.vFileInfo ? '' : (
                            <div>
                                <FormItem
                                    {...formItemLayout}
                                    label="视频M封面: "
                                >
                                    {getFieldDecorator('video_m', {
                                        initialValue: this.state.vmUrl,
                                        rules: [{ required: true, message: '请上传视频M封面！' }]
                                    })(
                                        <div className="upload-img-warp clearfix">
                                            <div className="upload-img-box">
                                                <UploadImg ref={(ref) => {
                                                }} url={this.state.vmUrl} setUrl={(url) => this.setState({'vmUrl': url})}/>
                                            </div>
                                            <span className="cover-img-tip">用于 M 端推荐位新闻封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="视频PC封面: "
                                >
                                    {getFieldDecorator('video_pc', {
                                        initialValue: this.state.vpcUrl,
                                        rules: [{ required: true, message: '请上传视频PC封面！' }]
                                    })(
                                        <div className="upload-img-warp clearfix">
                                            <div className="upload-img-box">
                                                <UploadImg ref={(ref) => {
                                                }} url={this.state.vpcUrl} setUrl={(url) => this.setState({'vpcUrl': url})}/>
                                            </div>
                                            <span className="cover-img-tip">用于 PC 端推荐位新闻封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span>
                                        </div>
                                    )}
                                </FormItem>
                            </div>
                        )
                    }
                    <FormItem
                        {...formItemLayout}
                        label="标题: "
                    >
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.title}` : '',
                            rules: [{ required: true, message: '请输入新闻标题！' }]
                        })(
                            <Input placeholder="新闻标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="核心关键词: ">
                        {getFieldDecorator('keyTags', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.keyTags || ''}` : '',
                            rules: [{required: false, message: '请输入核心关键词！'}]
                        })(
                            <Input placeholder="核心关键词"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="文章左对齐: ">
                        {getFieldDecorator('alignLeft', {
                            initialValue: false,
                            valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => {
                                    this.setState({alignLeft: checked ? 1 : 0}, () => {
                                        this.sendPost({
                                            postTitle: this.state.newsTitle,
                                            postContent: this.state.editor.getValue()
                                        })
                                    })
                                }}
                                checkedChildren="是"
                                unCheckedChildren="否"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="英文强制换行: ">
                        {getFieldDecorator('wordBreak', {
                            initialValue: false,
                            valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => {
                                    this.setState({wordBreak: checked ? 1 : 0}, () => {
                                        this.sendPost({
                                            postTitle: this.state.newsTitle,
                                            postContent: this.state.editor.getValue()
                                        })
                                    })
                                }}
                                checkedChildren="是"
                                unCheckedChildren="否"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="图片加水印: ">
                        {getFieldDecorator('watermark', {
                            initialValue: false,
                            valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => {
                                    checked ? Cookies.set('watermark', 1) : Cookies.set('watermark', 0)
                                }}
                                checkedChildren="是"
                                unCheckedChildren="否"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="内容: "
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && newsInfo) ? newsContent : '',
                            rules: [{ required: true, message: '请输入新闻内容！' }]
                        })(
                            <Input className="news" style={{display: 'none'}}/>
                        )}
                        <PostEditor
                            setSimditor={(editor) => { this.setState({editor}) }}
                            subSend={(data) => this.sendPost(data)} />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="标签: "
                    >
                        {getFieldDecorator('tags', {
                            initialValue: this.state.tags,
                            rules: [
                                {required: true, message: '至少输入一个标签！'}
                            ]
                        })(
                            <Input className="tag-item" placeholder="中文/英文/数字, 标签之间用英文逗号隔开!"/>
                        )}
                        {/*
                        <div>
                            {tags.map((tag, index) => {
                                const isLongTag = tag.length > 20
                                const tagElem = (
                                    <Tag color="blue" key={tag} closable={index !== -1} afterClose={() => this.handleClose(tag)}>
                                        {isLongTag ? `${tag.slice(0, 20)}` : tag}
                                    </Tag>
                                )
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem
                            })}
                            {inputVisible && (
                                <Input
                                    ref={this.saveInputRef}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && tags.length < 20 && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> New Tag
                                </Tag>
                            )}
                            <span>每个标签最多<font style={{color: 'red'}}> 20 </font>个字</span>
                        </div>
                        */}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="摘要: "
                    >
                        {getFieldDecorator('synopsis', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.synopsis}` : '',
                            rules: [{ max: 120, required: true, message: '请输入新闻内容摘要, 最多120字！' }]
                        })(
                            <TextArea className="news-summary" placeholder="新闻摘要, 最多120字"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="统一上传图片: ">
                        <div className="dropbox">
                            <Upload
                                headers={{'Sign-Param': getSig()}}
                                action={`${URL}/pic/upload`}
                                name='uploadFile'
                                listType="picture-card"
                                fileList={allfileList}
                                onPreview={this.handlePreview}
                                onChange={this.uploadAllImg}>
                                {allfileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            {isJsonString(newsInfo.coverPic) && JSON.parse(newsInfo.coverPic).mainImg && <p className="exImg">
                                <span>原封面图: </span>
                                <img onClick={this.handleCheck} src={JSON.parse(newsInfo.coverPic).mainImg} alt=""/>
                            </p>}
                        </div>
                    </FormItem>

                    {this.FormItem('pc', 'PC-封面', 'coverImgUrl', newsInfo, fileList, this.handleChange, '220px * 160px')}
                    {this.FormItem('pc_recommend', 'PC-推荐位', 'pccoverImgUrl', newsInfo, pcfileList, this.handlePcChange, '532px * 335px')}
                    {this.FormItem('wap_small', 'M-缩略图', 'mcoverImgUrl', newsInfo, mfileList, this.handleMobileChange, '164px * 124px')}
                    {this.FormItem('wap_big', 'M-轮播图', 'mccoverImgUrl', newsInfo, mcfileList, this.handleMobileCommentChange, '640px * 320px')}

                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" onClick={this.newsVisibleShow} className="preview" style={{marginRight: '10px', marginBottom: 10}}>新闻内容预览</Button>
                        <Button type="primary" data-status='1' onClick={this.handleSubmit} style={{marginRight: '10px', marginBottom: 10}}>审核通过</Button>
                        <Button type="primary" data-status='3' onClick={this.handleSubmit} style={{marginRight: '10px', marginBottom: 10}}>定时发表</Button>
                        <Button type="primary" data-status='4' onClick={this.handleSubmit} style={{marginRight: '10px', marginBottom: 10}}>暂存一下</Button>
                        <Button type="primary" data-status='2' onClick={this.handleSubmit} style={{marginRight: '10px', marginBottom: 10}}>审核驳回</Button>
                        <Button type="primary" className="cancel" style={{marginRight: '10px', marginBottom: 10}} onClick={() => { hashHistory.goBack() }}>取消</Button>
                    </FormItem>
                    <Modal visible={newsVisible} footer={null} className="newsModal" onCancel={this.newsVisibleHide} width={1000}>
                        <Row>
                            <Col className="previewNews simditor">
                                <p className="simditor-body" style={{padding: 10}} dangerouslySetInnerHTML={this.createMarkup(newsContent)}></p>
                            </Col>
                        </Row>
                    </Modal>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    {/* 图片剪裁 */}
                    <Modal
                        confirmLoading={this.state.confirmLoading}
                        height="700px"
                        width="1400px"
                        style={{top: '50px'}}
                        visible={uploadAllImgModal}
                        onOk={this.sureCropImg}
                        onCancel={this.uploadAllImgCancel}>
                        <div className="croper-wrap checkPost clearfix">
                            <div className="crop-img" id="cropImgWrap">
                                <img
                                    id="croppedImg"
                                    src=""
                                    alt="Picture"/>
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation()
                                    this.setState({
                                        focusImg: -1
                                    })
                                }}
                                className="crop-preview">
                                {this.state.cropImgRule.map(function (item, index) {
                                    return <div
                                        key={index}
                                        onClick={(e) => { This.changeActiveImg(e, item, index) }}
                                        className="cropper-intro">
                                        <div className={`cropper-item-wrap ${focusImg === index ? 'active' : ''}`}>
                                            <div
                                                data-type={item.coverName}
                                                data-list={item.coverList}
                                                className="crop-preview-item"
                                                style={{fontSize: 0, width: item.width, height: item.height}}>
                                                <img src="" alt=""/>
                                            </div>
                                        </div>
                                        <span>{item.intro}</span>
                                    </div>
                                })}
                            </div>
                        </div>
                    </Modal>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.articleAudit.userInfo,
        newsInfo: state.articleAudit.info,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(ArticleAuditSend))
