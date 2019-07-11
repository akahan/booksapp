import BooksModel from "../models/Books";
import { successResponse } from "../utils";

export default class BooksController {

  static async list(ctx, next) {
    const { filter, orderBy, first, last, skip } = ctx.request.body || {};

    console.log("ctx = ", filter, orderBy, first, last, skip);
    console.log("ctx.request.body = ", ctx.request.body);

    const books = await BooksModel.find(filter, orderBy, first, last, skip);

    successResponse(ctx, books);
  }

  static async item(ctx, next) {
    const id = Number(ctx.params.id);

    const book = await BooksModel.getById(id);

    if (book) {
      successResponse(ctx, book);
    } else {
      ctx.status = 204
    }
  }

  static async createItem(ctx, next) {
    const book = ctx.request.body;

    ctx.body = await BooksModel.create(book)
  }

  static async updateItem(ctx, next) {
    const id = Number(ctx.params.id);
    const book = ctx.request.body;

    console.log("id =", id);
    console.log("book =", book);

    ctx.body = await BooksModel.update(id, book);
  }

}
