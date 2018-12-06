/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Form, Input, Upload, Icon, Modal, Button, message, Spin, Radio, Select} from 'antd'
import {getActivityItemInfo} from '../../actions/activity/activity'
import {URL, getSig, activityNameList, actPositionOptions, axiosAjax} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const { TextArea } = Input

class ActivitySend extends Component {
    state = {
        updateOrNot: false,
        previewVisible: false,
        previewImage: '',
        pcImgSrcFileList: [],
        mImgSrcFileList: [],
        pcBigImgFileList: [],
        pcSmallImgFileList: [],
        pcImgSrc: '',
        pcBigImgSrc: '',
        pcSmallImgSrc: '',
        mImgSrc: '',
        loading: false,
        type: '',
        recommend: '1',
        position: '1',
        newsReqType: '1'
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            this.setState({
                loading: true
            })
            dispatch(getActivityItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    position: data.position,
                    updateOrNot: true,
                    mImgSrcFileList: data.mImg ? [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.mImg
                    }] : [],
                    pcImgSrcFileList: data.pcRecommendImg ? [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pcRecommendImg
                    }] : [],
                    pcBigImgFileList: data.pcBigImg ? [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pcBigImg
                    }] : [],
                    pcSmallImgFileList: data.pcSmallImg ? [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: data.pcSmallImg
                    }] : [],
                    pcBigImgSrc: data.pcBigImg,
                    pcSmallImgSrc: data.pcSmallImg,
                    mImgSrc: data.mImg,
                    pcImgSrc: data.pcRecommendImg,
                    loading: false,
                    recommend: data.recommend.toString()
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

    // pc 左侧大图
    handlePcBigImgChange = ({file, fileList}) => {
        this.setState({
            pcBigImgFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcBigImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcBigImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcBigImgSrc: '',
                    pcBigImgFileList: []
                })
            }
        }
    }

    // pc 右侧小图
    handlePcSmallImgChange = ({file, fileList}) => {
        this.setState({
            pcSmallImgFileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pcSmallImgSrc: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pcSmallImgSrc: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pcSmallImgSrc: '',
                    pcSmallImgFileList: []
                })
            }
        }
    }

    recommendOnChange = (e) => {
        this.setState({
            recommend: e.target.value
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
        if (this.state.recommend === '1') {
            this.props.form.setFieldsValue({
                pcRecommendImg: this.state.pcImgSrc,
                mImg: this.state.mImgSrc
            })
        } else if (this.state.recommend === '2') {
            this.props.form.setFieldsValue({
                pcBigImg: this.state.pcBigImgSrc
            })
        } else if (this.state.recommend === '3') {
            this.props.form.setFieldsValue({
                pcSmallImg: this.state.pcSmallImgSrc
            })
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.status = 0
                if (this.state.updateOrNot) {
                    values.id = this.props.location.query.id
                    values.showNum = this.props.activityInfo.showNum
                    values.status = this.props.activityInfo.status
                    axiosAjax('post', '/specialtopic/update', values, (res) => {
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
                    axiosAjax('post', '/specialtopic/add', values, (res) => {
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

    activityNameChange = (value) => {
        // let {form} = this.props
        // if (/^[89]$/.test(value)) {
        //     form.setFieldsValue({
        //         type: value
        //     })
        // }
        this.setState({
            type: value
        })
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {activityInfo} = this.props
        const {pcSmallImgFileList, pcBigImgFileList, previewVisible, previewImage, mImgSrcFileList, updateOrNot, pcImgSrcFileList} = this.state
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

        let formItem = () => {
            if (this.state.recommend === '1') {
                return <div>
                    <FormItem
                        className='activityTitle'
                        {...formItemLayout}
                        label="标题 "
                    >
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && activityInfo) ? `${activityInfo.title}` : '',
                            rules: [{required: true, message: '请输入Activity标题！'}]
                        })(
                            <Input className="activity-name" placeholder="请输入Activity标题"/>
                        )}
                    </FormItem>
                    <FormItem
                        className='activityTitle'
                        {...formItemLayout}
                        label="简介 "
                    >
                        {getFieldDecorator('description', {
                            initialValue: (updateOrNot && activityInfo) ? `${activityInfo.description}` : '',
                            rules: [{required: false, message: '请输入Activity简介！'}]
                        })(
                            <TextArea rows={4} className="activity-name" placeholder="请输入Activity简介"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        className="activityTitle"
                        label='跳转链接'>
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && activityInfo) ? `${(activityInfo.recommend === 1) ? activityInfo.url : ''}` : '',
                            rules: [
                                {type: 'url', message: '请输入正确的超链接！'},
                                {required: true, message: '地址不能为空！'}
                            ]
                        })(<Input placeholder='请输入相关链接'/>)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="pc 端封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pcRecommendImg', {
                                initialValue: (updateOrNot && activityInfo) ? pcImgSrcFileList : '',
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
                            <span className="cover-img-tip">用于 pc 端顶部推荐位封面图展示</span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="M 端封面: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('mImg', {
                                initialValue: (updateOrNot && activityInfo) ? mImgSrcFileList : '',
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
                            <span className="cover-img-tip">用于 M 端顶部推荐位轮播封面图展示</span>
                        </div>
                    </FormItem>
                </div>
            } else if (this.state.recommend === '2') {
                return <FormItem
                    {...formItemLayout}
                    label="底部大图: "
                    className='upload-div'
                >
                    <div className="dropbox">
                        {getFieldDecorator('pcBigImg', {
                            initialValue: (updateOrNot && activityInfo) ? pcBigImgFileList : '',
                            rules: [{required: true, message: '请上传活动页底部大图！'}]
                        })(
                            <Upload
                                headers={{'Sign-Param': getSig()}}
                                action={`${URL}/pic/upload`}
                                name='uploadFile'
                                listType="picture-card"
                                fileList={pcBigImgFileList}
                                onPreview={this.handlePreview}
                                onChange={this.handlePcBigImgChange}
                            >
                                {pcBigImgFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                        <span className="cover-img-tip">用于 pc 端底部左侧大图的轮播展示</span>
                    </div>
                </FormItem>
            } else if (this.state.recommend === '3') {
                return <FormItem
                    {...formItemLayout}
                    label="底部小图: "
                    className='upload-div'
                >
                    <div className="dropbox">
                        {getFieldDecorator('pcSmallImg', {
                            initialValue: (updateOrNot && activityInfo) ? pcSmallImgFileList : '',
                            rules: [{required: true, message: '请上传活动页底部大图！'}]
                        })(
                            <Upload
                                headers={{'Sign-Param': getSig()}}
                                action={`${URL}/pic/upload`}
                                name='uploadFile'
                                listType="picture-card"
                                fileList={pcSmallImgFileList}
                                onPreview={this.handlePreview}
                                onChange={this.handlePcSmallImgChange}
                            >
                                {pcSmallImgFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                        <span className="cover-img-tip">用于 pc 端底部右侧小图的轮播展示</span>
                    </div>
                </FormItem>
            }
        }

        return <div className="activity-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        className="activityTitle"
                        label='活动名称'>
                        {getFieldDecorator('type', {
                            initialValue: (updateOrNot && activityInfo) ? `${activityInfo.type || 'ggfh'}` : 'ggfh',
                            rules: [
                                {required: true, message: '请选择活动名称！'}
                            ]
                        })(
                            <Select
                                style={{ width: 100 }}
                                onChange={this.activityNameChange}
                            >
                                {activityNameList.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        className='activityTitle'
                        {...formItemLayout}
                        label="位置选择"
                    >
                        {getFieldDecorator('recommend', {
                            initialValue: (updateOrNot && activityInfo) ? `${activityInfo.recommend}` : '1',
                            rules: [{required: true, message: '请选择图片展示位置！'}]
                        })(
                            <RadioGroup onChange={this.recommendOnChange}>
                                {actPositionOptions.map((item, index) => {
                                    return <Radio key={index} value={item.value}>{item.label}</Radio>
                                })}
                            </RadioGroup>
                        )}
                    </FormItem>

                    {formItem()}

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
        activityInfo: state.activityInfo.info,
        selectData: state.activityInfo.selectedData,
        channelList: state.channelListInfo
    }
}

export default connect(mapStateToProps)(Form.create()(ActivitySend))
