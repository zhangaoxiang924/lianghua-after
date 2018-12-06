/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import menu from '../../public/menuData'
import { Menu } from 'antd'
import {getCrumbKey} from '../../public/index'
import IconItem from '../../components/icon/icon'
import Cookies from 'js-cookie'
const {SubMenu, Item} = Menu

class Left extends Component {
    render () {
        const {location} = this.props
        return <Menu
            className="shop-menu"
            selectedKeys={getCrumbKey(location)}
            defaultOpenKeys={getCrumbKey(location)}
            mode="inline">
            {(() => {
                if (parseInt(Cookies.get('hx_role')) !== 5) {
                    return menu.menuData().map(d => {
                        if (d.children) {
                            return <SubMenu
                                key={d.key}
                                title={<span><IconItem type={d.icon}/>{d.text}</span>}>
                                {d.children.map(data => {
                                    if (data.children) {
                                        return <SubMenu
                                            key={data.key}
                                            title={<span><IconItem type={data.icon}/>{data.text}</span>}>
                                            {data.children.map(item => {
                                                return <Item key={item.key}>
                                                    <span><IconItem type={item.icon}/><span>{item.text}</span></span>
                                                    <Link to = {{'pathname': item.link}}/>
                                                </Item>
                                            })}
                                        </SubMenu>
                                    } else {
                                        return <Item key={data.key}>
                                            <span><IconItem type={data.icon}/><span>{data.text}</span></span>
                                            <Link to = {{'pathname': data.link}}/>
                                        </Item>
                                    }
                                })}
                            </SubMenu>
                        } else {
                            if (parseInt(Cookies.get('hx_role')) !== 3) {
                                if (d.link !== '/systemAccount-list') {
                                    return <Item key={d.key}>
                                        <span><IconItem type={d.icon}/><span>{d.text}</span></span>
                                        <Link to = {{'pathname': d.link}}/>
                                    </Item>
                                }
                            } else {
                                return <Item key={d.key}>
                                    <span><IconItem type={d.icon}/><span>{d.text}</span></span>
                                    <Link to = {{'pathname': d.link}}/>
                                </Item>
                            }
                        }
                    })
                } else {
                    return <Item key='marsTrip'>
                        <span><IconItem type='icon-mars' /><span>火星中国行</span></span>
                        <Link to={{'pathname': '/marsTrip-list'}}/>
                    </Item>
                }
            })()}
        </Menu>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(Left)
