import _ from "lodash";

const SQL_MAX_LIMIT = 1000;
const TICK_CHAR = "`";


export const qs = (str, separator = ".") => {
  if (typeof str !== "string" || !str) return str;

  return qa(removeTicks(str).split(separator));
};


export const qa = (arr, separator = ".") => {
  if (!_.isArray(arr)) return arr;

  return arr.map(el => addTicks(el)).join(separator);
};


/**
 * Возвращаем

 const filter = {
    lastName: {
      $like: "%test%"
    },
    $or: [
      {
        name: {
          $equals: "test"
        },
        age: {
          $gte: 18
        }
      },
      {
        name: {
          $equals: "test2"
        },
        age: {
          $lt: 50
        }
      },
    ],
    $not: {
      id: {
        equals: 12
      },
    },
  };

 to "description LIKE ? AND ((title = ? AND authorId >= ?) OR (title = ? AND authorId < ?)) AND NOT id IN (?)"
 and variables =  [ '%test%', 'test', 18, 'test2', 50, [ 12, 13 ] ]

 * @param filter
 * @param availableFields
 * @returns {string}
 */
export const createWhereString = (filter, availableFields) => {
  const filterConditions = {
    $and: (value) => `${_.map(value, parseRecursive).join(" AND ")}`,
    $or: (value) => {
      const parts = _.map(value, parseRecursive);
      return parts.length > 1
        ? `((${( parts.join(`) OR (`) )}))`
        : parts.length
          ? `(${( parts[0] )})`
          : undefined;
    },
    $not: (value) => {
      const cond = filterConditions.$and(value);
      return cond ? `NOT (${cond})` : undefined;
    },
    $equals: "= ?",
    $gt: "> ?",
    $gte: ">= ?",
    $lt: "< ?",
    $lte: "<= ?",
    $in: "IN (?)",
    $like: "LIKE ?",
    $between: "BETWEEN ? AND ?",
  };

  const variables = [];

  const parseRecursive = (value, key) => {

    if (_.isNumber(key)) {
      return filterConditions.$and(value);
    }

    const cond = filterConditions[key];

    switch (key) {
      case "$and":
      case "$or":
      case "$not":
        if (!cond) return;
        return cond(value);
    }

    if (cond) {
      if (key === "$between") {
        if (!_.isArray(value)) {
          throw new Error("Invalid filter!");
        }

        variables.push(...value);
      } else {
        if (_.isNil(value) || _.isObject(value)) {
          throw new Error("Invalid filter!");
        }

        variables.push(value);
      }

      return `${cond}`;
    }

    if (!availableFields.includes(key)) {
      return;
    }

    return `${key} ${filterConditions.$and(value)}`;
  };

  const parsedWhereString = filterConditions.$and(filter);
  console.log([parsedWhereString, variables]);

  return [parsedWhereString, variables];
};


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


const removeTicks = (s) => s.replace(new RegExp(TICK_CHAR, "g"), "");

const addTicks = (s) => TICK_CHAR + s + TICK_CHAR;

