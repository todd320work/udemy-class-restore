export interface MetaData {
    // Note, these Names must match EXACTLY the names in the ReStorePagination Response Header.
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResponse<T> {
    items: T;
    metaData: MetaData;

    /**
     *
     */
    constructor(items: T, metaData: MetaData) {
        this.items = items;
        this.metaData = metaData;
        
    }
}