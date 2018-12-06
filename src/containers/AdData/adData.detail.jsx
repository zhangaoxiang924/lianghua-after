/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, message, Spin, Button, Form, DatePicker } from 'antd'
import moment from 'moment'
import './index.scss'
import {getAdDataItemInfo, setPageDetailData} from '../../actions/others/AdData.action'
import {formatDate} from '../../public/index'
const {RangePicker} = DatePicker
let columns = []

class AdDataIndex extends Component {
    constructor () {
        super()
        this.state = {
            visible: false,
            loading: true,
            startTime: '',
            endTime: '',
            sortType: '1'
        }
    }

    componentWillMount () {
        this.doSearch('init')
        columns = [{
            title: '日期',
            key: 'createTime',
            width: 280,
            render: (text, record) => {
                return <div className="adData-info clearfix">
                    {formatDate(record.createTime)}
                </div>
            }
        }, {
            title: '点击量(pv)',
            key: 'pv',
            render: (text, record) => record.count
        }]
    }

    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, location} = this.props
        let sendData = {
            statisticId: location.query.id,
            startTime: location.query.time,
            endTime: Date.parse(new Date()),
            currentPage: pageData.currPage
        }
        this.setState({
            loading: true
        })
        sendData = {...sendData, ...data}
        dispatch(getAdDataItemInfo(type, sendData, (res) => {
            this.setState({
                loading: false
            })
            if (res.code !== 1) {
                message.error('请求失败!')
            }
        }))
    }

    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            currentPage: 1
        })
        dispatch(setPageDetailData({'currPage': 1}))
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageDetailData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page})
    }

    handleChange = (date) => {
        this.setState({
            startTime: Date.parse(date[0].format('YYYY-MM-DD HH:mm:ss')),
            endTime: Date.parse(date[1].format('YYYY-MM-DD HH:mm:ss'))
        })
    }

    render () {
        const {list, pageData, location} = this.props
        return <div className="adData-index">
            <span style={{marginLeft: 15}}>时间筛选：</span>
            <RangePicker
                onChange={this.handleChange}
                defaultValue={[moment(formatDate(location.query.time || Date.parse(new Date())), 'YYYY-MM-DD'), moment()]}
                format="YYYY-MM-DD"
            />
            <Button type="primary" style={{marginLeft: 15}} onClick={() => { this._search() }}>确定</Button>
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
        selectedData: state.adDataInfo.selectedData,
        list: state.adDataInfo.listDetail,
        search: state.adDataInfo.search,
        pageData: state.adDataInfo.pageDetailData
    }
}

export default connect(mapStateToProps)(Form.create()(AdDataIndex))
