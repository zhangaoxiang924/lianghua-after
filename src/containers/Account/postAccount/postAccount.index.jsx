/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Form, Upload, Icon, Button } from 'antd'
import './postAccount.scss'
import IconItem from '../../../components/icon/icon'
import {getPostAccountList, setSearchQuery, setPageData, setFilterData, addAccount, selectData} from '../../../actions/account/postAccount.action'
import {axiosAjax, cutString, channelIdOptions, URL, getSig} from '../../../public/index'
import UpdatePsw from './updatepsw'
const confirm = Modal.confirm
const Option = Select.Option
const {TextArea} = Input
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
let columns = []
const FormItem = Form.Item
class PostAccountIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            previewVisible: false,
            previewImage: '',
            visible: false,
            deliveryModal: false,
            confirmDirty: false,
            imageList: [],
            confirmLoading: false,
            image: ''
        }
    }

    channelName (id) {
        let name = ''
        channelIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search, filter, dispatch} = this.props
        this.doSearch('init', {...filter, keyword: search.value})
        columns = [{
            title: '昵称',
            key: 'nickName',
            render: (text, record) => (record && <div className="postAccount-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.nickName, 30))} />
                    {/*
                    <div>
                        {(record.original && parseInt(record.original) === 1) ? <div style={{'display': 'inline-block'}}><span className="green-bg mr10">独家</span></div> : ''}
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block', verticalAlign: 'middle'}}><span className="org-bg mr10">推荐</span></div>}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                        {parseInt(record.topOrder) === 0 ? '' : <Tooltip placement="bottom" title={`置顶失效时间: ${moment(record.setTopOrderTime).format('YYYY年MM月DD日 HH:mm:ss')}`} >
                            <div className="news-top clearfix">
                                <span className="top-bg">置顶</span>
                                <Input
                                    className="top-num"
                                    onBlur = {(e) => this._editTopValue(e, record)}
                                    onChange={(e) => this.changeTopValue(e, record)}
                                    value={record.topOrder}
                                />
                            </div>
                        </Tooltip>}
                    </div>
                    */}
                </div>
            </div>)
        }, {
            title: '头像',
            key: 'iconurl',
            render: (record) => <div
                className="shrinkPic"
                key={record.iconurl}
                style={{
                    background: `url(${record.iconurl}) no-repeat center / cover`
                }}
                src={record.iconurl}
                onClick={this.handlePreview}
            />
        }, {
            title: '手机号',
            width: 150,
            key: 'phoneNum',
            render: (record) => {
                if (record.phoneNum === record.passportId) {
                    return '无'
                } else {
                    return record.phoneNum
                }
            }
        }, {
            title: '简介',
            dataIndex: 'introduce',
            width: 300,
            key: 'introduce'
        }, {
            title: '账号状态',
            key: 'status',
            render: (record) => {
                if (record && record.authorStatus === 2) {
                    return <span className="news-status">已交付</span>
                } if (record && record.authorStatus === 1) {
                    return <span className="news-status pre-publish">未交付</span>
                } else {
                    return <span className="news-status cont-publish">暂无</span>
                }
            }
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                </p>
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.importArticle(item) }} style={{background: '#e29953'}}>导入新闻</a>
                </p>
                {
                    item.authorStatus > 1 ? '' : <p>
                        <a
                            className="mr10 opt-btn"
                            href="javascript:void(0)"
                            onClick={() => {
                                this.setState({deliveryModal: true})
                                dispatch(selectData(item))
                            }}
                            style={{background: '#00a854'}}
                        >
                            交付账号
                        </a>
                    </p>
                }
                <p>
                    <a onClick={() => this.delPostAccount(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                </p>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    handlePreview = (e) => {
        this.setState({
            previewImage: e.target.getAttribute('src') || e.url || e.thumbUrl,
            previewVisible: true
        })
    }

    handleImgModalCancel = () => this.setState({previewVisible: false})

    createMarkup (str) { return {__html: str} }

    updateAccount (item) {
        this.props.dispatch(selectData(item))
        this.setState({
            imageList: item.iconurl && item.iconurl !== '' ? [{
                uid: 0,
                name: 'xxx.png',
                status: 'done',
                url: item.iconurl
            }] : [],
            image: item.iconurl,
            visible: true
        })
    }

    // 导入新闻
    importArticle (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要导入账号相关新闻吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId
                }
                axiosAjax('POST', '/account/author/importnews', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('导入成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        this.setState({
            loading: true
        })
        let sendData = {
            ...filter,
            keyword: search.value,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getPostAccountList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    _search () {
        const {dispatch} = this.props
        let type = 'init'
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }

    // 删除
    delPostAccount (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId
                }
                axiosAjax('POST', '/account/author/delete', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            newsStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    cancelModal = () => {
        const {form, dispatch} = this.props
        dispatch(selectData({}))
        this.setState({
            visible: false,
            imageList: [],
            image: ''
        })
        form.resetFields()
    }

    // 交付账号
    deliveryAccount = () => {
        const This = this
        const {selectedData, dispatch} = this.props
        const form = this.passwordForm.props.form
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            confirm({
                title: '提示',
                content: `确认要交付账号吗 ?`,
                onOk () {
                    axiosAjax('post', '/account/author/trans', {
                        passportId: selectedData.passportId,
                        password: values.password,
                        phonenum: values.phonenum
                    }, (data) => {
                        if (data.code === 1) {
                            message.success('操作成功!')
                            This.setState({ deliveryModal: false })
                            form.resetFields()
                            This.doSearch('init')
                            dispatch(selectData({}))
                        } else {
                            message.success(data.msg)
                        }
                    })
                }
            })
        })
    }

    cancelPasswordModal = () => {
        const {dispatch} = this.props
        const form = this.passwordForm.props.form
        this.setState({deliveryModal: false})
        form.resetFields()
        dispatch(selectData({}))
    }

    handleImgChange = ({file, fileList}) => {
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

    submitAccount () {
        const {dispatch, form, selectedData} = this.props
        const This = this
        form.setFieldsValue({
            iconurl: this.state.image
        })
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            this.setState({
                confirmLoading: true
            })
            let data = {
                nickname: values.nickname,
                introduce: values.introduce,
                iconurl: This.state.image
            }
            if (selectedData.passportId) {
                axiosAjax('post', '/account/author/update', {
                    passportId: selectedData.passportId, ...data
                }, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        this.setState({
                            visible: false,
                            confirmLoading: false
                        })
                        form.resetFields()
                        This.doSearch('init')
                    } else {
                        this.setState({
                            confirmLoading: false
                        })
                        message.success(data.msg)
                    }
                })
            } else {
                dispatch(addAccount(data, (data) => {
                    if (data.code === 1) {
                        this.setState({
                            visible: false,
                            confirmLoading: false
                        })
                        form.resetFields()
                        this.doSearch('init')
                    } else {
                        this.setState({
                            confirmLoading: false
                        })
                    }
                }))
            }
        })
    }

    render () {
        const {list, pageData, filter, form, selectedData, dispatch, search} = this.props
        const { getFieldDecorator } = form
        const {imageList, visible, loading, previewVisible, previewImage, deliveryModal} = this.state
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        return <div className="postAccount-index">
            <Row>
                <Col>
                    <span>账号状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>账号：</span>
                    <Input
                        value={search.value}
                        style={{width: 150, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({value: e.target.value}))}
                        placeholder="输入账号进行搜索"
                        onPressEnter={() => { this._search() }}
                    />

                    <span>
                        <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                    </span>
                    <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                        this.setState({visible: true})
                        dispatch(selectData({}))
                    }}>新增账号</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="添加/修改账号"
                visible={visible}
                confirmLoading={this.state.confirmLoading}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="账号昵称">
                        {getFieldDecorator('nickname', {
                            rules: [{
                                required: true, message: '请输入昵称!'
                            }],
                            initialValue: selectedData.nickName === '' ? '' : selectedData.nickName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="简介">
                        {getFieldDecorator('introduce', {
                            rules: [{
                                required: true, message: '请输入用户简介!'
                            }],
                            initialValue: selectedData.introduce === '' ? '' : selectedData.introduce
                        })(
                            <TextArea rows={4} placeholder="请输入用户简介"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="头像: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('iconurl', {
                                rules: [{ required: true, message: '请上传头像！' }],
                                initialValue: selectedData.nickName === '' ? '' : imageList
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/picture/upload`}
                                    data={{
                                        type: 'user'
                                    }}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={imageList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleImgChange}
                                >
                                    {imageList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <span className="cover-img-tip">头像: <font style={{color: 'red'}}>100 * 100</font></span>
                        </div>
                    </FormItem>
                </Form>
            </Modal>
            <Modal className="pre-Modal" visible={previewVisible} footer={null} onCancel={this.handleImgModalCancel}>
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
            <UpdatePsw
                wrappedComponentRef={(passwordForm) => { this.passwordForm = passwordForm }}
                visible={deliveryModal}
                onCreate={this.deliveryAccount}
                onCancel={ this.cancelPasswordModal }
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        postAccountInfo: state.postAccountInfo,
        list: state.postAccountInfo.list,
        search: state.postAccountInfo.search,
        filter: state.postAccountInfo.filter,
        pageData: state.postAccountInfo.pageData,
        selectedData: state.postAccountInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(PostAccountIndex))
