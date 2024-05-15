import express from 'express';
import session from "express-session";
import exphbs from 'express-handlebars';
import iflyRouter from './routes/index.mjs';
import flightRouter from './routes/newflight.mjs';
import loginRouter from './routes/login.mjs';
import logoutRouter from './routes/logout.mjs';
import signupRouter from './routes/signup.mjs';
import bodyParser from 'body-parser';

const app = express();



import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: '1A2B3c4d5E6f7g9H0$',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.engine('hbs', exphbs.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use("/", loginRouter);
app.use("/", logoutRouter);
app.use("/", signupRouter);
app.use("/", iflyRouter);
app.use("/", flightRouter);

export { app as ifly };
