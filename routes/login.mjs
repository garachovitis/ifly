import express from 'express'

const loginRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    
}

const iflyController = await import(`../controller/ifly-controller.mjs`);

loginRouter.get("/login", iflyController.renderLogin);
loginRouter.post("/login", iflyController.login);

export default loginRouter;
