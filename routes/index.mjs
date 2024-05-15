import express from 'express';
const indexRouter = express.Router();

indexRouter.get('/index', (req, res) => {
  res.render('index'); // Render the index.hbs template
});

export default indexRouter;
