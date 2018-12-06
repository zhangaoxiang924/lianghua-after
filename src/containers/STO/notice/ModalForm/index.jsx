import React, {Component} from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item
const {TextArea} = Input

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: [],
            disabled: true
        }
    }

    render () {
        const { visible, onCancel, onCreate, form, selectedData } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        return (
            <Modal
                visible={visible}
                title="新增STO公告"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="标题"
                    >
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true, message: '字段不能为空!'
                            }],
                            initialValue: selectedData.title || ''
                        })(
                            <Input placeholder="请输入公告标题" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容"
                    >
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true, message: '字段不能为空!'
                            }],
                            initialValue: selectedData.content || ''
                        })(
                            <TextArea rows={6} placeholder="请输入公告内容" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
