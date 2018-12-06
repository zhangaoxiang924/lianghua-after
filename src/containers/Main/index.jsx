/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：main
 */

import React, { Component } from 'react'
import { Layout, Breadcrumb } from 'antd'
import './index.scss'
import MainHeader from './header'
import AlertLogin from '../AlertLogin'
import Left from './left'
import {NavKey} from '../../public/config'
import {getCrumbKey} from '../../public/index'
const {Content, Sider} = Layout

export default class Main extends Component {
    state = {
        collapsed: false
    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed })
    }
    render () {
        const {location} = this.props
        return <Layout>
            <MainHeader />
            <Layout>
                <Sider
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    width={200}
                    className="shop-slider">
                    <Left location = {location} />
                </Sider>
                <Layout className="shop-content-wrap">
                    <Breadcrumb className="shop-breadcrumb">
                        {
                            getCrumbKey(location).map((item, index) => <Breadcrumb.Item key={index}>{NavKey[item]}</Breadcrumb.Item>)
                        }
                    </Breadcrumb>
                    <Content className="shop-content">
                        { this.props.children}
                    </Content>
                </Layout>
            </Layout>
            <AlertLogin />
        </Layout>
    }
}
