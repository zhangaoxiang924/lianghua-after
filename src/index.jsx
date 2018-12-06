/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：outer jsx
 */

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import $ from 'jquery'
import 'babel-polyfill'
import rootRoutes from './routes'
import store from './store/index'
import './public/font.scss'
import './public/index.scss'
import Cookies from 'js-cookie'
const history = syncHistoryWithStore(hashHistory, store)
Cookies.set('hx_domain', location.host)
$('body').append('<div id="root"></div>')
render(<Provider store={store}>
    <Router onUpdate={() => { window.scrollTo(0, 0) }} history={history}>
        {rootRoutes}
    </Router>
</Provider>, document.getElementById('root'))
