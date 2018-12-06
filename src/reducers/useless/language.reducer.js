/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {LANGUAGE} from '../../constants/index'

const languageInfo = (state = {query: {}, list: [], successList: [], repeatList: [], selectData: {}, language: {}}, action) => {
    let _query = state.query
    let _list = state.list
    let _repeatList = state.repeatList
    let _selectData = state.selectData
    switch (action.type) {
        case LANGUAGE.ADD_DATA:
            return {...state, ...action.data}
        case LANGUAGE.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case LANGUAGE.EDIT_LIST_ITEM:
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
        case LANGUAGE.EDIT_REPEAT_LIST_ITEM:
            let _thisRepeatItem = _repeatList[action.index]
            return {
                ...state,
                list: [
                    ..._repeatList.slice(0, action.index), {
                        ..._thisRepeatItem,
                        ...action.data
                    },
                    ..._repeatList.slice(action.index + 1)]
            }
        case LANGUAGE.SELECT_REPEAT_LIST_ITEM:
            if (!action.isChk) {
                // 取消
                delete _selectData[action.data.id]
            } else {
                // 选择
                _selectData = {..._selectData, [action.data.id]: action.data}
            }
            return {...state, selectData: _selectData}
        case LANGUAGE.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        default:
            return state
    }
}

export default languageInfo
