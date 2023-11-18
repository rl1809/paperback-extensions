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
    PartialSourceManga,
    BadgeColor,
} from "@paperback/types";

import {
    parseChapterList,
    parseArtists,
    searchArtists,
    Artist,
    SearchCriteria,
    getArtistById,
} from "./CoomerParse";

import { COOMER_DOMAIN, IMG_COOMER_DOMAIN } from "./constant";

import { services, sortBy, sortType } from "./external/search.json"

export const CoomerInfo: SourceInfo = {
    version: "0.0.1",
    name: "Coomer",
    icon: "icon.png",
    author: "Thanh Nha",
    authorWebsite: "https://github.com/rl1809",
    description: "Extension that pulls manga from Coomer",
    contentRating: ContentRating.ADULT,
    websiteBaseURL: COOMER_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
        }
    ]
};

export class Coomer
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
                        referer: `${COOMER_DOMAIN}/`,
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
        return `${COOMER_DOMAIN}${mangaId}`;
    }

    getArtists = async (): Promise<Artist[]> => {
        const url = `${COOMER_DOMAIN}/api/v1/creators.txt`
        const request = App.createRequest({
            url: url,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        });
        const response = await this.requestManager.schedule(request, 1);
        const json = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data

        return parseArtists(json)
    }

    artists = this.getArtists()

    private async GetJSON(url: string): Promise<Response> {
        const request = App.createRequest({
            url: url,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        });
        return this.requestManager.schedule(request, 1);
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
        const idParts = mangaId.split('/') ?? [""]; // Split the string by backslashes
        const lastPart = idParts[idParts.length - 1];
        const id = typeof lastPart === 'string' ? lastPart : ''; // Set to an empty string if it's undefined

        const artists = await this.artists
        const artist = getArtistById(artists, id)
        const name = artist.name
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [name],
                author: name,
                artist: name,
                image: `${IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                desc: "",
                status: "",
            }),
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        let offset = 0;
        let batchSize = 50
        const requests: Promise<Response>[] = []; // Array to hold all request promises

        // Make the first request to get the total number of chapters

        const $ = await this.DOMHTML(`${COOMER_DOMAIN}${mangaId}`);

        const total = parseInt($('small').text().match(/\d+/g)?.pop() || '0');

        // Loop to make concurrent requests for chapters
        while (offset < total) {
            requests.push(this.GetJSON(`${COOMER_DOMAIN}/api/v1${mangaId}?o=${offset}`));
            offset += batchSize;
        }

        // Wait for all requests to complete in parallel
        const responses = await Promise.all(requests);

        // Parse the HTML responses in parallel
        for (const response of responses) {
            const batchChapters = parseChapterList(response);
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



    async getChapterDetails(
        mangaId: string,
        chapterId: string
    ): Promise<ChapterDetails> {
        const pages: string[] = []

        const url = `${COOMER_DOMAIN}/api/v1${mangaId}/post/${chapterId}`
        const request = App.createRequest({
            url: url,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        });
        const response = await this.requestManager.schedule(request, 1);
        const json = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data

        pages.push(`${COOMER_DOMAIN}/data${json.file.path}`)

        const attachments = json.attachments
        for (const attachment of attachments) {
            pages.push(`${COOMER_DOMAIN}/data${attachment.path}`)
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }

    async getHomePageSections(
        sectionCallback: (section: HomeSection) => void
    ): Promise<void> {

        const sections: HomeSection[] = [
            App.createHomeSection({ id: 'popular', title: "Popular", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
            App.createHomeSection({ id: 'recent', title: "Recent", containsMoreItems: true, type: HomeSectionType.singleRowNormal }),
        ];

        const artists = await this.artists;
        let searchQuery: SearchCriteria = {
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

            const response = searchArtists(
                artists,
                searchQuery.searchName,
                searchQuery.orderBy,
                searchQuery.orderDirection,
                searchQuery.filterService,
                page,
                pageSize,
            );

            const items: PartialSourceManga[] = [];
            for (const artist of response.results) {
                items.push(
                    App.createPartialSourceManga({
                        mangaId: `/${artist.service}/user/${artist.id}`,
                        image: `${IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                        title: artist.name,
                        subtitle: artist.service,
                    })
                )
            }
            section.items = items;
            sectionCallback(section);
        }
    }


    async getViewMoreItems(
        homepageSectionId: string,
        metadata: any
    ): Promise<PagedResults> {
        let page = metadata?.page ?? 1;
        const pageSize = 20

        const artists = await this.artists
        const items: PartialSourceManga[] = []
        let searchQuery: SearchCriteria = {};
        switch (homepageSectionId) {
            case "popular":
                searchQuery.orderBy = "favorited"
                break;
            case "recent":
                searchQuery.orderBy = "updated"
                break;
            default:
                throw new Error("Requested to getViewMoreItems for a section ID which doesn't exist");
        }

        const response = searchArtists(
            artists,
            searchQuery.searchName,
            searchQuery.orderBy,
            searchQuery.orderDirection,
            searchQuery.filterService,
            page,
            pageSize,
        )

        for (const artist of response.results) {
            items.push(
                App.createPartialSourceManga({
                    mangaId: `/${artist.service}/user/${artist.id}`,
                    image: `${IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                    title: artist.name,
                    subtitle: artist.service,
                })
            )
        }


        const totalPages = Math.ceil(response.totalResults / pageSize);
        metadata = (page < totalPages) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: items,
            metadata
        });
    }

    async getSearchResults(
        query: SearchRequest,
        metadata: any
    ): Promise<PagedResults> {

        let page = metadata?.page ?? 1;
        const pageSize = 20

        const items: PartialSourceManga[] = []
        const artists = await this.artists

        let searchQuery: SearchCriteria = {
            "searchName": query.title ?? undefined,

        };

        const response = searchArtists(
            artists,
            searchQuery.searchName,
            searchQuery.orderBy,
            searchQuery.orderDirection,
            searchQuery.filterService,
            page,
            pageSize,
        )
        for (const artist of response.results) {
            items.push(
                App.createPartialSourceManga({
                    mangaId: `/${artist.service}/user/${artist.id}`,
                    image: `${IMG_COOMER_DOMAIN}/${artist.service}/${artist.id}`,
                    title: artist.name,
                    subtitle: artist.service,
                })
            )
        }

        const totalPages = Math.ceil(response.totalResults / pageSize);

        metadata = (page < totalPages) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: items,
            metadata
        });
    }

    async getSearchTags(): Promise<TagSection[]> {
        const sections: TagSection[] = [
            App.createTagSection({ id: '1', label: 'services', tags: services.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '2', label: 'order by', tags: sortBy.map(x => App.createTag(x)) }),
            App.createTagSection({ id: '3', label: 'order direction', tags: sortType.map(x => App.createTag(x)) }),
        ]
        return sections
    }
}
