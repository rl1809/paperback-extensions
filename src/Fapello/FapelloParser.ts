import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
} from '@paperback/types'



export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {
    const title = $('h2.font-semibold').text().trim();
    const image = $('div.bg-gradient-to-tr a img').attr('src') || "";
    const mediaAndLikes = $('div.divide-gray-300.divide-transparent.divide-x.grid.grid-cols-2.lg\\:text-left.lg\\:text-lg.mt-3.text-center.w-full.dark\\:text-gray-100').text().trim();


    // Extracting media and likes from the combined string
    const [media, likes] = mediaAndLikes.split(/\s+/);

    const description = `${media} Media - ${likes} Likes`;
    const status = ""

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [title],
            author: title,
            artist: title,
            image: image,
            desc: description,
            status: status,
        }),
    });
};


export const parseChapterList = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    chapters.push(App.createChapter({
        id: mangaId,
        name: 'Chapter',
        langCode: "",
        chapNum: 1,
    }))

    return chapters
}


export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    const avatarImgURL = $('div.bg-gradient-to-tr a img').attr('src') || "";
    const baseImgURL = avatarImgURL.substring(0, avatarImgURL.lastIndexOf('_'));
    const mediaAndLikes = $('div.divide-gray-300.divide-transparent.divide-x.grid.grid-cols-2.lg\\:text-left.lg\\:text-lg.mt-3.text-center.w-full.dark\\:text-gray-100').text().trim();



    // Extracting media and likes from the combined string
    const [media, _] = mediaAndLikes.split(/\s+/);

    let pageCount: number = media !== undefined ? parseInt(media, 10) + 1 : 0;


    for (let i = 0; i < pageCount; i++) {
        pages.push(`${baseImgURL}_${String(i + 1).padStart(4, '0')}.jpg`)
    }

    return App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages,
    })
}


export const parseSearch = ($: CheerioStatic): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []
    return items
}

export const parseHomeSections = ($: CheerioStatic): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []

    $('div.grid > div').each((_index, element) => {
        const mangaIdElement = $(element).find('a[href]').attr('href');
        const image = $(element).find('img').attr('src') || "";
        const title = $(element).find('div > a[href]').last().text().trim();

        if (mangaIdElement && image && title) {
            // Extract the mangaId from the href attribute
            const mangaId = mangaIdElement.split('/').filter(Boolean).pop() || '';

            // Push the extracted data to the items array
            items.push(
                App.createPartialSourceManga({
                    mangaId: mangaId,
                    image: image,
                    title: title,
                }))
        }
    });

    return items
}

export const parseViewMoreItems = ($: CheerioStatic): PartialSourceManga[] => {
    const items: PartialSourceManga[] = []

    $('div.grid > div').each((_index, element) => {
        const mangaIdElement = $(element).find('a[href]').attr('href');
        const image = $(element).find('img').attr('src') || "";
        const title = $(element).find('div > a[href]').last().text().trim();

        if (mangaIdElement && image && title) {
            // Extract the mangaId from the href attribute
            const mangaId = mangaIdElement.split('/').filter(Boolean).pop() || '';

            // Push the extracted data to the items array
            items.push(
                App.createPartialSourceManga({
                    mangaId: mangaId,
                    image: image,
                    title: title,
                }))
        }
    });

    return items
}

export const isLastPage = (pageNumber: number): boolean => {
    return pageNumber === 100
}

