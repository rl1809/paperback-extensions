import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    Tag,
} from '@paperback/types'

import {
    IMHENTAI_DOMAIN,
    tagBoxSelector,
    directoryGallerySelector,
    directorySubtitleSelector,
} from './constant';

import { getLanguageCode } from './IMHentaiHelper';

import entities = require('entities')

const convertDate = (timeElement: string): Date => {
    // Extract the time value using a regular expression
    const match = /(\d+) (\w+) ago/.exec(timeElement);

    if (match) {
        const value = match[1] ? parseInt(match[1]) : 0;
        const unit = match[2];

        // Calculate the time in milliseconds based on the unit
        let timeInMilliseconds = 0;
        if (unit === 'seconds') {
            timeInMilliseconds = value * 1000;
        } else if (unit === 'minutes') {
            timeInMilliseconds = value * 60 * 1000;
        } else if (unit === 'hours') {
            timeInMilliseconds = value * 60 * 60 * 1000;
        } else if (unit === 'days') {
            timeInMilliseconds = value * 24 * 60 * 60 * 1000;
        } else if (unit === 'weeks') {
            timeInMilliseconds = value * 7 * 24 * 60 * 60 * 1000;
        } else if (unit === 'months') {
            // Approximate number of days in a month
            timeInMilliseconds = value * 30 * 24 * 60 * 60 * 1000;
        } else if (unit === 'years') {
            // Approximate number of days in a year
            timeInMilliseconds = value * 365 * 24 * 60 * 60 * 1000;
        }


        // Calculate the posting date by subtracting timeInMilliseconds from the current date
        const currentDate = new Date();
        return new Date(currentDate.getTime() - timeInMilliseconds);
    } else {
        return new Date()
    }
};

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {

    const tags: Tag[] = [];
    const titles = $("h1").text()
    const authorElements = $('a', $('span:contains(Artist)').parent()).toArray();
    authorElements
        .filter((x) => x !== null) // Filter out null elements
        .forEach((element) => {
            const authorName = $(element).text().trim().replace(/(\d+\s*)+$/, ''); // Get author name
            const authorHref = $(element).attr('href') || ""; // Get href of author
            tags.push({ id: authorHref, label: `artist:${authorName}` });
        })

    for (const tag of $('a', $('span:contains(Tags)').parent()).toArray()) {
        const count = $(tag).children().remove().text().trim()
        let label = $(tag).text().replace(count, '').trim()
        if (isNaN(Number(count))) label = count
        const id = $(tag).attr('href') ?? ''

        if (!id || !label) continue
        tags.push({ id: id, label: label })
    }

    const author = authorElements
        .filter((x) => x !== null) // Filter out null elements
        .map((x) => $(x).text().trim().replace(/(\d+\s*)+$/, ''))
        .join(', ') || 'Unknown';
    const artist = author

    const image = getImageSrc($('img.lazy, div.cover > img').first())

    // Extract the information you need
    const altTitle = $('p.subtitle').text();
    const parodies = $('li:contains("Parodies:") a').map((_, el) => $(el).text().replace(/\d+/g, '').trim()).get().join(', ');
    const groups = $('li:contains("Groups:") a').map((_, el) => $(el).text().replace(/\d+/g, '').trim()).get().join(', ');
    const languages = $('li:contains("Languages:") a').map((_, el) => $(el).text().replace(/\d+/g, '').trim()).get().join(', ');
    const category = $('li:contains("Category:") a').map((_, el) => $(el).text().replace(/\d+/g, '').trim()).get().join(', ');
    const pages = $('li.pages').text().replace('Pages: ', '');

    let description = ""
    // Compile the extracted information into the description variable
    if (altTitle) description += `Alternative Title:\n${altTitle}\n\n`;
    if (parodies) description += `Parodies:\n${parodies}\n\n`;
    if (groups) description += `Groups:\n${groups}\n\n`;
    if (languages) description += `Languages:\n${languages}\n\n`;
    if (category) description += `Category:\n${category}\n\n`;
    description += `Page:\n${pages}`;
    const status = ""

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [titles],
            author: author,
            artist: artist,
            image: image,
            desc: description,
            status: status,
            tags: [App.createTagSection({ id: '0', label: 'genres', tags: tags.map(x => App.createTag(x)) })],
        }),
    })
}


