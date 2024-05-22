import express from 'express';
import cookieParser from 'cookie-parser';

const bookingRouter = express.Router();
bookingRouter.use(cookieParser());

const bookingController = await import('../controller/ifly-controller.mjs');

bookingRouter.get('/booking', bookingController.booking);
bookingRouter.post('/complete-booking', bookingController.completeBooking);

export default bookingRouter;
