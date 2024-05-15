import express from 'express';
import session from "express-session";
import exphbs from 'express-handlebars';
import iflyRouter from './routes/admin.mjs';
import flightRouter from './routes/newflight.mjs';
import loginRouter from './routes/login.mjs';
import logoutRouter from './routes/logout.mjs';
import signupRouter from './routes/signup.mjs';
import indexRouter from './routes/index.mjs';
import bodyParser from 'body-parser';

import path from 'path';

const app = express();

import dotenv from 'dotenv';
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

// Handlebars setup with helpers
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        times: function(n, block) {
            let accum = '';
            for(let i = 0; i < n; ++i) {
                accum += block.fn(i);
            }
            return accum;
        },
        // Add other helpers for pagination

        hasPreviousPage: (currentPage) => currentPage > 1,
        hasNextPage: (currentPage, totalPages) => currentPage < totalPages,
        prevPage: (currentPage) => currentPage - 1,
        nextPage: (currentPage) => currentPage + 1,
        eq: (a, b) => a === b, // Helper for equality comparison
        add: (a, b) => a + b, // Helper for addition
        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString(); // Or your preferred formatting
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'views'));

app.use("/", loginRouter);
app.use("/", logoutRouter);
app.use("/", signupRouter);
app.use("/", iflyRouter);
app.use("/", flightRouter);
app.use("/", indexRouter);

export { app as ifly };
