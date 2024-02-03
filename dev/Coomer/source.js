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
exports.Coomer = exports.CoomerInfo = void 0;
const types_1 = require("@paperback/types");
const CoomerParse_1 = require("./CoomerParse");
const constant_1 = require("./constant");
const search_json_1 = require("./external/search.json");
exports.CoomerInfo = {
    version: "0.0.1",
    name: "Coomer",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls manga from Coomer",
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: constant_1.COOMER_DOMAIN,
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: '18+',
            type: types_1.BadgeColor.RED
        }
    ]
};
class Coomer {
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
                            referer: `${constant_1.COOMER_DOMAIN}/`,
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
        this.getArtists = async () => {
            const url = `${constant_1.COOMER_DOMAIN}/api/v1/creators.txt`;
            const request = App.createRequest({
                url: url,
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
            });
            const response = await this.requestManager.schedule(request, 1);
            const json = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
            return (0, CoomerParse_1.parseArtists)(json);
        };
        this.artists = this.getArtists();
    }
    getMangaShareUrl(mangaId) {
        return `${constant_1.COOMER_DOMAIN}${mangaId}`;
    }
    async GetJSON(url) {
        const request = App.createRequest({
            url: url,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        });
        return this.requestManager.schedule(request, 1);
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
        const idParts = mangaId.split('/') ?? [""]; // Split the string by backslashes
        const lastPart = idParts[idParts.length - 1];
        const id = typeof lastPart === 'string' ? lastPart : ''; // Set to an empty string if it's undefined
        const artists = await this.artists;
        const artist = (0, CoomerParse_1.getArtistById)(artists, id);
        const name = artist.name;
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [name],
                author: name,
                artist: name,
                image: `${constant_1.IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                desc: "",
                status: "",
            }),
        });
    }
    async getChapters(mangaId) {
        const chapters = [];
        let offset = 0;
        let batchSize = 50;
        const requests = []; // Array to hold all request promises
        // Make the first request to get the total number of chapters
        const $ = await this.DOMHTML(`${constant_1.COOMER_DOMAIN}${mangaId}`);
        const total = parseInt($('small').text().match(/\d+/g)?.pop() || '0');
        // Loop to make concurrent requests for chapters
        while (offset < total) {
            requests.push(this.GetJSON(`${constant_1.COOMER_DOMAIN}/api/v1${mangaId}?o=${offset}`));
            offset += batchSize;
        }
        // Wait for all requests to complete in parallel
        const responses = await Promise.all(requests);
        // Parse the HTML responses in parallel
        for (const response of responses) {
            const batchChapters = (0, CoomerParse_1.parseChapterList)(response);
            chapters.push(...batchChapters);
        }
        chapters.sort((a, b) => a.time.getTime() - b.time.getTime());
        // Update the chapNum values
        chapters.forEach((obj, index) => {
            obj.chapNum = index + 1;
            obj.sortingIndex = index + 1;
        });
        return chapters;
    }
    async getChapterDetails(mangaId, chapterId) {
        const pages = [];
        const url = `${constant_1.COOMER_DOMAIN}/api/v1${mangaId}/post/${chapterId}`;
        const request = App.createRequest({
            url: url,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        });
        const response = await this.requestManager.schedule(request, 1);
        const json = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
        pages.push(`${constant_1.COOMER_DOMAIN}/data${json.file.path}`);
        const attachments = json.attachments;
        for (const attachment of attachments) {
            pages.push(`${constant_1.COOMER_DOMAIN}/data${attachment.path}`);
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            App.createHomeSection({ id: 'popular', title: "Popular", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'recent', title: "Recent", containsMoreItems: true, type: types_1.HomeSectionType.singleRowNormal }),
        ];
        const artists = await this.artists;
        let searchQuery = {
            orderDirection: "desc",
        };
        const page = 1;
        const pageSize = 20;
        for (const section of sections) {
            sectionCallback(section);
            switch (section.id) {
                case 'popular':
                    searchQuery.orderBy = "favorited";
                    break;
                case 'recent':
                    searchQuery.orderBy = "updated";
                    break;
                default:
                    throw new Error("Invalid homepage section ID");
            }
            const response = (0, CoomerParse_1.searchArtists)(artists, searchQuery.searchName, searchQuery.orderBy, searchQuery.orderDirection, searchQuery.filterService, page, pageSize);
            const items = [];
            for (const artist of response.results) {
                items.push(App.createPartialSourceManga({
                    mangaId: `/${artist.service}/user/${artist.id}`,
                    image: `${constant_1.IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                    title: artist.name,
                    subtitle: artist.service,
                }));
            }
            section.items = items;
            sectionCallback(section);
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        let page = metadata?.page ?? 1;
        const pageSize = 20;
        const artists = await this.artists;
        const items = [];
        let searchQuery = {};
        switch (homepageSectionId) {
            case "popular":
                searchQuery.orderBy = "favorited";
                break;
            case "recent":
                searchQuery.orderBy = "updated";
                break;
            default:
                throw new Error("Requested to getViewMoreItems for a section ID which doesn't exist");
        }
        const response = (0, CoomerParse_1.searchArtists)(artists, searchQuery.searchName, searchQuery.orderBy, searchQuery.orderDirection, searchQuery.filterService, page, pageSize);
        for (const artist of response.results) {
            items.push(App.createPartialSourceManga({
                mangaId: `/${artist.service}/user/${artist.id}`,
                image: `${constant_1.IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                title: artist.name,
                subtitle: artist.service,
            }));
        }
        const totalPages = Math.ceil(response.totalResults / pageSize);
        metadata = (page < totalPages) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: items,
            metadata
        });
    }
    async getSearchResults(query, metadata) {
        let page = metadata?.page ?? 1;
        const pageSize = 20;
        const items = [];
        const artists = await this.artists;
        let searchQuery = {
            "searchName": query.title ?? undefined,
        };
        const response = (0, CoomerParse_1.searchArtists)(artists, searchQuery.searchName, searchQuery.orderBy, searchQuery.orderDirection, searchQuery.filterService, page, pageSize);
        for (const artist of response.results) {
            items.push(App.createPartialSourceManga({
                mangaId: `/${artist.service}/user/${artist.id}`,
                image: `${constant_1.IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                title: artist.name,
                subtitle: artist.service,
            }));
        }
        const totalPages = Math.ceil(response.totalResults / pageSize);
        metadata = (page < totalPages) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: items,
            metadata
        });
    }
    async getSearchTags() {
        const sections = [
            App.createTagSection({ id: '1', label: 'services', tags: search_json_1.services.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '2', label: 'order by', tags: search_json_1.sortBy.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '3', label: 'order direction', tags: search_json_1.sortType.map(x => App.createTag(x)) }),
        ];
        return sections;
    }
}
exports.Coomer = Coomer;

},{"./CoomerParse":63,"./constant":64,"./external/search.json":65,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchArtists = exports.getArtistById = exports.parseArtists = exports.parseChapterList = void 0;
const parseChapterList = (response) => {
    const json = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
    try {
        const chapters = json.map((item) => App.createChapter({
            id: item.id,
            name: item.title,
            chapNum: 0,
            time: new Date(item.published),
        }));
        return chapters;
    }
    catch (error) {
        // Handle any parsing or data validation errors here
        console.error('Error parsing chapter data:', error);
        return [];
    }
};
exports.parseChapterList = parseChapterList;
const parseArtists = (response) => {
    try {
        const artists = response.map((item) => {
            return {
                favorited: item.favorited,
                id: item.id,
                indexed: item.indexed,
                name: item.name,
                service: item.service,
                updated: item.updated,
            };
        });
        return artists;
    }
    catch (error) {
        // Handle any parsing or data validation errors here
        console.error('Error parsing artist data:', error);
        return [];
    }
};
exports.parseArtists = parseArtists;
function getArtistById(artists, artistId) {
    return artists.find(artist => artist.id === artistId) ?? {
        favorited: 0,
        id: artistId,
        indexed: 0,
        name: "Unknown Artist",
        service: "Unknown Service",
        updated: 0
    };
    ;
}
exports.getArtistById = getArtistById;
function searchArtists(artists, searchName, orderBy, // Use keyof to restrict to valid property names
orderDirection, filterService, page, pageSize) {
    let filteredArtists = artists;
    // Filter by service if a filter is provided
    if (filterService) {
        filteredArtists = filteredArtists.filter(artist => artist.service === filterService);
    }
    // Search by name if a searchName is provided
    if (searchName) {
        const searchNameLower = searchName.toLowerCase();
        filteredArtists = filteredArtists.filter(artist => artist.name.toLowerCase().includes(searchNameLower));
    }
    // Sort the filtered artists based on the orderBy and orderDirection
    if (orderBy) {
        filteredArtists.sort((a, b) => {
            if (orderDirection === 'asc') {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            }
            else {
                return a[orderBy] < b[orderBy] ? 1 : -1;
            }
        });
    }
    // Pagination
    const totalResults = filteredArtists.length;
    if (page !== undefined && pageSize !== undefined) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        filteredArtists = filteredArtists.slice(startIndex, endIndex);
    }
    return { results: filteredArtists, totalResults };
}
exports.searchArtists = searchArtists;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMG_COOMER_DOMAIN = exports.COOMER_DOMAIN = void 0;
exports.COOMER_DOMAIN = "https://coomer.su";
exports.IMG_COOMER_DOMAIN = "https://img.coomer.party/icons";

},{}],65:[function(require,module,exports){
module.exports={
  "services": [
    {
      "id": "onlyfans",
      "label": "OnlyFans"
    },
    {
      "id": "fansly",
      "label": "Fansly"
    }
  ],
  "sortBy": [
    {
      "id": "pp",
      "label": "Popularity"
    },
    {
      "id": "di",
      "label": "Date Indexed"
    },
    {
      "id": "du",
      "label": "Date Updated"
    },
    {
      "id": "a",
      "label": "Alphabetical Order"
    },
    {
      "id": "s",
      "label": "Service"
    }
  ],
  "sortType": [
    {
      "id": "desc",
      "label": "Descending"
    },
    {
      "id": "asc",
      "label": "Ascending"
    }
  ]
}

},{}]},{},[62])(62)
});
