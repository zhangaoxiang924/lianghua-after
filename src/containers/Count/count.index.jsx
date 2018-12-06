import React, { Component } from 'react'
import {connect} from 'react-redux'
// import {Button} from 'antd'
import './index.scss'
import {getCountList} from '../../actions/system/count.action'
import {tranFormat} from '../../public/index'

const mapStateToProps = (state) => {
    return {
        countInfo: state.countInfo
    }
}

class Count extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            selected: 1,
            data: []
        }
    }
    componentDidMount () {
        this.props.dispatch(getCountList({}, (data) => {
            let countData = [
                {name: '今日快讯', count: data.dayLivesCount},
                {name: '今日新闻', count: data.dayNewsCount},
                {name: '昨天新闻', count: data.yesterdayNewsCount},
                {name: '昨天快讯', count: data.yesterdayLivesCount},
                {name: '本周快讯', count: data.weekLivesCount},
                {name: '本周新闻', count: data.weekNewsCount},
                {name: '本月快讯', count: data.monthLivesCount},
                {name: '本月新闻', count: data.monthNewsCount},
                {name: '全部快讯', count: data.totalLivesCount},
                {name: '全部新闻', count: data.totalNewsCount}
            ]
            this.setState({
                data: countData
            })
        }))
    }

    render () {
        return this.state.data.length === 0 ? <div>加载中...</div> : <div className="count-index">
            {this.state.data.map((item, index) => {
                return <div key={index} className="card">
                    <div className="content">
                        <p className="name">{item.name}</p>
                        <p className="number">{tranFormat(item.count || 0)} <span>条</span></p>
                    </div>
                </div>
            })}
        </div>
    }
}

export default connect(mapStateToProps)(Count)
