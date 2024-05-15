import express from 'express'

const logoutRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

logoutRouter.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/login");
});

export default logoutRouter;
