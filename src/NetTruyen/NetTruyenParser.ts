import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection,
    MangaUpdates,
} from '@paperback/types'


const convertTime = (timeAgo: string): Date => {
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed === 0 && timeAgo.includes('a')) ? 1 : trimmed;

    if (timeAgo.includes('giây') || timeAgo.includes('secs')) {
        return new Date(Date.now() - trimmed * 1000);
    } else if (timeAgo.includes('phút')) {
        return new Date(Date.now() - trimmed * 60000);
    } else if (timeAgo.includes('giờ')) {
        return new Date(Date.now() - trimmed * 3600000);
    } else if (timeAgo.includes('ngày')) {
        return new Date(Date.now() - trimmed * 86400000);
    } else if (timeAgo.includes('năm')) {
        return new Date(Date.now() - trimmed * 31556952000);
    } else if (timeAgo.includes(':')) {
        const [H, D] = timeAgo.split(' ');
        const fixD = String(D).split('/');
        const finalD = `${fixD[1]}/${fixD[0]}/${new Date().getFullYear()}`;
        return new Date(`${finalD} ${H}`);
    } else {
        const split = timeAgo.split('/');
        return new Date(`${split[1]}/${split[0]}/20${split[2]}`);
    }
}

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {
    
    const titles = $('h1.title-detail').text().trim();
    const author = $('ul.list-info > li.author > p.col-xs-8').text();
    const artist = $('ul.list-info > li.author > p.col-xs-8').text();
    const image = 'https:' + $('div.col-image > img').attr('src');
    const desc = $('div.detail-content > p').text();
    const status = $('ul.list-info > li.status > p.col-xs-8').text();
    const rating = parseFloat($('span[itemprop="ratingValue"]').text());

    const tags: Tag[] = [];
    const authorLink = $('ul.list-info > li.author > p.col-xs-8 > a').attr("href") || "";
    if (authorLink !== "") {
        tags.push({ id: authorLink, label: `Tác giả: ${author}` });
    }

    $('li.kind > p.col-xs-8 > a').each((_: any, obj: any) => {
        const label = $(obj).text();
        const id = $(obj).attr('href')?.split('/')[4] ?? label;
        tags.push({ id: id, label: label });
    });

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [titles],
            author,
            artist,
            image,
            desc,
            status,
            tags: [App.createTagSection({ id: '0', label: 'genres', tags: tags.map(x => App.createTag(x)) })],
            rating: Number.isNaN(rating) ? 0 : rating
        }),
    })
}

export const parseChapterList = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = [];

    $('div.list-chapter > nav > ul > li.row:not(.heading)').each((_: any, obj: any) => {
        const id = String($('div.chapter a', obj).attr('href')).split('/').slice(4).join('/');
        const time = $('div.col-xs-4', obj).text();
        const group = $('div.col-xs-3', obj).text();
        let name = $('div.chapter a', obj).text();
        const chapNum = $('div.chapter a', obj).text().split(' ')[1];
        name = name.includes(':') ? String(name.split(':')[1]).trim() : '';
        const timeFinal = convertTime(time);

        chapters.push(App.createChapter({
            id: id,
            chapNum: parseFloat(String(chapNum)),
            name: name,
            langCode: '🇻🇳',
            time: timeFinal,
            group: `${group} lượt xem`
        }));
    });

    if (chapters.length == 0) {
        throw new Error('No chapters found');
    }

    return chapters;
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = [];

    $('div.reading-detail > div.page-chapter > img').each((_: any, obj: any) => {
        if (!obj.attribs['data-original']) return;
        const link = obj.attribs['data-original'];
        pages.push(link.indexOf('https') === -1 ? 'https:' + link : link);
    });

    const chapterDetails = App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages
    })
    return chapterDetails
}

export const parseTags = ($: any): TagSection[] => {
    const arrayTags: Tag[] = [];
    const arrayTags2: Tag[] = [];
    const arrayTags3: Tag[] = [];
    const arrayTags4: Tag[] = [];
    const arrayTags5: Tag[] = [];

    for (const tag of $('div.col-md-3.col-sm-4.col-xs-6.mrb10', 'div.col-sm-10 > div.row').toArray()) {
        const label = $('div.genre-item', tag).text().trim();
        const id = $('div.genre-item > span', tag).attr('data-id') ?? label;
        if (!id || !label) continue;
        arrayTags.push({ id: id, label: label });
    }

    for (const tag of $('option', 'select.select-minchapter').toArray()) {
        const label = $(tag).text().trim();
        const id = 'minchapter.' + $(tag).attr('value') ?? label;
        if (!id || !label) continue;
        arrayTags2.push({ id: id, label: label });
    }

    for (const tag of $('option', '.select-status').toArray()) {
        const label = $(tag).text().trim();
        const id = 'status.' + $(tag).attr('value') ?? label;
        if (!id || !label) continue;
        arrayTags3.push({ id: id, label: label });
    }

    for (const tag of $('option', '.select-gender').toArray()) {
        const label = $(tag).text().trim();
        const id = 'gender.' + $(tag).attr('value') ?? label;
        if (!id || !label) continue;
        arrayTags4.push({ id: id, label: label });
    }

    for (const tag of $('option', '.select-sort').toArray()) {
        const label = $(tag).text().trim();
        const id = 'sort.' + $(tag).attr('value') ?? label;
        if (!id || !label) continue;
        arrayTags5.push({ id: id, label: label });
    }
    const tagSections: TagSection[] = [
        App.createTagSection({ id: '0', label: 'Thể Loại (Có thể chọn nhiều hơn 1)', tags: arrayTags.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '1', label: 'Số Lượng Chapter (Chỉ chọn 1)', tags: arrayTags2.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '2', label: 'Tình Trạng (Chỉ chọn 1)', tags: arrayTags3.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '3', label: 'Dành Cho (Chỉ chọn 1)', tags: arrayTags4.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '4', label: 'Sắp xếp theo (Chỉ chọn 1)', tags: arrayTags5.map(x => App.createTag(x)) }),
    ];
    return tagSections;
}

