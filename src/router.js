import Router from "koa-router";
import KoaConvert from "koa-convert";
import KoaBody from "koa-body";

import { BooksController } from "./controllers";

const router = new Router();
const jsonConverter = KoaConvert(KoaBody());

router
  .get("/books", BooksController.list)
  .post("/books", jsonConverter, BooksController.list)
  .get("/book/:id", BooksController.item)
  .post("/book", jsonConverter, BooksController.createItem)
  .put("/book/:id", jsonConverter, BooksController.updateItem);

export default router;
