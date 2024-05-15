// index.mjs

import express from 'express';
import * as iflyController from '../controller/ifly-controller.mjs';
const indexRouter = express.Router();

const flightsPerPage = 7; 

indexRouter.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const offset = (page - 1) * flightsPerPage;

        const filters = {
            from: req.query.from?.toUpperCase(),
            to: req.query.to?.toUpperCase(),
            departure_date: req.query.departure_date,
            return_date: req.query.return_date
        };

        const flights = await iflyController.getFilteredFlightsPaginated(offset, flightsPerPage, filters);
        const totalFlights = await iflyController.getTotalFilteredFlights(filters);

        res.json({ // Return JSON response
            flights: flights, 
            currentPage: page,
            totalPages: Math.ceil(totalFlights / flightsPerPage) 
        }); 
    } catch (error) {
        console.error("Error fetching flights:", error);
        res.status(500).json({ error: "Error fetching flights" }); // Return JSON error
    }
});


indexRouter.get('/index', (req, res) => {
  res.render('index'); 
});

export default indexRouter; 
