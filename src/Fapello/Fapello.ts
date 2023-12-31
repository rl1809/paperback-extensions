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
} from "@paperback/types";

import {
    isLastPage,
    parseChapterDetails,
    parseChapterList,
    parseMangaDetails,
    parseViewMoreItems,
    parseHomeSections,
    parseSearch,
    parseFeaturedSection,
} from "./FapelloParser";


import { FAPELLO_DOMAIN } from "./constant";


export const FapelloInfo: SourceInfo = {
    version: "0.0.1",
    name: "Fapello",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls images from Fapello",
    contentRating: ContentRating.ADULT,
    websiteBaseURL: FAPELLO_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
        }
    ]
};

export class Fapello
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
                        referer: `${FAPELLO_DOMAIN}/`,
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


    getMangaShareUrl(mangaId: string): string {
        return `${FAPELLO_DOMAIN}/${mangaId}/`;
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
        const $ = await this.DOMHTML(`${FAPELLO_DOMAIN}/${mangaId}/`)
        return parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const $ = await this.DOMHTML(`${FAPELLO_DOMAIN}/${mangaId}/`)
        return parseChapterList($, mangaId, this.requestManager);
    }

    async getChapterDetails(
        mangaId: string,
        chapterId: string
    ): Promise<ChapterDetails> {
        const $ = await this.DOMHTML(`${FAPELLO_DOMAIN}/${mangaId}/`)
        return parseChapterDetails($, mangaId, chapterId);
    }

    async getHomePageSections(
        sectionCallback: (section: HomeSection) => void
    ): Promise<void> {
        const promises: Promise<void>[] = []
        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'top-likes', title: "Top Likes", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'top-followers', title: "Top Followers", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'trending', title: "Trending", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];


        const featuredSection = App.createHomeSection({ id: 'featured', title: "Featured", containsMoreItems: false, type: HomeSectionType.featured })
        sectionCallback(featuredSection);
        promises.push(
            this.DOMHTML(`${FAPELLO_DOMAIN}/trending/`).then(async (response) => {
                featuredSection.items = await parseFeaturedSection(response)
                sectionCallback(featuredSection)
            })
        )
        for (const section of sections) {
            sectionCallback(section);
            let url: string;
            switch (section.id) {
                case 'top-likes':
                    url = `${FAPELLO_DOMAIN}/ajax/top-likes/page-1/`;
                    break;
                case 'top-followers':
                    url = `${FAPELLO_DOMAIN}/ajax/top-followers/page-1/`;
                    break;
                case 'trending':
                    url = `${FAPELLO_DOMAIN}/ajax/trending/page-1/`;
                    break;

                default:
                    throw new Error("Invalid homepage section ID");
            }


            promises.push(
                this.DOMHTML(url).then(async (response) => {
                    section.items = await parseHomeSections(response);
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


        let url = "";
        switch (homepageSectionId) {
            case 'top-likes':
                url = `${FAPELLO_DOMAIN}/ajax/top-likes/page-${page}/`;
                break;
            case 'top-followers':
                url = `${FAPELLO_DOMAIN}/ajax/top-followers/page-${page}/`;
                break;
            case 'trending':
                url = `${FAPELLO_DOMAIN}/ajax/trending/page-${page}/`;
                break;

            default:
                throw new Error("Invalid homepage section ID");
        }

        const $ = await this.DOMHTML(url)

        const manga = parseViewMoreItems($);

        metadata = isLastPage(page) ? undefined : { page: page + 1 };

        return App.createPagedResults({
            results: manga,
            metadata
        });
    }

    async getSearchResults(
        query: SearchRequest,
        metadata: any
    ): Promise<PagedResults> {
        const queryParam = query.title?.replace(/\s+/g, (match) => '-'.repeat(match.length)) || "";

        let url = `${FAPELLO_DOMAIN}/search/${queryParam}/`;

        const $ = await this.DOMHTML(url)
        const manga = parseSearch($);

        metadata = undefined

        return App.createPagedResults({
            results: manga,
            metadata
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const sections: TagSection[] = [
        ]
        return sections
    }

}
