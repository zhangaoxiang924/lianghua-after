/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root reducer
 */

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import publicInfo from './public/index'
import loginInfo from './public/loginInfo'
import partnerInfo from './partner/partner.reducer'
import councilInfo from './council/council.reducer'
import teamInfo from './team/team.reducer'
import channelListInfo from './post/channelList'
import flashTypeListInfo from './flash/flashTypeList'
import gameListInfo from './useless/gameListInfo'
import postInfo from './post/post.reducer'
import videoInfo from './video/video.reducer'
import postChannelInfo from './post/postChannel.reducer'
import commentInfo from './others/comment.reducer'
import flashInfo from './flash/flash.reducer'
import flashAuditInfo from './audit/flashAudit.reducer'
import userPostInfo from './useless/userPost.reducer'
import imgsInfo from './useless/imgs.reducer'
import languageInfo from './useless/language.reducer'
import InitGameInfo from './useless/initGame.reducer'
import authorityInfo from './useless/authority.reducer'
import auditInfo from './audit/audit.reducer'
import officialAuditInfo from './audit/officialAudit.reducer'
import adInfo from './others/ad.reducer'
import articleAudit from './audit/articleAudit.reducer'
import icoInfo from './others/ico.reducer'
import liveInfo from './live/live.reducer'
import specialTopicInfo from './others/specialTopic.reducer'
import appTopicInfo from './app/appTopic.reducer'
import columnAuthorInfo from './others/columnAuthor.reducer'
import newsMergeInfo from './post/newsMerge.reducer'
import liveUserInfo from './live/liveUser.reducer'
import liveContent from './live/liveContent.reducer'
import liveComment from './live/liveComment.reducer'
import flashAccountInfo from './account/flashAccount.reducer'
import postAccountInfo from './account/postAccount.reducer'
import managerAccountInfo from './account/managerAccount.reducer'
import blackListInfo from './account/blackList.reducer'
import cooperationInfo from './entries/cooperation.reducer'
import coinRecommendInfo from './entries/coinRecommend.reducer'
import webCoinRecommendInfo from './entries/webCoinRecommend.reducer'
import hotCoinInfo from './entries/hotCoin.reducer'
import newsHotWordsInfo from './entries/newsHotWords.reducer'
import bannerInfo from './banner/banner.reducer'
import marsTripInfo from './activity/marsTrip.reducer'
import registrantInfo from './activity/registrant.reducer'
import countInfo from './system/count.reducer'
import flashPushInfo from './flash/flashPush.reducer'
import activityInfo from './activity/activity.reducer'
import activityPublishInfo from './activity/activityPublish.reducer'
import activityCityInfo from './activity/activityCity.reducer'
import placeListInfo from './activity/cityList.reducer'
import wordsFilterInfo from './entries/wordsFilter.reducer'
import newsReadCountInfo from './system/newsReadCount.reducer'
import flashTypeInfo from './flash/flashType.reducer'
import miniAppInfo from './miniApp/miniApp.reducer'
import miniVideoInfo from './miniApp/miniVideo.reducer'
import feedBackInfo from './app/feedBack.reducer'
import videoAuditInfo from './audit/videoAudit.reducer'
import exchangeRecommendInfo from './entries/exchangeRecommend.reducer'
import versionInfo from './app/version.reducer'
import hotAuthorAndTagsInfo from './entries/hotAuthorAndTags.reducer'
import twitterInfo from './socialMedia/twitter.reducer'
import adDataInfo from './others/adData.reducer'
import twitterAccountInfo from './socialMedia/twitterAccount.reducer'
import appOpenCoinRecommendInfo from './entries/appOpenCoinRecommend.reducer'
import stoUserInfo from './sto/stoUser.reducer'
import stoNoticeInfo from './sto/stoNotice.reducer'
import participateInfo from './activity/participate.reducer'

const reducers = Object.assign({
    publicInfo,
    loginInfo,
    partnerInfo,
    councilInfo,
    teamInfo,
    channelListInfo,
    flashTypeListInfo,
    gameListInfo,
    postInfo,
    videoInfo,
    postChannelInfo,
    commentInfo,
    userPostInfo,
    imgsInfo,
    flashInfo,
    coinRecommendInfo,
    webCoinRecommendInfo,
    hotCoinInfo,
    newsHotWordsInfo,
    flashAuditInfo,
    languageInfo,
    InitGameInfo,
    authorityInfo,
    adInfo,
    auditInfo,
    officialAuditInfo,
    articleAudit,
    icoInfo,
    liveInfo,
    liveUserInfo,
    liveContent,
    liveComment,
    specialTopicInfo,
    appTopicInfo,
    columnAuthorInfo,
    newsMergeInfo,
    flashAccountInfo,
    managerAccountInfo,
    blackListInfo,
    cooperationInfo,
    bannerInfo,
    marsTripInfo,
    registrantInfo,
    countInfo,
    flashPushInfo,
    activityInfo,
    activityPublishInfo,
    activityCityInfo,
    placeListInfo,
    wordsFilterInfo,
    newsReadCountInfo,
    flashTypeInfo,
    miniAppInfo,
    miniVideoInfo,
    feedBackInfo,
    videoAuditInfo,
    exchangeRecommendInfo,
    versionInfo,
    hotAuthorAndTagsInfo,
    twitterAccountInfo,
    twitterInfo,
    postAccountInfo,
    adDataInfo,
    appOpenCoinRecommendInfo,
    stoUserInfo,
    stoNoticeInfo,
    participateInfo,
    routing: routerReducer
})

const rootReducer = combineReducers(reducers)
export default rootReducer