export const parseChapterList = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    const languageTag = $('a', $('span:contains(Language)').parent()).first().text().trim()
    let langCode = '🇬🇧'
    if (languageTag.includes('japanese')) {
        langCode = '🇯🇵'
    } else if (languageTag.includes('spanish')) {
        langCode = '🇪🇸'
    } else if (languageTag.includes('french')) {
        langCode = '🇫🇷'
    } else if (languageTag.includes('korean')) {
        langCode = '🇰🇷'
    } else if (languageTag.includes('german')) {
        langCode = '🇩🇪'
    } else if (languageTag.includes('russian')) {
        langCode = '🇷🇺'
    }

    const timeElement = $('li.posted').text();

    chapters.push(App.createChapter({
        id: mangaId,
        name: 'Chapter',
        langCode: langCode,
        chapNum: 1,
        time: convertDate(timeElement),
    }))

    return chapters
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    const pageCount = Number($('#load_pages').attr('value'))
    const imgDir = $('#load_dir').attr('value')
    const imgId = $('#load_id').attr('value')

    if (!pageCount || isNaN(pageCount)) {
        throw new Error(`Unable to parse pageCount (found: ${pageCount}) for mangaId:${mangaId}`)
    }
    if (!imgDir) {
        throw new Error(`Unable to parse imgDir (found: ${imgDir}) for mangaId:${mangaId}`)
    }
    if (!imgId) {
        throw new Error(`Unable to parse imgId (found: ${imgId}) for mangaId:${mangaId}`)
    }

    const domain = getImageSrc($('img.lazy, div.cover > img').first())
    const subdomainRegex = domain.match(/\/\/([^.]+)/)

    let subdomain = null
    if (subdomainRegex && subdomainRegex[1]) subdomain = subdomainRegex[1]

    const domainSplit = IMHENTAI_DOMAIN.split('//')

    for (let i = 0; i < pageCount; i++) {
        pages.push(`${domainSplit[0]}//${subdomain}.${domainSplit[1]}/${imgDir}/${imgId}/${i + 1}.jpg`)
    }

    return App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages,
    })
}

export const parseTags = (type: string, $: any): Tag[] => {
    const tags: Tag[] = []

    for (const tag of $('div.col.col', tagBoxSelector).toArray()) {
        const label = $('h3', tag).text().trim()
        const id = `${type}:"${label}"`
        if (!label) continue

        tags.push({ id: id, label: label })
    }

    return tags.map(x => App.createTag(x))
}

export const parseSearch = ($: CheerioStatic, excludedTags: number[]): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const obj of $('div.thumb', directoryGallerySelector).toArray()) {

        const image: string = getImageSrc($('img', $('div.inner_thumb', obj)).first() ?? '')
        const title: string = $('h2, div.caption', obj).first().text().trim() ?? ''
        const subtitle: string = $(directorySubtitleSelector, obj).text().trim() ?? ''

        const id = $('h2 > a, div.caption > a', obj).attr('href')?.replace(/\/$/, '')?.split('/').pop() ?? ''

        const dataTags: number[] = ($(obj).attr('data-tags') ?? '').split(' ').map(tag => parseInt(tag, 10)).filter(tag => !isNaN(tag));
        const containsExcludedTag = dataTags.some(tag => excludedTags.includes(tag));

        const dataLanguages: string[] = ($(obj).attr('data-languages') ?? '').split(' ');


        if (!id || !title || containsExcludedTag) continue

        if (!collectedIds.includes(id)) {
            items.push(
                App.createPartialSourceManga({
                    mangaId: String(id),
                    image: image,
                    title: title,
                    subtitle: `${subtitle} [${getLanguageCode(dataLanguages)}]`
                }))
        }
        collectedIds.push(id)
    }
    return items
}

