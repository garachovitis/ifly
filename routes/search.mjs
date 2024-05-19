//search.mjs route
import  express from 'express';

const searchRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const searchController = await import('../controller/ifly-controller.mjs');


searchRouter.get('/search', searchController.search);

export default searchRouter;
