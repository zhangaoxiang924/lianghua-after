/**
 * Author：zhoushuanglong
 * Time：2018-04-03 20:55
 * Description：cropper img
 */

import React, {Component} from 'react'
import html2canvas from 'html2canvas'
import Cropper from '../../../node_modules/cropperjs/dist/cropper.esm.js'
import '../../../node_modules/cropperjs/dist/cropper.css'
import {
    Upload,
    Icon,
    Modal,
    message
} from 'antd'

import './index.scss'

import {URL, generateUUID, getSig} from '../../public'

export default class CropperImg extends Component {
    state = {
        uploadUrl: `${URL}/pic/upload`,
        fileList: [],
        previewUrl: '',
        uploadShow: false,
        previewShow: false,
        cropper: null,
        uuid: generateUUID()
    }

    handlePreview = () => {
        this.setState({
            previewShow: true
        })
    }

    previewCancel = () => {
        this.setState({
            previewShow: false
        })
    }

    handleChange = ({file, fileList}) => {
        const This = this
        const {width, height} = this.props

        This.setState({
            fileList: fileList
        })
        if (file.status === 'removed') {
            this.setState({
                previewUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    previewUrl: file.response.obj,
                    uploadShow: true
                }, () => {
                    const image = document.getElementById(`cropperImg${This.state.uuid}`)
                    image.src = file.thumbUrl

                    This.setState({
                        cropper: new Cropper(image, {
                            aspectRatio: width / height,
                            crop: function (e) {
                                const cropper = this.cropper
                                const imageData = cropper.getCroppedCanvas()
                                const base64url = imageData.toDataURL('image/jpeg')
                                imageData.toBlob(function (e) {
                                    console.log(e)
                                })

                                $(`#cropperPreview${This.state.uuid}`).attr('src', base64url)
                            }
                        })
                    })
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    previewUrl: '',
                    fileList: []
                })
            }
        }
    }

    sureCrop = () => {
        const This = this
        this.setState({
            uploadShow: false
        })

        this.state.cropper.destroy()
        html2canvas($(`#cropperGenerate${This.state.uuid}`).get(0)).then(canvas => {
            canvas.toBlob(function (blob) {
                const formData = new FormData()
                formData.append('uploadFile', blob)
                $.ajax(`${URL}/pic/upload`, {
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    headers: {'Sign-Param': getSig()},
                    success: function (data) {
                        if (This.props.cropped) {
                            This.props.cropped(data.obj)
                        }
                        This.setState({
                            previewUrl: data.obj
                        })
                    },
                    error: function () {
                        console.log('Upload error')
                    }
                })
            })
        })
    }

    cancelCrop = () => {
        this.setState({
            uploadShow: false
        })
    }

    componentDidMount () {
    }

    render () {
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        const {fileList, uploadShow, uploadUrl, previewShow, previewUrl, uuid} = this.state
        const {width, height, style} = this.props
        return <div className="cropper-img" style={{...style}}>
            <Upload
                action={uploadUrl}
                name='uploadFile'
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}>
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            {/* 图片上传 */}
            <Modal
                height="700px"
                width="1220px"
                visible={uploadShow}
                onOk={this.sureCrop}
                onCancel={this.cancelCrop}>
                <div className="croper-wrap clearfix">
                    <div className="cropper-operate">
                        <img id={`cropperImg${uuid}`} src="" alt=""/>
                    </div>
                    <div className="cropper-preview">
                        <div
                            id={`cropperGenerate${uuid}`}
                            className="cropper-preview-con"
                            style={{width: `${width}px`, height: `${height}px`}}>
                            <img id={`cropperPreview${uuid}`} src="" alt=""/>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* 图片预览 */}
            <Modal visible={previewShow} footer={null} onCancel={this.previewCancel}>
                <img alt="cropper" style={{width: '100%'}} src={previewUrl}/>
            </Modal>
        </div>
    }
}
