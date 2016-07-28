/* ------------------------------------
 * getQueryParamsObject
 * @param {page, pageSize, sortColumn, sortAscending} object.
 * @returns {object} that containing fields - page, page_size, ordering
 * ------------------------------------ */
export const getPageQueryParamsObject = (options) => {
  var query = {};
  options.page && (query['page'] = options.page);
  options.pageSize && (query['page_size'] = options.pageSize);
  if (options.sortColumn) {
    query['ordering'] = options.sortAscending ? options.sortColumn : '-' + options.sortColumn;
  }
  return query;
};
