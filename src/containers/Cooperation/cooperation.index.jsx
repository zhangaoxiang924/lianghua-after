import React, {Component} from 'react'
import {connect} from 'react-redux'
// import { Link, hashHistory } from 'react-router'
import {Icon, Form, Table, Spin, Row, Col, Select, Button, Modal, message, Input, InputNumber, Upload} from 'antd'
import {getCooperationList, setPageData, setFilterData, setFormData} from '../../actions/entries/cooperation.action'
import {formatDate, axiosAjax, URL, getSig} from '../../public/index'

import './cooperation.scss'
import IconItem from '../../components/icon/icon'

const FormItem = Form.Item
let columns = []
const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 }
    }
}
const Option = Select.Option

const mapStateToProps = (state) => {
    return {
        cooList: state.cooperationInfo.cooList,
        pageData: state.cooperationInfo.pageData,
        filter: state.cooperationInfo.filter,
        formData: state.cooperationInfo.formData,
        maxNum: state.cooperationInfo.maxNum
    }
}

class Cooperation extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            visible: false,
            newsStatus: 1,
            order: 1,
            imageList: [],
            image: '',
            previewVisible: false,
            previewImage: ''
        }
    }

    componentWillMount () {
        this.setState({
            order: this.props.maxNum
        })
    }

    componentDidMount () {
        this.doInit({type: this.state.newsStatus})
        columns = [{
            title: '序号',
            key: 'showNum',
            render: (text, record) => <p>{record.show_num}</p>
        }, {
            title: '名称',
            key: 'linkName',
            render: (text, record) => (record && <div className="flashAccount-info clearfix">
                <div>
                    <h4 title={record.name}>{record.name}</h4>
                </div>
            </div>)
        }, {
            title: '网址',
            dataIndex: 'webLink',
            key: 'webLink',
            render: (text, record) => record && <a href={record.url} target="_blank">{record.url}</a>
        }, {
            title: 'ID',
            dataIndex: 'linkId',
            key: 'linkId',
            render: (text, record) => <p>{record.id}</p>
        }, {
            title: '链接类型',
            key: 'linkType',
            render: (text, record) => {
                if (record && record.type === 1) {
                    return <span className="type-status">友情链接</span>
                }
                if (record && record.type === 2) {
                    return <span className="type-status cont-publish">热门标签</span>
                }
                if (record && record.type === 3) {
                    return <span className="type-status cont-publish">合作伙伴</span>
                }
            }
        },
        {
            title: '创建时间',
            key: 'createTime',
            render: (text, record) => <p>{formatDate(record.create_time) || '时间格式错误'}</p>
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => {
                        this.updateCoo(item)
                    }} style={{background: '#108ee9'}}>编辑</a>
                </p>
                <p>
                    <a onClick={() => {
                        this.delCoo(item)
                    }} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
            </div>)
        }]
    }

    doInit = (data) => {
        let {dispatch, pageData, filter} = this.props
        let sendData = {
            ...filter,
            pageSize: 100,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getCooperationList(sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    changePage = (page) => {
        this.setState({
            loading: true
        })
        const {dispatch} = this.props
        dispatch(setPageData({'currPage': page}))
        this.doInit({'currentPage': page, type: this.state.newsStatus})
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'type': value}))
        this.setState({
            newsStatus: value
        })
        this.doInit({'currentPage': 1, type: value})
    }

    // 编辑底部连接
    updateCoo = (item) => {
        this.props.dispatch(setFormData(item))
        if (parseInt(this.props.filter.type) === 3) {
            this.setState({
                imageList: [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: item.image
                }],
                image: item.image
            })
        }
        this.setState({
            visible: true
        })
    }

    handleImageChange = ({file, fileList}) => {
        this.setState({
            imageList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                image: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    image: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    image: '',
                    imageList: []
                })
            }
        }
    }

    // 删除底部连接
    delCoo= (item) => {
        let that = this
        Modal.confirm({
            title: '提示',
            content: `确认要删除该友情链接?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    type: item.type
                }
                axiosAjax('POST', '/news/delfooterinfo', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        that.doInit()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 提交表单
    submitForm = () => {
        let that = this
        const {form, formData, filter} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            if (parseInt(filter.type) === 3) {
                values.image = this.state.image
            }
            if (formData.id) {
                axiosAjax('post', '/news/updatefooterinfo', {...values, id: formData.id, type: this.state.newsStatus}, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        that.setState({ visible: false })
                        this.props.dispatch(setFormData({name: '', url: '', show_num: '', id: ''}))
                        that.doInit({type: this.state.newsStatus})
                        form.resetFields()
                    } else {
                        message.success(data.msg)
                    }
                })
            } else {
                axiosAjax('post', '/news/addfooterinfo', {...values, type: this.state.newsStatus}, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        that.setState({ visible: false })
                        this.props.dispatch(setFormData({name: '', url: '', show_num: '', id: ''}))
                        that.doInit({type: this.state.newsStatus})
                        form.resetFields()
                    } else {
                        message.success(data.msg)
                    }
                })
            }
        })
    }

    // 修改序列号
    getOrderNum = (value) => {
        this.setState({
            order: value
        })
    }

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleCancel = () => this.setState({previewVisible: false})

    // 取消
    cancelModal = () => {
        const {form, dispatch} = this.props
        dispatch(setFormData({name: '', url: '', show_num: '', id: '', image: ''}))
        form.resetFields()
        this.setState({visible: false})
    }

    render () {
        let {pageData, filter, formData, form, maxNum} = this.props
        const {imageList, previewImage, previewVisible, visible} = this.state
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        const { getFieldDecorator } = form
        let list = this.props.cooList
        return (
            <div className="cooperation">
                <Row>
                    <Col>
                        <span>当前分类：</span>
                        <Select defaultValue={`${filter.type}`} style={{ width: 100 }} onChange={this.handleChange}>
                            <Option value="1">友情链接</Option>
                            <Option value="2">热门标签</Option>
                            <Option value="3">合作伙伴</Option>
                        </Select>
                        <span>
                            <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                                this.setState({
                                    imageList: [],
                                    image: '',
                                    visible: true
                                })
                            }}><IconItem type="icon-post-send"/>新增</Button>
                        </span>
                    </Col>
                </Row>
                <div className="mt30">
                    <Spin spinning={this.state.loading} size="large">
                        <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}}/>
                    </Spin>
                </div>
                <Modal
                    title="添加/修改链接信息"
                    visible={visible}
                    onOk={this.submitForm}
                    onCancel={ this.cancelModal }
                >
                    <Form>
                        <FormItem {...formItemLayout} label="名称">
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请输入名称!'
                                }],
                                initialValue: formData.name
                            })(
                                <Input disabled = {!!formData.id}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="链接地址">
                            {getFieldDecorator('url', {
                                rules: [{
                                    required: true, message: '请输入网址!'
                                }, {
                                    type: 'url', message: '格式：http://www.huoxing24.com'
                                }],
                                initialValue: formData.url
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="当前序号">
                            {getFieldDecorator('showNum', {
                                rules: [{
                                    required: true, message: '请输入序列号!'
                                }, {
                                    pattern: /^[1-9][0-9]*$/, message: '请输入正整数，例如：1、2、13等；错误格式：01、1.0'
                                }],
                                initialValue: formData.show_num ? formData.show_num : (maxNum + 1)
                            })(
                                <InputNumber min={1} max={maxNum + 1} type="number" onChange={this.getOrderNum}/>
                            )}
                        </FormItem>
                        {parseInt(filter.type) === 3 && visible && <FormItem
                            {...formItemLayout}
                            label="Logo: "
                            className='upload-div'
                        >
                            <div className="dropbox">
                                {getFieldDecorator('image', {
                                    initialValue: formData.image ? imageList : '',
                                    rules: [{required: true, message: '请上传合作方logo！'}]
                                })(
                                    <Upload
                                        headers={{'Sign-Param': getSig()}}
                                        action={`${URL}/pic/upload`}
                                        name='uploadFile'
                                        listType="picture-card"
                                        fileList={imageList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleImageChange}
                                    >
                                        {imageList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                            </div>
                        </FormItem> }
                    </Form>
                </Modal>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Form.create()(Cooperation))
