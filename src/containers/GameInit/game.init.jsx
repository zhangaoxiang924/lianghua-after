/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Icon, message } from 'antd'
import {getInitGameList, getInfoById, addInitGameData, addInitGameQuery} from '../../actions/useless/initGame.action'
import {axiosAjax, axiosPost} from '../../public/index'
import {gameStatus} from '../../public/config'
// import './lanhuage.scss'
import GameEdit from './game.edit'
let columns = []

class GameInit extends Component {
    constructor () {
        super()

        this.state = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0,
            'editModalShow': false,
            'editModalType': 'add'
        }
    }
    componentWillMount () {
        this.getGameList({})
        columns = [{
            title: '游戏系列名称 ',
            dataIndex: 'appName',
            key: 'appName'
        }, {
            title: '游戏系列图片 ',
            key: 'appIcon',
            width: '20%',
            render: (record) => (<div className="td-img"><img src={record.appIcon}/></div>)
        }, {
            title: '游戏系列ID ',
            dataIndex: 'appId',
            key: 'appId'
        }, {
            title: '初始化状态 ',
            key: 'status',
            render: (record) => (<div>{gameStatus[record.status]}</div>)
        }, {
            title: '操作',
            key: 'action',
            render: (record) => (<div>
                {
                    !record.status ? <a onClick={() => this.initGameItem(record.appId)} className="mr10" href="javascript:void(0)">初始化</a>
                        : ''
                }

                <a onClick={() => this.editGame(record)} href="javascript:void(0)">修改</a>
            </div>)
        }]
    }

    // 分页
    changePage (page) {
        this.setState({'currPage': page})
        this.getGameList({'page': page})
    }

    // 获取游戏列表
    getGameList (data) {
        const {dispatch} = this.props
        let sendData = {'page': this.state.currPage, 'appName': '', 'Status': '', ...data}
        dispatch(getInitGameList(sendData, (resData) => {
            this.setState({'totalCount': resData.totalCount, 'pageSize': resData.pageSize})
        }))
    }

    // 编辑
    editGame (record) {
        // console.log(record)
        const {dispatch} = this.props
        this.setState({'editModalShow': true, 'editModalType': 'edit'})
        // dispatch(addLanguageQuery({'lang': this.state.lang}))
        dispatch(getInfoById({'appId': record.appId}, (data) => {
            dispatch(addInitGameQuery({fileList: [{
                uid: -1,
                name: '',
                status: 'done',
                url: data.appIcon
            }]}))
        }))
    }

    submitEdit (sendData) {
        const {editModalType} = this.state
        const {dispatch} = this.props
        let _url = `/sysinfo/${editModalType === 'edit' ? 'update' : 'add'}`
        // console.log(_url)
        // let _url = `/i18n/import`
        // let _sendData = editModalType === 'edit' ? {...sendData, appId: query.appId} : sendData
        axiosPost(_url, sendData, (res) => {
            if (res.status === 200) {
                message.success('操作成功！')
                this.setState({'editModalShow': false})
                dispatch(addInitGameData({'query': {}}))
                this.getGameList({})
            } else {
                message.error(res.message)
            }
        })
    }

    // 初始化
    initGameItem (appId) {
        let sendData = {
            'appId': appId
        }
        axiosAjax('post', '/sysinfo/init', {...sendData}, (res) => {
            if (res.status === 200) {
                // const actionData = res.data
                this.getGameList({})
                message.success('初始化成功！')
            } else {
                message.error(res.msg)
            }
        })
    }

    render () {
        const {list, query, dispatch} = this.props
        return <div className="postUser-index">
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
                    <Button className="mr10" type="primary" onClick={() => { this.setState({'editModalShow': true, 'editModalType': 'add'}); dispatch(addInitGameQuery({fileList: []})) }}><Icon type="plus" />新增游戏系列</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: this.state.currPage, total: this.state.totalCount, pageSize: this.state.pageSize, onChange: (page) => this.changePage(page)}} />
            </div>
            {/* 游戏添加，修改 */}
            <GameEdit setFileList={(fileList) => dispatch(addInitGameQuery({fileList: fileList}))} query={query} isShow={this.state.editModalShow} type={this.state.editModalType} submitEdit={(data) => this.submitEdit(data)} onClose={() => { this.setState({'editModalShow': false}); dispatch(addInitGameData({'query': {}})) }}/>
        </div>
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return {
        list: state.InitGameInfo.list,
        query: state.InitGameInfo.query
    }
}

export default connect(mapStateToProps)(GameInit)
