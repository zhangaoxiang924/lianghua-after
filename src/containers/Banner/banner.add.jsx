/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Form, Input, Upload, Icon, Modal, Button, message, Spin, Radio, Select, Checkbox} from 'antd'
import {getBannerItemInfo} from '../../actions/banner/banner'
import {getChannelList} from '../../actions/index'
import {URL, getSig, bannerOptions, positionOptions, axiosAjax} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input

const options = [
    { label: '网页端', value: '1' },
    { label: 'App端', value: '2' }
]

class BannerSend extends Component {
    state = {
        updateOrNot: false,
        previewVisible: false,
        previewImage: '',
        pcImgSrcFileList: [],
        mImgSrcFileList: [],
        pcImgSrc: '',
        mImgSrc: '',
        pcBackImageFileList: [],
        mBackImageFileList: [],
        pcBackImage: '',
        mBackImage: '',
        loading: false,
        type: '1',
        place: ['1', '2'],
        position: '1',
        newsReqType: '1',
        channelId: '1'
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getChannelList())
        if (location.query.id) {
            this.setState({
                loading: true
            })
            dispatch(getBannerItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    position: data.position,
                    updateOrNot: true,
                    mImgSrcFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.mImgSrc
                    }],
                    pcImgSrcFileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pcImgSrc
                    }],
                    mImgSrc: data.mImgSrc,
                    pcImgSrc: data.pcImgSrc,
                    loading: false,
                    place: data.showPlace.split(','),
                    type: data.type.toString()
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    // pc 封面
    handlePcImgChange = ({file, fileList}) => {
        this.setState({
            pcImgSrcFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcImgSrc: '',
                    pcImgSrcFileList: []
                })
            }
        }
    }

    // m 封面
    handleMImgChange = ({file, fileList}) => {
        this.setState({
            mImgSrcFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mImgSrc: '',
                    mImgSrcFileList: []
                })
            }
        }
    }

    // pc 背景
    handlePcBackImgChange = ({file, fileList}) => {
        this.setState({
            pcBackImageFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcBackImage: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcBackImage: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcBackImage: '',
                    pcBackImageFileList: []
                })
            }
        }
    }

    // m 背景
    handleMBackImgChange = ({file, fileList}) => {
        this.setState({
            mBackImageFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mBackImage: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mBackImage: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mBackImage: '',
                    mBackImageFileList: []
                })
            }
        }
    }

    typeOnChange = (e) => {
        this.setState({
            type: e.target.value
        })
    }

    positionOnChange = (e) => {
        let value = e.target.value
        let {form} = this.props
        if (/^[89]$/.test(value)) {
            form.setFieldsValue({
                type: value
            })
        } else {
            form.setFieldsValue({
                type: '1'
            })
        }
        this.setState({
            position: value,
            type: value === '2' ? '1' : value
        })
    }

    placeOnChange = (values) => {
        let {form} = this.props
        form.setFieldsValue({
            showPlace: values
        })
        this.setState({
            place: values
        })
    }

    newsOnChange = (e) => {
        this.setState({
            newsReqType: e.target.value
        })
    }

    // 提交
    handleSubmit = (e) => {
        // let status = e.target.getAttribute('data-status')
        e.preventDefault()
        this.props.form.setFieldsValue({
            pcImgSrc: this.state.pcImgSrc,
            mImgSrc: this.state.mImgSrc
        })

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.status = 0
                let typeLink = ''
                switch (this.state.type) {
                    case '1':
                        typeLink = values.typeLink
                        break
                    case '2':
                        typeLink = values.typeLink_channel
                        delete values.typeLink_channel
                        break
                    case '3':
                        typeLink = values.typeLink_tags
                        delete values.typeLink_tags
                        break
                    case '4':
                        typeLink = values.typeLink_tags
                        delete values.typeLink_tags
                        break
                    case '5':
                        typeLink = values.typeLink_author
                        delete values.typeLink_author
                        break
                    case '6':
                        typeLink = values.typeLink_ad
                        delete values.typeLink_ad
                        break
                    case '7':
                        typeLink = values.typeLink_ad
                        delete values.typeLink_ad
                        break
                    case '8':
                        typeLink = values.typeLink_ad
                        delete values.typeLink_ad
                        break
                    case '9':
                        typeLink = values.typeLink_ad
                        delete values.typeLink_ad
                        break
                    default:
                        typeLink = values.typeLink
                        break
                }
                values.typeLink = typeLink
                values.showPlace = this.state.place.join(',')
                if (this.state.updateOrNot) {
                    values.id = this.props.location.query.id
                    values.showNum = this.props.bannerInfo.showNum
                    values.status = this.props.bannerInfo.status
                    axiosAjax('post', '/homerecommend/updatehomerecommend', values, (res) => {
                        if (res.code === 1) {
                            this.setState({
                                loading: false
                            })
                            message.success('修改成功！')
                            hashHistory.goBack()
                        } else {
                            this.setState({
                                loading: false
                            })
                            message.error(res.msg)
                        }
                    })
                } else {
                    axiosAjax('post', '/homerecommend/addhomerecommend', values, (res) => {
                        if (res.code === 1) {
                            this.setState({
                                loading: false
                            })
                            message.success('添加成功！')
                            hashHistory.goBack()
                        } else {
                            message.error(res.msg)
                            this.setState({
                                loading: false
                            })
                        }
                    })
                }
            }
        })
    }

    channelIdChange = (value) => {
        this.setState({
            channelId: value
        })
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {bannerInfo} = this.props
        const {previewVisible, previewImage, mImgSrcFileList, updateOrNot, pcImgSrcFileList} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 19}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )

        let label = () => {
            if (this.state.type === '2') {
                return '新闻频道'
            } else if (this.state.type === '3') {
                return '关键词/标签名'
            } else if (this.state.type === '1') {
                return '新闻 ID'
            } else if (this.state.type === '4') {
                return '跳转到专题'
            } else if (this.state.type === '5') {
                return '作者信息'
            } else if (this.state.type === '6') {
                return '广告'
            } else if (this.state.type === '7') {
                return '跳转到链接'
            } else if (this.state.type === '8') {
                return '跳转到活动'
            } else if (this.state.type === '9') {
                return '跳转到产品'
            } else {
                return '待定'
            }
        }

        let formItem = () => {
            if (this.state.type === '2') {
                return <FormItem
                    {...formItemLayout}
                    className="bannerTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_channel', {
                        initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.typeLink || '1'}` : '1',
                        rules: [
                            {required: true, message: '请选择新闻频道！'}
                        ]
                    })(
                        <Select
                            style={{ width: 100 }}
                            onChange={this.channelIdChange}
                        >
                            {this.props.channelList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                        </Select>
                    )}
                </FormItem>
            } else if (this.state.type === '3' || this.state.type === '4') {
                return <FormItem
                    {...formItemLayout}
                    className="bannerTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_tags', {
                        initialValue: (updateOrNot && bannerInfo) ? bannerInfo.typeLink : '',
                        rules: [
                            {required: true, message: '请输入相关内容！'}
                        ]
                    })(<Input placeholder='请输入相关内容'/>)}
                </FormItem>
            } else if (this.state.type === '1') {
                return <FormItem
                    {...formItemLayout}
                    className="bannerTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink', {
                        initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.type === 1 ? bannerInfo.typeLink : ''}` : '',
                        rules: [
                            {required: true, message: '新闻 ID 不能为空！'}
                        ]})(<Input placeholder='请输入跳转的新闻 ID'/>)
                    }
                </FormItem>
            } else if (this.state.type === '5') {
                return <FormItem
                    {...formItemLayout}
                    className="bannerTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_author', {
                        initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.type === 5 ? bannerInfo.typeLink : ''}` : '',
                        rules: [
                            {required: true, message: '作者昵称/作者ID不能为空！'}
                        ]
                    })(<Input placeholder='请输入作者昵称/作者ID'/>)}
                </FormItem>
            } else if (this.state.type === '6' || this.state.type === '7' || this.state.type === '8' || this.state.type === '9') {
                return <FormItem
                    {...formItemLayout}
                    className="bannerTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink_ad', {
                        initialValue: (updateOrNot && bannerInfo) ? `${(bannerInfo.type === 6 || bannerInfo.type === 7 || bannerInfo.type === 8 || bannerInfo.type === 9) ? bannerInfo.typeLink : ''}` : '',
                        rules: [
                            {type: 'url', message: '请输入正确的超链接！'},
                            {required: true, message: '地址不能为空！'}
                        ]
                    })(<Input placeholder='请输入相关链接'/>)}
                </FormItem>
            } else {
                return <FormItem
                    {...formItemLayout}
                    className="bannerTitle"
                    label={label()}>
                    {getFieldDecorator('typeLink', {
                        initialValue: '',
                        rules: [
                            {required: true, message: '内容不能为空！'}
                        ]
                    })(<Input disabled placeholder='待定'/>)}
                </FormItem>
            }
        }

        return <div className="banner-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        className='bannerTitle'
                        {...formItemLayout}
                        label="标题 "
                    >
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.title}` : '',
                            rules: [{required: true, message: '请输入Banner标题！'}]
                        })(
                            <Input className="banner-name" placeholder="请输入Banner标题"/>
                        )}
                    </FormItem>
                    <FormItem
                        className='bannerTitle'
                        {...formItemLayout}
                        label="简介 "
                    >
                        {getFieldDecorator('description', {
                            initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.description}` : '',
                            rules: [{required: false, message: '请输入Banner简介！'}]
                        })(
                            <TextArea rows={4} className="banner-name" placeholder="请输入Banner简介"/>
                        )}
                    </FormItem>

                    <FormItem
                        className='bannerTitle'
                        {...formItemLayout}
                        label="平台选择"
                    >
                        {getFieldDecorator('showPlace', {
                            initialValue: (updateOrNot && bannerInfo) ? bannerInfo.showPlace.split(',') : ['1', '2'],
                            rules: [{required: true, message: '请选择轮播位置！'}]
                        })(
                            <CheckboxGroup options={options} onChange={this.placeOnChange} />
                        )}
                    </FormItem>

                    <FormItem
                        className='bannerTitle'
                        {...formItemLayout}
                        label="位置选择"
                    >
                        {getFieldDecorator('position', {
                            initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.position}` : '1',
                            rules: [{required: true, message: '请选择轮播位置！'}]
                        })(
                            <RadioGroup onChange={this.positionOnChange}>
                                {positionOptions.map((item, index) => {
                                    return <Radio key={index} value={item.value}>{item.label}</Radio>
                                })}
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        className='bannerTitle'
                        {...formItemLayout}
                        label="跳转类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: (updateOrNot && bannerInfo) ? `${bannerInfo.type}` : '1',
                            rules: [{required: true, message: '请选择跳转类型！'}]
                        })(
                            <RadioGroup disabled={parseInt(this.state.position) === 8 || parseInt(this.state.position) === 9} onChange={this.typeOnChange}>
                                {bannerOptions.map((item, index) => {
                                    return <Radio key={index} value={item.value}>{item.label}</Radio>
                                })}
                            </RadioGroup>
                        )}
                    </FormItem>

                    {formItem()}

                    <FormItem
                        {...formItemLayout}
                        label="pc 端封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcImgSrc', {
                                initialValue: (updateOrNot && bannerInfo) ? pcImgSrcFileList : '',
                                rules: [{required: true, message: '请上传pc 封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={pcImgSrcFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handlePcImgChange}
                                >
                                    {pcImgSrcFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">用于 pc 端首页推荐的封面图展示</span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="M 端封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mImgSrc', {
                                initialValue: (updateOrNot && bannerInfo) ? mImgSrcFileList : '',
                                rules: [{required: true, message: '请上传轮播封面图！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={mImgSrcFileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMImgChange}
                                >
                                    {mImgSrcFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">用于 M 端相关模块封面图展示</span>
                        </div>
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
                </Form>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        bannerInfo: state.bannerInfo.info,
        selectData: state.bannerInfo.selectedData,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(BannerSend))
