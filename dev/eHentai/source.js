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
exports.eHentai = exports.eHentaiInfo = void 0;
const types_1 = require("@paperback/types");
const eHentaiParser_1 = require("./eHentaiParser");
const eHentaiSettings_1 = require("./eHentaiSettings");
const E_HENTAI_DOMAIN = 'https://e-hentai.org';
exports.eHentaiInfo = {
    version: "0.0.1",
    name: "E-Hentai",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls manga from IMHentai",
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: E_HENTAI_DOMAIN,
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: '18+',
            type: types_1.BadgeColor.RED
        }
    ]
};
class eHentai {
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
                            referer: `${E_HENTAI_DOMAIN}/`,
                            "user-agent": await this.requestManager.getDefaultUserAgent(),
                        },
                    };
                    request.cookies = [App.createCookie({ name: 'nw', value: '1', domain: 'https://e-hentai.org/' })];
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                },
            },
        });
        this.stateManager = App.createSourceStateManager();
    }
    getMangaShareUrl(mangaId) {
        return `${E_HENTAI_DOMAIN}/g/${mangaId}`;
    }
    async DOMHTML(url) {
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data);
    }
    async getGalleryData(ids) {
        const request = App.createRequest({
            url: 'https://api.e-hentai.org/api.php',
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data: {
                'method': 'gdata',
                'gidlist': ids.map(id => id.split('/')),
                'namespace': 1
            }
        });
        const data = await this.requestManager.schedule(request, 1);
        const json = (typeof data.data == 'string') ? JSON.parse(data.data.replaceAll(/[\r\n]+/g, ' ')) : data.data;
        return json.gmetadata;
    }
    async getSearchTags() {
        return [App.createTagSection({
                id: 'categories', label: 'Categories', tags: [
                    App.createTag({ id: 'category:2', label: 'Doujinshi' }),
                    App.createTag({ id: 'category:4', label: 'Manga' }),
                    App.createTag({ id: 'category:8', label: 'Artist CG' }),
                    App.createTag({ id: 'category:16', label: 'Game CG' }),
                    App.createTag({ id: 'category:256', label: 'Non-H' }),
                    App.createTag({ id: 'category:32', label: 'Image Set' }),
                    App.createTag({ id: 'category:512', label: 'Western' }),
                    App.createTag({ id: 'category:64', label: 'Cosplay' }),
                    App.createTag({ id: 'category:1', label: 'Misc' })
                ]
            })];
    }
    async supportsTagExclusion() {
        return true;
    }
    async getHomePageSections(sectionCallback) {
        const promises = [];
        const section = App.createHomeSection({
            id: "popular",
            title: "Popular",
            containsMoreItems: false,
            type: types_1.HomeSectionType.featured,
        });
        sectionCallback(section);
        promises.push(this.DOMHTML(`${E_HENTAI_DOMAIN}/popular`).then(async (response) => {
            section.items = await (0, eHentaiParser_1.parseHomeSections)(response);
            sectionCallback(section);
        }));
        const query = `${await (0, eHentaiSettings_1.getExtraArgs)(this.stateManager)}`;
        for (const tag of (await this.getSearchTags())[0]?.tags ?? []) {
            const section = App.createHomeSection({
                id: tag.id,
                title: tag.label,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            });
            sectionCallback(section);
            const url = `${E_HENTAI_DOMAIN}/?f_cats=${1023 - parseInt(tag.id.substring(9))}&f_search=${encodeURIComponent(query)}`;
            promises.push(this.DOMHTML(url).then(async (response) => {
                section.items = await (0, eHentaiParser_1.parseHomeSections)(response);
                sectionCallback(section);
            }));
        }
        Promise.all(promises);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const next = metadata?.next ?? 0;
        const query = `${await (0, eHentaiSettings_1.getExtraArgs)(this.stateManager)}`;
        const url = `${E_HENTAI_DOMAIN}/?f_cats=${1023 - parseInt(homepageSectionId.substring(9))}&f_search=${encodeURIComponent(query)}&next=${next}`;
        const $ = await this.DOMHTML(url);
        const result = (0, eHentaiParser_1.parseViewMore)($);
        metadata = result.nextId == 0 ? undefined : { next: result.nextId };
        return App.createPagedResults({
            results: result.items,
            metadata: metadata,
        });
    }
    async getSourceMenu() {
        return Promise.resolve(App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            rows: () => Promise.resolve([
                (0, eHentaiSettings_1.modifySearch)(this.stateManager),
                (0, eHentaiSettings_1.resetSettings)(this.stateManager)
            ]),
            isHidden: false
        }));
    }
    async getMangaDetails(mangaId) {
        const data = (await this.getGalleryData([mangaId]))[0];
        const title = (0, eHentaiParser_1.parseTitle)(data.title);
        const title_jp = (0, eHentaiParser_1.parseTitle)(data.title_jpn);
        const date = new Date(parseInt(data.posted) * 1000);
        let desc = "";
        desc += `Title: ${title}\n`;
        desc += `Alternative Title: ${title_jp}\n`;
        desc += `Uploader: ${data.uploader}\n`;
        desc += `Length: ${data.filecount} pages\n`;
        desc += `Rating: ${data.rating}\n`;
        desc += `Posted: ${date.toDateString()}`;
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [(0, eHentaiParser_1.parseTitle)(data.title), (0, eHentaiParser_1.parseTitle)(data.title_jpn)],
                image: data.thumb,
                rating: data.rating,
                status: "",
                desc: desc,
                artist: (0, eHentaiParser_1.parseArtist)(data.tags),
                tags: (0, eHentaiParser_1.parseTags)([data.category, ...data.tags]),
            })
        });
    }
    async getChapters(mangaId) {
        const data = (await this.getGalleryData([mangaId]))[0];
        return [App.createChapter({
                id: data.filecount,
                chapNum: 1,
                langCode: (0, eHentaiParser_1.parseLanguage)(data.tags),
                name: 'Chapter',
                time: new Date(parseInt(data.posted) * 1000)
            })];
    }
    async getChapterDetails(mangaId, chapterId) {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: await (0, eHentaiParser_1.parsePages)(mangaId, parseInt(chapterId), this.requestManager, this.cheerio)
        });
    }
    async getSearchResults(query, metadata) {
        const next = metadata?.next ?? 0;
        let categories = 0;
        const includedCategories = query.includedTags?.filter(tag => tag.id.startsWith('category:'));
        const excludedCategories = query.excludedTags?.filter(tag => tag.id.startsWith('category:'));
        if (includedCategories != undefined && includedCategories.length != 0)
            categories = includedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev - cur, 1023);
        else if (excludedCategories != undefined && excludedCategories.length != 0)
            categories = excludedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev + cur, 0);
        let searchQuery = query.title ?? "";
        const includedTags = query.includedTags?.filter(tag => !tag.id.startsWith('category:'));
        const excludedTags = query.excludedTags?.filter(tag => !tag.id.startsWith('category:'));
        for (const tag of includedTags)
            searchQuery += ` ${tag.id}`;
        for (const tag of excludedTags)
            searchQuery += ` -${tag.id}`;
        searchQuery += ` ${await (0, eHentaiSettings_1.getExtraArgs)(this.stateManager)}`;
        const url = `${E_HENTAI_DOMAIN}/?f_cats=${categories}&f_search=${encodeURIComponent(searchQuery)}&next=${next}`;
        const $ = await this.DOMHTML(url);
        const result = (0, eHentaiParser_1.parseViewMore)($);
        metadata = result.nextId == 0 ? undefined : { next: result.nextId };
        return App.createPagedResults({
            results: result.items,
            metadata: metadata,
        });
    }
}
exports.eHentai = eHentai;

},{"./eHentaiParser":63,"./eHentaiSettings":64,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTitle = exports.parseTags = exports.parsePages = exports.parseViewMore = exports.parseHomeSections = exports.parseLanguage = exports.parseArtist = void 0;
const parseArtist = (tags) => {
    const artist = tags.filter(tag => tag.startsWith('artist:')).map(tag => tag.substring(7));
    const cosplayer = tags.filter(tag => tag.startsWith('cosplayer:')).map(tag => tag.substring(10));
    if (artist.length != 0)
        return artist[0];
    else if (cosplayer.length != 0)
        return cosplayer[0];
    else
        return undefined;
};
exports.parseArtist = parseArtist;
const parseLanguage = (tags) => {
    const languageTags = tags.filter(tag => tag.startsWith('language:') && tag != 'language:translated').map(tag => tag.substring(9));
    if (languageTags.length == 0)
        return "🇯🇵";
    switch (languageTags[0]) {
        case 'bengali':
            return "🇧🇩";
            break;
        case 'bulgarian':
            return "🇧🇬";
            break;
        case 'chinese':
            return "🇨🇳";
            break;
        case 'czech':
            return "🇨🇿";
            break;
        case 'danish':
            return "🇩🇰";
            break;
        case 'dutch':
            return "🇳🇱";
            break;
        case 'english':
            return "🇬🇧";
            break;
        case 'finnish':
            return "🇫🇮";
            break;
        case 'french':
            return "🇫🇷";
            break;
        case 'german':
            return "🇩🇪";
            break;
        case 'greek':
            return "🇬🇷";
            break;
        case 'hungarian':
            return "🇭🇺";
            break;
        case 'gujarati':
        case 'nepali':
        case 'punjabi':
        case 'tamil':
        case 'telugu':
        case 'urdu':
            return "🇮🇳";
            break;
        case 'indonesian':
            return "🇮🇩";
            break;
        case 'persian':
            return "🇮🇷";
            break;
        case 'italian':
            return "🇮🇹";
            break;
        case 'korean':
            return "🇰🇷";
            break;
        case 'mongolian':
            return "🇲🇳";
            break;
        case 'norwegian':
            return "🇳🇴";
            break;
        case 'cebuano':
        case 'tagalog':
            return "🇵🇭";
            break;
        case 'polish':
            return "🇵🇱";
            break;
        case 'portuguese':
            return "🇵🇹";
            break;
        case 'romanian':
            return "🇷🇴";
            break;
        case 'russian':
            return "🇷🇺";
            break;
        case 'sanskrit':
            return "🇰🇳";
            break;
        case 'spanish':
            return "🇪🇸";
            break;
        case 'thai':
            return "🇹🇭";
            break;
        case 'turkish':
            return "🇹🇷";
            break;
        case 'ukrainian':
            return "🇺🇦";
            break;
        case 'vietnamese':
            return "🇻🇳";
            break;
        case 'welsh':
            return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
            break;
    }
    return "unknown";
};
exports.parseLanguage = parseLanguage;
const parseHomeSections = ($) => {
    const items = [];
    $('table.itg tbody tr').each((_index, element) => {
        const $element = $(element);
        const idElement = $element.find('.glname a').attr('href');
        const id = idElement ? `${idElement.split('/').slice(-3, -1).join('/')}` : "";
        const title = $element.find('.glname .glink').text().trim();
        const subtitle = $element.find('.gl1c .cn').text().trim();
        const imageElement = $element.find('.glthumb img');
        const image = imageElement.attr("data-src") ?? imageElement.attr("src") ?? "";
        if (id && title) {
            items.push(App.createPartialSourceManga({
                mangaId: id,
                image: image,
                title: title,
                subtitle: subtitle
            }));
        }
    });
    return items;
};
exports.parseHomeSections = parseHomeSections;
const parseViewMore = ($) => {
    const items = [];
    $('table.itg tbody tr').each((_index, element) => {
        const $element = $(element);
        const idElement = $element.find('.glname a').attr('href');
        const id = idElement ? `${idElement.split('/').slice(-3, -1).join('/')}` : "";
        const title = $element.find('.glname .glink').text().trim();
        const subtitle = $element.find('.gl1c .cn').text().trim();
        const imageElement = $element.find('.glthumb img');
        const image = imageElement.attr("data-src") ?? imageElement.attr("src") ?? "";
        if (id && title) {
            items.push(App.createPartialSourceManga({
                mangaId: id,
                image: image,
                title: title,
                subtitle: subtitle
            }));
        }
    });
    let nextId = 0;
    const nextLinkUrl = $('.searchnav #unext').attr('href');
    if (nextLinkUrl) {
        const idString = nextLinkUrl.split('next=')[1];
        if (idString) {
            nextId = parseInt(idString, 10);
        }
    }
    return { items, nextId };
};
exports.parseViewMore = parseViewMore;
async function getImage(url, requestManager, cheerio) {
    const request = App.createRequest({
        url: url,
        method: 'GET'
    });
    const response = await requestManager.schedule(request, 1);
    const $ = cheerio.load(response.data);
    return $('#img').attr('src') ?? '';
}
async function parsePage(id, page, requestManager, cheerio) {
    const request = App.createRequest({
        url: `https://e-hentai.org/g/${id}/?p=${page}`,
        method: 'GET'
    });
    const response = await requestManager.schedule(request, 1);
    const $ = cheerio.load(response.data);
    const pageArr = [];
    const pageDivArr = $('div.gdtm').toArray();
    for (const page of pageDivArr) {
        pageArr.push(getImage($('a', page).attr('href') ?? '', requestManager, cheerio));
    }
    return Promise.all(pageArr);
}
async function parsePages(id, pageCount, requestManager, cheerio) {
    const pageArr = [];
    // Calculate the number of iterations needed for pages
    const iterations = Math.ceil(pageCount / 40);
    for (let i = 0; i < iterations; i++) {
        pageArr.push(parsePage(id, i, requestManager, cheerio));
    }
    const results = await Promise.all(pageArr);
    return results.flat(); // Flatten the array of arrays into a single array
}
exports.parsePages = parsePages;
const createTags = (tags) => {
    let tagObjs = [];
    for (const tag of tags) {
        if (tag.split(":").length != 2) {
            continue;
        }
        const [tagType, tagName] = tag.split(":");
        tagObjs.push(App.createTag({ id: `${tagType}:"${tagName}$"`, label: tag }));
    }
    return App.createTagSection({ id: "genres", label: "genres", tags: tagObjs });
};
const parseTags = (tags) => {
    const tagSectionArr = [];
    switch (tags.shift()) {
        case 'Doujinshi':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:2', label: 'category:Doujinshi' })] }));
            break;
        case 'Manga':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:4', label: 'category:Manga' })] }));
            break;
        case 'Artist CG':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:8', label: 'category:Artist CG' })] }));
            break;
        case 'Game CG':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:16', label: 'category:Game CG' })] }));
            break;
        case 'Non-H':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:256', label: 'category:Non-H' })] }));
            break;
        case 'Image Set':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:32', label: 'category:Image Set' })] }));
            break;
        case 'Western':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:512', label: 'category:Western' })] }));
            break;
        case 'Cosplay':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:64', label: 'category:Cosplay' })] }));
            break;
        case 'Asian Porn':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:128', label: 'category:Asian Porn' })] }));
            break;
        case 'Misc':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:1', label: 'category:Misc' })] }));
            break;
    }
    tagSectionArr.push(createTags(tags));
    return tagSectionArr;
};
exports.parseTags = parseTags;
const parseTitle = (title) => {
    return title.replaceAll(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
};
exports.parseTitle = parseTitle;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.modifySearch = exports.getExtraArgs = void 0;
const getExtraArgs = async (stateManager) => {
    return await stateManager.retrieve('extraSearchArgs') ?? `-guro -yaoi -"males only"`;
};
exports.getExtraArgs = getExtraArgs;
const modifySearch = (stateManager) => {
    return App.createDUINavigationButton({
        id: 'modifySearch',
        label: 'Modify Search',
        form: App.createDUIForm({
            sections: () => {
                return Promise.resolve([
                    App.createDUISection({
                        id: 'modifySearchSection',
                        footer: 'Note: searches with only exclusions do not work, including on the home page',
                        rows: async () => {
                            await Promise.all([
                                (0, exports.getExtraArgs)(stateManager)
                            ]);
                            return await [
                                App.createDUIInputField({
                                    id: 'extraSearchArgs',
                                    label: 'Additional arguments',
                                    value: App.createDUIBinding({
                                        get: () => (0, exports.getExtraArgs)(stateManager),
                                        set: async (newValue) => {
                                            await stateManager.store('extraSearchArgs', newValue.replaceAll(/‘|’/g, '\'').replaceAll(/“|”/g, '"'));
                                        }
                                    })
                                })
                            ];
                        },
                        isHidden: false
                    })
                ]);
            }
        })
    });
};
exports.modifySearch = modifySearch;
const resetSettings = (stateManager) => {
    return App.createDUIButton({
        id: 'reset',
        label: 'Reset to Default',
        onTap: async () => {
            await Promise.all([
                stateManager.store('extraSearchArgs', null)
            ]);
        }
    });
};
exports.resetSettings = resetSettings;

},{}]},{},[62])(62)
});
