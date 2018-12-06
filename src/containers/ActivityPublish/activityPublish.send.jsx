/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
// import html2canvas from 'html2canvas'
import PostEditor from '../../components/postEditor'
import Cropper from '../../../node_modules/cropperjs/dist/cropper.esm.js'
import '../../../node_modules/cropperjs/dist/cropper.css'

import {
    Radio,
    Form,
    Input,
    Upload,
    Icon,
    Modal,
    Button,
    // Tag,
    // Tooltip,
    message,
    Row,
    Col,
    Spin,
    DatePicker,
    // Progress,
    Switch
} from 'antd'
import moment from 'moment'
import Cookies from 'js-cookie'
import {getActivityPublishItemInfo} from '../../actions/activity/activityPublish.action'
import {getActivityCityList} from '../../actions/index'
import {axiosFormData, axiosAjax, URL, formatDate, isJsonString, getSig, dataURLtoBlob} from '../../public/index'
import './index.scss'
// import CropperImg from '../../components/CropperImg'

const FormItem = Form.Item
const {TextArea} = Input
const RadioGroup = Radio.Group
const {RangePicker} = DatePicker

const placeTypeOptions = [
    {label: '国内', value: '1'},
    {label: '海外', value: '2'}
]

let uploadId = ''
let currIndex = 1
let pause = false

