export interface TablePaginationInterface<T> {
    data: T[],
    current_page: number,
    per_page: number,
    last_page: number,
    total: number,
}