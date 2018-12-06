import React, {Component} from 'react'
import { Modal, Form, Input, Select } from 'antd'
const FormItem = Form.Item
const {Option} = Select

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: [],
            value: '',
            description: '',
            disabled: true
        }
    }

    render () {
        const { visible, onCancel, onCreate, form } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        return (
            <Modal
                visible={visible}
                title="新增新闻热搜词"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                    >
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true, message: '字段不能为空!'
                            }],
                            initialValue: '1'
                        })(
                            <Select>
                                <Option value="1">评论敏感词</Option>
                                <Option value="2">搜索敏感词</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="敏感词"
                    >
                        {getFieldDecorator('sensitiveWord', {
                            rules: [{
                                required: true, message: '字段不能为空!'
                            }],
                            initialValue: ''
                        })(
                            <Input placeholder="请输入敏感词" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
