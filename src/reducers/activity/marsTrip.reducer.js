/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {MARSTRIP, SELECTEDDATA} from '../../constants/index'

const marsTripInfo = (state = {
    filter: {
        status: ''
    },
    search: {
        'nickName': '',
        'value': '',
        'type': 'init'
    },
    pageData: {
        'currPage': 1,
        'pageSize': 20,
        'totalCount': 0
    },
    query: {},
    list: [],
    userInfo: {
        'name': '',
        'pwd': ''
    },
    info: {},
    replyList: [],
    selectedData: {
        cityNum: ''
    }
}, action) => {
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case MARSTRIP.ADD_DATA:
            return {...state, ...action.data}
        case MARSTRIP.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case MARSTRIP.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case MARSTRIP.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case MARSTRIP.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case MARSTRIP.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case MARSTRIP.EDIT_LIST_ITEM:
            let _thisItem = _list[action.index]
            return {
                ...state,
                list: [
                    ..._list.slice(0, action.index), {
                        ..._thisItem,
                        ...action.data
                    },
                    ..._list.slice(action.index + 1)]
            }
        case MARSTRIP.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default marsTripInfo
