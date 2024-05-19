//booking.mjs route
import express from 'express';
const bookingRouter = express.Router();
const bookingController = await import('../controller/ifly-controller.mjs');

bookingRouter.route('/').get((req, res) => { res.redirect('/index') });
bookingRouter.get('/booking', bookingController.renderBookingPage);
bookingRouter.post('/booking/getFlights', bookingController.getFlightsForBooking); 
bookingRouter.post('/booking/completeBooking', bookingController.completeBooking);

export default bookingRouter;
