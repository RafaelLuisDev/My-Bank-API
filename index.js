import express from 'express';
import accountsRouter from './routes/accounts.js';
import winston from 'winston';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

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
            .connect(`mongodb+srv://${process.env.USERDB}:${process.env.PWDDB}@cluster0.wmrra.gcp.mongodb.net/Bank-api?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            })
            .then(() => {
                logger.info(`Conectado ao MongoDB! DB: Bank-api`);
            });
    } catch (error) {
        logger.error('Erro ao conectar no MongoDB', error);
    }
})();

app.use(express.json());
app.use('/accounts', accountsRouter);
app.use(cors());
app.listen(process.env.PORT, async () => {
    logger.info('API Started');
});
