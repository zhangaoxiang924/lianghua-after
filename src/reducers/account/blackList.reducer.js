/**
 * Author: yangbo
 * Time: 2018-05-16 20:26:32
 * Description: Description
 */

import {BLACKLIST} from '../../constants/index'
import {formatDate} from '../../public/index'

let initState = {
    search: { // 搜索
        'phoneNum': ''
    },
    pageData: { // 分页
        'currPage': 1,
        'pageSize': 20,
        'totalCount': 1
    },
    list: [] // 数据列表
}

const blackListInfo = (state = initState, action) => {
    // let _list = state.list
    let search = state.search
    let pageData = state.pageData
    switch (action.type) {
        case BLACKLIST.INIT_DATA:
        case BLACKLIST.ADD_DATA:
        case BLACKLIST.REMOVE_BLACKLIST:
            action.data.list = action.data.list.map(item => {
                return {...item, createTime: formatDate(item.createTime)}
            })
            return {...state, ...action.data}
        case BLACKLIST.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case BLACKLIST.SET_SEARCH_RESULT:
            return {...state, search: {...search, ...action.search}}
        default:
            return state
    }
}

export default blackListInfo
