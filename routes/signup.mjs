import express, { request, response } from 'express';
import dotenv from 'dotenv';

const signupRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

const taskListController = await import(`../controller/ifly-controller.mjs`);

signupRouter.get("/signup", async (request, response) => {
    response.render("signup", {_signup: true});
});
signupRouter.post("/signup", taskListController.signup);

export default signupRouter;
