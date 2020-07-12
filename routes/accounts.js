import express from 'express';
import { accountModel } from '../models/account.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../doc.js';

const router = express.Router();

const logRequest = (req, res) => {
    const { method, originalUrl, headers, body, query, params, ip } = req;

    logger.info(`
    Request: ${method} ${originalUrl}
    Host: ${headers.host}
    User-Agent: ${headers['user-agent']}
    IP: ${ip}
    Content-Type: ${headers['content-type']}
    Body: ${JSON.stringify(body)}
    Params: ${JSON.stringify(params)}
    Query: ${JSON.stringify(query)}
    `);
};

const logResponse = (typeResponse, req, resData) => {
    if (typeResponse === 'SUCCESS') logger.info(`SUCCESS ${req.method} ${req.originalUrl} - JSON Response: ${JSON.stringify(resData)}`);
    else logger.error(`ERROR ${req.method} ${req.originalUrl} - Error description: ${resData.message}`);
};

router
    .use(async (req, res, next) => {
        logRequest(req, res);
        next();
    })
    .use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .get('/', async (req, res) => {
        try {
            const accounts = await accountModel.find({}, { _id: 0, name: 1, balance: 1, agencia: 1, conta: 1 });

            logResponse('SUCCESS', req, accounts);
            res.status(200).send(accounts);
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .get('/balance', async (req, res) => {
        try {
            const { agencia, conta } = req.body;
            const account = await accountModel.findOne({ agencia: agencia, conta: conta }, { _id: 0, name: 1, balance: 1, agencia: 1, conta: 1 });

            if (account.length === 0) {
                const err = { Error: 'Conta informada não existe!' };
                logResponse('ERROR', req, err);
                res.status(404).send(err);
            } else {
                const response = { balance: account.balance };
                logResponse('SUCCESS', req, response);
                res.status(200).send(response);
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .get('/average', async (req, res) => {
        try {
            const { agencia } = req.body;
            const accounts = await accountModel
                .aggregate()
                .match({ agencia: agencia })
                .group({ _id: null, average: { $avg: '$balance' } });
            if (accounts.length === 0) {
                const err = { Error: 'Agência informada não existe!' };
                logResponse('ERROR', req, err);
                res.status(404).send(err);
            } else {
                const response = { average: accounts[0].average };
                logResponse('SUCCESS', req, response);
                res.status(200).send(response);
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .get('/lowestBalances', async (req, res) => {
        try {
            const { quant } = req.body;
            if (quant <= 0) res.status(400).send({ Error: 'Quantidade deve ser positivo!' });
            else {
                const accounts = await accountModel.aggregate().project({ _id: 0, balance: 1, agencia: 1, conta: 1 }).sort({ balance: 1 }).limit(quant);
                logResponse('SUCCESS', req, accounts);
                res.status(200).send(accounts);
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .get('/richestClients', async (req, res) => {
        try {
            const { quant } = req.body;
            if (quant <= 0) res.status(400).send({ Error: 'Quantidade deve ser positivo!' });
            else {
                const accounts = await accountModel.aggregate().project({ _id: 0, name: 1, balance: 1, agencia: 1, conta: 1 }).sort({ balance: -1, name: 1 }).limit(quant);
                logResponse('SUCCESS', req, accounts);
                res.status(200).send(accounts);
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .patch('/deposit', async (req, res) => {
        try {
            const { agencia, conta, valor } = req.body;

            if (valor <= 0) res.status(400).send({ Error: 'Valor de depósito deve ser positivo!' });
            else {
                const account = await accountModel.findOne({ agencia: agencia, conta: conta });

                if (!account) {
                    const err = { Error: 'Conta informada não existe!' };
                    logResponse('ERROR', req, err);
                    res.status(404).send(err);
                } else {
                    const accountUpdated = await accountModel.findOneAndUpdate({ agencia: agencia, conta: conta }, { balance: account.balance + valor }, { new: true });
                    const response = { balance: accountUpdated.balance };
                    logResponse('SUCCESS', req, response);
                    res.status(200).send(response);
                }
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .patch('/withdraw', async (req, res) => {
        try {
            const { agencia, conta, valor } = req.body;

            if (valor <= 0) res.status(400).send({ Error: 'Valor de saque deve ser positivo!' });
            else {
                const account = await accountModel.findOne({ agencia: agencia, conta: conta });

                if (!account) {
                    const err = { Error: 'Conta informada não existe!' };
                    logResponse('ERROR', req, err);
                    res.status(404).send(err);
                } else if (account.balance - valor - 1 < 0) res.status(400).send({ Error: 'Saldo insuficiente! Saque não autorizado.' });
                else {
                    const accountUpdated = await accountModel.findOneAndUpdate({ agencia: agencia, conta: conta }, { balance: account.balance - valor - 1 }, { new: true });
                    const response = { balance: accountUpdated.balance };
                    logResponse('SUCCESS', req, response);
                    res.status(200).send(response);
                }
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .delete('/close', async (req, res) => {
        try {
            const { agencia, conta } = req.body;

            const account = await accountModel.findOneAndDelete({ agencia: agencia, conta: conta });

            if (!account) {
                const err = { Error: 'Conta informada não existe!' };
                logResponse('ERROR', req, err);
                res.status(404).send(err);
            } else {
                const activeAccounts = await accountModel.count({ agencia: agencia });
                const response = { contasAtivas: activeAccounts };
                logResponse('SUCCESS', req, response);
                res.status(200).send(response);
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .post('/transfer', async (req, res) => {
        try {
            const { contaOrigem, contaDestino, valor } = req.body;

            const accountOrigin = await accountModel.findOne({ conta: contaOrigem });
            const accountDestination = await accountModel.findOne({ conta: contaDestino });

            if (!accountOrigin) {
                const err = { Error: 'Conta origem não existe!' };
                logResponse('ERROR', req, err);
                res.status(404).send(err);
            } else if (!accountDestination) {
                const err = { Error: 'Conta destino não existe!' };
                logResponse('ERROR', req, err);
                res.status(404).send(err);
            } else {
                let transferValue = 0;
                if (accountOrigin.agencia !== accountDestination.agencia) transferValue = 8;
                const accountOriginUpdated = await accountModel.findOneAndUpdate({ conta: contaOrigem }, { balance: accountOrigin.balance - valor - transferValue }, { new: true });
                const accountDestinationUpdated = await accountModel.findOneAndUpdate({ conta: contaDestino }, { balance: accountDestination.balance + valor }, { new: true });
                const response = { balance: accountOriginUpdated.balance };
                logResponse('SUCCESS', req, response);
                res.status(200).send(response);
            }
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    })
    .put('/privateClients', async (req, res) => {
        try {
            let accounts = [];
            const agencias = await accountModel.distinct('agencia');

            agencias.forEach(async (agencia) => {
                const account = await accountModel.aggregate().match({ agencia: agencia }).sort({ balance: -1 }).limit(1);
                accounts.push(account[0]);
                if (accounts.length === agencias.length) {
                    let allAccountsUpdated = [];
                    accounts.forEach(async (acc) => {
                        const accountUpdated = await accountModel.findOneAndUpdate({ _id: acc._id }, { agencia: 99 }, { new: true });
                        allAccountsUpdated.push(accountUpdated);
                        if (allAccountsUpdated.length === accounts.length) {
                            const allAccountsPrivate = await accountModel.find({ agencia: 99 }, { _id: 0, name: 1, balance: 1, agencia: 1, conta: 1 });
                            logResponse('SUCCESS', req, allAccountsPrivate);
                            res.status(200).send(allAccountsPrivate);
                        }
                    });
                }
            });
        } catch (err) {
            logResponse('ERROR', req, err);
            res.status(500).send({ Error: err.message });
        }
    });

export default router;
