/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root route
 */

import React from 'react'
import Cookies from 'js-cookie'
import {Route, IndexRoute} from 'react-router'
function isLogin (nextState, replace) {
    let loginStatus = Cookies.get('loginStatus')
    if (!loginStatus || !Cookies.get('hx_id') || !$.parseJSON(loginStatus)) {
        replace('/login')
    }
}
const rootRoutes = <div>
    <Route path="/" onEnter={isLogin} getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Main').default)
        }, 'Main')
    }}>
        <IndexRoute getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.index').default)
            }, 'Enter')
        }}/>
        {/* 新闻管理 */}
        <Route path='/post-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.index').default)
            }, 'PostIndex')
        }}/>
        <Route path='/post-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.detail').default)
            }, 'PostDetail')
        }}/>
        <Route path='/post-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.send').default)
            }, 'PostSend')
        }}/>
        <Route path='/post-channel' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.channel').default)
            }, 'PostChannel')
        }}/>
        {/* 视频管理 */}
        <Route path='/video-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Video/video.index').default)
            }, 'VideoIndex')
        }}/>
        <Route path='/video-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Video/video.detail').default)
            }, 'VideoDetail')
        }}/>
        <Route path='/video-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Video/video.send').default)
            }, 'VideoSend')
        }}/>
        {/* 快讯 */}
        <Route path='/flash-lists' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.index').default)
            }, 'FlashIndex')
        }}/>
        <Route path='/flash-audit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.audit').default)
            }, 'FlashAudit')
        }}/>
        <Route path='/flash-auditEdit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.auditEdit').default)
            }, 'FlashAuditEdit')
        }}/>
        <Route path='/flash-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.detail').default)
            }, 'FlashDetail')
        }}/>
        <Route path='/flash-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.send').default)
            }, 'FlashSend')
        }}/>
        <Route path='/flash-type' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.type.jsx').default)
            }, 'FlashType')
        }}/>
        {/* 评论管理 */}
        <Route path='/comment-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Comment/comment.index').default)
            }, 'CommentIndex')
        }}/>
        <Route path='/postUser' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/User/user.index').default)
            }, 'UserIndex')
        }}/>
        <Route path='/postUser-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/User/user.detail').default)
            }, 'UserDetail')
        }}/>
        <Route path='/images' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Imgs/img.index').default)
            }, 'ImgsIndex')
        }}/>
        {/* <Route path='/gameConfig' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/GameConfig/game.index').default)
            }, 'GameIndex')
        }}/> */}
        <Route path='/language' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Language/language.index').default)
            }, 'LanguageIndex')
        }}/>
        {/* 广告管理 */}
        <Route path='/ad-pc' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/pcAd.index.jsx').default)
            }, 'AdIndex')
        }}/>
        <Route path='/ad-mobile' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/mobileAd.index.jsx').default)
            }, 'AdIndex')
        }}/>
        <Route path='/ad-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/pcAd.send.jsx').default)
            }, 'AdEdit')
        }}/>
        <Route path='/adM-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/mobileAd.send.jsx').default)
            }, 'MAdEdit')
        }}/>
        {/* 认证管理 */}
        <Route path='/audit-identify' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/AuthorAudit/audit.index.jsx').default)
            }, 'AuditIndex')
        }}/>
        <Route path='/audit-details' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/AuthorAudit/audit.detail.jsx').default)
            }, 'AuditDetails')
        }}/>
        <Route path='/audit-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/ArticleAudit/checkArticle.index.jsx').default)
            }, 'ArticleIndex')
        }}/>
        <Route path='/checkArticle-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/ArticleAudit/checkArticle.send.jsx').default)
            }, 'ArticleSend')
        }}/>
        <Route path='/checkArticle-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/ArticleAudit/checkArticle.detail.jsx').default)
            }, 'ArticleDetail')
        }}/>
        <Route path='/audit-official' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/AuthorAudit/official.index.jsx').default)
            }, 'OfficialIndex')
        }}/>
        {/* ICO 管理 */}
        <Route path='/ico-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ico/ico.index.jsx').default)
            }, 'IcoIndex')
        }}/>
        <Route path='/ico-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ico/ico.edit.jsx').default)
            }, 'IcoEdit')
        }}/>
        <Route path='/ico-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ico/ico.detail.jsx').default)
            }, 'IcoDetail')
        }}/>
        {/* 直播管理 */}
        <Route path='/live-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Live/live.index.jsx').default)
            }, 'LiveIndex')
        }}/>
        <Route path='/live-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Live/live.edit.jsx').default)
            }, 'LiveEdit')
        }}/>
        <Route path='/live-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Live/live.detail.jsx').default)
            }, 'LiveDetail')
        }}/>
        <Route path='/live-userList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Live/live.userList.jsx').default)
            }, 'LiveUserList')
        }}/>
        <Route path='/live-userEdit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Live/live.userEdit.jsx').default)
            }, 'LiveUserEdit')
        }}/>
        <Route path='/live-commentList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Live/live.commentList.jsx').default)
            }, 'commentList')
        }}/>
        {/* 新闻专题管理 */}
        <Route path='/specialTopic-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SpecialTopic/specialTopic.index.jsx').default)
            }, 'specialTopicList')
        }}/>
        <Route path='/specialTopic-add' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SpecialTopic/specialTopic.add.jsx').default)
            }, 'SpecialTopicAdd')
        }}/>
        <Route path='/specialTopic-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SpecialTopic/specialTopic.edit.jsx').default)
            }, 'SpecialTopicEdit')
        }}/>
        <Route path='/topicContent-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SpecialTopic/topicContent.edit.jsx').default)
            }, 'TopicContentEdit')
        }}/>
        <Route path='/specialTopic-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SpecialTopic/specialTopic.detail.jsx').default)
            }, 'SpecialTopicDetail')
        }}/>
        {/* 币种推荐/热词搜索管理 */}
        <Route path='/webCoinRecommend-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/WebCoinRecommend/webCoinRecommend.index.jsx').default)
            }, 'WebCoinRecommendList')
        }}/>

        <Route path='/coinRecommend-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/CoinRecommend/coinRecommend.index.jsx').default)
            }, 'CoinRecommendList')
        }}/>

        <Route path='/appGuideCoin-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/AppOpenCoinRecommend/appOpenCoinRecommend.index').default)
            }, 'AppGuideCoinList')
        }}/>

        <Route path='/hotCoin-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/HotCoin/hotCoin.index.jsx').default)
            }, 'HotCoinList')
        }}/>

        <Route path='/newsHotWords-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/NewsHotWords/newsHotWords.index.jsx').default)
            }, 'NewsHotWordsList')
        }}/>

        {/* app 发现页轮播管理 */}
        <Route path='/appTopic-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/AppTopic/appTopic.index.jsx').default)
            }, 'AppTopicList')
        }}/>
        <Route path='/appTopic-add' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/AppTopic/appTopic.add.jsx').default)
            }, 'AppTopicAdd')
        }}/>
        <Route path='/appTopic-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/AppTopic/appTopic.edit.jsx').default)
            }, 'AppTopicEdit')
        }}/>

        {/* pc 和 M 端轮播管理 */}
        <Route path='/banner-topList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.top.jsx').default)
            }, 'BannerTop')
        }}/>
        <Route path='/banner-trList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.topRight.jsx').default)
            }, 'BannerTr')
        }}/>
        <Route path='/banner-activeList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.active.jsx').default)
            }, 'BannerActive')
        }}/>
        <Route path='/banner-productList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.product.jsx').default)
            }, 'BannerProduct')
        }}/>
        <Route path='/banner-add' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.add.jsx').default)
            }, 'BannerAdd')
        }}/>
        {/* 专栏作者管理 */}
        <Route path='/columnAuthor-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ColumnAuthor/columnAuthor.index').default)
            }, 'ColumnAuthorIndex')
        }}/>
        <Route path='/columnAuthor-setTop' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ColumnAuthor/authorTop.edit.jsx').default)
            }, 'ColumnAuthorSetTop')
        }}/>
        {/* 聚合管理 */}
        <Route path='/merge-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/NewsMerge/newsMerge.index').default)
            }, 'NewsMergeIndex')
        }}/>
        <Route path='/merge-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/NewsMerge/newsMerge.edit').default)
            }, 'NewsMergeEdit')
        }}/>
        {/* 账号管理 */}
        <Route path='/account-flashAccount' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Account/flashAccount/flashAccount.index').default)
            }, 'FlashAccount')
        }}/>
        <Route path='/post-account' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Account/postAccount/postAccount.index').default)
            }, 'PostAccount')
        }}/>
        <Route path='/account-blackList' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Account/blackListAccount/blackListAccount').default)
            }, 'BlackListAccount')
        }}/>
        {/* 合作管理 */}
        <Route path='/cooperation' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Cooperation/cooperation.index').default)
            }, 'Cooperation')
        }}/>
        {/* 系统管理员 */}
        <Route path='/systemAccount-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SystemManager/managerAccount.index').default)
            }, 'SystemManager')
        }}/>
        {/* 火星中国行 */}
        <Route path='/marsTrip-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MarsTrip/marsTrip.index').default)
            }, 'MarsTripList')
        }}/>
        <Route path='/registrant-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MarsTrip/registrant.list').default)
            }, 'RegistrantList')
        }}/>
        {/* 简单统计 */}
        <Route path='/count-total' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Count/countTotal.index.jsx').default)
            }, 'Count')
        }}/>
        {/* 简单统计 */}
        <Route path='/count-news' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Count/countNewsRead.index.jsx').default)
            }, 'Count')
        }}/>
        {/* 快讯推送 */}
        <Route path='/push-flash' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/PushManage/FlashPush/flashPush.index').default)
            }, 'PushFlash')
        }}/>
        {/* 活动页面内容管理 */}
        <Route path='/activity-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Activity/activity.index').default)
            }, 'ActivityList')
        }}/>
        <Route path='/activity-add' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Activity/activity.add').default)
            }, 'ActivityAdd')
        }}/>
        {/* 活动发布管理 */}
        <Route path='/activityPublish-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ActivityPublish/activityPublish.index').default)
            }, 'ActivityPublishIndex')
        }}/>
        <Route path='/activityPublish-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ActivityPublish/activityPublish.detail').default)
            }, 'ActivityPublishDetail')
        }}/>
        <Route path='/activityPublish-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ActivityPublish/activityPublish.send').default)
            }, 'ActivityPublishSend')
        }}/>
        <Route path='/activityPublish-city' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ActivityPublish/activityPublish.city').default)
            }, 'ActivityPublishCity')
        }}/>
        {/* 关键词过滤 */}
        <Route path='/wordsFilter' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/WordsFilter/wordsFilter.index.jsx').default)
            }, 'WordsFilter')
        }}/>
        {/* 小程序新闻编辑 */}
        <Route path='/miniNews-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MiniApp/MiniNews/miniNews.index.jsx').default)
            }, 'MiniNewsIndex')
        }}/>
        <Route path='/miniNews-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MiniApp/MiniNews/miniNews.detail.jsx').default)
            }, 'MiniNewsDetail')
        }}/>
        <Route path='/miniNews-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MiniApp/MiniNews/miniNews.update.jsx').default)
            }, 'MiniNewsSend')
        }}/>
        {/* 小程序视频编辑 */}
        <Route path='/miniVideo-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MiniApp/MiniVideo/miniVideo.index.jsx').default)
            }, 'MiniVideoIndex')
        }}/>
        <Route path='/miniVideo-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MiniApp/MiniVideo/miniVideo.detail.jsx').default)
            }, 'MiniVideoDetail')
        }}/>
        <Route path='/miniVideo-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/MiniApp/MiniVideo/miniVideo.update.jsx').default)
            }, 'MiniVideoSend')
        }}/>
        {/* 反馈管理 */}
        <Route path='/feedBack-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/FeedBack/feedBack.index.jsx').default)
            }, 'FeedBackList')
        }}/>
        {/* 视频审核 */}
        <Route path='/audit-video' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/VideoAudit/videoAudit.index.jsx').default)
            }, 'VideoAuditList')
        }}/>
        <Route path='/audit-videoDetail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/VideoAudit/videoAudit.detail.jsx').default)
            }, 'VideoAuditDetail')
        }}/>
        <Route path='/audit-videoSend' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/VideoAudit/videoAudit.send.jsx').default)
            }, 'VideoAuditSend')
        }}/>
        {/* 交易所推荐 */}
        <Route path='/exchangeRecommend-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/ExchangeRecommend/exchangeRecommend.index.jsx').default)
            }, 'ExchangeRecommendList')
        }}/>
        {/* 版本更新内容管理 */}
        <Route path='/version-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/Version/version.index').default)
            }, 'VersionList')
        }}/>
        {/* 热门标签和作者管理 */}
        <Route path='/tagsAndAuthor-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Entries/HotAuthorAndTags/index').default)
            }, 'TagsAndAuthor')
        }}/>
        {/* twitter 列表 */}
        <Route path='/socialMedia-twitter' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SocialMedia/Twitter/twitterFlash').default)
            }, 'SocialMediaTwitter')
        }}/>
        <Route path='/socialMedia-account' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/SocialMedia/Twitter/twitterAccount/twitterAccount.index').default)
            }, 'SocialMediaAccount')
        }}/>
        {/* 广告数据 */}
        <Route path='/adData-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/AdData/adData.index.jsx').default)
            }, 'AdDataIndex')
        }}/>
        <Route path='/adData-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/AdData/adData.detail.jsx').default)
            }, 'AdDataDetail')
        }}/>
        {/* 合作伙伴 */}
        <Route path='/partner-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Partner/user/partner-list.jsx').default)
            }, 'PartnerList')
        }}/>
        <Route path='/partner-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Partner/user/partner-edit.jsx').default)
            }, 'PartnerEdit')
        }}/>
        {/* 委员会 */}
        <Route path='/council-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Council/user/councilList.jsx').default)
            }, 'CouncilList')
        }}/>
        <Route path='/council-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Council/user/councilEdit.jsx').default)
            }, 'CouncilEdit')
        }}/>
        {/* 队伍管理 */}
        <Route path='/team-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.index').default)
            }, 'TeamList')
        }}/>
        <Route path='/team-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.send').default)
            }, 'TeamSend')
        }}/>
        <Route path='/team-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.detail').default)
            }, 'TeamDetail')
        }}/>
        {/* STO嘉宾管理 */}
        <Route path='/sto-userEdit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/STO/user/sto.userEdit.jsx').default)
            }, 'StoUserEdit')
        }}/>
        <Route path='/sto-notice' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/STO/notice/stoNotice.index.jsx').default)
            }, 'StoNoticeEdit')
        }}/>
        <Route path='/sto-partner' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/STO/participate/participate.list').default)
            }, 'StoPartner')
        }}/>
    </Route>
    <Route path='/login' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Login').default)
        }, 'Login')
    }}/>
</div>

export default rootRoutes
