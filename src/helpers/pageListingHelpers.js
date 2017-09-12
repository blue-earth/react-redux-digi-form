/* ------------------------------------
 * getQueryParamsObject
 * @param {page, pageSize, sortColumn, sortAscending} object.
 * @returns {object} that containing fields - page, page_size, ordering
 * ------------------------------------ */
export const getPageQueryParamsObject = (options) => {
  var query = {};
  options.page && (query['page'] = options.page);
  options.pageSize && (query['page_size'] = options.pageSize);
  options.status && (query['status'] = options.status);
  if (options.sortColumn) {
    query['ordering'] = options.isSortAscending ? options.sortColumn : '-' + options.sortColumn;
  }
  return query;
};
