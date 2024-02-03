import {
    Chapter,
    Response
} from '@paperback/types'


export const parseChapterList = (response: Response): Chapter[] => {
    const json = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data
    try {
        const chapters: Chapter[] = json.map((item: any) => App.createChapter({
            id: item.id,
            name: item.title,
            chapNum: 0,
            time: new Date(item.published),
        }));

        return chapters;
    } catch (error) {
        // Handle any parsing or data validation errors here
        console.error('Error parsing chapter data:', error);
        return [];
    }
}


export interface Artist {
    favorited: number;
    id: string;
    indexed: number;
    name: string;
    service: string;
    updated: number;
}

export interface SearchCriteria {
    searchName?: string;
    orderBy?: keyof Artist;
    orderDirection?: string;
    filterService?: string;
}

export const parseArtists = (response: any): Artist[] => {
    try {
        const artists: Artist[] = response.map((item: any) => {
            return {
                favorited: item.favorited,
                id: item.id,
                indexed: item.indexed,
                name: item.name,
                service: item.service,
                updated: item.updated,
            };
        });

        return artists;
    } catch (error) {
        // Handle any parsing or data validation errors here
        console.error('Error parsing artist data:', error);
        return [];
    }
}

export function getArtistById(artists: Artist[], artistId: string): Artist {
    return artists.find(artist => artist.id === artistId) ?? {
        favorited: 0, // Replace with default values for the artist object
        id: artistId,
        indexed: 0,
        name: "Unknown Artist", // Provide a default name
        service: "Unknown Service", // Provide a default service
        updated: 0
    };;
}

export function searchArtists(
    artists: Artist[],
    searchName?: string,
    orderBy?: keyof Artist, // Use keyof to restrict to valid property names
    orderDirection?: string,
    filterService?: string,
    page?: number,
    pageSize?: number
): { results: Artist[]; totalResults: number } {
    let filteredArtists = artists;

    // Filter by service if a filter is provided
    if (filterService) {
        filteredArtists = filteredArtists.filter(artist => artist.service === filterService);
    }

    // Search by name if a searchName is provided
    if (searchName) {
        const searchNameLower = searchName.toLowerCase();
        filteredArtists = filteredArtists.filter(artist => artist.name.toLowerCase().includes(searchNameLower));
    }

    // Sort the filtered artists based on the orderBy and orderDirection
    if (orderBy) {
        filteredArtists.sort((a, b) => {
            if (orderDirection === 'asc') {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            } else {
                return a[orderBy] < b[orderBy] ? 1 : -1;
            }
        });
    }

    // Pagination
    const totalResults = filteredArtists.length;
    if (page !== undefined && pageSize !== undefined) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        filteredArtists = filteredArtists.slice(startIndex, endIndex);
    }

    return { results: filteredArtists, totalResults };
}