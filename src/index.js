import Koa from "koa";

import config from "../config";
import router from "./router";
import * as middleware from "./middleware";

const app = new Koa();

app.use(middleware.error);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.server.port, () => {
  console.log("Server listening at port %s:%d", config.server.host, config.server.port);
});
