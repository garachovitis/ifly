import express from 'express';
const supportRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const supportController = await import('../controller/ifly-controller.mjs');

supportRouter.get('/support', supportController.supportrender); 




export default supportRouter;