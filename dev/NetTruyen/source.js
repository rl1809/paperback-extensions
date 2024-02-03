(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./CloudflareBypassRequestProviding"), exports);
__exportStar(require("./HomePageSectionsProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./RequestManagerProviding"), exports);
__exportStar(require("./SearchResultsProviding"), exports);

},{"./ChapterProviding":8,"./CloudflareBypassRequestProviding":9,"./HomePageSectionsProviding":10,"./MangaProgressProviding":11,"./MangaProviding":12,"./RequestManagerProviding":13,"./SearchResultsProviding":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":17,"./DynamicUI/Exports/DUIForm":18,"./DynamicUI/Exports/DUIFormRow":19,"./DynamicUI/Exports/DUISection":20,"./DynamicUI/Rows/Exports/DUIButton":21,"./DynamicUI/Rows/Exports/DUIHeader":22,"./DynamicUI/Rows/Exports/DUIInputField":23,"./DynamicUI/Rows/Exports/DUILabel":24,"./DynamicUI/Rows/Exports/DUILink":25,"./DynamicUI/Rows/Exports/DUIMultilineLabel":26,"./DynamicUI/Rows/Exports/DUINavigationButton":27,"./DynamicUI/Rows/Exports/DUIOAuthButton":28,"./DynamicUI/Rows/Exports/DUISecureInputField":29,"./DynamicUI/Rows/Exports/DUISelect":30,"./DynamicUI/Rows/Exports/DUIStepper":31,"./DynamicUI/Rows/Exports/DUISwitch":32,"./Exports/Chapter":33,"./Exports/ChapterDetails":34,"./Exports/Cookie":35,"./Exports/HomeSection":36,"./Exports/IconText":37,"./Exports/MangaInfo":38,"./Exports/MangaProgress":39,"./Exports/MangaUpdates":40,"./Exports/PBCanvas":41,"./Exports/PBImage":42,"./Exports/PagedResults":43,"./Exports/PartialSourceManga":44,"./Exports/RawData":45,"./Exports/Request":46,"./Exports/RequestManager":47,"./Exports/Response":48,"./Exports/SearchField":49,"./Exports/SearchRequest":50,"./Exports/SecureStateManager":51,"./Exports/SourceCookieStore":52,"./Exports/SourceInterceptor":53,"./Exports/SourceManga":54,"./Exports/SourceStateManager":55,"./Exports/Tag":56,"./Exports/TagSection":57,"./Exports/TrackedMangaChapterReadAction":58,"./Exports/TrackerActionQueue":59}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":16,"./generated/_exports":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetTruyen = exports.NetTruyenInfo = void 0;
const types_1 = require("@paperback/types");
const NetTruyenParser_1 = require("./NetTruyenParser");
const NETTRUYEN_DOMAIN = "https://nettruyenss.com";
exports.NetTruyenInfo = {
    version: "0.0.1",
    name: "NetTruyen",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/NhaNT1999",
    description: "Extension that pulls manga from NetTruyen",
    contentRating: types_1.ContentRating.EVERYONE,
    websiteBaseURL: NETTRUYEN_DOMAIN,
    sourceTags: [],
    intents: types_1.SourceIntents.MANGA_CHAPTERS |
        types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class NetTruyen {
    constructor(cheerio) {
        this.cheerio = cheerio;
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 15000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        ...{
                            referer: `${NETTRUYEN_DOMAIN}/`,
                            "user-agent": await this.requestManager.getDefaultUserAgent(),
                        },
                    };
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                },
            },
        });
    }
    getMangaShareUrl(mangaId) {
        return `${NETTRUYEN_DOMAIN}/truyen-tranh/${mangaId}`;
    }
    async supportsTagExclusion() {
        return true;
    }
    async DOMHTML(url) {
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data);
    }
    async getMangaDetails(mangaId) {
        const $ = await this.DOMHTML(`${NETTRUYEN_DOMAIN}/truyen-tranh/${mangaId}`);
        return (0, NetTruyenParser_1.parseMangaDetails)($, mangaId);
    }
    async getChapters(mangaId) {
        const $ = await this.DOMHTML(`${NETTRUYEN_DOMAIN}/truyen-tranh/${mangaId}`);
        return (0, NetTruyenParser_1.parseChapterList)($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const $ = await this.DOMHTML(`${NETTRUYEN_DOMAIN}/truyen-tranh/${chapterId}`);
        return (0, NetTruyenParser_1.parseChapterDetails)($, mangaId, chapterId);
    }
    async getHomePageSections(sectionCallback) {
        const promises = [];
        const sections = [
            App.createHomeSection({ id: 'viewest', title: "Truyện Xem Nhiều Nhất", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'hot', title: "Truyện Hot Nhất", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_updated', title: "Truyện Mới Cập Nhật", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_added', title: "Truyện Mới Thêm Gần Đây", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'full', title: "Truyện Đã Hoàn Thành", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
        ];
        const featuredSection = App.createHomeSection({ id: 'featured', title: "Truyện Đề Cử", containsMoreItems: false, type: types_1.HomeSectionType.featured });
        sectionCallback(featuredSection);
        promises.push(this.DOMHTML(`${NETTRUYEN_DOMAIN}/`).then(async (response) => {
            featuredSection.items = await (0, NetTruyenParser_1.parseFeaturedSection)(response);
            sectionCallback(featuredSection);
        }));
        for (const section of sections) {
            sectionCallback(section);
            let url;
            switch (section.id) {
                case 'viewest':
                    url = `${NETTRUYEN_DOMAIN}/tim-truyen?status=-1&sort=10`;
                    break;
                case 'hot':
                    url = `${NETTRUYEN_DOMAIN}/hot`;
                    break;
                case 'new_updated':
                    url = `${NETTRUYEN_DOMAIN}/`;
                    break;
                case 'new_added':
                    url = `${NETTRUYEN_DOMAIN}/tim-truyen?status=-1&sort=15`;
                    break;
                case 'full':
                    url = `${NETTRUYEN_DOMAIN}/truyen-full`;
                    break;
                default:
                    throw new Error("Invalid homepage section ID");
            }
            promises.push(this.DOMHTML(url).then(async (response) => {
                section.items = await (0, NetTruyenParser_1.parseHomeSections)(response);
                sectionCallback(section);
            }));
        }
        Promise.all(promises);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        let page = metadata?.page ?? 1;
        let param = "";
        let url = "";
        switch (homepageSectionId) {
            case "viewest":
                param = `?status=-1&sort=10&page=${page}`;
                url = `${NETTRUYEN_DOMAIN}/tim-truyen`;
                break;
            case "hot":
                param = `?page=${page}`;
                url = `${NETTRUYEN_DOMAIN}/hot`;
                break;
            case "new_updated":
                param = `?page=${page}`;
                url = `${NETTRUYEN_DOMAIN}/`;
                break;
            case "new_added":
                param = `?status=-1&sort=15&page=${page}`;
                url = `${NETTRUYEN_DOMAIN}/tim-truyen`;
                break;
            case "full":
                param = `?page=${page}`;
                url = `${NETTRUYEN_DOMAIN}/truyen-full`;
                break;
            default:
                throw new Error("Requested to getViewMoreItems for a section ID which doesn't exist");
        }
        const request = App.createRequest({
            url,
            method: 'GET',
            param,
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const manga = (0, NetTruyenParser_1.parseViewMoreItems)($);
        metadata = (0, NetTruyenParser_1.isLastPage)($) ? undefined : { page: page + 1 };
        return App.createPagedResults({
            results: manga,
            metadata
        });
    }
    async getSearchResults(query, metadata) {
        let page = metadata?.page ?? 1;
        const search = {
            genres: '',
            exgenres: '',
            gender: "-1",
            status: "-1",
            minchapter: "1",
            sort: "0",
        };
        const extags = query.excludedTags?.map(tag => tag.id) ?? [];
        const exgenres = [];
        for (const value of extags) {
            if (value.indexOf('.') === -1) {
                exgenres.push(value);
            }
        }
        const tags = query.includedTags?.map(tag => tag.id) ?? [];
        const genres = [];
        let authorLink = "";
        for (const value of tags) {
            if (value.startsWith("http")) {
                authorLink = value;
            }
            else if (value.indexOf('.') === -1) {
                genres.push(value);
            }
            else {
                const [key, val] = value.split(".");
                switch (key) {
                    case 'minchapter':
                        search.minchapter = String(val);
                        break;
                    case 'gender':
                        search.gender = String(val);
                        break;
                    case 'sort':
                        search.sort = String(val);
                        break;
                    case 'status':
                        search.status = String(val);
                        break;
                }
            }
        }
        search.genres = genres.join(",");
        search.exgenres = exgenres.join(",");
        const paramExgenres = search.exgenres ? `&notgenres=${search.exgenres}` : '';
        const url = `${NETTRUYEN_DOMAIN}${query.title ? '/tim-truyen' : '/tim-truyen-nang-cao'}`;
        const param = encodeURI(`?keyword=${query.title ?? ''}&genres=${search.genres}${paramExgenres}&gender=${search.gender}&status=${search.status}&minchapter=${search.minchapter}&sort=${search.sort}&page=${page}`);
        let searchQuery = url + param;
        if (/[a-zA-Z]+/.test(search.genres)) {
            searchQuery = `${NETTRUYEN_DOMAIN}/tim-truyen/${search.genres}?page=${page}`;
        }
        if (authorLink !== "") {
            searchQuery = `${authorLink}&page=${page}`;
        }
        const $ = await this.DOMHTML(searchQuery);
        const tiles = (0, NetTruyenParser_1.parseSearch)($);
        metadata = !(0, NetTruyenParser_1.isLastPage)($) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: tiles,
            metadata
        });
    }
    async getSearchTags() {
        const url = `${NETTRUYEN_DOMAIN}/tim-truyen-nang-cao`;
        const $ = await this.DOMHTML(url);
        return (0, NetTruyenParser_1.parseTags)($);
    }
    async filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        const updateManga = [];
        const pages = 10;
        for (let i = 1; i < pages + 1; i++) {
            let url = `${NETTRUYEN_DOMAIN}/?page=${i}`;
            const $ = await this.DOMHTML(url);
            const updateManga = $('div.item', 'div.row').toArray().map(manga => {
                const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
                const time = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > i", manga).last().text().trim();
                return {
                    id: id,
                    time: time
                };
            });
            updateManga.push(...updateManga);
        }
        const returnObject = (0, NetTruyenParser_1.parseUpdatedManga)(updateManga, time, ids);
        mangaUpdatesFoundCallback(App.createMangaUpdates(returnObject));
    }
}
exports.NetTruyen = NetTruyen;

},{"./NetTruyenParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastPage = exports.parseUpdatedManga = exports.parseViewMoreItems = exports.parseHomeSections = exports.parseFeaturedSection = exports.parseSearch = exports.parseTags = exports.parseChapterDetails = exports.parseChapterList = exports.parseMangaDetails = void 0;
const convertTime = (timeAgo) => {
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed === 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('giây') || timeAgo.includes('secs')) {
        return new Date(Date.now() - trimmed * 1000);
    }
    else if (timeAgo.includes('phút')) {
        return new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('giờ')) {
        return new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('ngày')) {
        return new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('năm')) {
        return new Date(Date.now() - trimmed * 31556952000);
    }
    else if (timeAgo.includes(':')) {
        const [H, D] = timeAgo.split(' ');
        const fixD = String(D).split('/');
        const finalD = `${fixD[1]}/${fixD[0]}/${new Date().getFullYear()}`;
        return new Date(`${finalD} ${H}`);
    }
    else {
        const split = timeAgo.split('/');
        return new Date(`${split[1]}/${split[0]}/20${split[2]}`);
    }
};
const parseMangaDetails = ($, mangaId) => {
    const titles = $('h1.title-detail').text().trim();
    const author = $('ul.list-info > li.author > p.col-xs-8').text();
    const artist = $('ul.list-info > li.author > p.col-xs-8').text();
    const image = 'https:' + $('div.col-image > img').attr('src');
    const desc = $('div.detail-content > p').text();
    const status = $('ul.list-info > li.status > p.col-xs-8').text();
    const rating = parseFloat($('span[itemprop="ratingValue"]').text());
    const tags = [];
    const authorLink = $('ul.list-info > li.author > p.col-xs-8 > a').attr("href") || "";
    if (authorLink !== "") {
        tags.push({ id: authorLink, label: `Tác giả: ${author}` });
    }
    $('li.kind > p.col-xs-8 > a').each((_, obj) => {
        const label = $(obj).text();
        const id = $(obj).attr('href')?.split('/')[4] ?? label;
        tags.push({ id: id, label: label });
    });
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [titles],
            author,
            artist,
            image,
            desc,
            status,
            tags: [App.createTagSection({ id: '0', label: 'genres', tags: tags.map(x => App.createTag(x)) })],
            rating: Number.isNaN(rating) ? 0 : rating
        }),
    });
};
exports.parseMangaDetails = parseMangaDetails;
const parseChapterList = ($, mangaId) => {
    const chapters = [];
    $('div.list-chapter > nav > ul > li.row:not(.heading)').each((_, obj) => {
        const id = String($('div.chapter a', obj).attr('href')).split('/').slice(4).join('/');
        const time = $('div.col-xs-4', obj).text();
        const group = $('div.col-xs-3', obj).text();
        let name = $('div.chapter a', obj).text();
        const chapNum = $('div.chapter a', obj).text().split(' ')[1];
        name = name.includes(':') ? String(name.split(':')[1]).trim() : '';
        const timeFinal = convertTime(time);
        chapters.push(App.createChapter({
            id: id,
            chapNum: parseFloat(String(chapNum)),
            name: name,
            langCode: '🇻🇳',
            time: timeFinal,
            group: `${group} lượt xem`
        }));
    });
    if (chapters.length == 0) {
        throw new Error('No chapters found');
    }
    return chapters;
};
exports.parseChapterList = parseChapterList;
const parseChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    $('div.reading-detail > div.page-chapter > img').each((_, obj) => {
        if (!obj.attribs['data-original'])
            return;
        const link = obj.attribs['data-original'];
        pages.push(link.indexOf('https') === -1 ? 'https:' + link : link);
    });
    const chapterDetails = App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages
    });
    return chapterDetails;
};
exports.parseChapterDetails = parseChapterDetails;
const parseTags = ($) => {
    const arrayTags = [];
    const arrayTags2 = [];
    const arrayTags3 = [];
    const arrayTags4 = [];
    const arrayTags5 = [];
    for (const tag of $('div.col-md-3.col-sm-4.col-xs-6.mrb10', 'div.col-sm-10 > div.row').toArray()) {
        const label = $('div.genre-item', tag).text().trim();
        const id = $('div.genre-item > span', tag).attr('data-id') ?? label;
        if (!id || !label)
            continue;
        arrayTags.push({ id: id, label: label });
    }
    for (const tag of $('option', 'select.select-minchapter').toArray()) {
        const label = $(tag).text().trim();
        const id = 'minchapter.' + $(tag).attr('value') ?? label;
        if (!id || !label)
            continue;
        arrayTags2.push({ id: id, label: label });
    }
    for (const tag of $('option', '.select-status').toArray()) {
        const label = $(tag).text().trim();
        const id = 'status.' + $(tag).attr('value') ?? label;
        if (!id || !label)
            continue;
        arrayTags3.push({ id: id, label: label });
    }
    for (const tag of $('option', '.select-gender').toArray()) {
        const label = $(tag).text().trim();
        const id = 'gender.' + $(tag).attr('value') ?? label;
        if (!id || !label)
            continue;
        arrayTags4.push({ id: id, label: label });
    }
    for (const tag of $('option', '.select-sort').toArray()) {
        const label = $(tag).text().trim();
        const id = 'sort.' + $(tag).attr('value') ?? label;
        if (!id || !label)
            continue;
        arrayTags5.push({ id: id, label: label });
    }
    const tagSections = [
        App.createTagSection({ id: '0', label: 'Thể Loại (Có thể chọn nhiều hơn 1)', tags: arrayTags.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '1', label: 'Số Lượng Chapter (Chỉ chọn 1)', tags: arrayTags2.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '2', label: 'Tình Trạng (Chỉ chọn 1)', tags: arrayTags3.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '3', label: 'Dành Cho (Chỉ chọn 1)', tags: arrayTags4.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '4', label: 'Sắp xếp theo (Chỉ chọn 1)', tags: arrayTags5.map(x => App.createTag(x)) }),
    ];
    return tagSections;
};
exports.parseTags = parseTags;
const parseSearch = ($) => {
    const tiles = [];
    $('div.item', 'div.row').each((_, manga) => {
        const title = $('figure.clearfix > figcaption > h3 > a', manga).first().text();
        const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
        let image = $('figure.clearfix > div.image > a > img', manga).first().attr('data-original');
        image = !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image;
        const subtitle = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > a", manga).last().text().trim();
        if (!id || !title)
            return;
        tiles.push(App.createPartialSourceManga({
            mangaId: String(id),
            image: String(image),
            title: title,
            subtitle: subtitle,
        }));
    });
    return tiles;
};
exports.parseSearch = parseSearch;
const parseFeaturedSection = ($) => {
    const featuredItems = [];
    $('div.item', 'div.altcontent1').each((_, manga) => {
        const title = $('.slide-caption > h3 > a', manga).text();
        const id = $('a', manga).attr('href')?.split('/').pop();
        const image = $('a > img.lazyOwl', manga).attr('data-src');
        const subtitle = $('.slide-caption > a', manga).text().trim() + ' - ' + $('.slide-caption > .time', manga).text().trim();
        if (!id || !title)
            return;
        featuredItems.push(App.createPartialSourceManga({
            mangaId: String(id),
            image: !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image,
            title: title,
            subtitle: subtitle,
        }));
    });
    return featuredItems;
};
exports.parseFeaturedSection = parseFeaturedSection;
const parseHomeSections = ($) => {
    const items = [];
    $('div.item', 'div.row').slice(0, 20).each((_, manga) => {
        const title = $('figure.clearfix > figcaption > h3 > a', manga).first().text();
        const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
        const image = $('figure.clearfix > div.image > a > img', manga).first().attr('data-original');
        const subtitle = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > a", manga).last().text().trim();
        if (!id || !title)
            return;
        items.push(App.createPartialSourceManga({
            mangaId: String(id),
            image: !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image,
            title: title,
            subtitle: subtitle,
        }));
    });
    return items;
};
exports.parseHomeSections = parseHomeSections;
const parseViewMoreItems = ($) => {
    const mangas = [];
    const collectedIds = new Set();
    $('div.item', 'div.row').each((_, manga) => {
        const title = $('figure.clearfix > figcaption > h3 > a', manga).first().text();
        const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
        const image = $('figure.clearfix > div.image > a > img', manga).first().attr('data-original');
        const subtitle = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > a", manga).last().text().trim();
        if (!id || !title)
            return;
        if (!collectedIds.has(id)) {
            mangas.push(App.createPartialSourceManga({
                mangaId: String(id),
                image: !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image,
                title: title,
                subtitle: subtitle,
            }));
            collectedIds.add(id);
        }
    });
    return mangas;
};
exports.parseViewMoreItems = parseViewMoreItems;
const parseUpdatedManga = (updateManga, time, ids) => {
    const returnObject = {
        ids: []
    };
    for (const elem of updateManga) {
        if (ids.includes(elem.id) && time < convertTime(elem.time)) {
            returnObject.ids.push(elem.id);
        }
    }
    return returnObject;
};
exports.parseUpdatedManga = parseUpdatedManga;
const isLastPage = ($) => {
    const current = $('ul.pagination > li.active > a').text();
    let total = $('ul.pagination > li.PagerSSCCells:last-child').text();
    if (current) {
        total = total ?? '';
        return (+total) === (+current);
    }
    return true;
};
exports.isLastPage = isLastPage;

},{}]},{},[62])(62)
});
