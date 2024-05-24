import express from 'express';
import cookieParser from 'cookie-parser';

const searchRouter = express.Router();
searchRouter.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env');
}

const searchController = await import('../controller/ifly-controller.mjs');

searchRouter.get('/search', searchController.search);

searchRouter.post('/book', async (request, response) => {
    const { flightType, flightID } = request.body;
    response.cookie(flightType === 'departure' ? 'bookedArrivalFlightID' : 'bookedReturnFlightID', flightID, { httpOnly: true });
    response.sendStatus(200);
});

export default searchRouter;
