
import express from 'express';

const iflyRouter = express.Router();


if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const iflyController = await import(`../controller/ifly-controller.mjs`);

iflyRouter.route('/').get((req, res) => { res.redirect('/admin') });

iflyRouter.get('/admin', iflyController.adminrender);


export default iflyRouter;