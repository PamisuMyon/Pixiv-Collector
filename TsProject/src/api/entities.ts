export interface RequestOption {
    method?: string;
    headers?: any;
    proxyHost?: string;
    proxyPort?: number;
    parameters?: any;
    formUrlencodedDatas?: any;
    body?: string;
}

export interface Illust {
    id: number;
    title: string;
    type: string;
    image_urls: {
        squre_medium?: string;
        medium?: string;
        large?: string;
        original?: string;
    };
    user: User;
    caption: string;
    restrict: number;
    tags: {
        name: string;
        translated_name: string;
    }[];
    create_date: string;
    page_count: number;
    sanity_level: number;
    meta_pages: {
        squre_medium?: string;
        medium?: string;
        large?: string;
        original?: string;
    }[];
    total_view: number;
    total_bookmarks: number;
    is_bookmarked: boolean;
    // custom properties
    _id?: string;   // object id in collector server
    imageUrl?: string;
    imageKey?: string;
    selected?: boolean;
    collected?: boolean;
}

export interface User {
    id: number;
    name: string;
    account?: string;
}