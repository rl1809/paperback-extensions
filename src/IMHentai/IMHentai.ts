import {
    Chapter,
    ChapterDetails,
    ChapterProviding,
    ContentRating,
    HomePageSectionsProviding,
    HomeSection,
    HomeSectionType,
    MangaProviding,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    SearchResultsProviding,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
    BadgeColor,
    DUISection,
    SourceStateManager
} from "@paperback/types";

import {
    isLastPage,
    parseChapterDetails,
    parseChapterList,
    parseMangaDetails,
    parseSearch,
    parseTags,
    parseViewMoreItems,
    parseHomeSections,
} from "./IMHentaiParser";

import {
    getExtraArgs,
    settings,
    resetSettings
} from "./IMHentaiSettings"

import { IMHENTAI_DOMAIN } from "./constant";

import { categories, languages, order } from "./external/search.json"

export const IMHentaiInfo: SourceInfo = {
    version: "0.0.1",
    name: "IMHentai",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls manga from IMHentai",
    contentRating: ContentRating.MATURE,
    websiteBaseURL: IMHENTAI_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ]
};

export class IMHentai
    implements
    SearchResultsProviding,
    MangaProviding,
    ChapterProviding,
    HomePageSectionsProviding {
    constructor(private cheerio: CheerioAPI) { }

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        referer: `${IMHENTAI_DOMAIN}/`,
                        "user-agent": await this.requestManager.getDefaultUserAgent(),
                    },
                };
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            },
        },
    });

    stateManager = App.createSourceStateManager()

    async supportsTagExclusion(): Promise<boolean> {
        return true;
    }

    getMangaShareUrl(mangaId: string): string {
        return `${IMHENTAI_DOMAIN}/gallery/${mangaId}`;
    }

    private async DOMHTML(url: string): Promise<CheerioStatic> {
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const $ = await this.DOMHTML(`${IMHENTAI_DOMAIN}/gallery/${mangaId}`)
        return parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const $ = await this.DOMHTML(`${IMHENTAI_DOMAIN}/gallery/${mangaId}`)
        return parseChapterList($, mangaId);
    }

    async getChapterDetails(
        mangaId: string,
        chapterId: string
    ): Promise<ChapterDetails> {
        const $ = await this.DOMHTML(`${IMHENTAI_DOMAIN}/gallery/${chapterId}`)
        return parseChapterDetails($, mangaId, chapterId);
    }

    async getHomePageSections(
        sectionCallback: (section: HomeSection) => void
    ): Promise<void> {
        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'popular', title: "Popular", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'downloaded', title: "Most Downloaded", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'top-rated', title: "Top Rated", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'latest', title: "Latest", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];

        const search = {
            lt: 0,      // latest
            pp: 0,      // popular
            dl: 0,      // downladed
            tr: 0,      // top rated
            en: 1,      // english
            jp: 1,      // japanese
            es: 1,      // spanish
            fr: 1,      // french
            kr: 1,      // korean
            de: 1,      // german
            ru: 1,      // russian
            m: 1,       // manga
            d: 1,       // doujinshi
            w: 1,       // western
            i: 1,       // image set
            a: 1,       // artist cg
            g: 1,       // game cg
        };

        const promises: Promise<void>[] = []

        for (const section of sections) {
            sectionCallback(section);
            switch (section.id) {
                case 'popular':
                    search.pp = 1;
                    break;
                case 'downloaded':
                    search.dl = 1;
                    break;
                case 'top-rated':
                    search.tr = 1;
                    break;
                case 'latest':
                    search.lt = 1;
                    break;
                default:
                    throw new Error("Invalid homepage section ID");
            }

            const key = await getExtraArgs(this.stateManager)
            const keyParam = key.replace(/\+/g, '%2B').replace(/ /g, '+').replace(/"/g, '%22');
            const params = `key=${keyParam}'&apply=Search&${Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&')}`;
            const url = `${IMHENTAI_DOMAIN}/advsearch?${params}`

            promises.push(
                this.DOMHTML(url).then(async (response) => {
                    section.items = await parseHomeSections(response)
                    sectionCallback(section)
                })
            )
        }
        Promise.all(promises)
    }


    async getViewMoreItems(
        homepageSectionId: string,
        metadata: any
    ): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1;

        const search = {
            lt: 0,      // latest
            pp: 0,      // popular
            dl: 0,      // downladed
            tr: 0,      // top rated
            en: 1,      // english
            jp: 1,      // japanese
            es: 1,      // spanish
            fr: 1,      // french
            kr: 1,      // korean
            de: 1,      // german
            ru: 1,      // russian
            m: 1,       // manga
            d: 1,       // doujinshi
            w: 1,       // western
            i: 1,       // image set
            a: 1,       // artist cg
            g: 1,       // game cg
        };


        switch (homepageSectionId) {
            case 'popular':
                search.pp = 1;
                break;
            case 'downloaded':
                search.dl = 1;
                break;
            case 'top-rated':
                search.tr = 1;
                break;
            case 'latest':
                search.lt = 1;
                break;
            default:
                throw new Error("Requested to getViewMoreItems for a section ID which doesn't exist");
        }

        const key = await getExtraArgs(this.stateManager)
        const keyParam = key.replace(/\+/g, '%2B').replace(/ /g, '+').replace(/"/g, '%22');
        const params = `key=${keyParam}'&apply=Search&${Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&')}&page=${page}`;
        const $ = await this.DOMHTML(`${IMHENTAI_DOMAIN}/advsearch?${params}`)
        const manga = parseViewMoreItems($);

        metadata = isLastPage($) ? undefined : { page: page + 1 };

        return App.createPagedResults({
            results: manga,
            metadata
        });
    }

    async getSearchResults(
        query: SearchRequest,
        metadata: any
    ): Promise<PagedResults> {
        let page = metadata?.page ?? 1;

        const search = {
            lt: 0,      // latest
            pp: 0,      // popular
            dl: 0,      // downladed
            tr: 0,      // top rated
            en: 0,      // english
            jp: 0,      // japanese
            es: 0,      // spanish
            fr: 0,      // french
            kr: 0,      // korean
            de: 0,      // german
            ru: 0,      // russian
            m: 0,       // manga
            d: 0,       // doujinshi
            w: 0,       // western
            i: 0,       // image set
            a: 0,       // artist cg
            g: 0,       // game cg
        };

        let artistHref = ""
        let key = await getExtraArgs(this.stateManager)
        const tags = query.includedTags?.map(tag => tag.id) ?? [];
        for (const value of tags) {
            if (value.startsWith("/")) {
                artistHref = value
            } else if (value.indexOf(":") === -1) {
                search[value as keyof typeof search] = 1
            } else {
                key += ` +${value}`
            }
        }

        const extags = query.excludedTags?.map(tag => tag.id) ?? [];
        for (const value of extags) {
            if (value.indexOf(":") === -1) {
                search[value as keyof typeof search] = 0
            } else {
                key += ` -${value}`
            }
        }

        let url = `${IMHENTAI_DOMAIN}/advsearch`
        const keyParam = key.replace(/\+/g, '%2B').replace(/ /g, '+').replace(/"/g, '%22');
        let param = `?key=${keyParam}'&apply=Search&${Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&')}&page=${page}`;
        if (tags.length == 0) {
            url = `${IMHENTAI_DOMAIN}/search`
            param = encodeURI(`?key=${query.title ?? ''}&apply=Search&page=${page}`);
        }
        let searchQuery = url + param
        if (artistHref !== "") {
            searchQuery = `${IMHENTAI_DOMAIN}${artistHref}?page=${page}`
        }

        const $ = await this.DOMHTML(searchQuery);
        const tiles = parseSearch($);
        metadata = !isLastPage($) ? { page: page + 1 } : undefined;

        return App.createPagedResults({
            results: tiles,
            metadata
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const tagsURL = `${IMHENTAI_DOMAIN}/tags/popular/`;
        const parodiesURL = `${IMHENTAI_DOMAIN}/parodies/popular/`;
        const artistsURL = `${IMHENTAI_DOMAIN}/artists/popular/`;
        const charactersURL = `${IMHENTAI_DOMAIN}/characters/popular/`;
        const groupsURL = `${IMHENTAI_DOMAIN}/groups/popular/`;

        const [tagsCheerio, parodiesCheerio, artistsCheerio, charactersCheerio, groupsCheerio] = await Promise.all([
            this.DOMHTML(tagsURL),
            this.DOMHTML(parodiesURL),
            this.DOMHTML(artistsURL),
            this.DOMHTML(charactersURL),
            this.DOMHTML(groupsURL)
        ]);

        const tags = parseTags("tag", tagsCheerio);
        const parodies = parseTags("parody", parodiesCheerio)
        const artists = parseTags("artist", artistsCheerio)
        const characters = parseTags("character", charactersCheerio)
        const groups = parseTags("group", groupsCheerio)

        const sections: TagSection[] = [
            App.createTagSection({ id: '0', label: 'tags', tags: tags.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '1', label: 'parodies', tags: parodies.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '2', label: 'artists', tags: artists.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '3', label: 'characters', tags: characters.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '4', label: 'groups', tags: groups.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '5', label: 'categories', tags: categories.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '6', label: 'languages', tags: languages.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '7', label: 'order by', tags: order.map(x => App.createTag(x)) }),
        ]
        return sections
    }

    async extraArgs(stateManager: SourceStateManager): Promise<string> {
        const args = await getExtraArgs(stateManager)
        return ` ${args}`
    }

    // Sourrce Settings
    async getSourceMenu(): Promise<DUISection> {
        return Promise.resolve(App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            rows: () => Promise.resolve([
                settings(this.stateManager),
                resetSettings(this.stateManager)
            ]),
            isHidden: false
        }))
    }
}
