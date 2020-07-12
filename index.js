import express from 'express';
import accountsRouter from './routes/accounts.js';
import winston from 'winston';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
const dbUser = 'dbAdmin';
const dbPassword = 'dbAdmin';
const dbName = 'Bank-api';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `[${label}] ${timestamp} 
    ${level.toUpperCase()}: 
        ${message}`;
});

global.logger = winston.createLogger({
    level: 'silly',
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'my-bank-api.log' })],
    format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

(async () => {
    try {
        await mongoose
            .connect(`mongodb+srv://${dbUser}:${dbPassword}@bootcampigti.wmrra.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            })
            .then(() => {
                logger.info(`Conectado ao MongoDB! DB: ${dbName}`);
            });
    } catch (error) {
        logger.error('Erro ao conectar no MongoDB', error);
    }
})();

app.use(express.json());
app.use('/accounts', accountsRouter);
app.use(cors());
app.listen(port, async () => {
    logger.info('API Started');
});
