import React, {Component} from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

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

    componentWillMount () {
        const {selectedData} = this.props
        this.setState({
            disabled: !selectedData.topOrder
        })
    }

    handleChange = (checked) => {
        const {form} = this.props
        if (!checked) {
            form.setFieldsValue({
                topOrder: 0
            })
        }
        this.setState({
            disabled: !checked
        })
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
                title="版本更新"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="版本号"
                    >
                        {getFieldDecorator('version', {
                            rules: [{
                                required: false, message: '字段不能为空!'
                            }],
                            initialValue: selectedData.version || ''
                        })(
                            <Input placeholder="请输入版本号" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="更新内容">
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true, message: '字段不能为空!'
                            }],
                            initialValue: selectedData.content || ''
                        })(
                            <TextArea rows={8} placeholder="请输入更新内容" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
