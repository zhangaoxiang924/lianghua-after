/**
 * Author：tantingting
 * Time：2017/9/25
 * Description：Description
 */

import React, {Component} from 'react'

export default class IconItem extends Component {
    render () {
        const {type} = this.props
        return <i className={`iconfont ${type} mr5`}/>
    }
}
