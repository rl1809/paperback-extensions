import {
    RequestManager,
    Tag,
    TagSection,
    PartialSourceManga
} from '@paperback/types'

export const parseArtist = (tags: string[]): string | undefined => {
    const artist = tags.filter(tag => tag.startsWith('artist:')).map(tag => tag.substring(7))
    const cosplayer = tags.filter(tag => tag.startsWith('cosplayer:')).map(tag => tag.substring(10))
    if (artist.length != 0) return artist[0]
    else if (cosplayer.length != 0) return cosplayer[0]
    else return undefined
}


export const parseLanguage = (tags: string[]): string => {
    const languageTags = tags.filter(tag => tag.startsWith('language:') && tag != 'language:translated').map(tag => tag.substring(9))
    if (languageTags.length == 0) return "🇯🇵"
    switch (languageTags[0]) {
        case 'bengali': return "🇧🇩"; break
        case 'bulgarian': return "🇧🇬"; break
        case 'chinese': return "🇨🇳"; break
        case 'czech': return "🇨🇿"; break
        case 'danish': return "🇩🇰"; break
        case 'dutch': return "🇳🇱"; break
        case 'english': return "🇬🇧"; break
        case 'finnish': return "🇫🇮"; break
        case 'french': return "🇫🇷"; break
        case 'german': return "🇩🇪"; break
        case 'greek': return "🇬🇷"; break
        case 'hungarian': return "🇭🇺"; break
        case 'gujarati': case 'nepali': case 'punjabi': case 'tamil': case 'telugu': case 'urdu': return "🇮🇳"; break
        case 'indonesian': return "🇮🇩"; break
        case 'persian': return "🇮🇷"; break
        case 'italian': return "🇮🇹"; break
        case 'korean': return "🇰🇷"; break
        case 'mongolian': return "🇲🇳"; break
        case 'norwegian': return "🇳🇴"; break
        case 'cebuano': case 'tagalog': return "🇵🇭"; break
        case 'polish': return "🇵🇱"; break
        case 'portuguese': return "🇵🇹"; break
        case 'romanian': return "🇷🇴"; break
        case 'russian': return "🇷🇺"; break
        case 'sanskrit': return "🇰🇳"; break
        case 'spanish': return "🇪🇸"; break
        case 'thai': return "🇹🇭"; break
        case 'turkish': return "🇹🇷"; break
        case 'ukrainian': return "🇺🇦"; break
        case 'vietnamese': return "🇻🇳"; break
        case 'welsh': return "🏴󠁧󠁢󠁷󠁬󠁳󠁿"; break
    }
    return "unknown"
}

export const parseHomeSections = ($: CheerioStatic): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []

    $('table.itg tbody tr').each((_index: any, element: any) => {
        const $element = $(element);
        const idElement = $element.find('.glname a').attr('href');
        const id = idElement ? `${idElement.split('/').slice(-3, -1).join('/')}` : "";

        const title = $element.find('.glname .glink').text().trim();
        const subtitle = $element.find('.gl1c .cn').text().trim();
        const imageElement = $element.find('.glthumb img')
        const image = imageElement.attr("data-src") ?? imageElement.attr("src") ?? ""

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

interface ParsedViewMoreResult {
    items: PartialSourceManga[];
    nextId: number;
}

export const parseViewMore = ($: CheerioStatic): ParsedViewMoreResult => {
    const items: PartialSourceManga[] = []

    $('table.itg tbody tr').each((_index: any, element: any) => {
        const $element = $(element);
        const idElement = $element.find('.glname a').attr('href');
        const id = idElement ? `${idElement.split('/').slice(-3, -1).join('/')}` : "";

        const title = $element.find('.glname .glink').text().trim();
        const subtitle = $element.find('.gl1c .cn').text().trim();
        const imageElement = $element.find('.glthumb img')
        const image = imageElement.attr("data-src") ?? imageElement.attr("src") ?? ""

        if (id && title) {
            items.push(App.createPartialSourceManga({
                mangaId: id,
                image: image,
                title: title,
                subtitle: subtitle
            }));
        }
    });

    let nextId = 0
    const nextLinkUrl = $('.searchnav #unext').attr('href');
    if (nextLinkUrl) {
        const idString = nextLinkUrl.split('next=')[1];
        if (idString) {
            nextId = parseInt(idString, 10);
        }
    }
    return { items, nextId };
};


async function getImage(url: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string> {
    const request = App.createRequest({
        url: url,
        method: 'GET'
    })

    const response = await requestManager.schedule(request, 1)
    const $ = cheerio.load(response.data as string)
    return $('#img').attr('src') ?? ''
}

async function parsePage(id: string, page: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const request = App.createRequest({
        url: `https://e-hentai.org/g/${id}/?p=${page}`,
        method: 'GET'
    })

    const response = await requestManager.schedule(request, 1)
    const $ = cheerio.load(response.data as string)

    const pageArr:Promise<string>[] = []
    const pageDivArr = $('div.gdtm').toArray()

    for (const page of pageDivArr) {
        pageArr.push(getImage($('a', page).attr('href') ?? '', requestManager, cheerio))
    }

    return Promise.all(pageArr)
}

export async function parsePages(id: string, pageCount: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const pageArr = []

    // Calculate the number of iterations needed for pages
    const iterations = Math.ceil(pageCount / 40)

    for (let i = 0; i < iterations; i++) {
        pageArr.push(parsePage(id, i, requestManager, cheerio))
    }

    const results = await Promise.all(pageArr)
    return results.flat() // Flatten the array of arrays into a single array
}



const createTags = (tags: string[]): TagSection => {
    let tagObjs: Tag[] = []
    for (const tag of tags) {
        if (tag.split(":").length != 2) {
            continue
        }
        const [tagType, tagName] = tag.split(":")
        tagObjs.push(App.createTag({ id: `${tagType}:"${tagName}$"`, label: tag }))
    }
    return App.createTagSection({ id: "genres", label: "genres", tags: tagObjs })
}

export const parseTags = (tags: string[]): TagSection[] => {
    const tagSectionArr = []

    switch (tags.shift()) {
        case 'Doujinshi': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:2', label: 'category:Doujinshi' })] })); break
        case 'Manga': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:4', label: 'category:Manga' })] })); break
        case 'Artist CG': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:8', label: 'category:Artist CG' })] })); break
        case 'Game CG': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:16', label: 'category:Game CG' })] })); break
        case 'Non-H': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:256', label: 'category:Non-H' })] })); break
        case 'Image Set': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:32', label: 'category:Image Set' })] })); break
        case 'Western': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:512', label: 'category:Western' })] })); break
        case 'Cosplay': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:64', label: 'category:Cosplay' })] })); break
        case 'Asian Porn': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:128', label: 'category:Asian Porn' })] })); break
        case 'Misc': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:1', label: 'category:Misc' })] })); break
    }

    tagSectionArr.push(createTags(tags))
    return tagSectionArr
}

export const parseTitle = (title: string): string => {
    return title.replaceAll(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
}