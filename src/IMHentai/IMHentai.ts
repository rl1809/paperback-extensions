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
    SourceStateManager,
    PartialSourceManga,
} from "@paperback/types";

import {
    isLastPage,
    parseChapterDetails,
    parseChapterList,
    parseMangaDetails,
    parseSearch,
    parseViewMoreItems,
    parseHomeSections,
} from "./IMHentaiParser";

import {
    getExtraArgs,
    settings,
    resetSettings
} from "./IMHentaiSettings"

import { IMHENTAI_DOMAIN } from "./constant";

import { popularTags, categories, languages, order } from "./external/search.json"

import { tagMappingDict } from "./IMHentaiHelper";

export const IMHentaiInfo: SourceInfo = {
    version: "0.0.1",
    name: "IMHentai",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls manga from IMHentai",
    contentRating: ContentRating.ADULT,
    websiteBaseURL: IMHENTAI_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
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

    async getExcludedTags(): Promise<number[]> {
        const tags: number[] = [];
        const excludeTagsStr = await this.extraArgs(this.stateManager);
        const excludeTags = excludeTagsStr.split(" ");
        excludeTags.forEach(tagName => {
            if (tagName.startsWith("-") && tagMappingDict[tagName.substring(1)]) {
                tags.push(tagMappingDict[tagName.substring(1)] ?? 0);
            }
        });
        return tags;
    }

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


        const promises: Promise<void>[] = []

        for (const section of sections) {
            sectionCallback(section);
            let url: string;
            switch (section.id) {
                case 'popular':
                    url = `${IMHENTAI_DOMAIN}/popular/`;
                    break;
                case 'downloaded':
                    url = `${IMHENTAI_DOMAIN}/downloaded/`;
                    break;
                case 'top-rated':
                    url = `${IMHENTAI_DOMAIN}/top-rated`;
                    break;
                case 'latest':
                    url = `${IMHENTAI_DOMAIN}/`;
                    break;
                default:
                    throw new Error("Invalid homepage section ID");
            }


            promises.push(
                this.DOMHTML(url).then(async (response) => {
                    section.items = await parseHomeSections(response, await this.getExcludedTags());
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


        let param = "";
        let url = "";

        switch (homepageSectionId) {
            case "popular":
                param = `?page=${page}`;
                url = `${IMHENTAI_DOMAIN}/popular`;
                break;
            case "downloaded":
                param = `?page=${page}`;
                url = `${IMHENTAI_DOMAIN}/downloaded`;
                break;
            case "top-rated":
                param = `?page=${page}`;
                url = `${IMHENTAI_DOMAIN}/top-rated`;
                break;
            case "latest":
                param = `?page=${page}`;
                url = `${IMHENTAI_DOMAIN}/`;
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
        const $ = this.cheerio.load(response.data as string);

        const manga = parseViewMoreItems($, await this.getExcludedTags());

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
        let tagHref = ""
        const tags = query.includedTags?.map(tag => tag.id) ?? [];
        for (const value of tags) {
            if (value.startsWith("/artist")) {
                artistHref = value
                break
            } else if (value.startsWith("/tag")) {
                tagHref = value
                break
            } else if (value.indexOf(":") === -1) {
                search[value as keyof typeof search] = 1
            }
        }

        const extags = query.excludedTags?.map(tag => tag.id) ?? [];
        for (const value of extags) {
            if (value.indexOf(":") === -1) {
                search[value as keyof typeof search] = 0
            }
        }

        const queryTitle = (query.title || "").replace(/\s+/g, (match) => '+'.repeat(match.length));

        let firstSearchQuery = `${IMHENTAI_DOMAIN}/search/?key=${queryTitle}&page=${page}`;
        let secondSearchQuery = `${IMHENTAI_DOMAIN}/search/?key=${queryTitle}&page=${page + 1}`;

        if (tags.length != 0 || extags.length != 0) {
            const param = `apply=Search&${Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&')}`;
            firstSearchQuery = `${IMHENTAI_DOMAIN}/search/?key=${queryTitle}&${param}&page=${page}`;
            secondSearchQuery = `${IMHENTAI_DOMAIN}/search/?key=${queryTitle}&${param}&page=${page + 1}`;
        }

        if (artistHref !== "") {
            firstSearchQuery = `${IMHENTAI_DOMAIN}${artistHref}?page=${page}`
            secondSearchQuery = `${IMHENTAI_DOMAIN}${artistHref}?page=${page + 1}`
        }
        if (tagHref !== "") {
            firstSearchQuery = `${IMHENTAI_DOMAIN}${tagHref}?page=${page}`
            secondSearchQuery = `${IMHENTAI_DOMAIN}${tagHref}?page=${page + 1}`
        }

        let manga: PartialSourceManga[] = [];

        const firstCheerioPromise = this.DOMHTML(firstSearchQuery);
        const secondCheerioPromise = this.DOMHTML(secondSearchQuery);
        const excludedTagsPromise = this.getExcludedTags();

        const [firstCheerio, secondCheerio, excludedTags] = await Promise.all([
            firstCheerioPromise,
            secondCheerioPromise,
            excludedTagsPromise
        ]);

        const [firstResponse, secondResponse] = await Promise.all([
            parseSearch(firstCheerio, excludedTags),
            parseSearch(secondCheerio, excludedTags)
        ]);

        manga = [...firstResponse, ...secondResponse]


        metadata = !isLastPage(secondCheerio) ? { page: page + 2 } : undefined;

        return App.createPagedResults({
            results: manga,
            metadata
        });
    }

    async getSearchTags(): Promise<TagSection[]> {

        const sections: TagSection[] = [
            App.createTagSection({ id: '0', label: 'tags (advanced search)', tags: popularTags.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '1', label: 'categories (multiple choice)', tags: categories.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '2', label: 'languages (multiple choice)', tags: languages.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '3', label: 'order by (choose 1)', tags: order.map(x => App.createTag(x)) }),
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