class ActivityPublishSend extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editor: '',
            updateOrNot: false,
            tags: [],
            mp3fileList: [],
            videofileList: [],
            videoList: [],
            audioDefalutArr: [],
            inputVisible: false,
            inputValue: '',
            isLogin: false,
            place: '北京',
            newsVisible: false,
            placeType: '1',
            previewVisible: false,
            previewImage: '',
            newsTitle: '',
            newsContent: '',
            mp3Url: '',
            videoUrl: '',
            uploading: false,
            progressNum: 0,
            loading: true,
            recommend: 0,
            advertised: 0,
            subject: 0,
            uploadAllImgModal: false,
            cropper: null,
            focusImg: -1,
            ratio: 2,
            cropImgRule: [
                {
                    coverName: 'pcImg',
                    coverList: 'pcfileList',
                    width: '800px',
                    height: '200px',
                    ratio: 800 / 200,
                    intro: 'PC端推荐位新闻封面:1200 * 300'
                }, {
                    coverName: 'mcImg',
                    coverList: 'mcfileList',
                    width: '320px',
                    height: '230px',
                    ratio: 640 / 460,
                    intro: 'M端推荐新闻的滚动:640 * 460'
                }, {
                    coverName: 'Img',
                    coverList: 'fileList',
                    width: '256px',
                    height: '186px',
                    ratio: 385 / 280,
                    intro: 'PC 端新闻封面:385 * 280'
                }, {
                    coverName: 'mImg',
                    coverList: 'mfileList',
                    width: '200px',
                    height: '145px',
                    ratio: 255 / 185,
                    intro: 'M端新闻封面:255 * 185'
                }
            ],
            width: 0,
            height: 0,
            wordBreak: 0,
            alignLeft: 0,
            iconLoading: false,
            interval: 0
        }
    }

    enterIconLoading = () => {
        this.setState({ iconLoading: true })
    }

    // 上传图片时插入state
    insertState = (arr) => {
        arr.map((item) => {
            this.state[item + 'fileList'] = []
            this.state[item + 'Img'] = ''
        })
    }

    componentWillMount () {
        Cookies.set('watermark', 0)
        this.insertState(['mHotSubject', 'pcHotSubject', 'mSubject', 'pcSubject', 'videoPc', 'videoM', 'all', '', 'pc', 'm', 'mc'])
    }

    componentDidMount () {
        const {dispatch, location} = this.props
        dispatch(getActivityCityList())
        if (location.query.id) {
            this.setState({
                loading: true
            })
            dispatch(getActivityPublishItemInfo({'id': location.query.id}, (res) => { this.renderData(res) }))
        } else {
            this.setState({
                loading: false
            })
            /*
            if (!localStorage.getItem('articleData')) {
                this.setState({
                    loading: false
                })
            } else {
                setTimeout(() => {
                    dispatch(getLocalInfo({}, (res) => {
                        this.renderData(res)
                    }))
                }, 500)
            }
            // this.setState({interval: setInterval(() => {
            //     this.saveArticle()
            //     console.log('已存储！')
            // }, 5 * 1000)})
             */
        }

        // this.props.router.setRouteLeaveHook(
        //     this.props.route,
        //     this.routerWillLeave
        // )
    }

    routerWillLeave = () => { return '离开页面可能会导致编辑内容丢失, 是否确认离开?' }

    componentWillUnmount () {
        const {interval} = this.state
        this.setState({interval: clearInterval(interval)})
    }

    // 本地存储
    saveArticle = (fn) => {
        const {form} = this.props
        let subject = null
        if (parseInt(this.state.subject) === 1) {
            subject = {
                pc_subject: this.state.pcSubjectImg,
                m_subject: this.state.mSubjectImg,
                pc_hot_subject: this.state.pcHotSubjectImg,
                m_hot_subject: this.state.mHotSubjectImg
            }
        } else {
            subject = {}
        }
        let articleData = {
            ...subject,
            tags: this.state.tags.join(','),
            original: this.state.original,
            subject: this.state.subject,
            content: this.state.newsContent,
            audio: JSON.stringify(this.state.audioDefalutArr),
            video: this.state.videofileList[0] && this.state.videofileList[0].fileUrl ? JSON.stringify(this.state.videofileList) : '[]',
            // publishTime: Date.parse(form.getFieldValue('publishTime').format('YYYY-MM-DD HH:mm:ss')) || Date.parse(new Date()),
            author: form.getFieldValue('author'),
            hotCounts: form.getFieldValue('hotCounts'),
            synopsis: form.getFieldValue('synopsis'),
            title: form.getFieldValue('title'),
            source: form.getFieldValue('source'),
            advertised: form.getFieldValue('advertised'),
            subTitle: form.getFieldValue('subTitle'),
            originalUrl: form.getFieldValue('originalUrl'),
            originalTitle: form.getFieldValue('originalTitle'),
            placeType: this.state.placeType,
            place: this.state.place,
            coverPic: JSON.stringify({
                pc_recommend: this.state.pcImg,
                pc: this.state.Img,
                wap_small: this.state.mImg,
                wap_big: this.state.mcImg,
                video_pc: this.state.videoPcImg,
                video_m: this.state.videoMImg,
                ...subject
            })
        }
        localStorage.setItem('articleData', JSON.stringify(articleData))
        if (fn) {
            fn(articleData)
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
        // sessionStorage.setItem('hx_content', JSON.stringify(data))
        let filterContent = data.content.replace(/<style(.+)<\/style>/, '')
        this.state.editor.setValue(filterContent)
        let coverPic = isJsonString(data.coverPic) ? JSON.parse(data.coverPic) : {
            pc_recommend: '',
            pc: '',
            wap_big: '',
            wap_small: '',
            video_pc: '',
            video_m: ''
        }
        let videoPcfileList = this.fileList(coverPic, 'video_pc')
        let videoMfileList = this.fileList(coverPic, 'video_m')
        let pcfileList = this.fileList(coverPic, 'pc_recommend')
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
            // audioDefalutArr: isJsonString(data.audio) ? JSON.parse(data.audio) : [],
            videofileList: isJsonString(data.video) ? JSON.parse(data.video) : [],
            // tags: !data.tags ? [] : data.tags.split(','),
            newsContent: filterContent,
            Img: coverPic.pc,
            allImg: coverPic.all,
            pcImg: coverPic.pc_recommend || '',
            mImg: coverPic.wap_small,
            mcImg: coverPic.wap_big,
            videoMImg: coverPic.video_m,
            videoPcImg: coverPic.video_pc,
            // mp3Url: data.audio || '',
            videoUrl: data.video || '',
            loading: false,
            recommend: data.recommend || 0,
            placeType: data.placeType
        })
    }

    // 频道改变
    placeChange = (e) => {
        this.setState({
            place: e.target.value
        })
    }

    placeTypeChange = (e) => {
        const {form} = this.props
        if (e.target.value === '1') {
            form.setFieldsValue({
                placeType: '1'
            })
        } else {
            form.setFieldsValue({
                placeType: '2'
            })
        }
        this.setState({
            placeType: e.target.value
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
            tags = [...tags, inputValue.slice(0, 8)]
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
                if (width <= 1300 && height <= 1300) {
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

    // pc 图片上传
    handleChange = async ({file, fileList}) => {
        if (file.status === 'removed') {
            this.setState({
                Img: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 1300 * 1300, 请重新选择图片或使用统一上传!')
                return false
            }
        }
        this.setState({
            fileList: fileList
        })
        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    Img: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    Img: '',
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
                videoPcImg: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    videoPcImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    videoPcImg: '',
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
                videoMImg: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    videoMImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    videoMImg: '',
                    videoMfileList: []
                })
            }
        }
    }

    // pc 推荐位展示图上传
    handlePcChange = async ({file, fileList}) => {
        if (file.status === 'removed') {
            this.setState({
                pcImg: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 1300 * 1300, 请重新选择图片或使用统一上传!')
                return false
            }
        }

        this.setState({
            pcfileList: fileList
        })

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcImg: '',
                    pcfileList: []
                })
            }
        }
    }

    // 手机端展示图上传
    handleMobileChange = async ({file, fileList}) => {
        if (file.status === 'removed') {
            this.setState({
                mImg: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 1300 * 1300, 请重新选择图片或使用统一上传!')
                return false
            }
        }

        this.setState({
            mfileList: fileList
        })

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mImg: '',
                    mfileList: []
                })
            }
        }
    }

    // 手机端推荐展示图上传
    handleMobileCommentChange = async ({file, fileList}) => {
        if (file.status === 'removed') {
            this.setState({
                mcImg: ''
            })
        } else {
            let sizeSuit = await this.beforeUpload(file.originFileObj)
            if (!sizeSuit) {
                message.warning('单张图片上传尺寸不能大于 1300 * 1300, 请重新选择图片或使用统一上传!')
                return false
            }
        }
        this.setState({
            mcfileList: fileList
        })

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mcImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mcImg: '',
                    mcfileList: []
                })
            }
        }
    }

    // 音频上传
    handleMp3 = ({file, fileList}) => {
        if (file.response) {
            if (file.response.code === 1) {
                this.setState({
                    mp3fileList: fileList
                }, function () {
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
            }
        }
    }

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
        this.UploadPost(file, formData, totalSize, blockCount, blockSize)
    }

    UploadPost = (file, formData, totalSize, blockCount, blockSize) => {
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
                if (res.code === 1) {
                    if (currIndex === 1) {
                        uploadId = res.obj
                    }
                    let num = currIndex / blockCount * 100
                    if ((currIndex + 1) === blockCount) {
                        num = 100
                    }
                    this.setState({
                        progressNum: parseFloat(num.toFixed(2))
                    })
                    if (currIndex < blockCount) {
                        currIndex = currIndex + 1
                        this.UploadPost(file, formData, totalSize, blockCount, blockSize)
                    }
                } else if (res.code < 0) {
                    uploadId = ''
                    currIndex = 1
                    message.error(res.msg)
                } else if (res.code === 2) {
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

    // 音频
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    delAudio = (uid) => {
        let arr = this.state.audioDefalutArr
        arr.map(function (item, index) {
            if (item.uid.toString() === uid.toString()) {
                arr.splice(index, 1)
            }
        })
        this.setState({
            audioDefalutArr: arr
        })
    }

    delPost = () => {
        uploadId = ''
        currIndex = 1
        this.setState({
            videoList: [],
            videofileList: [],
            uploading: false
        })
    }

    // 统一上传
    uploadAllImg = ({file, fileList}) => {
        const This = this
        if (file.size / (1024 * 1024) >= 2) {
            message.error('图片大小超过 2M , 请重新选择!')
            this.setState({
                allfilelist: [],
                allImg: ''
            })
            return false
        }
        this.setState({
            allfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                allfilelist: [],
                allImg: ''
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
                    allImg: file.response.obj,
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
                                    maxWidth: 800
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
                    allImg: '',
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
        const This = this
        let count = 0
        this.setState({
            uploadAllImgModal: false,
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
                    processData: false,
                    timeout: 20000,
                    contentType: false,
                    success: function (data) {
                        count += 1
                        if (count === 4) {
                            This.setState({
                                loading: false
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
                            loading: false
                        })
                        if (status === 'timeout') {
                            message.error('上传超时, 请检查网络后重新上传！')
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

    selectTime = (value) => {
        // console.log(Date.parse(value[0].format('YYYY-MM-DD HH:mm:ss')))
        // console.log(Date.parse(value[1].format('YYYY-MM-DD HH:mm:ss')))
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.enterIconLoading()
        let status = e.target.getAttribute('data-status')
        let update = this.state.updateOrNot && (this.props.location.query.id || this.props.location.query.url)
        // !update && this.saveArticle()
        if ($('.simditor').find('img.uploading').length > 0) {
            message.warning('编辑器中图片正在上传, 请稍候提交!')
            this.setState({
                iconLoading: false
            })
            return false
        }

        if (this.state.uploading) {
            message.warning('视频正在上传, 请稍候提交!')
            this.setState({
                iconLoading: false
            })
            return false
        }
        /*
        let pt = Date.parse(this.props.form.getFieldValue('publishTime').format('YYYY-MM-DD HH:mm:ss'))
        let nt = Date.parse(new Date())

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

        let newArr = this.state.audioDefalutArr
        this.state.mp3fileList.map(function (item, index) {
            newArr.push({
                uid: item.uid,
                fileName: item.name,
                fileUrl: item.response.obj
            })
        })
        */
        this.setState({
            audioDefalutArr: []
        }, function () {
            this.props.form.setFieldsValue({
                // tags: this.state.tags.join(','),
                recommend: this.state.recommend,
                // advertised: this.state.advertised,
                content: this.state.newsContent,
                pc_recommend: this.state.pcImg,
                pc: this.state.Img,
                wap_small: this.state.mImg,
                wap_big: this.state.mcImg
                // audio: JSON.stringify(this.state.audioDefalutArr),
                // video: this.state.videofileList[0] && this.state.videofileList[0].fileUrl ? JSON.stringify(this.state.videofileList) : '[]'
            })
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.setState({
                        loading: true
                    })
                    values.startTime = Date.parse(values['publishTime'][0].format('YYYY-MM-DD HH:mm:ss'))
                    values.endTime = Date.parse(values['publishTime'][1].format('YYYY-MM-DD HH:mm:ss'))
                    values.coverPic = JSON.stringify({
                        pc_recommend: values.pc_recommend || '',
                        pc: values.pc,
                        wap_big: values.wap_big,
                        wap_small: values.wap_small,
                        video_pc: this.state.videoPcImg,
                        video_m: this.state.videoMImg
                    })
                    delete values.pc
                    delete values.pc_recommend
                    delete values.wap_big
                    delete values.wap_small
                    delete values.video_pc
                    delete values.video_m
                    delete values.alignLeft
                    delete values.wordBreak
                    delete values.watermark
                    delete values.publishTime
                    values.id = this.props.location.query.id || ''
                    values.status = status || 1
                    !(this.state.updateOrNot && this.props.location.query.id) && delete values.id
                    axiosAjax('post', `${(this.state.updateOrNot && this.props.location.query.id) ? '/activity/update' : '/activity/add'}`, values, (res) => {
                        this.setState({
                            loading: false
                        })
                        if (res.code && res.code === 1) {
                            message.success(update ? '修改成功！' : '添加成功！')
                            !update && localStorage.removeItem('articleData')
                            hashHistory.push('/activityPublish-list')
                        } else {
                            this.setState({
                                iconLoading: false
                            })
                            message.error(res.msg)
                        }
                    })
                } else {
                    this.setState({
                        iconLoading: false
                    })
                }
            })
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
    createMarkup = (str) => {
        return {__html: str}
    }

    CropperImgCroped = (imgUrl) => {
        console.log(imgUrl)
    }

    // 上传图片组件  图片名 / label名 / 图片链接 / 新闻信息 / 图片list / onchange事件 / 图片大小 / 是否需要预览按钮(默认展示, 传true则不展示)
    FormItem = (opt) => {
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
            label={opt.label}>
            <div className="dropbox">
                {getFieldDecorator(opt.imgName, {
                    initialValue: (updateOrNot && opt.activityPublishInfo) ? opt.fileList : '',
                    rules: [{required: opt.require, message: `请上传${opt.label}封面！`}]
                })(
                    <Upload
                        headers={{'Sign-Param': getSig()}}
                        action={`${URL}/pic/upload`}
                        name='uploadFile'
                        listType="picture-card"
                        fileList={opt.fileList}
                        onPreview={this.handlePreview}
                        onChange={opt.changeEvent}>
                        {opt.fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                )}
                {opt.noBtn ? '' : <Button
                    data-type={opt.imgUrl}
                    onClick={this.handlePreview}
                    className="img-preview"
                    type="primary">预览</Button>}
                <span className="cover-img-tip">用于 {opt.label} 的封面展示, 建议尺寸: <font style={{color: 'red'}}>{opt.size}</font></span>
            </div>
        </FormItem>
    }

    render () {
        // const update = this.state.updateOrNot && (this.props.location.query.id || this.props.location.query.url)
        const This = this
        const {getFieldDecorator} = this.props.form
        const {activityPublishInfo} = this.props
        // const {cateId, focusImg, allfileList, uploadAllImgModal, pcSubjectfileList, mSubjectfileList, pcHotSubjectfileList, mHotSubjectfileList, progressNum, videoPcfileList, videoMfileList, videofileList, uploading, previewVisible, previewImage, fileList, pcfileList, mfileList, mcfileList, tags, inputVisible, inputValue, newsContent, updateOrNot, newsVisible, mp3fileList} = this.state
        const {focusImg, allfileList, uploadAllImgModal, previewVisible, previewImage, fileList, pcfileList, mfileList, mcfileList, newsContent, updateOrNot, newsVisible} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 20, offset: 1}
        }
        /*
        const props = {
            action: '/file/upload',
            onRemove: this.delPost,
            beforeUpload: (file) => {
                this.setState({
                    videoList: [file],
                    videofileList: [file]
                })
                return false
            },
            fileList: this.state.videofileList
        }
         */
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        return <div className="activityPublish-send">
            {/*
             <CropperImg style={{display: 'none'}} height={200} width={400} previewImg={this.state.mcImg} cropped={this.CropperImgCroped}/>
             */}
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="主办方: "
                    >
                        {getFieldDecorator('sponsor', {
                            initialValue: (updateOrNot && activityPublishInfo) ? (activityPublishInfo.sponsor || '') : '',
                            rules: [{required: true, message: '请输入活动主办方！'}]
                        })(
                            <Input className="news-source" placeholder="请输入活动主办方"/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="场地类型: ">
                        {getFieldDecorator('placeType', {
                            initialValue: (updateOrNot && activityPublishInfo) ? `${activityPublishInfo.placeType || '1'}` : '1'
                        })(
                            <RadioGroup
                                options={placeTypeOptions}
                                onChange={this.placeTypeChange}
                                setFieldsValue={this.state.placeType}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    {/*
                    {this.props.placeList.length !== 0 && <FormItem {...formItemLayout} label="举办城市: ">
                        {getFieldDecorator('place', {
                            initialValue: (updateOrNot && activityPublishInfo) ? `${activityPublishInfo.place || '北京'}` : '北京'
                        })(
                            <RadioGroup
                                options={this.props.placeList}
                                onChange={this.placeChange}
                                setFieldsValue={this.state.place}>
                            </RadioGroup>
                        )}
                    </FormItem>}
                    */}

                    <FormItem
                        {...formItemLayout}
                        label="举办城市: "
                    >
                        {getFieldDecorator('place', {
                            initialValue: (updateOrNot && activityPublishInfo) ? (activityPublishInfo.place || '') : '',
                            rules: [
                                {required: true, message: '请输入活动举办城市！'},
                                {pattern: /^[^\s]+$/, message: '禁止输入空格！'}
                            ]
                        })(
                            <Input disabled={!this.state.place} className="news-source" placeholder="请输入活动举办城市, 不能含有空格"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="详细地址: "
                    >
                        {getFieldDecorator('detailPlace', {
                            initialValue: (updateOrNot && activityPublishInfo) ? (activityPublishInfo.detailPlace || '') : '',
                            rules: [{required: true, message: '请输入活动详细地址！'}]
                        })(
                            <Input disabled={!this.state.place} className="news-source" placeholder="请输入活动详细地址"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="报名链接: "
                    >
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && activityPublishInfo) ? `${activityPublishInfo.url || ''}` : '',
                            rules: [
                                {type: 'url', message: '请输入正确的超链接！'},
                                {required: false, message: '请输入报名链接！'}
                            ]
                        })(
                            <Input className="news-source" placeholder="请输入报名链接"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="活动时间: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择活动时间！'}],
                            initialValue: (updateOrNot && activityPublishInfo) ? [moment(formatDate(activityPublishInfo.startTime || Date.parse(new Date())), 'YYYY-MM-DD HH:mm:ss'), moment(formatDate(activityPublishInfo.endTime || Date.parse(new Date())), 'YYYY-MM-DD HH:mm:ss')] : []
                        })(
                            <RangePicker placeholder={['开始时间', '结束时间']} showTime onOk={this.selectTime} format="YYYY-MM-DD HH:mm:ss"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="联系方式: "
                    >
                        {getFieldDecorator('connection', {
                            initialValue: (updateOrNot && activityPublishInfo) ? (activityPublishInfo.connection || '') : '',
                            rules: [{required: true, message: '请输入活动联系方式！'}]
                        })(
                            <Input className="news-source" placeholder="请输入活动联系方式"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="费用: "
                    >
                        {getFieldDecorator('fee', {
                            initialValue: (updateOrNot && activityPublishInfo) ? (activityPublishInfo.fee || '') : '',
                            rules: [{required: false, message: '请输入活动费用！'}]
                        })(
                            <Input className="news-source" placeholder="请输入活动费用"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="人数: "
                    >
                        {getFieldDecorator('numPeople', {
                            initialValue: (updateOrNot && activityPublishInfo) ? (activityPublishInfo.numPeople || '') : '',
                            rules: [
                                {required: false, message: '请输入活动人数！'},
                                {pattern: /^[1-9]\d*$/, message: '请输入正整数！'}
                            ]
                        })(
                            <Input className="news-source" placeholder="请输入活动人数"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="活动标题: ">
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && activityPublishInfo) ? `${activityPublishInfo.title}` : '',
                            rules: [{required: true, message: '请输入活动标题！'}]
                        })(
                            <Input placeholder="活动标题"/>
                        )}
                    </FormItem>

                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="副标题: ">
                        {getFieldDecorator('subTitle', {
                            initialValue: (updateOrNot && activityPublishInfo) ? `${activityPublishInfo.subTitle || ''}` : '',
                            rules: [{required: false, message: '请输入活动副标题！'}]
                        })(
                            <Input placeholder="副标题, 用于官网SEO优化"/>
                        )}
                    </FormItem>
                    */}
                    <FormItem
                        {...formItemLayout}
                        label="活动特色: "
                    >
                        {getFieldDecorator('synopsis', {
                            initialValue: (updateOrNot && activityPublishInfo) ? `${activityPublishInfo.synopsis}` : '',
                            rules: [{max: 120, required: true, message: '请输入活动特色, 最多120字！'}]
                        })(
                            <TextArea rows={4} className="news-summary" placeholder="活动特色(简介), 最多120字"/>
                        )}
                    </FormItem>

                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="音频">
                        {getFieldDecorator('audio', {
                            valuePropName: 'mp3fileList',
                            getValueFromEvent: this.normFile
                        })(
                            <Upload
                                headers={{'Sign-Param': getSig()}}
                                defaultFileList={this.state.mp3fileList}
                                action={`${URL}/audio/upload`}
                                name='uploadFile'
                                filelist={mp3fileList}
                                onChange={this.handleMp3}>
                                <Button>
                                    <Icon type="upload"/> 点击上传音频
                                </Button>
                            </Upload>
                        )}
                        <ul>{this.state.audioDefalutArr.map(function (item, index) {
                            return <li key={index}>
                                {item.fileName}
                                <span style={{marginLeft: '10px', cursor: 'pointer'}} onClick={() => {
                                    This.delAudio(item.uid)
                                }}>删除</span>
                                 <audio src={item.fileUrl}/>
                            </li>
                        })}</ul>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="视频">
                        {getFieldDecorator('video')(
                            <Upload
                                {...props}
                                name='uploadFile'
                            >
                                <Button>
                                    <Icon type="upload"/> 选择视频
                                </Button>
                            </Upload>
                        )}
                        {(() => {
                            if (videofileList.length === 0) {
                                return ''
                            } else if (videofileList[0].fileName) {
                                return <p>
                                    <span>{videofileList[0].fileName}</span>
                                    <span
                                        onClick={this.delPost}
                                        style={{marginLeft: 15, color: '#52b8fc', cursor: 'pointer'}}>删除</span>
                                </p>
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

                    {(videofileList[0] && videofileList[0].fileUrl) ? <div className="activityPublish-cover">
                        {this.FormItem({
                            imgName: 'video_pc',
                            label: '视频PC封面',
                            imgUrl: '',
                            activityPublishInfo: activityPublishInfo,
                            fileList: videoPcfileList,
                            changeEvent: this.handleVideoPcChange,
                            size: '280px * 205px',
                            noBtn: false,
                            require: true
                        })}
                        {this.FormItem({
                            imgName: 'video_m',
                            label: '视频 M 端封面',
                            imgUrl: '',
                            activityPublishInfo: activityPublishInfo,
                            fileList: videoMfileList,
                            changeEvent: this.handleVideoMChange,
                            size: '280px * 205px',
                            noBtn: false,
                            require: true
                        })}
                    </div> : ''}
                    */}
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
                        label="活动内容: "
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && activityPublishInfo) ? newsContent : '',
                            rules: [{required: true, message: '请输入活动内容！'}]
                        })(
                            <Input className="news" style={{display: 'none'}}/>
                        )}
                        <PostEditor
                            setSimditor={(editor) => { this.setState({editor}) }}
                            subSend={(data) => this.sendPost(data)}/>
                    </FormItem>

                    {/*
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
                                const isLongTag = tag.length > 8
                                const tagElem = (
                                    <Tag
                                        color="blue" key={tag} closable={index !== -1}
                                        afterClose={() => this.handleClose(tag)}>
                                        {isLongTag ? `${tag.slice(0, 8)}` : tag}
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
                            {!inputVisible && tags.length < 3 && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{background: '#fff', borderStyle: 'dashed'}}
                                >
                                    <Icon type="plus"/> New Tag
                                </Tag>
                            )}
                            <span>建议每篇新闻最多 <font style={{color: 'red'}}>3</font> 个标签, 每个标签最多<font
                                style={{color: 'red'}}> 8 </font>个字</span>
                        </div>
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

                    {this.FormItem({
                        imgName: 'pc',
                        label: 'PC-缩略图',
                        imgUrl: 'Img',
                        activityPublishInfo: activityPublishInfo,
                        fileList: fileList,
                        changeEvent: this.handleChange,
                        size: '385 * 280',
                        noBtn: false,
                        require: true
                    })}

                    {this.FormItem({
                        imgName: 'pc_recommend',
                        label: 'PC-推荐位',
                        imgUrl: 'pcImg',
                        activityPublishInfo: activityPublishInfo,
                        fileList: pcfileList,
                        changeEvent: this.handlePcChange,
                        size: '1200 * 300',
                        noBtn: false,
                        require: false
                    })}

                    {this.FormItem({
                        imgName: 'wap_small',
                        label: 'M-缩略图',
                        imgUrl: 'mImg',
                        activityPublishInfo: activityPublishInfo,
                        fileList: mfileList,
                        changeEvent: this.handleMobileChange,
                        size: '255 * 185',
                        noBtn: false,
                        require: true
                    })}

                    {this.FormItem({
                        imgName: 'wap_big',
                        label: 'M-推荐位',
                        imgUrl: 'mcImg',
                        activityPublishInfo: activityPublishInfo,
                        fileList: mcfileList,
                        changeEvent: this.handleMobileCommentChange,
                        size: '640 * 460',
                        noBtn: false,
                        require: false
                    })}

                    <FormItem
                        {...formItemLayout}
                        label="是否推荐: "
                    >
                        {getFieldDecorator('recommend', {
                            initialValue: (updateOrNot && activityPublishInfo.recommend) ? parseInt(activityPublishInfo.recommend) === 1 : false,
                            valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => {
                                    this.setState({recommend: checked ? 1 : 0})
                                }}
                                checkedChildren="是"
                                unCheckedChildren="否"
                            />
                        )}
                    </FormItem>

                    <FormItem
                        wrapperCol={{span: 12, offset: 2}}
                    >
                        <Button
                            type="primary" onClick={this.newsVisibleShow} className="preview"
                            style={{marginRight: '10px', marginBottom: 10}}>活动内容预览</Button>
                        <Button
                            loading={this.state.iconLoading}
                            type="primary" data-status='1' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>发布</Button>
                        {/*
                        <Button
                            type="primary" data-status='3' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>定时发表</Button>
                        */}
                        <Button
                            type="primary" data-status='0' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>待发布</Button>
                        <Button
                            type="primary" className="cancel"
                            onClick={() => {
                                hashHistory.goBack()
                            }}>取消</Button>
                    </FormItem>

                    {/* 图片剪裁 */}
                    <Modal
                        height="700px"
                        width="1400px"
                        style={{top: '50px'}}
                        visible={uploadAllImgModal}
                        onOk={this.sureCropImg}
                        maskClosable={false}
                        onCancel={this.uploadAllImgCancel}>
                        <div className="croper-wrap activityPub clearfix">
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
                {/*
                {!update && <Button onClick={() => {
                    this.saveArticle()
                    message.success('本地保存成功!')
                }} title="存一下" className="fix-button" type="primary" shape="circle" icon="download" size='large' />}
                */}
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.activityPublishInfo.userInfo,
        activityPublishInfo: state.activityPublishInfo.info,
        placeList: state.placeListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(ActivityPublishSend))
