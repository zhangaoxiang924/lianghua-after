import React, {Component} from 'react'
import { Form, Input, Modal } from 'antd'
import PostEditor from '../../../components/postEditor'
import './index.scss'
const FormItem = Form.Item

class EditorCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            coverImgUrl: '',
            description: '',
            loading: true,
            userType: '1'
        }
    }

    render () {
        const { visible, onCancel, onCreate, form, data } = this.props
        const { getFieldDecorator } = form
        return (
            <Modal
                visible={visible}
                title="修改内容"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
                className="editor-modal"
            >
                <Form>
                    <FormItem>
                        {getFieldDecorator('editorContent', {
                            initialValue: '',
                            rules: [{required: true, message: '请输入直播内容！'}]
                        })(
                            <Input className="news" style={{display: 'none'}}/>
                        )}
                        <PostEditor
                            toolBar={['fontScale', 'image', 'title', 'bold', 'italic', 'underline', 'strikethrough', 'color', 'ol', 'ul', 'alignment']}
                            info={{'postContent': data.content}}
                            subSend={(data) => this.props.editorPost(data)}
                        />
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(EditorCreateForm)
