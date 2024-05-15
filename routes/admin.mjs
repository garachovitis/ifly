
import express from 'express';
const iflyRouter = express.Router();


if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const iflyController = await import(`../controller/ifly-controller.mjs`);

iflyRouter.route('/').get((req, res) => { res.redirect('/tasks') });

iflyRouter.get('/tasks', iflyController.listAllTasksRender);


export default iflyRouter;