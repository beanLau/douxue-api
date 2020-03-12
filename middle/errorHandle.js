module.exports = (ctx, next) => {
    return next().catch((err) => {
      if (err.status === 401) {
        ctx.redirect("/login")
        ctx.status = 200;
        ctx.body = {
          code: 401,
          data: null,
          msg: err.originalError ? err.originalError.message : err.message,
        };
      } else {
        throw err;
      }
    });
  }