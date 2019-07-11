export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log("test");
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
}
