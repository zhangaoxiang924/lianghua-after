/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { hashHistory } from 'react-router'
import { Radio, Form, Input, Upload, Icon, Modal, Button, message, Spin, Select } from 'antd'
import {getAdItemInfo} from '../../actions/others/ad.action'
import {getChannelList} from '../../actions/index'

import {axiosAjax, URL, mobileAdPosition, adTypeOptions, getSig} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const typeOptions = [
    { label: 'PC端', value: '1' },
    { label: '手机端', value: '2' }
]

class AdMSend extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            adPlace: '1',
            adVisible: false,
            type: '1',
            previewVisible: false,
            previewImage: '',
            adTitle: '',
            channelId: '1',
            adContent: '',
            fileList: [],
            coverImgUrl: '',
            loading: true,
            adType: '1',
            text: {
                label: '链接',
                message: '请输入正确的链接地址',
                placeholder: '链接地址',
                type: 'url'
            }
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getChannelList())
        if (location.query.id) {
            dispatch(getAdItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    updateOrNot: true,
                    fileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.imgSrc
                    }],
                    coverImgUrl: data.imgSrc,
                    loading: false,
                    adPlace: data.adPlace,
                    adType: `${data.useType}`,
                    text: this.label(`${data.useType}`)
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    label = (type) => {
        let label = {}
        switch (type) {
            case '1':
                label = {label: '链接', message: '请输入正确的链接地址', placeholder: '链接地址', type: 'url'}
                break
            case '3':
                label = {label: '新闻 ID', message: '请输入新闻 ID', placeholder: '新闻 ID', type: ''}
                break
            case '4':
                label = {label: '频道', message: '请选择新闻频道', placeholder: '新闻 ID', type: ''}
                break
            case '5':
                label = {label: '专题名', message: '请输入专题名', placeholder: '示例：火星特训营/20180725170844035121', type: ''}
                break
            case '6':
                label = {label: '关键字', message: '请输入搜索的关键字/标签', placeholder: '关键字/标签', type: ''}
                break
            default:
                label = {label: '链接', message: '请输入正确的链接地址', placeholder: '链接地址', type: 'url'}
                break
        }
        return label
    }

    // 频道改变
    positionChange = (e) => {
        this.setState({
            adPlace: e.target.value
        })
    }

    typeChange = (e) => {
        this.setState({
            type: e.target.value
        })
    }

    // 上传图片
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = ({ file, fileList }) => {
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
            } if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    coverImgUrl: '',
                    fileList: []
                })
            }
        }
    }

    adType = (e) => {
        this.setState({
            adType: e.target.value,
            text: this.label(e.target.value)
        })
    }

    adVisibleHide = () => {
        this.setState({ adVisible: false })
    }

    adVisibleShow = () => {
        this.setState({ adVisible: true })
    }

    // 提交
    handleSubmit = (e) => {
        let status = e.target.getAttribute('data-status')
        e.preventDefault()
        this.props.form.setFieldsValue({
            imgSrc: this.state.coverImgUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.location.query.id || ''
                values.status = status || 1
                values.url = values.useType === '4' ? values.channelId : values.url
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${this.state.updateOrNot ? '/ad/update' : '/ad/add'}`, values, (res) => {
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.goBack()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 发布
    sendPost (sendData) {
        let _data = {
            'adTitle': sendData.postTitle || '',
            'adContent': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    channelIdChange = (value) => {
        this.setState({
            url: value
        })
    }

    // 内容格式化
    createMarkup (str) { return {__html: str} }

    render () {
        const { getFieldDecorator } = this.props.form
        const { adInfo } = this.props
        const { previewVisible, previewImage, fileList, updateOrNot, text } = this.state
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 15 }
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        return <div className="ad-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="平台: ">
                        {getFieldDecorator('type', {
                            initialValue: '2'
                        })(
                            <RadioGroup
                                disabled
                                options={typeOptions}
                                onChange={this.typeChange}
                                setFieldsValue={this.state.type}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="位置: ">
                        {getFieldDecorator('adPlace', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.adPlace}` : '1'
                        })(
                            <RadioGroup
                                options={mobileAdPosition}
                                onChange={this.positionChange}
                                setFieldsValue={this.state.adPlace}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="类型: ">
                        {getFieldDecorator('useType', {
                            initialValue: this.state.adType
                        })(
                            <RadioGroup onChange={this.adType} setFieldsValue={this.state.adType}>
                                {adTypeOptions.map((item, index) => {
                                    return <Radio key={index} value={item.value}>{item.label}</Radio>
                                })}
                            </RadioGroup>
                        )}
                    </FormItem>
                    {this.state.adType === '4' ? <FormItem {...formItemLayout} label={text.label}>
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.url}` : '1',
                            rules: [{ required: true, type: `${text.type}`, message: `${text.message}` }]
                        })(
                            <Select style={{ width: 100 }} onChange={this.channelIdChange}>
                                {this.props.channelList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                            </Select>
                        )}
                    </FormItem> : <FormItem {...formItemLayout} label={text.label}>
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.url}` : '',
                            rules: [{ required: parseInt(this.state.adPlace) !== 4, type: `${text.type}`, message: `${text.message}` }]
                        })(<Input placeholder={text.placeholder}/>)}
                    </FormItem>}

                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="发布日期: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择广告发布时间！'}],
                            initialValue: (updateOrNot && adInfo) ? moment(formatDate(adInfo.publishTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </FormItem>
                    */}

                    <FormItem
                        {...formItemLayout}
                        label="标题: "
                    >
                        {getFieldDecorator('remake', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.remake}` : '',
                            rules: [{ required: true, message: '请输入链接标题！' }]
                        })(
                            <Input placeholder="输入链接标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="描述: "
                    >
                        {getFieldDecorator('description', {
                            initialValue: (updateOrNot && adInfo) ? `${adInfo.description || ''}` : '',
                            rules: [{ required: false, message: '请输入广告描述！' }]
                        })(
                            <Input placeholder="请输入广告描述"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="封面: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('imgSrc', {
                                initialValue: (updateOrNot && adInfo) ? fileList : '',
                                rules: [{ required: true, message: '请上传广告封面！' }]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    headers={{'Sign-Param': getSig()}}
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
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                            {/* <span className="cover-img-tip">用于广告封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span> */}
                        </div>
                    </FormItem>

                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" data-status='1' htmlType="submit" style={{marginRight: '10px'}}>发布</Button>
                        <Button type="primary" data-status='2' onClick={this.handleSubmit} style={{marginRight: '10px'}}>放入草稿箱</Button>
                        <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        adInfo: state.adInfo.info,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(AdMSend))
