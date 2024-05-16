
import express from 'express';

const indexRouter = express.Router();


if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const iflyController = await import(`../controller/ifly-controller.mjs`);

indexRouter.route('/').get((req, res) => { res.redirect('/index') });

indexRouter.get('/index', iflyController.indexrender);


export default indexRouter;