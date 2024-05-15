import express from 'express';
const flightRouter = express.Router();

// Import the controller once at the top level (not inside a route handler)
const iflyController = await import('../controller/ifly-controller.mjs');

// Redirection (Optional)
flightRouter.get('/', (req, res) => {
  res.redirect('/tasks'); // Assuming you want to redirect to a main task list page
});

// Add Flight Route (More Specific and RESTful)
flightRouter.post('/flight/add', iflyController.addFlight); // Use plural 'flights' for REST convention
flightRouter.get('/flights', iflyController.getAllFlights);
flightRouter.get('/', (req, res) => {res.render('newflight');});
flightRouter.get('/newflight', iflyController.renderNewFlightForm);
export default flightRouter;
