/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {SPECIALTOPIC, SELECTEDDATA} from '../../constants/index'

const specialTopicInfo = (
    state = {
        contentList: [],
        filter: {status: '1', recommend: ''},
        search: {'nickName': '', 'search': '', 'type': 'init', symbol: ''},
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
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case SPECIALTOPIC.ADD_DATA:
            return {...state, ...action.data}
        case SPECIALTOPIC.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case SPECIALTOPIC.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case SPECIALTOPIC.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case SPECIALTOPIC.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case SPECIALTOPIC.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case SPECIALTOPIC.EDIT_LIST_ITEM:
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
        case SPECIALTOPIC.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SPECIALTOPIC.GET_TOP_NUM:
            return {...state, numArr: action.actionData}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default specialTopicInfo
