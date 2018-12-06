/**
 * Author: yangbo
 * Time: 2018-05-22 14:16:37
 * Description: Description
 */
import {COOPERATION} from '../../constants/index'

let initState = {
    filter: {
        type: '1'
    },
    cooList: [],
    pageData: {
        'currPage': 1,
        'pageSize': 100,
        'totalCount': 1
    },
    newsStatus: '1',
    formData: {
        id: '',
        name: '',
        url: '',
        show_num: ''
    },
    maxNum: 1
}

const cooperationInfo = (state = initState, action) => {
    switch (action.type) {
        case COOPERATION.INIT_COOPERATION:
            return {...state, cooList: action.data.cooList, maxNum: action.data.maxNum}
        case COOPERATION.SET_FILTER_DATA:
            return {...state, filter: {...state.filter, ...action.data}}
        case COOPERATION.SET_FORM_DATA:
            return {...state, formData: {...state.formData, ...action.data}}
    }

    return state
}

export default cooperationInfo
