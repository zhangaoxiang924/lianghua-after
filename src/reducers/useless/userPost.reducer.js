/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {USERPOST} from '../../constants/index'

const userPostInfo = (state = {search: {'searchQuery': ''}, pageData: {'currPage': 1, 'pageSize': 10, 'totalCount': 0}, commentPageData: {'currPage': 1, 'pageSize': 10, 'totalCount': 0}, postPageData: {'currPage': 1, 'pageSize': 10, 'totalCount': 0}, query: {}, list: [], postList: [], commentList: []}, action) => {
    let search = state.search
    let pageData = state.pageData
    let commentPageData = state.commentPageData
    let postPageData = state.postPageData
    let _query = state.query
    let _list = state.list
    let _postList = state.postList
    let _commentList = state.commentList
    switch (action.type) {
        case USERPOST.ADD_DATA:
            return {...state, ...action.data}
        case USERPOST.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case USERPOST.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case USERPOST.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case USERPOST.SET_POST_LIST_PAGE_DATA:
            return {...state, postPageData: {...postPageData, ...action.data}}
        case USERPOST.SET_COMMENT_LIST_PAGE_DATA:
            return {...state, commentPageData: {...commentPageData, ...action.data}}
        case USERPOST.EDIT_USER_LIST_ITEM:
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
        case USERPOST.EDIT_USER_POST_LIST_ITEM:
            let _thisPostItem = _postList[action.index]
            return {
                ...state,
                postList: [
                    ..._postList.slice(0, action.index), {
                        ..._thisPostItem,
                        ...action.data
                    },
                    ..._postList.slice(action.index + 1)]
            }
        case USERPOST.EDIT_COMMENT_LIST_ITEM:
            let _thisCommentItem = _commentList[action.index]
            return {
                ...state,
                commentList: [
                    ..._commentList.slice(0, action.index), {
                        ..._thisCommentItem,
                        ...action.data
                    },
                    ..._commentList.slice(action.index + 1)]
            }
        case USERPOST.DEL_USER_POST_LIST_ITEM:
            return {...state, postList: [..._postList.slice(0, action.index), ..._postList.slice(action.index + 1)]}
        case USERPOST.DEL_COMMENT_LIST_ITEM:
            return {...state, list: [..._commentList.slice(0, action.index), ..._commentList.slice(action.index + 1)]}
        default:
            return state
    }
}

export default userPostInfo