export const parseHomeSections = ($: CheerioStatic, excludedTags: number[]): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const obj of $('div.thumb', directoryGallerySelector).toArray()) {

        const image: string = getImageSrc($('img', $('div.inner_thumb', obj)).first() ?? '')
        const title: string = $('h2, div.caption', obj).first().text().trim() ?? ''
        const subtitle: string = $(directorySubtitleSelector, obj).text().trim() ?? ''

        const id = $('h2 > a, div.caption > a', obj).attr('href')?.replace(/\/$/, '')?.split('/').pop() ?? ''

        const dataTags: number[] = ($(obj).attr('data-tags') ?? '').split(' ').map(tag => parseInt(tag, 10)).filter(tag => !isNaN(tag));
        const containsExcludedTag = dataTags.some(tag => excludedTags.includes(tag));

        const dataLanguages: string[] = ($(obj).attr('data-languages') ?? '').split(' ');


        if (!id || !title || containsExcludedTag) continue

        if (!collectedIds.includes(id)) {
            items.push(
                App.createPartialSourceManga({
                    mangaId: String(id),
                    image: image,
                    title: title,
                    subtitle: `${subtitle} [${getLanguageCode(dataLanguages)}]`
                }))
        }
        collectedIds.push(id)
    }
    return items
}

export const parseViewMoreItems = ($: CheerioStatic, excludedTags: number[]): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const obj of $('div.thumb', directoryGallerySelector).toArray()) {

        const image: string = getImageSrc($('img', $('div.inner_thumb', obj)).first() ?? '')
        const title: string = $('h2, div.caption', obj).first().text().trim() ?? ''
        const subtitle: string = $(directorySubtitleSelector, obj).text().trim() ?? ''

        const id = $('h2 > a, div.caption > a', obj).attr('href')?.replace(/\/$/, '')?.split('/').pop() ?? ''

        const dataTags: number[] = ($(obj).attr('data-tags') ?? '').split(' ').map(tag => parseInt(tag, 10)).filter(tag => !isNaN(tag));
        const containsExcludedTag = dataTags.some(tag => excludedTags.includes(tag));

        const dataLanguages: string[] = ($(obj).attr('data-languages') ?? '').split(' ');

        if (!id || !title || containsExcludedTag) continue

        if (!collectedIds.includes(id)) {
            items.push(
                App.createPartialSourceManga({
                    mangaId: String(id),
                    image: image,
                    title: title,
                    subtitle: `${subtitle}[${getLanguageCode(dataLanguages)}]`
                }))
        }
        collectedIds.push(id)
    }
    return items
}

export const isLastPage = ($: CheerioStatic): boolean => {
    let isLast = false
    const hasEnded = $('li.page-item', 'ul.pagination').last().attr('class')
    if (hasEnded === 'page-item disabled') isLast = true
    return isLast;
}

const getImageSrc = (imageObj: Cheerio | undefined): string => {
    let image
    if (typeof imageObj?.attr('data-original') != 'undefined') {
        image = imageObj?.attr('data-original')
    }
    if (typeof imageObj?.attr('data-cfsrc') != 'undefined') {
        image = imageObj?.attr('data-cfsrc')
    }
    else if (typeof imageObj?.attr('data-src') != 'undefined') {
        image = imageObj?.attr('data-src')
    }
    else if (typeof imageObj?.attr('data-bg') != 'undefined') {
        image = imageObj?.attr('data-bg')
    }
    else if (typeof imageObj?.attr('data-srcset') != 'undefined') {
        image = imageObj?.attr('data-srcset')
    }
    else if (typeof imageObj?.attr('data-lazy-src') != 'undefined') {
        image = imageObj?.attr('data-lazy-src')
    }
    else if (typeof imageObj?.attr('data-aload') != 'undefined') {
        image = imageObj?.attr('data-aload')
    }
    else if (typeof imageObj?.attr('srcset') != 'undefined') {
        image = imageObj?.attr('srcset')?.split(' ')[0] ?? ''
    }
    else {
        image = imageObj?.attr('src')
    }
    return encodeURI(decodeURI(decodeHTMLEntity(image?.trim() ?? '')))
}


const decodeHTMLEntity = (str: string): string => {
    return entities.decodeHTML(str)
}

