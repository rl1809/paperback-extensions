import {
    RequestManager,
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


async function getImage(url: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string> {
    const request = App.createRequest({
        url: url,
        method: 'GET'
    })

    const response = await requestManager.schedule(request, 1)
    const $ = cheerio.load(response.data as string)
    return $('#img').attr('src') ?? ''
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

async function parsePage(id: string, page: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const request = App.createRequest({
        url: `https://e-hentai.org/g/${id}/?p=${page}`,
        method: 'GET'
    })

    const response = await requestManager.schedule(request, 1)
    const $ = cheerio.load(response.data as string)

    const pageArr = []
    const pageDivArr = $('div.gdtm').toArray()

    for (const page of pageDivArr) {
        const imageUrl = await getImage($('a', page).attr('href') ?? '', requestManager, cheerio)
        pageArr.push(imageUrl)
    }

    return pageArr
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


const namespaceHasTags = (namespace: string, tags: string[]): boolean => { return tags.filter(tag => tag.startsWith(`${namespace}:`)).length != 0 }

const createTagSectionForNamespace = (namespace: string, tags: string[]): TagSection => { return App.createTagSection({ id: namespace, label: namespace, tags: tags.filter(tag => tag.startsWith(`${namespace}:`)).map(tag => App.createTag({ id: tag, label: tag.substring(namespace.length + 1) })) }) }

export const parseTags = (tags: string[]): TagSection[] => {
    const tagSectionArr = []

    switch (tags.shift()) {
        case 'Doujinshi': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:2', label: 'Doujinshi' })] })); break
        case 'Manga': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:4', label: 'Manga' })] })); break
        case 'Artist CG': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:8', label: 'Artist CG' })] })); break
        case 'Game CG': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:16', label: 'Game CG' })] })); break
        case 'Non-H': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:256', label: 'Non-H' })] })); break
        case 'Image Set': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:32', label: 'Image Set' })] })); break
        case 'Western': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:512', label: 'Western' })] })); break
        case 'Cosplay': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:64', label: 'Cosplay' })] })); break
        case 'Asian Porn': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:128', label: 'Asian Porn' })] })); break
        case 'Misc': tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:1', label: 'Misc' })] })); break
    }

    if (namespaceHasTags('character', tags)) tagSectionArr.push(createTagSectionForNamespace('character', tags))
    if (namespaceHasTags('female', tags)) tagSectionArr.push(createTagSectionForNamespace('female', tags))
    if (namespaceHasTags('male', tags)) tagSectionArr.push(createTagSectionForNamespace('male', tags))
    if (namespaceHasTags('mixed', tags)) tagSectionArr.push(createTagSectionForNamespace('mixed', tags))
    if (namespaceHasTags('other', tags)) tagSectionArr.push(createTagSectionForNamespace('other', tags))
    if (namespaceHasTags('parody', tags)) tagSectionArr.push(createTagSectionForNamespace('parody', tags))

    return tagSectionArr
}

export const parseTitle = (title: string): string => {
    return title.replaceAll(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
}