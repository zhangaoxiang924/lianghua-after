/**
 * Author：tantingting
 * Time：2017/9/21
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import $ from 'jquery'
import Simditor from 'simditor'
import '../../../node_modules/simditor/styles/simditor.css'
import LargedefaultImg from './img/default-large.png'
// import IconItem from '../icon/icon'
import {Input, message} from 'antd'
import './index.scss'
import {URL, getSig} from '../../public/index'
const {TextArea} = Input
let editor = ''
class PostEditor extends Component {
    constructor (props) {
        super(props)
        const {info, toolBar} = props
        this.state = {
            'postContent': !(info && info.postContent) ? '' : info.postContent
        }
        this.EDITTOOLBAR = !toolBar ? [
            'title',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'fontScale',
            'color',
            'ol',
            'ul',
            'blockquote',
            'code',
            'table',
            'link',
            'image',
            'hr',
            'indent',
            'outdent',
            'alignment'
        ] : toolBar
    }

    componentDidMount () {
        editor = new Simditor({
            pasteImage: true,
            textarea: $('.editor'),
            defaultImage: LargedefaultImg,
            // placeholder: '这里输入内容...',
            toolbar: this.EDITTOOLBAR,
            upload: {
                pasteImage: true,
                // url: '/pic/upload', // 文件上传的接口地址
                url: `${URL}/picture/upload`, // 文件上传的接口地址
                params: {
                    type: 'news'
                }, // 键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                fileKey: 'uploadFile', // 服务器端获取文件数据的参数名
                connectionCount: 1,
                headers: {'Sign-Param': getSig()},
                leaveConfirm: '正在上传文件',
                success: function (result) {
                    this.editor.opts.upload.headers['Sign-Param'] = getSig()
                    let msg = ''
                    let imgPath = ''
                    if (result.code !== 1) {
                        msg = result.msg || this._t('uploadFailed')
                        window.layer.msg(msg)
                        imgPath = this.defaultImage
                    } else {
                        message.success('图片上传成功！')
                        imgPath = result.obj
                    }
                    return imgPath
                }
            }
        })

        if (this.props.setSimditor) {
            this.props.setSimditor(editor)
        }

        const {info} = this.props
        if (info && info.postContent) {
            editor.setValue(info.postContent)
        }

        editor.on('valuechanged ', (e) => {
            this.setState({'postContent': editor.getValue()})
            this.sendPost()
        })
    }

    // 发布
    sendPost () {
        const {subSend} = this.props
        subSend(this.state)
    }

    // this.props.clear && this.clearContent()

    // 清空
    clearContent () {
        editor.setValue('')
        this.setState({
            'postContent': ''
        })
    }

    render () {
        return <div className="editor-post-content">
            <TextArea className="editor" autosize/>
            {/*
            <div className="btns">
                <Button className="mr10" onClick={() => this.clearContent()}><IconItem type="icon-clear"/>清空</Button>
            </div>
            */}
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        query: state.postInfo.query
    }
}

export default connect(mapStateToProps)(PostEditor)
