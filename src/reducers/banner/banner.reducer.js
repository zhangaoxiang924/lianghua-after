/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {BANNER, SELECTEDDATA} from '../../constants/index'

const bannerInfo = (
    state = {
        contentList: [],
        filter: {status: '', position: '0'},
        search: {'nickName': '', 'title': '', 'type': 'init', symbol: ''},
        pageData: {'currentPage': 1, 'pageSize': 10, 'totalCount': 0},
        query: {},
        list: [],
        userInfo: {'name': '', 'pwd': ''},
        info: {},
        zcrList: [],
        guestList: [],
        replyList: [],
        numArr: []
    }, action) => {
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case BANNER.ADD_DATA:
            return {...state, ...action.data}
        case BANNER.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case BANNER.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case BANNER.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case BANNER.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default bannerInfo
