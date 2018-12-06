import React, {Component} from 'react'
import { Modal, Form, Select, Spin, InputNumber, Switch } from 'antd'
import {postAjax} from '../../../../public/index'
const FormItem = Form.Item
const Option = Select.Option
let timeout
let currentValue

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: [],
            value: '',
            description: '',
            loading: true,
            userType: '1',
            searching: false,
            disabled: true
        }
    }

    componentWillMount () {
        const {selectedData} = this.props
        this.setState({
            disabled: !selectedData.topOrder
        })
    }

    orderChange = (checked) => {
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

    getAuthorList = (value, callback) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        currentValue = value

        const getList = () => {
            this.setState({
                searching: true
            })
            postAjax(`post`, `/market/coin/querycoins`, {
                value: value,
                currentPage: 1,
                pageSize: 500
            }, (res) => {
                this.setState({
                    searching: false
                })
                if (currentValue === value) {
                    const result = res.data.coin
                    const data = []
                    result.forEach((r) => {
                        data.push({
                            value: r.symbol,
                            text: r.symbol
                        })
                    })
                    callback(data)
                }
            })
        }
        timeout = setTimeout(getList, 100)
    }

    handleChange = (value) => {
        this.setState({
            value: {value: value},
            data: []
        })
        this.getAuthorList(value, data => this.setState({ data }))
    }

    render () {
        const { visible, onCancel, onCreate, form, selectedData } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        const options = this.state.data.map((d, i) => {
            return <Option value={d.value} key={i}>{d.text}</Option>
        })
        return (
            <Modal
                visible={visible}
                title="新增热搜币种"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="热搜币种"
                    >
                        {getFieldDecorator('keyWord', {
                            initialValue: selectedData.id ? {key: selectedData.keyWord, label: selectedData.keyWord} : {key: '', label: ''},
                            rules: [{ required: true, message: '字段不能为空！' }]
                        })(
                            <Select
                                mode="combobox"
                                labelInValue
                                showSearch
                                style={{width: '100%'}}
                                placeholder='请输入币种名'
                                defaultActiveFirstOption={false}
                                notFoundContent={this.state.searching ? <Spin size="small" /> : '未查询到相关内容'}
                                showArrow={true}
                                filterOption={false}
                                onSearch={this.handleChange}
                            >
                                {options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否置顶"
                    >
                        {getFieldDecorator('status', {
                            valuePropName: 'checked',
                            initialValue: !!selectedData.topOrder
                        })(
                            <Switch onChange={this.orderChange} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('topOrder', {
                            rules: [{
                                required: !this.state.disabled, message: '请输入排序号!'
                            }],
                            initialValue: this.state.disabled || !selectedData.topOrder ? 0 : selectedData.topOrder
                        })(
                            <InputNumber min={0} disabled={this.state.disabled} placeholder="值越大, 顺序越靠前" />
                        )}
                        <span>（值越大, 排序越靠前）</span>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
