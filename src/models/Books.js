import mysql from "../utils/mysql";
import { appendIfValueDefined, createLimit, parseFilter, qa, qs } from "../utils";
import _ from "lodash";

const db = mysql();

export class BooksModel {
  static tableName = "books";

  static fields = [
    "id",
    "authorId",
    "date",
    "title",
    "description",
    "image",
  ];

  static filtersFields = [];

  static async find(filter, orderBy, first, last, skip) {
    const [wheres, variables] = parseFilter(filter, this.fields);
    const limit = createLimit(first, last, skip);

    let query = `
      SELECT ${qa(this.fields, ",")} 
      FROM ${qs(this.tableName)}
    `;

    if (wheres) {
      query = appendIfValueDefined(query, "WHERE", wheres.join(" AND "));
    }

    query = appendIfValueDefined(query, "LIMIT", limit);

    console.log("query =", query);
    console.log("variables = ", variables);

    const [rows] = await db.query(query, variables);

    return rows || [];
  }

  static async getById(id) {
    if (!_.isNumber(id)) {
      return;
    }

    const books = await db.query(`
      SELECT ${qa(this.fields, ",")}
      FROM ${qs(this.tableName)} 
      WHERE id = ?
    `, [id]);

    return books[0];
  }

  static async create(book) {
    if (!_.isObject(book)) {
      return;
    }

    const result = await db.query(`
      INSERT INTO ${qs(this.tableName)} 
      SET ?
    `, [book]);

    // if (result.insertId) {
    //   id = result.insertId;
    // }

    return this.getById(result.insertId);
  }

  static async update(id, book) {
    if (!_.isNumber(id) || !_.isObject(book)) {
      console.log(id, book);
      return;
    }

    const updateData = {};

    // if (book.date) {
    //   updateData.date = Date(book.date);
    // }

    if (book.title) {
      updateData.title = String(book.title);
    }

    if (book.description) {
      updateData.description = String(book.description);
    }

    if (book.authorId) {
      updateData.authorId = Number(book.authorId);
    }

    // if (book.image) {
    //   updateData.image = String(book.image);
    // }

    console.log("updateData =", updateData);

    const result = await db.query(`
      UPDATE ${qs(this.tableName)} 
      SET ? 
      WHERE id=?
    `, [updateData, id]);

    console.log("result =", result);

    return this.getById(id);
  }

}

export default BooksModel;
