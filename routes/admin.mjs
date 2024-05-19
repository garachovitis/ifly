
//admin.mjs the route
import express from 'express';
const adminRouter = express.Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
}

const iflyController = await import('../controller/ifly-controller.mjs');

adminRouter.get('/admin', iflyController.adminrender); 
adminRouter.get('/newflight', iflyController.renderNewFlightForm); 
adminRouter.delete('/admin/:flightID', iflyController.removeFlight); 



export default adminRouter;