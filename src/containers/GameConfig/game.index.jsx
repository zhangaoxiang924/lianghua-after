/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Input, Form, Button, Upload, Icon, Modal, message } from 'antd'
// import './config.scss'
import {axiosFormData, URL} from '../../public/index'
import IconItem from '../../components/icon/icon'
// import {addGameData} from '../../actions/other.action'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 12}
}
class GameIndex extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            'file': null,
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: `${URL}${$.cookie('gameIcon')}`
            }]
        }
    }
    handleCancel = () => this.setState({ previewVisible: false })
    beforeUpload = (file, fileList) => {
        this.setState({'file': file})
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = ({fileList}) => {
        let _fileList = fileList.slice(1)
        fileList.length < 2 ? this.setState({fileList}) : this.setState({fileList: _fileList})
    }
    /*
    * 添加游戏
    * */
    submitForm = () => {
        const { form } = this.props
        form.validateFields((err, fieldValues) => {
            if (err) {
                return
            }
            let files = this.state.file
            var formData = new FormData()
            formData.append('lk_game_file', files)
            formData.append('lk_game_name', fieldValues.lk_game_name)
            axiosFormData('POST', '/api_game_up', formData, function (res) {
                if (res.code === 200) {
                    message.success('修改成功！')
                    // dispatch(addGameData({'gameName': fieldValues.lk_game_name, 'gameIcon': res.data.lk_game_file}))
                    $.cookie('gameName', fieldValues.lk_game_name)
                    $.cookie('gameIcon', res.data.lk_game_file)
                } else {
                    message.warning(res.message)
                }
            })
        })
    }
    render () {
        const {getFieldDecorator} = this.props.form
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return <div className="game-config common">
            <Form>
                <FormItem label="游戏名称" {...formItemLayout}>
                    {getFieldDecorator('lk_game_name', {
                        rules: [{
                            required: true, message: '请输入游戏名称！'
                        }],
                        initialValue: $.cookie('gameName')
                    })(
                        <Row>
                            <Col span={12} ><Input defaultValue={$.cookie('gameName')} /></Col>
                        </Row>
                    )}
                </FormItem>
                <FormItem label="游戏图标" {...formItemLayout}>
                    <div>（尺寸512*512，格式JPEG和PNG，大小2M以下)</div>
                    {getFieldDecorator('lk_game_file', {
                        initialValue: $.cookie('gameIcon')
                    })(
                        <div className="clearfix">
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                listType="picture-card"
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}
                            >
                                {this.state.fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                        </div>
                    )}
                </FormItem>
                <FormItem>
                    <Row>
                        <Col offset={2}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => { this.submitForm() }}
                            >
                                <IconItem type="icon-save"/>保存
                            </Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}
export default connect(mapStateToProps)(Form.create()(GameIndex))
