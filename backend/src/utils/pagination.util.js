// backend/src/utils/pagination.util.js

/**
 * Parses and clamps pagination query params.
 * @param {object} query - req.query
 * @param {number} defaultLimit - default page size
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const parsePagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
