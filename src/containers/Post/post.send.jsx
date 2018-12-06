/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
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
    Tag,
    Tooltip,
    message,
    Row,
    Col,
    Spin,
    DatePicker,
    Progress,
    Switch,
    Select
} from 'antd'
import moment from 'moment'
import Cookies from 'js-cookie'
import {getPostItemInfo, getMergeNewsInfo, getLocalInfo, getTwitterInfo} from '../../actions/post/post.action'
import {getPostAccountList} from '../../actions/account/postAccount.action'
import {getChannelList} from '../../actions/index'
import {axiosFormData, axiosAjax, URL, formatDate, isJsonString, getSig, dataURLtoBlob} from '../../public/index'
import './post.scss'
// import CropperImg from '../../components/CropperImg'
// import html2canvas from 'html2canvas'
const FormItem = Form.Item
const {TextArea} = Input
const {Option} = Select
const RadioGroup = Radio.Group

const cateIdOptions = [
    {label: '原创', value: '1'},
    {label: '转载', value: '2'}
]

let uploadId = ''
let currIndex = 1
let pause = false

class PostSend extends Component {
    constructor (props) {
        super(props)
        this.state = {
            confirmLoading: false,
            editor: '',
            updateOrNot: false,
            tags: [],
            source: '',
            createdBy: '',
            mp3fileList: [],
            videofileList: [],
            videoList: [],
            audioDefalutArr: [],
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
            mp3Url: '',
            videoUrl: '',
            uploading: false,
            progressNum: 0,
            loading: true,
            original: 0,
            advertised: 0,
            subject: 0,
            uploadAllImgModal: false,
            cropper: null,
            focusImg: -1,
            ratio: 640 / 320,
            cropImgRule: [
                {
                    coverName: 'mcImg',
                    coverList: 'mcfileList',
                    width: '640px',
                    height: '320px',
                    ratio: 640 / 320,
                    intro: 'M端推荐新闻的滚动:640 * 320'
                }, {
                    coverName: 'pcImg',
                    coverList: 'pcfileList',
                    width: '400px',
                    height: '251px',
                    ratio: 532 / 335,
                    intro: 'PC端推荐位新闻封面:532 * 335'
                }, {
                    coverName: 'Img',
                    coverList: 'fileList',
                    width: '220px',
                    height: '160px',
                    ratio: 220 / 160,
                    intro: 'PC 端新闻封面:220 * 160'
                }, {
                    coverName: 'mImg',
                    coverList: 'mfileList',
                    width: '164px',
                    height: '124px',
                    ratio: 290 / 220,
                    intro: 'M端新闻封面:164 * 124'
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
        dispatch(getChannelList())
        dispatch(getPostAccountList('init', {pageSize: 1000, currentPage: 1}))
        if (location.query.id || location.query.url || location.query.from) {
            if (location.query.id) {
                dispatch(getPostItemInfo({'id': location.query.id}, (res) => { this.renderData(res) }))
            } else if (location.query.url) {
                dispatch(getMergeNewsInfo({
                    url: location.query.url,
                    webName: location.query.webName,
                    title: location.query.title,
                    publishTime: location.query.publishTime,
                    coverPic: location.query.coverPic,
                    synopsis: location.query.synopsis,
                    author: location.query.author
                }, (res) => { this.renderData(res) }))
            } else if (location.query.from === 'twitter') {
                dispatch(getTwitterInfo({url: location.query.urls}, (res) => {
                    if (!res) {
                        message.error('此新闻源暂不支持导入功能！')
                    } else {
                        this.renderData(res)
                    }
                }))
            }
        } else {
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
            this.setState({interval: setInterval(() => {
                this.saveArticle()
                console.log('已存储！')
            }, 5 * 1000)})
            // sessionStorage.setItem('hx_content', '')
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
        const {tags, original, channelId, newsContent, videofileList, audioDefalutArr, cateId, pcImg, Img, mImg, mcImg, videoPcImg, videoMImg, pcSubjectImg, mSubjectImg, mHotSubjectImg, pcHotSubjectImg} = this.state
        let subject = null
        if (parseInt(this.state.subject) === 1) {
            subject = {
                pc_subject: pcSubjectImg,
                m_subject: mSubjectImg,
                pc_hot_subject: pcHotSubjectImg,
                m_hot_subject: mHotSubjectImg
            }
        } else {
            subject = {}
        }

        let articleData = {
            ...subject,
            tags: tags.join(','),
            original: original,
            subject: this.state.subject,
            content: newsContent,
            audio: JSON.stringify(audioDefalutArr),
            video: videofileList[0] && videofileList[0].fileUrl ? JSON.stringify(videofileList) : '[]',
            // publishTime: Date.parse(form.getFieldValue('publishTime').format('YYYY-MM-DD HH:mm:ss')) || Date.parse(new Date()),
            author: form.getFieldValue('author'),
            hotCounts: form.getFieldValue('hotCounts'),
            synopsis: form.getFieldValue('synopsis'),
            title: form.getFieldValue('title'),
            source: parseInt(cateId) === 1 ? form.getFieldValue('source').label || '火星财经' : form.getFieldValue('sourceTrans'),
            createdBy: parseInt(cateId) === 1 ? form.getFieldValue('source').key || 'fff9d400cb94444fadaefd429516c276' : '',
            advertised: form.getFieldValue('advertised'),
            subTitle: form.getFieldValue('subTitle'),
            keyTags: form.getFieldValue('keyTags'),
            originalUrl: form.getFieldValue('originalUrl'),
            originalTitle: form.getFieldValue('originalTitle'),
            cateId: cateId,
            channelId: channelId,
            coverPic: JSON.stringify({
                pc_recommend: pcImg,
                pc: Img,
                wap_small: mImg,
                wap_big: mcImg,
                video_pc: videoPcImg,
                video_m: videoMImg,
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
            video_m: '',
            pc_subject: '',
            m_subject: '',
            m_hot_subject: '',
            pc_hot_subject: ''
        }
        let pcfileList = this.fileList(coverPic, 'pc_recommend')
        let pcSubject = this.fileList(coverPic, 'pc_subject')
        let mSubject = this.fileList(coverPic, 'm_subject')
        let mHotSubject = this.fileList(coverPic, 'm_hot_subject')
        let pcHotSubject = this.fileList(coverPic, 'pc_hot_subject')
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
            pcSubjectfileList: pcSubject,
            mSubjectfileList: mSubject,
            pcHotSubjectfileList: pcHotSubject,
            mHotSubjectfileList: mHotSubject,
            audioDefalutArr: isJsonString(data.audio) ? JSON.parse(data.audio) : [],
            videofileList: isJsonString(data.video) ? JSON.parse(data.video) : [],
            tags: !data.tags ? [] : data.tags.split(','),
            newsContent: filterContent,
            Img: coverPic.pc,
            allImg: coverPic.all,
            pcImg: coverPic.pc_recommend || '',
            mImg: coverPic.wap_small,
            mcImg: coverPic.wap_big,
            pcSubjectImg: coverPic.pc_subject,
            mSubjectImg: coverPic.m_subject,
            pcHotSubjectImg: coverPic.pc_hot_subject,
            mHotSubjectImg: coverPic.m_hot_subject,
            videoMImg: coverPic.video_m,
            videoPcImg: coverPic.video_pc,
            mp3Url: data.audio || '',
            videoUrl: data.video || '',
            loading: false,
            original: data.original || 0,
            advertised: data.advertised || 0,
            subject: data.subject || 0,
            cateId: data.cateId,
            source: data.cateId && parseInt(data.cateId) === 1 ? {key: data.createdBy || 'fff9d400cb94444fadaefd429516c276', label: data.source || '火星财经'} : data.source,
            createdBy: data.cateId && parseInt(data.cateId) === 1 ? data.createdBy || 'fff9d400cb94444fadaefd429516c276' : ''
        })
    }

    // 频道改变
    channelIdChange = (e) => {
        this.setState({
            channelId: e.target.value
        })
    }

    cateIdChange = (e) => {
        let value = e.target.value
        if (value === '1') {
            this.setState({
                source: '火星财经',
                createdBy: 'fff9d400cb94444fadaefd429516c276'
            })
        } else {
            this.setState({
                source: ''
            })
        }
        this.setState({
            cateId: value
        })
    }

    optionChange = (e) => {
        this.setState({
            source: e.label,
            createdBy: e.key
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

    // pc 图片上传
    handleChange = async ({file, fileList}) => {
        if (file.status === 'removed') {
            this.setState({
                Img: ''
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

    // pcSubjectfileList: [],
    // mSubjectfileList: [],
    // pcHotSubjectfileList: [],
    // mHotSubjectfileList: [],
    // pcSubjectImg: '',
    // mSubjectImg: '',
    // pcHotSubjectImg: '',
    // mHotSubjectImg: '',

    // pc专题展示图上传
    handlePcSubjectChange = async ({file, fileList}) => {
        let sizeSuit = await this.beforeUpload(file.originFileObj)
        if (!sizeSuit) {
            message.warning('图片尺寸不能大于 800 * 800, 请重新选择!')
            return false
        }
        this.setState({
            pcSubjectfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcSubjectImg: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcSubjectImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcSubjectImg: '',
                    pcSubjectfileList: []
                })
            }
        }
    }

    // m 端专题展示图上传
    handleMSubjectChange = async ({file, fileList}) => {
        let sizeSuit = await this.beforeUpload(file.originFileObj)
        if (!sizeSuit) {
            message.warning('图片尺寸不能大于 800 * 800, 请重新选择!')
            return false
        }
        this.setState({
            mSubjectfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mSubjectImg: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mSubjectImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mSubjectImg: '',
                    mSubjectfileList: []
                })
            }
        }
    }

    // pc 端 hot 专题展示图上传
    handlePcHotSubjectChange = async ({file, fileList}) => {
        let sizeSuit = await this.beforeUpload(file.originFileObj)
        if (!sizeSuit) {
            message.warning('图片尺寸不能大于 800 * 800, 请重新选择!')
            return false
        }
        this.setState({
            pcHotSubjectfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcHotSubjectImg: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcHotSubjectImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcHotSubjectImg: '',
                    pcHotSubjectfileList: []
                })
            }
        }
    }

    // m 端 hot 专题展示图上传
    handleMHotSubjectChange = async ({file, fileList}) => {
        let sizeSuit = await this.beforeUpload(file.originFileObj)
        if (!sizeSuit) {
            message.warning('图片尺寸不能大于 800 * 800, 请重新选择!')
            return false
        }
        this.setState({
            mHotSubjectfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mHotSubjectImg: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mHotSubjectImg: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mHotSubjectImg: '',
                    mHotSubjectfileList: []
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
                allfileList: [],
                allImg: ''
            })
            return false
        }
        this.setState({
            allfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                allfileList: [],
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
                                const base64url = imageData.toDataURL('image/jpeg', 0.85)

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
                // let dom = $(this)
                // let width = dom.outerWidth(false)
                // let height = dom.outerHeight(false)
                // let canvas = document.createElement('canvas')
                // let context = canvas.getContext('2d')
                // let scale = 1
                // context.mozImageSmoothingEnabled = false
                // context.webkitImageSmoothingEnabled = false
                // context.msImageSmoothingEnabled = false
                // context.imageSmoothingEnabled = false
                // canvas.width = width * scale
                // canvas.height = height * scale
                // context.scale(scale, scale)
                // let opts = {
                //     scale: scale,
                //     canvas: canvas,
                //     logging: false,
                //     width: width,
                //     height: height
                // }
                // console.log($(this).find('img').prop('src'))
                // $(this).find('img').cropper('getCroppedCanvas').toBlob(function (blob) {})
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
                            message.error('上传超时, 请检查网络后重新上传！')
                        } else {
                            message.error('网络故障, 请尝试重新上传！')
                        }
                        XMLHttpRequest.abort()
                    }
                })
            }, d * 500)
            // html2canvas($(this).get(0), opts).then(canvas => {
            //     canvas.toBlob(function (blob) {
            //         const formData = new FormData()
            //         formData.append('uploadFile', blob)
            //         $.ajax(`${URL}/pic/upload`, {
            //             headers: {'Sign-Param': getSig()},
            //             method: 'POST',
            //             data: formData,
            //             processData: false,
            //             timeout: 40000,
            //             contentType: false,
            //             success: function (data) {
            //                 if (d === 0) {
            //                     This.setState({
            //                         loading: false,
            //                         confirmLoading: false
            //                     })
            //                     message.success('上传完毕！')
            //                 }
            //                 This.setState({
            //                     [coverName]: data.obj,
            //                     [coverList]: [{
            //                         uid: 0,
            //                         name: 'xxx.png',
            //                         status: 'done',
            //                         url: data.obj
            //                     }]
            //                 }, function () {
            //                     // console.log(This.state[coverName])
            //                 })
            //             },
            //             error: function (XMLHttpRequest, status) {
            //                 This.setState({
            //                     loading: false
            //                 })
            //                 if (status === 'timeout') {
            //                     message.error('上传超时, 请检查网络后重新上传！')
            //                 } else {
            //                     message.error('网络故障, 请尝试重新上传！')
            //                 }
            //                 XMLHttpRequest.abort()
            //             }
            //         })
            //     })
            // })
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
        this.enterIconLoading()
        let status = e.target.getAttribute('data-status')
        let update = this.state.updateOrNot && (this.props.location.query.id || this.props.location.query.url)
        !update && this.saveArticle()
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
        this.setState({
            audioDefalutArr: newArr
        }, function () {
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

            this.props.form.setFieldsValue({
                ...subject,
                tags: this.state.tags.join(','),
                original: this.state.original,
                advertised: this.state.advertised,
                subject: this.state.subject,
                content: this.state.newsContent,
                pc_recommend: this.state.pcImg,
                pc: this.state.Img,
                wap_small: this.state.mImg,
                wap_big: this.state.mcImg,
                audio: JSON.stringify(this.state.audioDefalutArr),
                video: this.state.videofileList[0] && this.state.videofileList[0].fileUrl ? JSON.stringify(this.state.videofileList) : '[]'
            })
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.setState({
                        loading: true
                    })
                    if (parseInt(this.state.cateId) === 1) {
                        values.createdBy = values.source.key
                        values.source = values.source.label
                    } else {
                        values.source = values.sourceTrans
                    }
                    values.publishTime = Date.parse(values['publishTime'].format('YYYY-MM-DD HH:mm:ss'))
                    values.coverPic = JSON.stringify({
                        pc_recommend: values.pc_recommend || '',
                        pc: values.pc,
                        wap_big: values.wap_big,
                        wap_small: values.wap_small,
                        video_pc: this.state.videoPcImg,
                        video_m: this.state.videoMImg,
                        pc_subject: values.pc_subject || '',
                        m_subject: values.m_subject || '',
                        pc_hot_subject: values.pc_hot_subject || '',
                        m_hot_subject: values.m_hot_subject || ''
                    })
                    delete values.pc
                    delete values.pc_recommend
                    delete values.wap_big
                    delete values.wap_small
                    delete values.video_pc
                    delete values.video_m
                    delete values.pc_subject
                    delete values.m_subject
                    delete values.m_hot_subject
                    delete values.pc_hot_subject
                    delete values.alignLeft
                    delete values.wordBreak
                    delete values.watermark
                    values.id = this.props.location.query.id || ''
                    values.status = status || 1
                    !(this.state.updateOrNot && this.props.location.query.id) && delete values.id
                    axiosAjax('post', `${(this.state.updateOrNot && this.props.location.query.id) ? '/news/update' : '/news/add'}`, values, (res) => {
                        this.setState({
                            loading: false
                        })
                        if (res.code && res.code === 1) {
                            message.success(update ? '修改成功！' : '添加成功！')
                            !update && localStorage.removeItem('articleData')
                            hashHistory.push('/post-list')
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
                    initialValue: (updateOrNot && opt.newsInfo) ? opt.fileList : '',
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
        // 这个update用来判断是否展示自动保存按钮
        const update = this.state.updateOrNot && (this.props.location.query.id || this.props.location.query.url || this.props.location.query.from === 'twitter')
        const This = this
        const {getFieldDecorator} = this.props.form
        const {newsInfo, list} = this.props
        const {cateId, focusImg, allfileList, uploadAllImgModal, pcSubjectfileList, mSubjectfileList, pcHotSubjectfileList, mHotSubjectfileList, progressNum, videoPcfileList, videoMfileList, videofileList, uploading, previewVisible, previewImage, fileList, pcfileList, mfileList, mcfileList, tags, inputVisible, inputValue, newsContent, updateOrNot, newsVisible, mp3fileList} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 20, offset: 1}
        }
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
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        // 获取内容并显示, 暂时这么写-----(已更新)
        // const hxContent = (location.query.id || location.query.url) ? JSON.parse(sessionStorage.getItem('hx_content')).content : ''
        let optionData = [{label: '火星财经', value: 'fff9d400cb94444fadaefd429516c276'}]
        list.length !== 0 && list.map((d) => {
            optionData.push({
                label: d.nickName,
                value: d.passportId
            })
            return optionData
        })
        return <div className="post-send">
            {/*
             <CropperImg style={{display: 'none'}} height={200} width={400} previewImg={this.state.mcImg} cropped={this.CropperImgCroped}/>
             */}
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="作者: ">
                        {getFieldDecorator('author', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.author}` : '',
                            rules: [{required: true, message: '请输入作者！'}]
                        })(
                            <Input ref={(input) => {
                                this.authorInput = input
                            }} className="news-author" placeholder="请输入作者"/>
                        )}
                    </FormItem>

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

                    <FormItem
                        {...formItemLayout}
                        label="是否推广: "
                    >
                        {getFieldDecorator('advertised', {
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
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.cateId || '2'}` : '1'
                        })(
                            <RadioGroup
                                options={cateIdOptions}
                                onChange={this.cateIdChange}
                                setFieldsValue={this.state.cateId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    {optionData.length !== 0 && parseInt(cateId) === 1 ? <FormItem
                        {...formItemLayout}
                        label="来源"
                    >
                        {getFieldDecorator('source', {
                            initialValue: (updateOrNot && newsInfo) ? {key: newsInfo.createdBy || 'fff9d400cb94444fadaefd429516c276'} : {key: 'fff9d400cb94444fadaefd429516c276', label: '火星财经'},
                            rules: [{ required: true, message: '请选择新闻来源！' }]
                        })(
                            <Select
                                labelInValue
                                showSearch
                                style={{width: '100%'}}
                                placeholder='选择新闻来源'
                                defaultActiveFirstOption={false}
                                notFoundContent={this.state.searching ? <Spin size="small" /> : '未查询到相关内容'}
                                showArrow={true}
                                optionFilterProp='children'
                                filterOption={true}
                                onChange={this.optionChange}
                            >
                                {optionData.length !== 0 && optionData.map(d => {
                                    return <Option key={d.value}>{d.label}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem> : <FormItem
                        {...formItemLayout}
                        label="来源: "
                    >
                        {getFieldDecorator('sourceTrans', {
                            initialValue: ((updateOrNot && newsInfo && newsInfo.cateId === 2) || this.props.location.query.url) ? `${newsInfo.source || ''}` : '',
                            rules: [{required: true, message: '请输入新闻来源！'}]
                        })(
                            <Input className="news-source" placeholder="请输入新闻来源"/>
                        )}
                    </FormItem>}

                    {(parseInt(cateId) === 2 || this.props.location.query.url) && <div className="reprint">
                        <FormItem
                            {...formItemLayout}
                            label="原文标题: "
                        >
                            {getFieldDecorator('originalTitle', {
                                initialValue: (updateOrNot && newsInfo) ? `${newsInfo.originalTitle || ''}` : '',
                                rules: [{required: true, message: '请输入原文标题！'}]
                            })(
                                <Input className="news-source" placeholder="请输入原文标题"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="原文链接: "
                        >
                            {getFieldDecorator('originalUrl', {
                                initialValue: (updateOrNot && newsInfo) ? `${newsInfo.originalUrl || ''}` : '',
                                rules: [{required: false, message: '请输入原文链接！'}]
                            })(
                                <Input className="news-source" placeholder="请输入原文链接"/>
                            )}
                        </FormItem>
                    </div>}

                    <FormItem
                        {...formItemLayout}
                        label="发布日期: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择新闻发布时间！'}],
                            initialValue: (updateOrNot && newsInfo && newsInfo.status !== 0) ? moment(formatDate(newsInfo.publishTime || Date.parse(new Date())), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="热度: "
                    >
                        {getFieldDecorator('hotCounts', {
                            initialValue: (updateOrNot && newsInfo) ? (newsInfo.hotCounts || 0) : 0,
                            rules: [{required: true, pattern: /^[0-9]+$/, message: '请输入新闻热度值(正整数)！'}]
                        })(
                            <Input className="news-source" placeholder="请输入新闻热度值"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="标题: ">
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.title}` : '',
                            rules: [{required: true, message: '请输入新闻标题！'}]
                        })(
                            <Input placeholder="新闻标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="副标题: ">
                        {getFieldDecorator('subTitle', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.subTitle || ''}` : '',
                            rules: [{required: false, message: '请输入新闻副标题！'}]
                        })(
                            <Input placeholder="副标题, 用于官网SEO优化"/>
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
                                {/* <audio src={item.fileUrl}/> */}
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

                    {(videofileList[0] && videofileList[0].fileUrl) ? <div className="post-cover">
                        {this.FormItem({
                            imgName: 'video_pc',
                            label: '视频PC封面',
                            imgUrl: '',
                            newsInfo: newsInfo,
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
                            newsInfo: newsInfo,
                            fileList: videoMfileList,
                            changeEvent: this.handleVideoMChange,
                            size: '280px * 205px',
                            noBtn: false,
                            require: true
                        })}
                    </div> : ''}

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
                            rules: [{required: true, message: '请输入新闻内容！'}]
                        })(
                            <Input className="news" style={{display: 'none'}}/>
                        )}
                        <PostEditor
                            setSimditor={(editor) => { this.setState({editor}) }}
                            subSend={(data) => this.sendPost(data)}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="摘要: "
                    >
                        {getFieldDecorator('synopsis', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.synopsis}` : '',
                            rules: [{max: 120, required: true, message: '请输入新闻内容摘要, 最多120字！'}]
                        })(
                            <TextArea className="news-summary" placeholder="新闻摘要, 最多120字"/>
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
                            <span>每个标签最多<font style={{color: 'red'}}> 20 </font>个字</span>
                        </div>
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
                            <span className="cover-img-tip all-img">统一上传所有尺寸图片，自动剪裁适配尺寸</span>
                        </div>
                    </FormItem>

                    {this.FormItem({
                        imgName: 'pc',
                        label: 'PC-缩略图',
                        imgUrl: 'Img',
                        newsInfo: newsInfo,
                        fileList: fileList,
                        changeEvent: this.handleChange,
                        size: '220px * 160px',
                        noBtn: false,
                        require: true
                    })}

                    {this.FormItem({
                        imgName: 'pc_recommend',
                        label: 'PC-推荐位',
                        imgUrl: 'pcImg',
                        newsInfo: newsInfo,
                        fileList: pcfileList,
                        changeEvent: this.handlePcChange,
                        size: '532px * 335px',
                        noBtn: false,
                        require: true
                    })}

                    {this.FormItem({
                        imgName: 'wap_small',
                        label: 'M-缩略图',
                        imgUrl: 'mImg',
                        newsInfo: newsInfo,
                        fileList: mfileList,
                        changeEvent: this.handleMobileChange,
                        size: '164px * 124px',
                        noBtn: false,
                        require: true
                    })}

                    {this.FormItem({
                        imgName: 'wap_big',
                        label: 'M-轮播图',
                        imgUrl: 'mcImg',
                        newsInfo: newsInfo,
                        fileList: mcfileList,
                        changeEvent: this.handleMobileCommentChange,
                        size: '640px * 320px',
                        noBtn: false,
                        require: true
                    })}

                    <FormItem
                        {...formItemLayout}
                        label="是否专题: ">
                        {getFieldDecorator('subject', {
                            initialValue: (updateOrNot) ? parseInt(this.state.subject) === 1 : false,
                            valuePropName: 'checked'
                        })(
                            <Switch
                                onChange={(checked) => {
                                    this.setState({subject: checked ? 1 : 0})
                                }}
                                checkedChildren="是"
                                unCheckedChildren="否"/>
                        )}
                    </FormItem>

                    {parseInt(this.state.subject) !== 1 ? '' : <div>
                        {this.FormItem({
                            imgName: 'pc_subject',
                            label: '专题 pc 端',
                            imgUrl: '',
                            newsInfo: newsInfo,
                            fileList: pcSubjectfileList,
                            changeEvent: this.handlePcSubjectChange,
                            size: '580 * 285',
                            noBtn: true,
                            require: true
                        })}
                        {this.FormItem({
                            imgName: 'pc_hot_subject',
                            label: '专题 pc 推荐',
                            imgUrl: '',
                            newsInfo: newsInfo,
                            fileList: pcHotSubjectfileList,
                            changeEvent: this.handlePcHotSubjectChange,
                            size: '580 * 400',
                            noBtn: true,
                            require: true
                        })}
                        {this.FormItem({
                            imgName: 'm_subject',
                            label: '专题 M 端',
                            imgUrl: '',
                            newsInfo: newsInfo,
                            fileList: mSubjectfileList,
                            changeEvent: this.handleMSubjectChange,
                            size: '500 * 280',
                            noBtn: true,
                            require: true
                        })}
                        {this.FormItem({
                            imgName: 'm_hot_subject',
                            label: '专题 M 推荐',
                            imgUrl: '',
                            newsInfo: newsInfo,
                            fileList: mHotSubjectfileList,
                            changeEvent: this.handleMHotSubjectChange,
                            size: '500 * 280',
                            noBtn: true,
                            require: true
                        })}
                    </div>}

                    <FormItem
                        wrapperCol={{span: 12, offset: 2}}
                    >
                        <Button
                            type="primary" onClick={this.newsVisibleShow} className="preview"
                            style={{marginRight: '10px', marginBottom: 10}}>新闻内容预览</Button>
                        <Button
                            loading={this.state.iconLoading}
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
                        width="1400px"
                        style={{top: '50px'}}
                        visible={uploadAllImgModal}
                        onOk={this.sureCropImg}
                        maskClosable={false}
                        onCancel={this.uploadAllImgCancel}>
                        <div className="croper-wrap post clearfix">
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
                {!update && <Button onClick={() => {
                    this.saveArticle()
                    message.success('本地保存成功!')
                }} title="存一下" className="fix-button" type="primary" shape="circle" icon="download" size='large' />}
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.postAccountInfo.list,
        userInfo: state.postInfo.userInfo,
        newsInfo: state.postInfo.info,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(PostSend))
