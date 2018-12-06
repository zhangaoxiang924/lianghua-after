import React, {Component} from 'react'
import { Table, Input, Popconfirm, Button, message } from 'antd'
import {hashHistory} from 'react-router'
import {axiosAjax, axiosPost} from '../../../public/index'
import './index.scss'

const data = []

const EditableCell = ({ editable, value, onChange, type }) => (
    <div>
        {editable ? <Input
            type={type || 'text'}
            style={{ margin: '-5px 0' }}
            value={value}
            onChange={e => onChange(e.target.value)}
        /> : value
        }
    </div>
)

export default class EditableTable extends Component {
    constructor (props) {
        super(props)
        const {dataList, update} = this.props
        this.columns = [{
            title: '文章标题',
            dataIndex: 'title',
            width: '30%',
            render: (text, record) => this.renderColumns(text, record, 'title', 'text')
        }, {
            title: '文章链接(请输入完整的URL地址)',
            dataIndex: 'url',
            width: '35%',
            render: (text, record) => this.renderColumns(text, record, 'url', 'url')
        }, {
            title: '备注',
            dataIndex: 'synopsis',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'synopsis', 'text')
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                const { editable } = record
                return (
                    <div className="editable-row-operations">
                        {
                            editable ? <span>
                                <a onClick={() => this.save(record.key)}>保存</a>
                                <Popconfirm title="确定要放弃修改吗？" onConfirm={() => this.cancel(record.key)}>
                                    <a>取消</a>
                                </Popconfirm>
                            </span> : <a onClick={() => this.edit(record.key)}>编辑</a>
                        }
                        {
                            this.state.data.length > 0 ? (
                                <Popconfirm title="确定要删除吗？" onConfirm={() => this.onDelete(record.key, record)}>
                                    <a href="#">删除</a>
                                </Popconfirm>
                            ) : null
                        }
                    </div>
                )
            }
        }]
        let newData = []
        if (update) {
            dataList.map((item, index) => {
                item.key = index
                newData.push(item)
            })
        }
        this.state = update ? {
            data: newData,
            count: newData.length
        } : {
            data: data,
            count: 1
        }
        this.cacheData = data.map(item => ({ ...item }))
    }

    componentWillUpdate () {
        // console.log(this.props.dataList)
    }

    handleAdd = () => {
        const { count, data } = this.state
        const newData = {
            editable: true,
            key: count,
            title: `标题${count}`,
            url: 'http://www.huoxing24.com/',
            synopsis: `无`
        }
        this.setState({
            data: [newData, ...data],
            count: count + 1
        })
    }

    renderColumns (text, record, column, type) {
        return (
            <EditableCell
                type={type}
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        )
    }

    handleChange (value, key, column) {
        const newData = [...this.state.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
            target[column] = value
            this.setState({ data: newData })
            this.setContentList(newData)
        }
    }

    edit (key) {
        const newData = [...this.state.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
            target.editable = true
            this.setState({ data: newData })
        }
    }

    save (key) {
        const newData = [...this.state.data]
        const target = newData.filter(item => key === item.key)[0]
        if (!this.props.query) {
            if (target) {
                delete target.editable
                this.setState({ data: newData })
                this.cacheData = newData.map(item => ({ ...item }))
                this.setContentList(newData)
            }
        } else {
            let sendData = {}
            for (let key in target) {
                if (key !== 'key' && key !== 'editable') {
                    sendData[key] = target[key]
                }
            }
            if (target && !target.id) {
                let addData = {
                    topic: {
                        id: this.props.query
                    },
                    contentList: []
                }
                addData.contentList.push(sendData)

                // 增加新 content
                axiosPost('/topic/addcontent', {...addData}, (res) => {
                    if (res.code === 1) {
                        delete target.editable
                        target.id = res.obj
                        message.success('操作成功！')
                        this.setState({ data: newData })
                        this.cacheData = newData.map(item => ({ ...item }))
                    } else {
                        message.error(res.msg)
                    }
                })
            } else {
                sendData.status = 1
                delete sendData.key

                // 修改原有的 content
                axiosAjax('POST', '/topic/updatecontent', {...sendData}, (res) => {
                    if (res.code === 1) {
                        delete target.editable
                        this.setState({ data: newData })
                        this.cacheData = newData.map(item => ({ ...item }))
                        message.success('操作成功！')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        }
    }

    onDelete = (key, target) => {
        const dataSource = [...this.state.data]
        if (!target.id) {
            this.setState({ data: dataSource.filter(item => {
                return item.key !== key
            })})
            this.setContentList(dataSource.filter(item => item.key !== key))
        } else {
            let sendData = {
                status: 0
            }
            sendData.id = target.id
            axiosAjax('POST', '/topic/delcontent', {...sendData}, (res) => {
                if (res.code === 1) {
                    message.success('操作成功！')
                    this.setState({ data: dataSource.filter(item => item.key !== key) })
                    this.setContentList(dataSource.filter(item => item.key !== key))
                } else {
                    message.error(res.msg)
                }
            })
        }
    }

    setContentList = (data) => {
        let newData = []
        data.map((item, index) => {
            let newObj = {}
            for (let key in item) {
                if (key !== 'key' && key !== 'editable') {
                    newObj[key] = item[key]
                }
            }
            newData.push(newObj)
        })
        this.props.getData(newData)
    }

    cancel (key) {
        const newData = [...this.state.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
            delete target.editable
            this.setState({ data: newData })
        }
    }

    render () {
        return <div className="editable-table">
            <Button className="editable-add-btn" type="primary" onClick={this.handleAdd}>新增</Button>
            {this.props.backButton ? <Button type="primary" className="cancel" style={{marginLeft: 15}} onClick={() => { hashHistory.goBack() }}>返回</Button> : ''}
            <Table pagination={false} bordered dataSource={this.state.data} columns={this.columns} />
        </div>
    }
}
