const createPagination = (page, limit, totalCount, resourceName) => {
  const totalPages = Math.ceil(totalCount / limit);

  const currentPage = Math.max(1, Math.min(page, totalPages));

  return {
    page: currentPage,
    limit,
    totalPages,
    [`total${resourceName}`]: totalCount,
    message:
      page > totalPages
        ? "Requested page exceeds total pages. Showing last available page."
        : undefined,
  };
};

module.exports = { createPagination };
