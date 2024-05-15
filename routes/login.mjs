import express from 'express'

const loginRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    
}

const taskListController = await import(`../controller/ifly-controller.mjs`);

loginRouter.get("/login", taskListController.renderLogin);
loginRouter.post("/login", taskListController.login);

export default loginRouter;