export const parseSearch = ($: CheerioStatic): PartialSourceManga[] => {
    const tiles: PartialSourceManga[] = [];

    $('div.item', 'div.row').each((_: any, manga: any) => {
        const title = $('figure.clearfix > figcaption > h3 > a', manga).first().text();
        const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
        let image = $('figure.clearfix > div.image > a > img', manga).first().attr('data-original');
        image = !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image
        const subtitle = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > a", manga).last().text().trim();
        if (!id || !title) return;

        tiles.push(App.createPartialSourceManga({
            mangaId: String(id),
            image: String(image),
            title: title,
            subtitle: subtitle,
        }));
    });

    return tiles;
}

export const parseFeaturedSection = ($: CheerioStatic): PartialSourceManga[] => {
    const featuredItems: PartialSourceManga[] = [];

    $('div.item', 'div.altcontent1').each((_: any, manga: any) => {
        const title = $('.slide-caption > h3 > a', manga).text();
        const id = $('a', manga).attr('href')?.split('/').pop();
        const image = $('a > img.lazyOwl', manga).attr('data-src');
        const subtitle = $('.slide-caption > a', manga).text().trim() + ' - ' + $('.slide-caption > .time', manga).text().trim();
        if (!id || !title) return;
        featuredItems.push(App.createPartialSourceManga({
            mangaId: String(id),
            image: !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image,
            title: title,
            subtitle: subtitle,
        }));
    });

    return featuredItems;
}

export const parseHomeSections = ($: CheerioStatic): PartialSourceManga[] => {
    const items: PartialSourceManga[] = [];

    $('div.item', 'div.row').slice(0, 20).each((_: any, manga: any) => {
        const title = $('figure.clearfix > figcaption > h3 > a', manga).first().text();
        const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
        const image = $('figure.clearfix > div.image > a > img', manga).first().attr('data-original');
        const subtitle = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > a", manga).last().text().trim();
        if (!id || !title) return;
        items.push(App.createPartialSourceManga({
            mangaId: String(id),
            image: !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image,
            title: title,
            subtitle: subtitle,
        }));
    });

    return items;
}

export const parseViewMoreItems = ($: CheerioStatic): PartialSourceManga[] => {
    const mangas: PartialSourceManga[] = [];
    const collectedIds: Set<string> = new Set();

    $('div.item', 'div.row').each((_: any, manga: any) => {
        const title = $('figure.clearfix > figcaption > h3 > a', manga).first().text();
        const id = $('figure.clearfix > div.image > a', manga).attr('href')?.split('/').pop();
        const image = $('figure.clearfix > div.image > a > img', manga).first().attr('data-original');
        const subtitle = $("figure.clearfix > figcaption > ul > li.chapter:nth-of-type(1) > a", manga).last().text().trim();

        if (!id || !title) return;
        if (!collectedIds.has(id)) {
            mangas.push(App.createPartialSourceManga({
                mangaId: String(id),
                image: !image ? "https://i.imgur.com/GYUxEX8.png" : 'https:' + image,
                title: title,
                subtitle: subtitle,
            }));
            collectedIds.add(id);
        }
    });

    return mangas;
}

export const parseUpdatedManga = (updateManga: any, time: Date, ids: string[]): MangaUpdates => {
    const returnObject: MangaUpdates = {
        ids: []
    };

    for (const elem of updateManga) {
        if (ids.includes(elem.id) && time < convertTime(elem.time)) {
            returnObject.ids.push(elem.id);
        }
    }

    return returnObject;
}

export const isLastPage = ($: CheerioStatic): boolean => {
    const current = $('ul.pagination > li.active > a').text();
    let total = $('ul.pagination > li.PagerSSCCells:last-child').text();

    if (current) {
        total = total ?? '';
        return (+total) === (+current);
    }
    return true;
}