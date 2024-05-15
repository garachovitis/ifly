import express from 'express'

const taskListRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const taskListController = await import(`../controller/ifly-controller.mjs`);

taskListRouter.route('/').get((req, res) => { res.redirect('/index') });

taskListRouter.get('/tasks', taskListController.listAllTasksRender);

export default taskListRouter;
