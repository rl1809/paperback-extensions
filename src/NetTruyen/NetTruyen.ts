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
    MangaUpdates,
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
    parseUpdatedManga,
    parseFeaturedSection,
} from "./NetTruyenParser";


const NETTRUYEN_DOMAIN = "https://nettruyenclub.com";

export const NetTruyenInfo: SourceInfo = {
    version: "0.0.1",
    name: "NetTruyen",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/NhaNT1999",
    description: "Extension that pulls manga from NetTruyen",
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: NETTRUYEN_DOMAIN,
    sourceTags: [],
    intents:
        SourceIntents.MANGA_CHAPTERS |
        SourceIntents.HOMEPAGE_SECTIONS
};

export class NetTruyen
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
                        referer: `${NETTRUYEN_DOMAIN}/`,
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
        return `${NETTRUYEN_DOMAIN}/truyen-tranh/${mangaId}`;
    }

    async supportsTagExclusion(): Promise<boolean> {
        return true;
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
        const $ = await this.DOMHTML(`${NETTRUYEN_DOMAIN}/truyen-tranh/${mangaId}`)
        return parseMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const $ = await this.DOMHTML(`${NETTRUYEN_DOMAIN}/truyen-tranh/${mangaId}`)
        return parseChapterList($, mangaId);
    }

    async getChapterDetails(
        mangaId: string,
        chapterId: string
    ): Promise<ChapterDetails> {
        const $ = await this.DOMHTML(`${NETTRUYEN_DOMAIN}/truyen-tranh/${chapterId}`)
        return parseChapterDetails($, mangaId, chapterId);
    }

    async getHomePageSections(
        sectionCallback: (section: HomeSection) => void
    ): Promise<void> {

        const promises: Promise<void>[] = []

        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'viewest', title: "Truyện Xem Nhiều Nhất", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'hot', title: "Truyện Hot Nhất", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_updated', title: "Truyện Mới Cập Nhật", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'new_added', title: "Truyện Mới Thêm Gần Đây", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'full', title: "Truyện Đã Hoàn Thành", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];


        const featuredSection = App.createHomeSection({ id: 'featured', title: "Truyện Đề Cử", containsMoreItems: false, type: HomeSectionType.featured })
        sectionCallback(featuredSection);
        promises.push(
            this.DOMHTML(`${NETTRUYEN_DOMAIN}/`).then(async (response) => {
                featuredSection.items = await parseFeaturedSection(response)
                sectionCallback(featuredSection)
            })
        )

        for (const section of sections) {
            sectionCallback(section);
            let url: string;
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
        const $ = this.cheerio.load(response.data as string);

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
            genres: '',
            exgenres: '',
            gender: "-1",
            status: "-1",
            minchapter: "1",
            sort: "0",
        };

        const extags = query.excludedTags?.map(tag => tag.id) ?? [];
        const exgenres: string[] = [];
        for (const value of extags) {
            if (value.indexOf('.') === -1) {
                exgenres.push(value);
            }
        }

        const tags = query.includedTags?.map(tag => tag.id) ?? [];
        const genres: string[] = [];
        let authorLink = "";
        for (const value of tags) {
            if (value.startsWith("http")) {
                authorLink = value;
            } else if (value.indexOf('.') === -1) {
                genres.push(value);
            } else {
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
        let searchQuery = url + param
        if (/[a-zA-Z]+/.test(search.genres)) {
            searchQuery = `${NETTRUYEN_DOMAIN}/tim-truyen/${search.genres}?page=${page}`;
        }
        if (authorLink !== "") {
            searchQuery = `${authorLink}&page=${page}`;
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
        const url = `${NETTRUYEN_DOMAIN}/tim-truyen-nang-cao`;
        const $ = await this.DOMHTML(url);
        return parseTags($);
    }

    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        const updateManga: any = [];
        const pages = 10;
        for (let i = 1; i < pages + 1; i++) {
            let url = `${NETTRUYEN_DOMAIN}/?page=${i}`
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

        const returnObject = parseUpdatedManga(updateManga, time, ids)
        mangaUpdatesFoundCallback(App.createMangaUpdates(returnObject))
    }
}
