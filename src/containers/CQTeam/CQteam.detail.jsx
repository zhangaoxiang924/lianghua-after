/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, Tag, Spin} from 'antd'
import {hashHistory} from 'react-router'
import IconItem from '../../components/icon/icon'
import {getCQTeamItemInfo} from '../../actions/CQteam/CQteam.action'
// import {axiosAjax, isJsonString} from '../../public/index'
import './index.scss'

class CQteamDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: true,
            previewVisible: false,
            previewImage: ''
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getCQTeamItemInfo({'teamId': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
    }

    edit = () => {
        const {info} = this.props
        hashHistory.push({
            pathname: '/CQteam-send',
            query: {id: info.id}
        })
    }

    render () {
        const col = {
            md: {
                span: 15
            },
            lg: {
                span: 7,
                offset: 1
            }
        }
        const {info} = this.props
        return <Spin spinning={this.state.loading} size="large">
            {info.id ? <div className="CQTeam-detail">
                <Row>
                    <Col span={1}>
                        <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()}/>
                    </Col>
                    <Col className="text-right" span={20} offset={3}>
                        <Button onClick={this.edit} className="mr10" type="primary"><IconItem type="icon-edit"/>编辑</Button>
                    </Col>
                </Row>
                <Row className="CQTeam-detail-info">
                    <Col className="section" {...col}>
                        <span className="name">作者：</span>
                        <span className="desc">{`${info.author}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">新闻来源：</span>
                        <span className="desc">{`${info.source}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">类别：</span>
                        <span className="desc">{`${info.cateId === 1 ? '原创' : '转载'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">独家：</span>
                        <span className="desc">{`${(info.original && parseInt(info.original) === 1) ? '是' : '否'}`} </span>
                    </Col>
                </Row>
                <Row className="CQTeam-tags">
                    <Col className="section">
                        <span className="name">标签：</span>
                        {info.tags && info.tags.split(',').map((item, index) => {
                            return <Tag key={index} color="blue" style={{marginLeft: 5}}>{item}</Tag>
                        })}
                    </Col>
                </Row>
                <Row className="CQTeam-title">
                    <Col className="section">
                        <span className="name">新闻标题：</span>
                        <span className="desc">{`${info.title}`} </span>
                    </Col>
                </Row>
                <Row className="CQTeam-summary">
                    <Col className="section">
                        <span className="name">新闻摘要：</span>
                        <span className="desc">{`${info.synopsis}`} </span>
                    </Col>
                </Row>
            </div> : <div style={{height: 300}}>加载中...</div>}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.CQTeamInfo.info
    }
}

export default connect(mapStateToProps)(CQteamDetail)
