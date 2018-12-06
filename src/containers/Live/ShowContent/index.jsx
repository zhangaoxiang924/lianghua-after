/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {getLiveContentList} from '../../../actions/live/liveContent.action'
import {formatDate} from '../../../public/index'
import img from '../img/default.png'
class ShowContent extends Component {
    constructor () {
        super()
        this.state = {
            loading: true
        }
    }

    componentWillMount () {
        const {dispatch} = this.props
        dispatch(getLiveContentList('init', {
            castId: this.props.id,
            currentPage: 1,
            pageSize: 30
        }))
        this.setState({
            loading: false
        })
    }

    render () {
        return <div className="live-detail">
            <Spin spinning={this.state.loading} size="large">
                <Row className="item-section">
                    <Col className='item-content'>
                        <p>好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!</p>
                    </Col>
                    <Col className='item-img'>
                        <img src={img} alt=""/>
                        <img src={img} alt=""/>
                        <img src={img} alt=""/>
                    </Col>
                    <Col span={6} className='item-date'>{formatDate(new Date())}</Col>
                    <Col span={6} className='item-opts'>
                        <a>编辑</a>
                        <a>删除</a>
                    </Col>
                </Row>
                <Row className="item-section">
                    <Col className='item-content'>
                        <p>好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!</p>
                    </Col>
                    <Col className='item-img'>
                        <img src={img} alt=""/>
                        <img src={img} alt=""/>
                        <img src={img} alt=""/>
                    </Col>
                    <Col span={6} className='item-date'>{formatDate(new Date())}</Col>
                    <Col span={6} className='item-opts'>
                        <a>编辑</a>
                        <a>删除</a>
                    </Col>
                </Row>
                <Row className="item-section">
                    <Col className='item-content'>
                        <p>好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!</p>
                    </Col>
                    <Col className='item-img'>
                        <img src={img} alt=""/>
                        <img src={img} alt=""/>
                        <img src={img} alt=""/>
                    </Col>
                    <Col span={6} className='item-date'>{formatDate(new Date())}</Col>
                    <Col span={6} className='item-opts'>
                        <a>编辑</a>
                        <a>删除</a>
                    </Col>
                </Row>
                <span className="content-end">已加载全部~</span>
            </Spin>
        </div>
    }
}

export default ShowContent
