import _ from "lodash";


export const successResponse = (ctx, result) => {
  ctx.body = {
    success: true,
    result
  };
};


export const JSONParseSafe = str => {
  try {
    return JSON.parse(str);
  } catch (e) {
  }
};

