/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
// import html2canvas from 'html2canvas'
import Cropper from '../../../node_modules/cropperjs/dist/cropper.esm.js'
import '../../../node_modules/cropperjs/dist/cropper.css'

import {
    Form,
    Input,
    Upload,
    Icon,
    Modal,
    Button,
    Tag,
    Tooltip,
    message,
    Row,
    Col,
    Spin,
    DatePicker,
    Progress
} from 'antd'
import moment from 'moment'
import {getVideoItemInfo} from '../../actions/video/video.action'
import {axiosFormData, axiosAjax, URL, formatDate, isJsonString, getSig, dataURLtoBlob} from '../../public/index'
import './video.scss'
// import CropperImg from '../../components/CropperImg'

const FormItem = Form.Item
const {TextArea} = Input

let uploadId = ''
let currIndex = 1
let pause = false

class VideoSend extends Component {
    constructor (props) {
        super(props)
        this.state = {
            updateOrNot: false,
            topOrder: 0,
            tags: [],
            videofileList: [],
            videoList: [],
            inputVisible: false,
            inputValue: '',
            channelId: '1',
            newsVisible: false,
            cateId: '1',
            previewVisible: false,
            previewImage: '',
            videoUrl: '',
            uploading: false,
            progressNum: 0,
            loading: true,
            original: 0,
            subject: 0,
            uploadAllImgModal: false,
            cropper: null,
            focusImg: -1,
            confirmLoading: false,
            ratio: 640 / 360,
            cropImgRule: [
                {
                    coverName: 'mcoverImgUrl',
                    coverList: 'mfileList',
                    width: '320px',
                    height: '180px',
                    ratio: 640 / 360,
                    intro: 'M端视频封面:640 * 360'
                }, {
                    coverName: 'pccoverImgUrl',
                    coverList: 'pcfileList',
                    width: '285px',
                    height: '160px',
                    ratio: 285 / 160,
                    intro: 'PC端推荐位视频封面:285 * 160'
                }, {
                    coverName: 'coverImgUrl',
                    coverList: 'fileList',
                    width: '285px',
                    height: '160px',
                    ratio: 285 / 160,
                    intro: 'PC 端视频封面:285 * 160'
                }, {
                    coverName: 'mccoverImgUrl',
                    coverList: 'mcfileList',
                    width: '320px',
                    height: '180px',
                    ratio: 640 / 360,
                    intro: 'M端推荐位视频封面:640 * 360'
                }
            ]
        }
    }

    insertState = (arr) => {
        arr.map((item) => {
            this.state[item + 'fileList'] = []
            this.state[item + 'coverImgUrl'] = ''
        })
    }

    componentWillMount () {
        this.insertState(['videoPc', 'videoM', 'all', '', 'pc', 'm', 'mc'])
    }

    componentDidMount () {
        const {dispatch, location} = this.props
        if (location.query.id || location.query.url) {
            dispatch(getVideoItemInfo({'id': location.query.id}, (res) => { this.renderData(res) }))
        } else {
            this.setState({
                loading: false
            })
            sessionStorage.setItem('hx_content', '')
        }
    }

    fileList = (picJson, imgUrl) => {
        if (picJson[imgUrl] && picJson[imgUrl] !== '') {
            return [{
                uid: 0,
                name: 'xxx.png',
                status: 'done',
                url: picJson[imgUrl]
            }]
        } else {
            return []
        }
    }

