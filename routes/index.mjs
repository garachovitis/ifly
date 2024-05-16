// index.mjs

import express from 'express';
import * as iflyController from '../controller/ifly-controller.mjs';
const indexRouter = express.Router();


indexRouter.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        // const offset = (page - 1) * flightsPerPage;

        const filters = {
            from: req.query.from?.toUpperCase(),
            to: req.query.to?.toUpperCase(),
            departure_date: req.query.departure_date,
            return_date: req.query.return_date
        };


        
    } catch (error) {
        console.error("Error fetching flights: from mjs", error);
        res.status(500).json({ error: "Error fetching flights from mjs ind" }); // Return JSON error
    }
});


indexRouter.get('/index', (req, res) => {
  res.render('index'); 
});

export default indexRouter; 
