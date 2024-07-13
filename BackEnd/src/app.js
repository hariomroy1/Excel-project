import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(cors());

app.use(express.static("public"));


//now import routes
import router from './routes/routes.js';

app.use('/api',router);

export default app;
