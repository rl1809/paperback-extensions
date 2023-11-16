import {
    SearchResultsProviding,
    MangaProviding,
    ChapterProviding,
    HomePageSectionsProviding,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    TagSection,
    Request,
    ContentRating,
    Response,
    BadgeColor,
    SourceIntents,
    HomeSectionType,
    DUISection,
    SourceManga
} from '@paperback/types'

import {
    getGalleryData,
    getSearchData
} from './eHentaiHelper'

import {
    parseArtist,
    parsePages,
    parseTags,
    parseTitle,
    parseHomeSections,
    parseViewMore,
} from './eHentaiParser'

import {
    modifySearch,
    resetSettings,
} from './eHentaiSettings'


const E_HENTAI_DOMAIN = 'https://e-hentai.org'

export const eHentaiInfo: SourceInfo = {
    version: "0.0.1",
    name: "E-Hentai",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls manga from IMHentai",
    contentRating: ContentRating.ADULT,
    websiteBaseURL: E_HENTAI_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
        }
    ]
};

export class eHentai
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
                        referer: `${E_HENTAI_DOMAIN}/`,
                        "user-agent": await this.requestManager.getDefaultUserAgent(),
                    },
                };
                request.cookies = [App.createCookie({ name: 'nw', value: '1', domain: 'https://e-hentai.org/' })]
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            },
        },
    });

    stateManager = App.createSourceStateManager();

    getMangaShareUrl(mangaId: string): string {
        return `${E_HENTAI_DOMAIN}/g/${mangaId}`
    }

    private async DOMHTML(url: string): Promise<CheerioStatic> {
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data as string);
    }

    async getSearchTags(): Promise<TagSection[]> {
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
                App.createTag({ id: 'category:128', label: 'Asian Porn' }),
                App.createTag({ id: 'category:1', label: 'Misc' })
            ]
        })]
    }

    async supportsTagExclusion(): Promise<boolean> {
        return true
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {

        const promises: Promise<void>[] = []
        const section = App.createHomeSection(
            {
                id: "popular",
                title: "Popular",
                containsMoreItems: false,
                type: HomeSectionType.featured,
            }
        )
        promises.push(
            this.DOMHTML(`${E_HENTAI_DOMAIN}/popular`).then(async (response) => {
                section.items = await parseHomeSections(response)
                sectionCallback(section)
            })
        )
        for (const tag of (await this.getSearchTags())[0]?.tags ?? []) {
            const section = App.createHomeSection(
                {
                    id: tag.id,
                    title: tag.label,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                }
            )
            const url = `${E_HENTAI_DOMAIN}/?f_cats=${1023 - parseInt(tag.id.substring(9))}`
            promises.push(
                this.DOMHTML(url).then(async (response) => {
                    section.items = await parseHomeSections(response)
                    sectionCallback(section)
                })
            )
        }
        Promise.all(promises)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const next = metadata?.next ?? 0

        const url = `${E_HENTAI_DOMAIN}/?f_cats=${1023 - parseInt(homepageSectionId.substring(9))}&next=${next}`
        const $ = await this.DOMHTML(url)
        const result = parseViewMore($);
        metadata = result.nextId == 0 ? undefined : result.nextId;
        return App.createPagedResults({
            results: result.items,
            metadata: metadata,
        })
    }

    async getSourceMenu(): Promise<DUISection> {
        return Promise.resolve(App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            rows: () => Promise.resolve([
                modifySearch(this.stateManager),
                resetSettings(this.stateManager)
            ]),
            isHidden: false
        }))
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const data = (await getGalleryData([mangaId], this.requestManager))[0]

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo(
                {
                    titles: [parseTitle(data.title), parseTitle(data.title_jpn)],
                    image: data.thumb,
                    rating: data.rating,
                    status: "",
                    desc: "",
                    artist: parseArtist(data.tags),
                    tags: parseTags([data.category, ...data.tags]),
                    hentai: !(data.category == 'Non-H' || data.tags.includes('other:non-nude')),
                }
            )
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = (await getGalleryData([mangaId], this.requestManager))[0]
        return [App.createChapter({
            id: data.filecount,
            chapNum: 1,
            langCode: "en",
            name: parseTitle(data.title),
            time: new Date(parseInt(data.posted) * 1000)
        })]
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: await parsePages(mangaId, parseInt(chapterId), this.requestManager, this.cheerio)
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 0
        let stopSearch = metadata?.stopSearch ?? false
        if (stopSearch) return App.createPagedResults({
            results: [],
            metadata: {
                stopSearch: true
            }
        })

        const includedCategories = query.includedTags?.filter(tag => tag.id.startsWith('category:'))
        const excludedCategories = query.excludedTags?.filter(tag => tag.id.startsWith('category:'))
        let categories = 0
        if (includedCategories != undefined && includedCategories.length != 0) categories = includedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev - cur, 1023)
        else if (excludedCategories != undefined && excludedCategories.length != 0) categories = excludedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev + cur, 0)

        const results = await getSearchData(query.title, page, categories, this.requestManager, this.cheerio, this.stateManager)
        if (results[results.length - 1]?.mangaId == 'stopSearch') {
            results.pop()
            stopSearch = true
        }

        return App.createPagedResults({
            results: results,
            metadata: {
                page: page + 1,
                stopSearch: stopSearch
            }
        })
    }
}