    renderData = (data) => {
        let coverPic = isJsonString(data.coverPic) ? JSON.parse(data.coverPic) : {
            pc_recommend: '',
            pc: '',
            wap_big: '',
            wap_small: '',
            video_pc: '',
            video_m: ''
        }
        let pcfileList = this.fileList(coverPic, 'pc_recommend')
        let videoPcfileList = this.fileList(coverPic, 'video_pc')
        let videoMfileList = this.fileList(coverPic, 'video_m')
        let fileList = this.fileList(coverPic, 'pc')
        let mfileList = this.fileList(coverPic, 'wap_small')
        let mcfileList = this.fileList(coverPic, 'wap_big')

        this.setState({
            updateOrNot: true,
            videoPcfileList: videoPcfileList,
            videoMfileList: videoMfileList,
            fileList: fileList,
            pcfileList: pcfileList,
            mfileList: mfileList,
            mcfileList: mcfileList,
            videofileList: isJsonString(data.url) ? JSON.parse(data.url) : [],
            tags: !data.tags ? [] : data.tags.split(','),
            newsContent: data.content,
            coverImgUrl: coverPic.pc,
            allcoverImgUrl: coverPic.all,
            pccoverImgUrl: coverPic.pc_recommend || '',
            mcoverImgUrl: coverPic.wap_small,
            mccoverImgUrl: coverPic.wap_big,
            videoMcoverImgUrl: coverPic.video_m,
            videoPccoverImgUrl: coverPic.video_pc,
            videoUrl: isJsonString(data.url) ? JSON.parse(data.url)[0].fileUrl : '',
            loading: false,
            original: data.original || 0,
            subject: data.subject || 1,
            topOrder: data.topOrder || 0
        })
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

    // 标签设置
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag)
        this.setState({tags})
    }

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus())
    }

    handleInputChange = (e) => {
        this.setState({inputValue: e.target.value})
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

    // 上传图片预览
    handleCancel = () => this.setState({previewVisible: false})

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

    // pc 图片上传
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

    // pc 视频展示图上传
    handleVideoPcChange = ({file, fileList}) => {
        this.setState({
            videoPcfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                videoPccoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    videoPccoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    videoPccoverImgUrl: '',
                    videoPcfileList: []
                })
            }
        }
    }

    // 手机端视频展示图上传
    handleVideoMChange = ({file, fileList}) => {
        this.setState({
            videoMfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                videoMcoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    videoMcoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    videoMcoverImgUrl: '',
                    videoMfileList: []
                })
            }
        }
    }

    // pc 推荐位展示图上传
    handlePcChange = ({file, fileList}) => {
        this.setState({
            pcfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pccoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pccoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pccoverImgUrl: '',
                    pcfileList: []
                })
            }
        }
    }

    // 手机端展示图上传
    handleMobileChange = ({file, fileList}) => {
        this.setState({
            mfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mcoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mcoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mcoverImgUrl: '',
                    mfileList: []
                })
            }
        }
    }

    // 手机端推荐展示图上传
    handleMobileCommentChange = ({file, fileList}) => {
        this.setState({
            mcfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mccoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mccoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mccoverImgUrl: '',
                    mcfileList: []
                })
            }
        }
    }

    // pcSubjectfileList: [],
    // mSubjectfileList: [],
    // pcHotSubjectfileList: [],
    // mHotSubjectfileList: [],
    // pcSubjectcoverImgUrl: '',
    // mSubjectcoverImgUrl: '',
    // pcHotSubjectcoverImgUrl: '',
    // mHotSubjectcoverImgUrl: '',

    // 大文件上传
    handleUpload = () => {
        const {videoList} = this.state
        let file = videoList[0]
        let totalSize = file.size // 文件大小
        let blockSize = 1024 * 1024 * 2 // 块大小
        let blockCount = Math.ceil(totalSize / blockSize) // 总块数
        // 创建FormData对象
        let formData = new FormData()
        formData.append('fileName', file.name) // 文件名
        formData.append('blockCount', blockCount) // 总块数
        formData.append('currIndex', currIndex) // 当前上传的块下标
        formData.append('uploadId', uploadId) // 上传编号
        formData.append('uploadFile', null)
        formData.append('type', 'video')
        this.setState({
            uploading: true
        })
        this.UploadVideo(file, formData, totalSize, blockCount, blockSize)
    }

    UploadVideo = (file, formData, totalSize, blockCount, blockSize) => {
        if (pause) {
            return // 暂停
        }
        try {
            let start = (currIndex - 1) * blockSize
            let end = Math.min(totalSize, start + blockSize)
            let uploadFile = file.slice(start, end)
            formData.set('uploadFile', uploadFile)
            formData.set('currIndex', currIndex)
            formData.set('uploadId', uploadId)

            axiosFormData('post', '/file/upload', formData, (res) => {
                if (res.request) {
                    clearInterval(this.timeOut)
                    this.timeOut = setTimeout(() => {
                        this.UploadVideo(file, formData, totalSize, blockCount, blockSize)
                    }, 10000)
                    return false
                }
                if (res.response) {
                    if (/^(5|4)\d{2}/.test(res.response.status)) {
                        clearInterval(this.timeOut)
                        this.timeOut = setTimeout(() => {
                            this.UploadVideo(file, formData, totalSize, blockCount, blockSize)
                        }, 10000)
                    }
                    return false
                }
                if (res.code === 1) {
                    clearInterval(this.timeOut)
                    if (currIndex === 1) {
                        uploadId = res.obj
                    }
                    let num = currIndex / blockCount * 100
                    if ((currIndex + 1) === blockCount) {
                        num = 99
                    }
                    this.setState({
                        progressNum: parseFloat(num.toFixed(2))
                    })
                    if (currIndex < blockCount) {
                        currIndex = currIndex + 1
                        this.UploadVideo(file, formData, totalSize, blockCount, blockSize)
                    }
                } else if (res.code < 0) {
                    uploadId = ''
                    currIndex = 1
                    message.error(res.msg)
                } else if (res.code === 2) {
                    clearInterval(this.timeOut)
                    uploadId = ''
                    currIndex = 1
                    let {videofileList} = this.state
                    let newVideoFile = []
                    videofileList.map((item, index) => {
                        newVideoFile.push({
                            uid: item.uid,
                            fileName: item.name,
                            name: item.name,
                            fileUrl: res.obj
                        })
                    })
                    this.setState({
                        videoUrl: res.obj,
                        videoList: [],
                        videofileList: newVideoFile,
                        uploading: false
                    })
                    message.success('文件上传成功!')
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    newsVisibleHide = () => {
        this.setState({newsVisible: false})
    }

    newsVisibleShow = () => {
        this.setState({newsVisible: true})
    }

    delVideo = () => {
        this.setState({
            videofileList: []
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
                            crop: function (e) {
                                const cropper = this.cropper
                                const imageData = cropper.getCroppedCanvas()
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
            uploadAllImgModal: false,
            confirmLoading: true,
            loading: true
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
                    timeout: 30000,
                    processData: false,
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
        e.preventDefault()
        let status = e.target.getAttribute('data-status')
        if (this.state.uploading) {
            message.warning('视频正在上传, 请稍候提交!')
            return false
        }

        let pt = Date.parse(this.props.form.getFieldValue('publishTime').format('YYYY-MM-DD HH:mm:ss'))
        let nt = Date.parse(new Date())

        if (status === '3' && (pt <= nt)) {
            message.warning('预发布时间应 大于 当前时间，请重新设置!')
            return false
        }

        if (status === '1' && (pt > nt)) {
            message.warning('直接发布的时间应 小于等于 当前时间，请重新设置!')
            return false
        }

        this.props.form.setFieldsValue({
            tags: this.state.tags.join(','),
            // original: this.state.original,
            // subject: this.state.subject,
            pc_recommend: this.state.pccoverImgUrl,
            pc: this.state.coverImgUrl,
            wap_small: this.state.mcoverImgUrl,
            wap_big: this.state.mccoverImgUrl,
            url: this.state.videofileList[0] && this.state.videofileList[0].fileUrl ? JSON.stringify(this.state.videofileList) : ''
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                // values.publishTime = Date.parse(values['publishTime'].format('YYYY-MM-DD HH:mm:ss'))
                values.coverPic = JSON.stringify({
                    pc_recommend: values.pc_recommend || '',
                    pc: values.pc,
                    wap_big: values.wap_big,
                    wap_small: values.wap_small,
                    video_pc: this.state.videoPccoverImgUrl,
                    video_m: this.state.videoMcoverImgUrl
                })
                values.publishTime = Date.parse(values['publishTime'].format('YYYY-MM-DD HH:mm:ss'))
                values.createdBy = 'fff9d400cb94444fadaefd429516c276'
                values.topOrder = this.state.topOrder
                delete values.pc
                delete values.pc_recommend
                delete values.wap_big
                delete values.wap_small
                delete values.video_pc
                delete values.video_m
                values.id = this.props.location.query.id || ''
                values.status = status === '0' ? '0' : 1
                !(this.state.updateOrNot && this.props.location.query.id) && delete values.id
                axiosAjax('post', `${(this.state.updateOrNot && this.props.location.query.id) ? '/video/updatevideo' : '/video/addvideo'}`, values, (res) => {
                    this.setState({
                        loading: false
                    })
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.push('/video-list')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 发布
    sendVideo = (sendData) => {
        let _data = {
            'newsTitle': sendData.postTitle || '',
            'newsContent': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    CropperImgCroped = (imgUrl) => {
        console.log(imgUrl)
    }

    // 上传图片组件
    FormItem = (require, imgName, label, imgUrl, newsInfo, fileList, changeEvent, size, noBtn) => {
        const {updateOrNot} = this.state
        const {getFieldDecorator} = this.props.form
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

        return <FormItem
            {...formItemLayout}
            label={label}>
            <div className="dropbox">
                {getFieldDecorator(imgName, {
                    initialValue: (updateOrNot && newsInfo) ? fileList : '',
                    rules: [{required: require, message: `请上传${label}封面！`}]
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
                {noBtn ? '' : <Button
                    data-type={imgUrl}
                    onClick={this.handlePreview}
                    className="img-preview"
                    type="primary">预览</Button>}
                <span className="cover-img-tip">用于 {label} 的封面展示, 建议尺寸: <font style={{color: 'red'}}>{size}</font></span>
            </div>
        </FormItem>
    }

    render () {
        const This = this
        const {getFieldDecorator} = this.props.form
        const {newsInfo} = this.props
        const {focusImg, allfileList, uploadAllImgModal, progressNum, videoPcfileList, videoMfileList, videofileList, uploading, previewVisible, previewImage, fileList, pcfileList, mfileList, mcfileList, tags, inputVisible, inputValue, newsContent, updateOrNot, newsVisible} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 15, offset: 1}
        }
        const props = {
            action: '/file/upload',
            onRemove: (file) => {
                this.setState(({fileList}) => {
                    const index = fileList.indexOf(file)
                    const newFileList = fileList.slice()
                    newFileList.splice(index, 1)
                    return {
                        videoList: newFileList,
                        videofileList: newFileList
                    }
                })
            },
            beforeUpload: (file) => {
                this.setState({
                    videoList: [file],
                    videofileList: [file]
                })
                return false
            },
            fileList: this.state.videofileList
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        return <div className="video-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="作者: ">
                        {getFieldDecorator('author', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.author}` : '',
                            rules: [{required: true, message: '请输入视频作者！'}]
                        })(
                            <Input ref={(input) => {
                                this.authorInput = input
                            }} className="news-author" placeholder="请输入视频作者"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="来源: "
                    >
                        {getFieldDecorator('source', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.source || ''}` : '',
                            rules: [{required: true, message: '请输入视频来源！'}]
                        })(
                            <Input className="news-source" placeholder="请输入视频来源"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="发布日期: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择视频发布时间！'}],
                            initialValue: (updateOrNot && newsInfo) ? moment(formatDate(newsInfo.publishTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="视频上传">
                        {getFieldDecorator('url', {
                            rules: [{required: true, message: '请上传视频！'}]
                        })(
                            <Upload {...props} name='uploadFile'>
                                <Button><Icon type="upload"/> 选择视频</Button>
                            </Upload>
                        )}
                        {(() => {
                            if (videofileList.length === 0) {
                                return ''
                            } else if (videofileList[0].fileName) {
                                return <div>
                                    <video controls style={{width: 200}} src={this.state.videoUrl} />
                                    <p>
                                        <span>{videofileList[0].fileName}</span>
                                        <span
                                            onClick={this.delVideo}
                                            style={{marginLeft: 15, color: '#52b8fc', cursor: 'pointer'}}>删除</span>
                                    </p>
                                </div>
                            }
                        })()}
                        <Button
                            style={{marginTop: 16}}
                            className="upload-demo-start"
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={this.state.videoList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? '上传中' : '开始上传'}
                        </Button>
                        {uploading &&
                        <Progress
                            strokeWidth={5} style={{width: 300, display: 'block'}}
                            percent={progressNum}
                            status="active"/>}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="PC播放器封面: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('video_pc', {
                                initialValue: (updateOrNot && newsInfo) ? videoPcfileList : '',
                                rules: [{required: true, message: '请上传视频 PC 端播放器封面！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={videoPcfileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleVideoPcChange}
                                >
                                    {videoPcfileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">用于 PC 端视频播放器的封面展示, 建议尺寸: <font style={{color: 'red'}}>850 * 480</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="M播放器封面: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('video_m', {
                                initialValue: (updateOrNot && newsInfo) ? videoMfileList : '',
                                rules: [{required: true, message: '请上传视频 M 端播放器封面！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={videoMfileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleVideoMChange}
                                >
                                    {videoMfileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">用于 M 端视频播放器的封面展示, 建议尺寸: <font style={{color: 'red'}}>640 * 视频高</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="视频标题: ">
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.title}` : '',
                            rules: [{required: true, message: '请输入视频标题！'}]
                        })(
                            <Input placeholder="请输入视频标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="视频简介: "
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.content}` : '',
                            rules: [{required: true, message: '请输入视频简介'}]
                        })(
                            <TextArea className="news-summary" placeholder="请输入视频简介" rows={4}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="标签: "
                    >
                        {getFieldDecorator('tags', {
                            initialValue: this.state.tags.join(','),
                            rules: [{required: true, message: '至少输入一个标签！'}]
                        })(
                            <Input className="tag-item" style={{display: 'none'}}/>
                        )}
                        <div>
                            {tags.map((tag, index) => {
                                const isLongTag = tag.length > 20
                                const tagElem = (
                                    <Tag
                                        color="blue" key={tag} closable={index !== -1}
                                        afterClose={() => this.handleClose(tag)}>
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
                                    style={{width: 120}}
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && tags.length < 20 && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{background: '#fff', borderStyle: 'dashed'}}
                                >
                                    <Icon type="plus"/> New Tag
                                </Tag>
                            )}
                            <span>建议每条视频最多 <font style={{color: 'red'}}>20</font> 个标签, 每个标签最多<font
                                style={{color: 'red'}}> 20 </font>个字</span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="热度: "
                    >
                        {getFieldDecorator('hotCounts', {
                            initialValue: (updateOrNot && newsInfo) ? (newsInfo.hotCounts || 0) : 0,
                            rules: [{required: true, pattern: /^[0-9]+$/, message: '请输入视频热度值(正整数)！'}]
                        })(
                            <Input className="news-source" placeholder="请输入视频热度值"/>
                        )}
                    </FormItem>

                    {/** 是否独家
                    <FormItem
                        {...formItemLayout}
                        label="是否独家: "
                    >
                        {getFieldDecorator('original', {
                            initialValue: (updateOrNot && newsInfo.original) ? parseInt(newsInfo.original) === 1 : false,
                            valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => {
                                    this.setState({original: checked ? 1 : 0})
                                }}
                                checkedChildren="是"
                                unCheckedChildren="否"
                            />
                        )}
                    </FormItem>
                    */}
                    {/** 频道和类别
                    <FormItem {...formItemLayout} label="频道: ">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.channelId || '1'}` : '1'
                        })(
                            <RadioGroup
                                options={channelIdOptions}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类别: ">
                        {getFieldDecorator('cateId', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.cateId || '2'}` : '1'
                        })(
                            <RadioGroup
                                options={cateIdOptions}
                                onChange={this.cateIdChange}
                                setFieldsValue={this.state.cateId}>
                            </RadioGroup>
                        )}
                    </FormItem>
                    */}

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
                            <span className="cover-img-tip all-img">统一上传所有尺寸图片，自动剪裁适配尺寸</span>
                        </div>
                    </FormItem>

                    {this.FormItem(true, 'pc', 'PC列表缩略图', 'coverImgUrl', newsInfo, fileList, this.handleChange, '285 * 160')}
                    {this.FormItem(false, 'pc_recommend', 'PC-推荐位', 'pccoverImgUrl', newsInfo, pcfileList, this.handlePcChange, '285 * 160 (暂定)')}
                    {this.FormItem(true, 'wap_small', 'M列表缩略图', 'mcoverImgUrl', newsInfo, mfileList, this.handleMobileChange, '640 * 360')}
                    {this.FormItem(false, 'wap_big', 'M-推荐位', 'mccoverImgUrl', newsInfo, mcfileList, this.handleMobileCommentChange, '640 * 360(暂定)')}

                    <FormItem
                        wrapperCol={{span: 12, offset: 2}}
                    >
                        <Button
                            type="primary" data-status='1' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>发表</Button>
                        <Button
                            type="primary" data-status='3' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>定时发表</Button>
                        <Button
                            type="primary" data-status='0' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>存为草稿</Button>
                        <Button
                            type="primary" className="cancel"
                            onClick={() => {
                                hashHistory.goBack()
                            }}>取消</Button>
                    </FormItem>

                    {/* 图片剪裁 */}
                    <Modal
                        confirmLoading={this.state.confirmLoading}
                        height="700px"
                        width="1280px"
                        style={{top: '50px'}}
                        visible={uploadAllImgModal}
                        onOk={this.sureCropImg}
                        onCancel={this.uploadAllImgCancel}>
                        <div className="croper-wrap video clearfix">
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
                                                style={{width: item.width, height: item.height}}>
                                                <img src="" alt=""/>
                                            </div>
                                        </div>
                                        <span>{item.intro}</span>
                                    </div>
                                })}
                            </div>
                        </div>
                    </Modal>

                    {/* 内容编辑 */}
                    <Modal
                        visible={newsVisible} footer={null} className="newsModal" onCancel={this.newsVisibleHide}
                        width={1000}>
                        <Row>
                            <Col
                                className="previewNews simditor">
                                <p
                                    className="simditor-body"
                                    style={{padding: 10}}
                                    dangerouslySetInnerHTML={this.createMarkup(newsContent)}/>
                            </Col>
                        </Row>
                    </Modal>

                    {/* 图片预览 */}
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.videoInfo.userInfo,
        newsInfo: state.videoInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(VideoSend))
