/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Table } from 'antd'
let dataSource = []
let columns = []
class WordImportSuccess extends Component {
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
            title: '词条key ',
            dataIndex: 'wordKey',
            key: 'wordKey'
        }, {
            title: '导入词条译文 ',
            dataIndex: 'wordValue',
            key: 'wordValue'
        }]
    }
    render () {
        return <div>
            <Table dataSource={dataSource} columns={columns} bordered />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(WordImportSuccess)
