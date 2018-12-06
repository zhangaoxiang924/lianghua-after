/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {APPTOPIC, SELECTEDDATA} from '../../constants/index'

const appTopicInfo = (
    state = {
        contentList: [],
        filter: {status: '1', type: '0'},
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
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case APPTOPIC.ADD_DATA:
            return {...state, ...action.data}
        case APPTOPIC.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case APPTOPIC.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case APPTOPIC.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case APPTOPIC.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case APPTOPIC.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case APPTOPIC.EDIT_LIST_ITEM:
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
        case APPTOPIC.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case APPTOPIC.GET_TOP_NUM:
            return {...state, numArr: action.actionData}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default appTopicInfo
