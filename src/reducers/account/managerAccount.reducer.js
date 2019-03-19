/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {MANAGERACCOUNT, SELECTEDDATA} from '../../constants/index'

const managerAccountInfo = (state = {
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
        passportId: ''
    }
}, action) => {
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case MANAGERACCOUNT.ADD_DATA:
            return {...state, ...action.data}
        case MANAGERACCOUNT.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case MANAGERACCOUNT.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case MANAGERACCOUNT.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case MANAGERACCOUNT.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default managerAccountInfo
