interface PaginateArgs {
  limit?: number;
  page?: number;
  total: number;
}

export function paginate({ limit = 10, page = 1, total }: PaginateArgs) {
  const pageCount = Math.ceil(total / limit) || 1;
  const totalCount = total;
  const currentPage = page > 0 ? (page > pageCount ? pageCount : page) : 1;
  const offset = (currentPage - 1) * limit;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const previousPage = isFirstPage ? null : currentPage - 1;
  const nextPage = isLastPage ? null : currentPage + 1;

  return {
    currentPage,
    isFirstPage,
    isLastPage,
    previousPage,
    nextPage,
    pageCount,
    totalCount,
    offset,
    limit,
  };
}
