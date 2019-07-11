import _ from "lodash";

const TICK_CHAR = "`";

const removeTicks = (s) => s.replace(new RegExp(TICK_CHAR, "g"), "");
const addTicks = (s) => TICK_CHAR + s + TICK_CHAR;

export const qs = (str, separator = ".") => {
  if (typeof str !== "string" || !str) return str;

  return qa(removeTicks(str).split(separator));
};

export const qa = (arr, separator = ".") => {
  if (!_.isArray(arr)) return arr;

  return arr.map(el => addTicks(el)).join(separator);
};

export const successResponse = (ctx, result) => {
  ctx.body = {
    success: true,
    result
  };
};


const SQL_MAX_LIMIT = 1000;

export const createLimit = (first, last, skip) => {

  if (!_.isNil(first) && !_.inRange(first, 1, SQL_MAX_LIMIT + 1)) {
    return "";
  }

  if (!_.isNil(last) && !_.inRange(last, 1, SQL_MAX_LIMIT + 1)) {
    return "";
  }

  if (!_.isNil(skip) && skip < 0) {
    return "";
  }

  const limit = !!last ? last : first;

  return `${skip || 0}, ${limit || SQL_MAX_LIMIT}`;
};

export const appendIfValueDefined = (query, append, value) => value ? `${query} ${append} ${value}` : query;

// TODO: Доработать парсер, чтобы понимал gt/gte/lt/lte и тд.
function filterParser(value, key, availableFields) {
  return availableFields.includes(key) ? [`${key} = ?`, value] : undefined;
}

/**
 * Возвращаем
 * @param filter
 * @param availableFields
 * @returns {Array}
 */
export const parseFilter = (filter, availableFields) => {
  return _.unzip(_.map(filter, (value, key) => filterParser(value, key, availableFields)));
};

export const JSONParseSafe = (str) => {
  try { return JSON.parse(str); } catch (e) {}
};

