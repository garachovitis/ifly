import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
   console.log('loading .env');
   dotenv.config();
}

import { ifly } from './app.mjs';

const port = process.env.PORT || '3000';

const server = ifly.listen(port, () => {
   console.log(`Listening to http://127.0.0.1:${port}`);
});

process.on('SIGTERM', () => {
   console.info('SIGTERM signal received.');
   console.log('Closing http server.');
   server.close(() => {
      console.log('Http server closed.');
   });
});
