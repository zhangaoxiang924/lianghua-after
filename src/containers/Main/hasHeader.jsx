/**
 * Author：tantingting
 * Time：2017/9/5
 * Description：Description
 */
import React, { Component } from 'react'
import MainHeader from './header'
import './hasHeader.scss'

export default class HasHeader extends Component {
    render () {
        return <div className="has-header">
            <MainHeader />
            <div className="game-wrap">{this.props.children}</div>
        </div>
    }
}
