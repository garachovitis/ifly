import express from 'express';
import cookieParser from 'cookie-parser';

import bodyParser from 'body-parser';

const bookingRouter = express.Router();
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env');
}


bookingRouter.use(cookieParser());
bookingRouter.use(bodyParser.json());


const bookingController = await import('../controller/ifly-controller.mjs');

bookingRouter.get('/booking', bookingController.booking);


bookingRouter.post('/complete-booking', bookingController.completeBooking);

export default bookingRouter;
