/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { ACTIVITYCITY } from '../../constants/index'

const channelListInfo = (state = [], action) => {
    switch (action.type) {
        case ACTIVITYCITY:
            return action.placeListOptions
        default:
            return state
    }
}

export default channelListInfo
