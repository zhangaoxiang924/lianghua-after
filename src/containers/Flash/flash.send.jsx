/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'
import { Form, Radio, Input, Button, message, Spin, InputNumber, Icon, Upload, Modal, Select } from 'antd'
import {getFlashItemInfo} from '../../actions/flash/flash.action'
import {getTypeList} from '../../actions/index'
import {axiosAjax, URL, getSig} from '../../public/index'
import './flash.scss'
const Option = Select.Option

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const tagOptions = [
    { label: '普通', value: 1 },
    { label: '重要', value: 2 }
]

const trendOptions = [
    { label: '利好', value: 1 },
    { label: '利空', value: 0 }
]

let timeout, currentValue

class FlashSend extends Component {
    constructor () {
        super()
        this.state = {
            previewVisible: false,
            previewImage: '',
            imageList: [],
            images: '',
            updateOrNot: false,
            inputVisible: false,
            channelId: '1',
            inputValue: '',
            content: '',
            imagesRemark: '',
            loading: true,
            tag: 1,
            trend: 1,
            upCounts: 0,
            downCounts: 0,
            url: '',
            searching: false,
            data: [],
            searchText: '',
            iconLoading: false,
            noCurrResult: false
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getTypeList())
        if (location.query.id) {
            dispatch(getFlashItemInfo({'id': location.query.id}, (data) => {
                let imageList = data.images && data.images !== '' ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.images
                }] : []
                this.setState({
                    content: data.content,
                    imagesRemark: data.imagesRemark,
                    url: data.url,
                    updateOrNot: true,
                    loading: false,
                    imageList: imageList,
                    images: data.images
                })
            }))
        } else {
            this.randomNum(true)
            this.setState({
                loading: false
            })
        }
    }

    // 频道改变
    channelIdChange = (e) => {
        this.setState({
            channelId: e.target.value
        })
    }

    // 状态改变
    tagChange = (e) => {
        this.setState({
            tag: e.target.value
        })
    }

    // 趋势改变
    trendChange = (e) => {
        this.setState({
            trend: e.target.value
        })
        this.randomNum(e.target.value)
    }

    // 生成两个随机数
    randomNum = (up) => {
        let num1 = Math.floor(Math.random() * 30 + 1)
        let num2 = Math.floor(Math.random() * 30 + 1)
        if (num1 === num2) num2 -= 1
        let max = Math.max(num1, num2)
        let min = Math.min(num1, num2)
        if (up) {
            this.setState({
                upCounts: max,
                downCounts: min
            })
        } else {
            this.setState({
                upCounts: min,
                downCounts: max
            })
        }
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.setFieldsValue({
            images: this.state.images
        })
        this.props.form.validateFields((err, values) => {
            if (values.content.indexOf('【') === -1 || values.content.indexOf('】') === -1 || values.content.split('【')[1].indexOf('】') === -1) {
                message.error('快讯标题格式有误, 请修改后重新发表!')
                return false
            }
            if (!err) {
                this.setState({
                    loading: true
                })
                values.title = ''
                values.channelId = values.channelId || 0
                values.id = this.props.location.query.id || ''
                if (values.tagsV2.length === 0) {
                    values.tagsV2 = ''
                } else {
                    let arr = []
                    values.tagsV2.forEach((item) => {
                        arr.push({
                            name: item.label,
                            ...JSON.parse(item.key)
                        })
                    })
                    values.tagsV2 = JSON.stringify(arr)
                }
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${this.state.updateOrNot ? '/lives/update' : '/lives/add'}`, values, (res) => {
                    this.setState({
                        loading: false
                    })
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.push('/flash-lists')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
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

    getWAndH = (file) => {
        let data = new Promise((resolve) => {
            let reader = new FileReader()
            let image = new Image()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                image.src = e.target.result
            }
            resolve(image)
        }).then((res) => {
            return new Promise((resolve) => {
                res.onload = () => {
                    let w = res.width
                    let h = res.height
                    resolve({w, h})
                }
            })
        })
        return data
    }

    // m 封面
    handleMImgChange = ({file, fileList}) => {
        this.setState({
            imageList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                images: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                let obj = file.response.obj
                this.getWAndH(file.originFileObj).then((res) => {
                    let url = obj.indexOf('?') !== -1 ? `${obj}&w=${res.w}&h=${res.h}` : `${obj}?w=${res.w}&h=${res.h}`
                    this.setState({
                        images: url
                    })
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    images: '',
                    imageList: []
                })
            }
        }
    }

    handleChange = (value, option) => {
        this.setState({value})
    }

    handleBlur = () => {
        this.setState({
            searchText: ''
        })
    }

    handleSelect = (value, e) => {
        value.type = e.props.dataType
    }

    judgeExist = (str, arr) => {
        let newArr = arr.filter((item) => {
            return item.name === str
        })
        if (newArr.length === 0 && arr.length !== 0) {
            this.setState({
                noCurrResult: true
            })
        } else {
            this.setState({
                noCurrResult: false
            })
        }
    }

    getAuthorList = (value) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        currentValue = value

        const getList = () => {
            this.setState({
                searching: true,
                data: []
            })
            axiosAjax(`post`, `/tagmgr/like`, {
                name: value
            }, (res) => {
                this.setState({
                    searching: false
                })
                this.judgeExist(currentValue, res.obj)
                if (res.obj.length === 0 && value.trim() !== '') {
                    this.setState({
                        searchText: <div>
                            <span>未查询到相关标签, 是否创建?</span>
                            <Button type="primary" loading={this.state.iconLoading} style={{margin: '0 10px'}} onClick={this.addNewTag} size="small">是</Button>
                            <Button type="primary" size="small" onClick={() => {
                                this.setState({
                                    searchText: ''
                                })
                            }}>否</Button>
                        </div>,
                        noCurrResult: false
                    })
                } else {
                    this.setState({
                        searchText: ''
                    })
                }
                if (currentValue === value) {
                    const data = res.obj
                    this.setState({ data })
                }
            })
        }
        timeout = setTimeout(getList, 500)
    }

    addNewTag = (e) => {
        e.target.disabled = true
        const {form} = this.props
        this.setState({
            iconLoading: true
        })
        axiosAjax(`post`, `/tagmgr/addSimpleTag`, {
            name: currentValue,
            creator: Cookies.get('hx_passportId')
        }, (res) => {
            this.setState({
                searchText: '',
                iconLoading: false,
                noCurrResult: false
            })
            let newTag = [{key: res.obj.id.toString(), type: res.obj.type, label: res.obj.name}]
            form.setFieldsValue({
                tagsV2: [...form.getFieldValue('tagsV2'), ...newTag]
            })
        })
    }

    transTags = (arr) => {
        let newTags = []
        arr.forEach((item) => {
            newTags.push({
                label: item.name,
                key: JSON.stringify({id: item.id, type: item.type})
            })
        })
        return newTags
    }

    render () {
        const { getFieldDecorator } = this.props.form
        const { flashInfo, flashTypeList, location } = this.props
        const { imagesRemark, content, updateOrNot, tag, trend, imageList, previewVisible, previewImage, upCounts, downCounts } = this.state
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 15, offset: 1 }
        }

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        const options = this.state.data.map(d => <Option dataType={d.type} className={`tagType-${d.type}`} value={JSON.stringify({id: d.id, type: d.type}) } key={d.id}>{d.name}</Option>)

        let insert = localStorage.getItem('insertFlash')
        return <div className="flash-send">
            <Spin spinning={this.state.loading} size="large">
                <Form onSubmit={this.handleSubmit}>
                    {flashTypeList.length !== 0 && <FormItem {...formItemLayout} label="频道：">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.channelId}` : '0'
                        })(
                            <RadioGroup
                                options={flashTypeList}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>}

                    <FormItem {...formItemLayout} label="快讯标识：">
                        {getFieldDecorator('tag', {
                            initialValue: (updateOrNot && flashInfo) ? (flashInfo.tag === 0 ? 1 : flashInfo.tag) : (!insert || location.query.from !== 'twitter' ? 1 : JSON.parse(insert).item.isImportant === 0 ? 1 : 2),
                            rules: [{ required: true, message: '请选择快讯标识！' }]
                        })(
                            <RadioGroup
                                options={tagOptions}
                                onChange={this.tagChange}
                                setFieldsValue={tag}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    {updateOrNot ? '' : <FormItem {...formItemLayout} label="趋势：">
                        {getFieldDecorator('trend', {
                            initialValue: (updateOrNot && flashInfo) ? (flashInfo.trend && flashInfo.trend === 2 ? 2 : 1) : 1,
                            rules: [{ required: true, message: '请选择利好/利空趋势！' }]
                        })(
                            <RadioGroup
                                options={trendOptions}
                                onChange={this.trendChange}
                                setFieldsValue={trend}>
                            </RadioGroup>
                        )}
                    </FormItem>}

                    <FormItem {...formItemLayout} label="利好数：">
                        {getFieldDecorator('upCounts', {
                            initialValue: (updateOrNot && flashInfo) ? (flashInfo.upCounts || 0) : upCounts
                        })(
                            <InputNumber />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="利空数：">
                        {getFieldDecorator('downCounts', {
                            initialValue: (updateOrNot && flashInfo) ? (flashInfo.downCounts || 0) : downCounts
                        })(
                            <InputNumber />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="链接地址：">
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.url ? flashInfo.url : ''}` : '',
                            rules: [{ type: 'url', message: '请输入正确的超链接地址！' }]
                        })(
                            <Input placeholder='快讯中插入的超链接地址'/>
                        )}
                    </FormItem>

                    {/*
                    <FormItem {...formItemLayout} label="标题：">
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && flashInfo) ? `${!flashInfo.title ? getTitle(content, true) : flashInfo.title}` : '',
                            rules: [
                                { required: true, message: '请输入快讯标题！' },
                                { pattern: /^((?!【|】).)*$/, message: '标题格式有误！' }
                            ]
                        })(
                            <Input placeholder='快讯标题，请勿添加括号'/>
                        )}
                    </FormItem>
                    */}

                    <FormItem
                        {...formItemLayout}
                        label="内容："
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && flashInfo) ? content : (!insert || location.query.from !== 'twitter' ? '' : `【${JSON.parse(insert).item.title}】${JSON.parse(insert).item.brief}`),
                            rules: [
                                { required: true, message: '请输入快讯内容！' }
                                // { pattern: /^((?!【|】).)*$/, message: '内容格式有误！' }
                            ]
                        })(
                            <TextArea className="flash" rows={8} placeholder="示例：【快讯标题】快讯内容"/>
                        )}
                    </FormItem>

                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="内容："
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && flashInfo) ? getContent(content) : '',
                            rules: [
                                { required: true, message: '请输入快讯内容！' },
                                { pattern: /^((?!【|】).)*$/, message: '内容格式有误！' }
                            ]
                        })(
                            <TextArea className="flash" rows={4} placeholder="快讯内容"/>
                        )}
                    </FormItem>
                    */}

                    <FormItem
                        {...formItemLayout}
                        label="标签："
                    >
                        {getFieldDecorator('tagsV2', {
                            initialValue: (updateOrNot && flashInfo) ? (!flashInfo.tagsV2 || JSON.parse(flashInfo.tagsV2).length === 0 ? [] : this.transTags(JSON.parse(flashInfo.tagsV2))) : [],
                            rules: [
                                { required: false, message: '请选择快讯标签！' }
                            ]
                        })(
                            <Select
                                mode="multiple"
                                showSearch
                                labelInValue
                                notFoundContent={this.state.searching ? <Spin size="small" /> : this.state.searchText}
                                filterOption={false}
                                optionFilterProp='children'
                                style={{ width: '100%' }}
                                onSearch={this.getAuthorList}
                                onSelect={this.handleSelect}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            >
                                {options}
                            </Select>
                        )}
                        {this.state.noCurrResult && <p style={{position: 'absolute', right: '-155px', bottom: 0}}>
                            <span>未找到结果?</span>
                            <Button type="primary" loading={this.state.iconLoading} style={{margin: '0 10px'}} onClick={this.addNewTag} size="small">创建</Button>
                            <span>一个</span>
                        </p>}

                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="快讯配图: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('images', {
                                initialValue: (updateOrNot && flashInfo) ? imageList : ''
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/picture/upload`}
                                    data={{
                                        type: 'lives'
                                    }}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={imageList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMImgChange}
                                >
                                    {imageList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="图片注释："
                    >
                        {getFieldDecorator('imagesRemark', {
                            initialValue: (updateOrNot && flashInfo) ? imagesRemark : '',
                            rules: [{ required: false }]
                        })(
                            <Input placeholder='图片注释'/>
                        )}
                    </FormItem>

                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" onClick={this.handleSubmit} style={{marginRight: '10px'}}>发表</Button>
                        <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.flashInfo.userInfo,
        flashInfo: state.flashInfo.info,
        flashTypeList: state.flashTypeListInfo,
        getData: state.publicInfo.tempData
    }
}

export default connect(mapStateToProps)(Form.create()(FlashSend))
