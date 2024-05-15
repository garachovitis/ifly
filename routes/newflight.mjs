import express from 'express';
const flightRouter = express.Router();

// Import the controller once at the top level (not inside a route handler)
const taskListController = await import('../controller/ifly-controller.mjs');

// Redirection (Optional)
flightRouter.get('/', (req, res) => {
  res.redirect('/tasks'); // Assuming you want to redirect to a main task list page
});

// Add Flight Route (More Specific and RESTful)
flightRouter.post('/flight/add', taskListController.addFlight); // Use plural 'flights' for REST convention
flightRouter.get('/flights', taskListController.getAllFlights);

export default flightRouter;
