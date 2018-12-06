/**
 * Created by zhang on 2018/11/5.
 */
import {GETITEM, ALERTLOGIN} from '../../constants/index'

const publicInfo = (state = {
    tempData: {},
    alertOrNot: false
}, action) => {
    switch (action.type) {
        case GETITEM:
            return {...state, tempData: action.payload.item}
        case ALERTLOGIN:
            return {...state, alertOrNot: action.payload}
        default:
            return state
    }
}
export default publicInfo
