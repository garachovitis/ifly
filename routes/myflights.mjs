import express from 'express';
const myflightsRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const myFlightsController = await import('../controller/ifly-controller.mjs');

myflightsRouter.get('/myflights', myFlightsController.myFlights); 



export default myflightsRouter;