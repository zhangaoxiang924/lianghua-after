/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Spin } from 'antd'
import './index.scss'
// import { hashHistory } from 'react-router'
import {getNewsReadCountList, setPageData} from '../../actions/system/countNewsRead.action'
import {flashIdOptions} from '../../public/index'
let columns = []
class FlashIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true
        }
    }

    channelName (id) {
        let name = ''
        flashIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search} = this.props
        this.doSearch(!search.type ? 'init' : search.type)
        columns = [{
            title: '日期',
            key: 'visitDate',
            dataIndex: 'visitDate',
            render: (text) => (<h3>{text}</h3>)
        }, {
            title: '推荐新闻点击量',
            key: 'recNewsVisitCount',
            dataIndex: 'recNewsVisitCount',
            render: (text) => text + '次'
        }, {
            title: '所有新闻点击量',
            key: 'todayNewsVisitCount',
            dataIndex: 'todayNewsVisitCount',
            render: (text) => text + '次'
        }, {
            title: '推荐新闻点击量占比',
            dataIndex: 'recIntodayNews',
            key: 'recIntodayNews',
            render: (text) => (text * 100) + '%'
        }]
    }

    doSearch (type, data) {
        const {dispatch, pageData} = this.props
        this.setState({
            loading: true
        })
        let sendData = {
            'currentPage': pageData.currPage
        }
        sendData = {...sendData, ...data}
        dispatch(getNewsReadCountList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'currentPage': 1})
        dispatch(setPageData({'currPage': 1}))
    }
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page})
    }

    render () {
        const {list, pageData} = this.props
        return <div className="flash-index">
            <div style={{marginTop: 15}}>
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.newsReadCountInfo.list,
        search: state.newsReadCountInfo.search,
        pageData: state.newsReadCountInfo.pageData
    }
}

export default connect(mapStateToProps)(FlashIndex)
