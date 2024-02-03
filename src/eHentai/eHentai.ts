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
    parseArtist,
    parsePages,
    parseTags,
    parseTitle,
    parseHomeSections,
    parseViewMore,
    parseLanguage
} from './eHentaiParser'

import {
    modifySearch,
    resetSettings,
    getExtraArgs,
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

    private async getGalleryData(ids: string[]): Promise<any> {
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
        })

        const data = await this.requestManager.schedule(request, 1)
        const json = (typeof data.data == 'string') ? JSON.parse(data.data.replaceAll(/[\r\n]+/g, ' ')) : data.data
        return json.gmetadata
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
        sectionCallback(section);
        promises.push(
            this.DOMHTML(`${E_HENTAI_DOMAIN}/popular`).then(async (response) => {
                section.items = await parseHomeSections(response)
                sectionCallback(section)
            })
        )
        const query = `${await getExtraArgs(this.stateManager)}`
        for (const tag of (await this.getSearchTags())[0]?.tags ?? []) {
            const section = App.createHomeSection(
                {
                    id: tag.id,
                    title: tag.label,
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal,
                }
            )
            sectionCallback(section);
            const url = `${E_HENTAI_DOMAIN}/?f_cats=${1023 - parseInt(tag.id.substring(9))}&f_search=${encodeURIComponent(query)}`
            promises.push(
                this.DOMHTML(url).then(async (response) => {
                    section.items = await parseHomeSections(response)
                    sectionCallback(section);
                })
            )
        }
        Promise.all(promises)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const next = metadata?.next ?? 0

        const query = `${await getExtraArgs(this.stateManager)}`
        const url = `${E_HENTAI_DOMAIN}/?f_cats=${1023 - parseInt(homepageSectionId.substring(9))}&f_search=${encodeURIComponent(query)}&next=${next}`
        const $ = await this.DOMHTML(url)
        const result = parseViewMore($);
        metadata = result.nextId == 0 ? undefined : { next: result.nextId };
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
        const data = (await this.getGalleryData([mangaId]))[0]
        const title = parseTitle(data.title)
        const title_jp = parseTitle(data.title_jpn)
        const date = new Date(parseInt(data.posted) * 1000)
        let desc = ""
        desc += `Title: ${title}\n`
        desc += `Alternative Title: ${title_jp}\n`
        desc += `Uploader: ${data.uploader}\n`
        desc += `Length: ${data.filecount} pages\n`
        desc += `Rating: ${data.rating}\n`
        desc += `Posted: ${date.toDateString()}`
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo(
                {
                    titles: [parseTitle(data.title), parseTitle(data.title_jpn)],
                    image: data.thumb,
                    rating: data.rating,
                    status: "",
                    desc: desc,
                    artist: parseArtist(data.tags),
                    tags: parseTags([data.category, ...data.tags]),
                }
            )
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = (await this.getGalleryData([mangaId]))[0]
        return [App.createChapter({
            id: data.filecount,
            chapNum: 1,
            langCode: parseLanguage(data.tags),
            name: 'Chapter',
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
        const next = metadata?.next ?? 0

        let categories = 0
        const includedCategories = query.includedTags?.filter(tag => tag.id.startsWith('category:'))
        const excludedCategories = query.excludedTags?.filter(tag => tag.id.startsWith('category:'))
        if (includedCategories != undefined && includedCategories.length != 0) categories = includedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev - cur, 1023)
        else if (excludedCategories != undefined && excludedCategories.length != 0) categories = excludedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev + cur, 0)

        let searchQuery = query.title ?? ""
        const includedTags = query.includedTags?.filter(tag => !tag.id.startsWith('category:'))
        const excludedTags = query.excludedTags?.filter(tag => !tag.id.startsWith('category:'))

        for (const tag of includedTags) searchQuery += ` ${tag.id}`
        for (const tag of excludedTags) searchQuery += ` -${tag.id}`
        searchQuery += ` ${await getExtraArgs(this.stateManager)}`

        const url = `${E_HENTAI_DOMAIN}/?f_cats=${categories}&f_search=${encodeURIComponent(searchQuery)}&next=${next}`
        const $ = await this.DOMHTML(url)
        const result = parseViewMore($);
        metadata = result.nextId == 0 ? undefined : { next: result.nextId };
        return App.createPagedResults({
            results: result.items,
            metadata: metadata,
        })
    }
}