/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Icon, Modal, message } from 'antd'
import {getAuthorityList, delAuthorityListItem, addAuthorityQuery, addAuthorityData} from '../../actions/useless/authority.action'
import {axiosPost} from '../../public/index'
import './system.scss'
import SystemEdit from './system.edit'
let dataSource = []
let columns = []
const confirm = Modal.confirm

class SystemIndex extends Component {
    constructor () {
        super()

        this.state = {
            'editModalShow': false,
            'editModalType': 'add'
        }
    }
    componentWillMount () {
        this.doSearch()
        dataSource = [{
            key: '1',
            name: 'zhangsan@linekong.com',
            role: '管理员',
            item: '黎明之光、苍穹之剑'

        }, {
            key: '2',
            name: 'zhangsan@linekong.com',
            role: '管理员',
            item: '黎明之光'
        }]

        columns = [{
            title: '邮箱账号 ',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '角色 ',
            dataIndex: 'role',
            key: 'role'
        }, {
            title: '项目权限 ',
            dataIndex: 'item',
            key: 'item'
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <a className="mr10" href="javascript:void(0)" onClick={() => this.editWord(item)}>编辑项目权限</a>
                <a className="mr10" href="javascript:void(0)" onClick={() => this.delUser(item)}>删除用户</a>
            </div>)
        }]
    }

    doSearch (data) {
        const {dispatch} = this.props
        let sendData = !data ? {} : data
        dispatch(getAuthorityList(sendData))
    }

    editWord (item) {
        const {dispatch} = this.props
        this.setState({'editModalShow': true, 'editModalType': 'edit'})
        dispatch(addAuthorityQuery(item))
    }

    submitEdit (sendData) {
        const {editModalType} = this.state
        const {query, dispatch} = this.props
        let _url = `/i18n/${editModalType === 'edit' ? 'update' : 'add'}`
        let _sendData = editModalType === 'edit' ? {...sendData, id: query.id} : sendData
        axiosPost(_url, _sendData, (res) => {
            if (res.status === 200) {
                message.success('操作成功！')
                this.setState({'editModalShow': false})
                dispatch(addAuthorityData({'query': {}}))
                this.doSearch()
            } else {
                message.error(res.message)
            }
        })
    }

    delUser (item) {
        const {dispatch} = this.props
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                dispatch(delAuthorityListItem({id: item.id}, item.key))
            }
        })
    }
    render () {
        // const {list} = this.props
        return <div className="system-main">
            <Row>
                {/* <Col span={5}>
                    <Input
                        placeholder="请输入词条key"
                        prefix={<Icon type="search" />}
                    />
                </Col>
                <Col offset={1} span={2}>
                    <Button className="mr10" type="primary">搜索</Button>
                </Col> */}
                <Col span={24} className="text-right">
                    <Button className="mr10" type="primary" onClick={() => this.setState({'editModalShow': true, 'editModalType': 'add'})}><Icon type="plus" />新增用户</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Table dataSource={dataSource} columns={columns} bordered pagination={false} />
                {/* <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={false} /> */}
            </div>
            {/* 权限添加，修改 */}
            <SystemEdit isShow={this.state.editModalShow} type={this.state.editModalType} submitEdit={() => this.submitEdit()} onClose={() => this.setState({'editModalShow': false})} />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.authorityInfo.list
    }
}

export default connect(mapStateToProps)(SystemIndex)
