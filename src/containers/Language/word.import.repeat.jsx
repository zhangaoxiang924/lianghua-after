/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Row, Col, Button, Table, Checkbox } from 'antd'
let dataSource = []
let columns = []
class WordImportRepeat extends Component {
    componentWillMount () {
        dataSource = [{
            key: '1',
            wordKey: 'home',
            wordValue: '首页'
        }, {
            key: '2',
            wordKey: 'bbs',
            wordValue: '论坛'
        }]

        columns = [{
            title: <Checkbox />,
            key: 'checkbox',
            width: 60,
            render: () => <Checkbox />
        }, {
            title: '词条key（当前译文）',
            dataIndex: 'wordKey',
            key: 'wordKey'
        }, {
            title: '导入词条译文 ',
            dataIndex: 'wordValue',
            key: 'wordValue'
        }, {
            title: '操作',
            key: 'action',
            render: () => (<div>
                <a className="mr10" href="javascript:void(0)">替换</a>
                <a className="mr10" href="javascript:void(0)">作废</a>
            </div>)
        }]
    }
    render () {
        return <div>
            <Row className="mb15">
                <Col className="text-right">
                    <Button type="primary" className="mr10">导出重复项</Button>
                    <Button type="primary" className="mr10">批量替换</Button>
                    <Button type="primary">批量作废</Button>
                </Col>
            </Row>
            <Table dataSource={dataSource} columns={columns} bordered />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(WordImportRepeat)
