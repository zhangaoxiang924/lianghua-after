/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：menu data
 * , {
        key: 'postUser',
        icon: 'icon-postUser',
        link: '/postUser',
        text: '用户管理'
    }, {
        key: 'images',
        icon: 'icon-images',
        link: '/images',
        text: '图片鉴别'
    }, {
        key: 'language',
        icon: 'icon-language',
        link: '/language',
        text: '多语言词条管理'
    }
 */
import Cookies from 'js-cookie'
const basic = [
    /*
    {
        key: 'count',
        icon: 'icon-count',
        link: '',
        text: `简单数据统计`,
        children: [
            {
                key: 'count-total',
                icon: 'icon-count',
                link: '/count-total',
                text: '发布数量统计'
            }, {
                key: 'count-news',
                icon: 'icon-count',
                link: '/count-news',
                text: '新闻阅读统计'
            }
        ]
    }, {
        key: 'sto',
        symbol: 27,
        icon: 'icon-sto',
        link: '',
        text: 'STO',
        children: [
            {
                key: 'sto-userList',
                icon: 'icon-accountManager',
                link: '/sto-userList',
                text: '顾问管理'
            }, {
                key: 'sto-notice',
                icon: 'icon-flash',
                link: '/sto-notice',
                text: '公告管理'
            }, {
                key: 'sto-partner',
                icon: 'icon-accountManager',
                link: '/sto-partner',
                text: '报名人员管理'
            }
        ]
    }, {
        key: 'socialMedia',
        symbol: 24,
        icon: 'icon-socialMedia',
        link: '/socialMedia-twitter',
        text: '工作台'
    }, {
        key: 'post',
        symbol: 1,
        icon: 'icon-post',
        link: '',
        text: '新闻管理',
        children: [
            {
                key: 'post-list',
                icon: 'icon-post-list',
                link: '/post-list',
                text: '新闻列表'
            }, {
                key: 'post-send',
                icon: 'icon-post-send',
                link: '/post-send',
                text: '新闻添加/编辑'
            }, {
                key: 'post-channel',
                icon: 'icon-post-channel',
                link: '/post-channel',
                text: '频道管理'
            }, {
                key: 'post-account',
                icon: 'icon-post-channel',
                link: '/post-account',
                text: '新闻账号管理'
            }
        ]
    }, {
        key: 'flash',
        symbol: 4,
        icon: 'icon-flash',
        link: '',
        text: '快讯管理',
        children: [
            {
                key: 'flash-lists',
                icon: 'icon-flash-list',
                link: '/flash-lists',
                text: '快讯列表'
            }, {
                key: 'flash-edit',
                icon: 'icon-flash-send',
                link: '/flash-edit',
                text: '快讯添加/编辑'
            }, {
                key: 'flash-type',
                icon: 'icon-post-channel',
                link: '/flash-type',
                text: '快讯频道管理'
            }, {
                key: 'flash-audit',
                icon: 'icon-flash-audit',
                link: '/flash-audit',
                text: '快讯审核'
            }
        ]
    }, {
        key: 'audit',
        symbol: 3,
        icon: 'icon-audit',
        link: '',
        text: '审核管理',
        children: [
            {
                key: 'audit-identify',
                icon: 'icon-identify',
                link: '/audit-identify',
                text: '身份认证'
            },
            {
                key: 'audit-official',
                icon: 'icon-identify',
                link: '/audit-official',
                text: '官方添加认证'
            },
            {
                key: 'audit-list',
                icon: 'icon-article',
                link: '/audit-list',
                text: '文章审核'
            },
            {
                key: 'audit-video',
                icon: 'icon-video',
                link: '/audit-video',
                text: '视频审核'
            }
        ]
    }, {
        key: 'merge',
        symbol: 2,
        icon: 'icon-merge',
        link: '/merge-list',
        text: '新闻聚合'
        // children: [
        //     {
        //         key: 'merge-list',
        //         icon: 'icon-post-list',
        //         link: '/merge-list',
        //         text: '新闻主体列表'
        //     }
        // ]
    }, {
        key: 'video',
        symbol: 6,
        icon: 'icon-video',
        link: '/video-list',
        text: '视频管理'
        // children: [
        //     {
        //         key: 'video-list',
        //         icon: 'icon-video-list',
        //         link: '/video-list',
        //         text: '视频列表'
        //     }, {
        //         key: 'video-send',
        //         icon: 'icon-video-send',
        //         link: '/video-send',
        //         text: '视频添加/编辑'
        //     }
        // ]
    }, {
        key: 'miniNews',
        symbol: 7,
        icon: 'icon-miniApp',
        link: '',
        text: '小程序管理',
        children: [
            {
                key: 'miniNews',
                icon: 'icon-miniNews',
                link: '/miniNews-list',
                text: '精选新闻'
            }, {
                key: 'miniVideo',
                icon: 'icon-miniVideo',
                link: '/miniVideo-list',
                text: '精选视频'
            }
        ]
    }, {
        key: 'ad',
        symbol: 5,
        icon: 'icon-ad',
        link: '',
        text: '广告管理',
        children: [
            {
                key: 'ad-pc',
                icon: 'icon-pc-list',
                link: '/ad-pc',
                text: 'PC端广告'
                // children: [
                //     {
                //         key: 'ad-pc',
                //         icon: 'icon-ad-list',
                //         link: '/ad-pc',
                //         text: 'PC端广告'
                //     }
                // ]
            },
            {
                key: 'ad-mobile',
                icon: 'icon-mobile-list',
                link: '/ad-mobile',
                text: '手机端广告'
                // children: [
                //     {
                //         key: 'ad-mobile',
                //         icon: 'icon-ad-list',
                //         link: '/ad-mobile',
                //         text: '手机端广告'
                //     }
                // ]
            }
        ]
    }, {
        key: 'columnAuthor',
        symbol: 8,
        icon: 'icon-columnAuthor',
        link: '/columnAuthor-list',
        text: '专栏作者管理'
        // children: [
        //     {
        //         key: 'columnAuthor-list',
        //         icon: 'icon-post-list',
        //         link: '/columnAuthor-list',
        //         text: '专栏作者列表'
        //     }
        // ]
    }, {
        key: 'comment',
        icon: 'icon-comment',
        link: '/comment-list',
        text: '文章评论管理'
        // children: [
        //     {
        //         key: 'comment-list',
        //         icon: 'icon-comment-list',
        //         link: '/comment-list',
        //         text: '评论列表'
        //     }
        // ]
    }, {
        key: 'live',
        symbol: 10,
        icon: 'icon-live',
        link: '',
        text: '直播管理',
        children: [
            {
                key: 'live-userList',
                icon: 'icon-live-user',
                link: '/live-userList',
                text: '用户列表'
            }, {
                key: 'live-list',
                icon: 'icon-post-list',
                link: '/live-list',
                text: '直播列表'
            }, {
                key: 'live-edit',
                icon: 'icon-ico-edit',
                link: '/live-edit',
                text: '直播添加/编辑'
            }
            // , {
            //     key: 'live-commentList',
            //     icon: 'icon-comment-list',
            //     link: '/live-commentList',
            //     text: '直播评论列表'
            // }
        ]
    }, {
        key: 'specialTopic',
        symbol: 11,
        icon: 'icon-st',
        link: '/specialTopic-list',
        text: '新闻专题管理'
        // children: [
        //     {
        //         key: 'specialTopic-list',
        //         icon: 'icon-post-list',
        //         link: '/specialTopic-list',
        //         text: '专题列表'
        //     }, {
        //         key: 'specialTopic-add',
        //         icon: 'icon-ico-edit',
        //         link: '/specialTopic-add',
        //         text: '新增专题'
        //     }
        // ]
    }, {
        key: 'activity',
        symbol: 12,
        icon: 'icon-activity',
        link: '/activity-list',
        text: '峰会专题管理'
    }, {
        key: 'activityPublish',
        symbol: 13,
        icon: 'icon-activityPublish',
        link: '',
        text: '活动发布管理',
        children: [
            {
                key: 'activityPublish-list',
                icon: 'icon-post-list',
                link: '/activityPublish-list',
                text: '活动列表'
            }, {
                key: 'activityPublish-city',
                icon: 'icon-ico-edit',
                link: '/activityPublish-city',
                text: '举办城市'
            }
        ]
    }, {
        key: 'appTopic',
        symbol: 14,
        icon: 'icon-banner',
        link: '/appTopic-list',
        text: 'App发现页轮播'
        // children: [
        //     {
        //         key: 'appTopic-list',
        //         icon: 'icon-post-list',
        //         link: '/appTopic-list',
        //         text: '轮播图列表'
        //     }, {
        //         key: 'appTopic-add',
        //         icon: 'icon-ico-edit',
        //         link: '/appTopic-add',
        //         text: '新增Banner'
        //     }
        // ]
    }, {
        key: 'banner',
        symbol: 16,
        icon: 'icon-banner',
        link: '',
        text: '首页Banner管理',
        children: [
            {
                key: 'banner-topList',
                icon: 'icon-top-list',
                link: '/banner-topList',
                text: '顶部轮播'
            }, {
                key: 'banner-trList',
                icon: 'icon-tr-list',
                link: '/banner-trList',
                text: '顶部右侧'
            }, {
                key: 'banner-productList',
                icon: 'icon-product-list',
                link: '/banner-productList',
                text: '产品轮播'
            }, {
                key: 'banner-activeList',
                icon: 'icon-active-list',
                link: '/banner-activeList',
                text: '活动轮播'
            }
        ]
    }, {
        key: 'version',
        symbol: 23,
        icon: 'icon-version',
        link: '/version-list',
        text: 'APP 版本更新'
    }, {
        key: 'coinRecommend',
        symbol: 15,
        icon: 'icon-cr',
        link: '',
        text: 'APP 词条管理',
        children: [
            {
                key: 'appGuideCoin-list',
                icon: 'icon-homecr',
                link: '/appGuideCoin-list',
                text: '引导页币种'
            },
            {
                key: 'coinRecommend-list',
                icon: 'icon-coinRecommend-list',
                link: '/coinRecommend-list',
                text: '币种推荐列表'
            },
            {
                key: 'hotCoin-list',
                icon: 'icon-hotCoin-list',
                link: '/hotCoin-list',
                text: '热搜币种列表'
            },
            {
                key: 'newsHotWords-list',
                icon: 'icon-newsHotWords-list',
                link: '/newsHotWords-list',
                text: '热搜新闻列表'
            }
        ]
    }, {
        key: 'tagsAndAuthor',
        symbol: 25,
        icon: 'icon-hotTags',
        link: '/tagsAndAuthor-list',
        text: '热门标签管理'
    }, {
        key: 'wordsFilter',
        symbol: 17,
        icon: 'icon-wordsFilter',
        link: '/wordsFilter',
        text: '敏感词过滤'
    }, {
        key: 'webCoinRecommend',
        symbol: 18,
        icon: 'icon-homecr',
        link: '/webCoinRecommend-list',
        text: '首页币种推荐'
    }, {
        key: 'exchangeRecommend',
        symbol: 22,
        icon: 'icon-exchangeRecommend-list',
        link: '/exchangeRecommend-list',
        text: '交易所展示'
    },
    // {
    //     key: 'ico',
    //     icon: 'icon-ico',
    //     link: '',
    //     text: 'ICO 管理',
    //     children: [
    //         {
    //             key: 'ico-list',
    //             icon: 'icon-post-list',
    //             link: '/ico-list',
    //             text: 'ICO 列表'
    //         }, {
    //             key: 'ico-edit',
    //             icon: 'icon-ico-edit',
    //             link: '/ico-edit',
    //             text: 'ICO 添加/编辑'
    //         }
    //     ]
    // },
    */
    {
        key: 'banner',
        symbol: 16,
        icon: 'icon-banner',
        link: '/banner-list',
        text: '轮播管理'
    },
    {
        key: 'team',
        symbol: 27,
        icon: 'icon-team',
        link: '/team-list',
        text: '团队管理'
    },
    {
        key: 'partner',
        symbol: 27,
        icon: 'icon-partner',
        link: '/partner-list',
        text: '合作伙伴管理'
    },
    {
        key: 'council',
        symbol: 27,
        icon: 'icon-council',
        link: '/council-list',
        text: '委员会管理'
    }
]

let menuData = () => {
    let level = parseInt(Cookies.get('hx_level'))
    if (level === 30) {
        return [{
            key: 'account',
            icon: 'icon-account',
            link: '/account-manager',
            symbol: 28,
            text: '系统账号管理'
        }, ...basic]
    } else {
        return basic
    }
}

// 菜单标识
export const menuConfig = {}

export default { menuData }
